import React, { useState, useCallback } from 'react';
import type { RarestSpecies } from './types';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeRarity } from './services/inaturalistService';
import { getFunFact } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RarestSpecies[] | null>(null);

  const handleAnalyze = useCallback(async (url: string, username: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const stats = await analyzeRarity(url, username);
      const topN = stats.slice(0, 10);

      // Fetch fun facts sequentially to avoid rate-limiting errors
      const finalResults: RarestSpecies[] = [];
      for (const stat of topN) {
        const funFact = await getFunFact(stat.taxon);
        finalResults.push({
          ...stat,
          funFact,
        });
      }

      setResults(finalResults);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-green-900/40 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-2">
            iNaturalist Rarity Analyzer
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Paste an iNaturalist locality URL and a username to discover their rarest observations.
          </p>
        </header>

        <section className="p-6 bg-slate-800/30 backdrop-blur-sm rounded-lg shadow-2xl">
          <InputForm isLoading={isLoading} onSubmit={handleAnalyze} />
          <p className="text-xs text-slate-500 text-center mt-4">
            Calculates rarity based on all research-grade observations for the given filters.
          </p>
        </section>

        {error && (
          <section className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-md max-w-2xl mx-auto">
            <p className="font-bold">Analysis Failed</p>
            <p>{error}</p>
          </section>
        )}

        {results && results.length > 0 && (
          <section>
            <ResultsDisplay results={results} />
          </section>
        )}
        
        {results && results.length === 0 && !isLoading && !error &&(
           <section className="mt-8 text-center bg-slate-800/50 p-6 rounded-md max-w-2xl mx-auto">
             <p className="font-bold text-slate-300">No Results</p>
             <p className="text-slate-400">Could not calculate rarity. This can happen if the user has no observations or if there's no overlap with the locality's general observations.</p>
           </section>
        )}

      </main>
    </div>
  );
};

export default App;
