import type { SpeciesObservationStats, iNatTaxon } from '../types';

const API_BASE = 'https://api.inaturalist.org/v1/observations/species_counts';
const PER_PAGE = 500; // species_counts endpoint allows up to 500

interface SpeciesCountResult {
  count: number;
  taxon: iNatTaxon;
}

async function fetchAllSpeciesCounts(params: URLSearchParams): Promise<SpeciesCountResult[]> {
  let allResults: SpeciesCountResult[] = [];
  let page = 1;
  let totalResults = -1;

  params.set('per_page', PER_PAGE.toString());

  while (true) {
    params.set('page', page.toString());
    const response = await fetch(`${API_BASE}?${params.toString()}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`iNaturalist API error (${response.status}): ${errorText}`);
    }
    const data = await response.json();
    const results: SpeciesCountResult[] = data.results.filter((r: any) => r.taxon);
    
    if (totalResults === -1) {
      totalResults = data.total_results;
    }
    
    allResults = allResults.concat(results);
    
    if (allResults.length >= totalResults || results.length < PER_PAGE) {
      break; 
    }
    
    page++;
  }

  return allResults;
}

export async function analyzeRarity(exploreUrl: string, username: string): Promise<SpeciesObservationStats[]> {
  if (!exploreUrl.trim() || !username.trim()) {
    throw new Error("URL and Username cannot be empty.");
  }

  let url;
  try {
      url = new URL(exploreUrl);
  } catch (e) {
      throw new Error("Invalid iNaturalist URL format.");
  }

  if (!url.pathname.includes('/observations')) {
    throw new Error("URL must be an iNaturalist observations or species_counts URL.");
  }

  const params = new URLSearchParams(url.search);
  
  if (!params.has('place_id') && !params.has('project_id') && !params.has('taxon_id')) {
    throw new Error("The URL must contain a filter like 'place_id', 'project_id', or 'taxon_id' to define the scope.");
  }
  
  params.set('quality_grade', 'research');

  // Fetch all species counts for the locality
  const allSpeciesParams = new URLSearchParams(params);
  allSpeciesParams.delete('user_login');
  allSpeciesParams.delete('user_id');
  const allSpeciesCounts = await fetchAllSpeciesCounts(allSpeciesParams);

  // Fetch user's species counts
  const userSpeciesParams = new URLSearchParams(params);
  userSpeciesParams.set('user_login', username.trim());
  const userSpeciesCounts = await fetchAllSpeciesCounts(userSpeciesParams);

  if (allSpeciesCounts.length === 0) {
    throw new Error('No research-grade species found for this locality. Please check the URL.');
  }

  if (userSpeciesCounts.length === 0) {
    throw new Error(`No research-grade species found for user "${username.trim()}" in this locality.`);
  }

  const speciesFrequency = new Map<number, number>();
  for (const item of allSpeciesCounts) {
      speciesFrequency.set(item.taxon.id, item.count);
  }

  const userSpeciesStats: SpeciesObservationStats[] = [];
  for (const userItem of userSpeciesCounts) {
    const totalObservations = speciesFrequency.get(userItem.taxon.id) || userItem.count;
    userSpeciesStats.push({
      taxon: userItem.taxon,
      totalObservations: totalObservations,
      userObservations: userItem.count,
    });
  }

  userSpeciesStats.sort((a, b) => a.totalObservations - b.totalObservations);

  return userSpeciesStats;
}
