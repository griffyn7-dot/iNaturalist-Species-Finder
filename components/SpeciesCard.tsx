
import React from 'react';
import type { RarestSpecies } from '../types';

interface SpeciesCardProps {
  species: RarestSpecies;
  rank: number;
}

const SpeciesCard: React.FC<SpeciesCardProps> = ({ species, rank }) => {
  const { taxon, totalObservations, userObservations, funFact } = species;
  const commonName = taxon.preferred_common_name || 'N/A';
  const imageUrl = taxon.default_photo?.square_url;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-green-500/20 hover:ring-2 hover:ring-green-600 flex flex-col sm:flex-row">
      <div className="flex-shrink-0">
        {imageUrl ? (
          <img className="h-48 w-full sm:h-full sm:w-48 object-cover" src={imageUrl} alt={commonName} />
        ) : (
          <div className="h-48 w-full sm:h-full sm:w-48 bg-slate-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col justify-between">
        <div>
          <p className="text-sm font-bold text-green-400">#{rank} RAREST FIND</p>
          <h3 className="text-2xl font-bold text-slate-100">{commonName}</h3>
          <p className="text-md font-light text-slate-400 italic mb-3">{taxon.name}</p>
          <p className="text-slate-300 mb-4">
            Observed <span className="font-bold text-white">{userObservations}</span> times by you out of <span className="font-bold text-white">{totalObservations}</span> total in this area.
          </p>
        </div>
        <div className="mt-auto pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-300 flex items-start gap-2">
            <span className="flex-shrink-0 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM13.5 18h-3v-2h3v2zm0-4h-3V7h3v7z"/>
              </svg>
            </span>
            <span>{funFact}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeciesCard;
