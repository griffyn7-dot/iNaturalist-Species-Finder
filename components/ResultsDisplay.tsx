
import React from 'react';
import type { RarestSpecies } from '../types';
import SpeciesCard from './SpeciesCard';

interface ResultsDisplayProps {
  results: RarestSpecies[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">Your Rarest Finds</h2>
      <div className="space-y-6">
        {results.map((species, index) => (
          <SpeciesCard key={species.taxon.id} species={species} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
