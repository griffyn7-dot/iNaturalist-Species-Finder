import React, { useState } from 'react';

interface InputFormProps {
  isLoading: boolean;
  onSubmit: (url: string, username: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ isLoading, onSubmit }) => {
  const [url, setUrl] = useState('https://www.inaturalist.org/observations/species_counts?place_id=97394');
  const [username, setUsername] = useState('sbushes');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url, username);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="inat-url" className="block text-sm font-medium text-slate-400 mb-1">
          iNaturalist URL (Observations or Species Counts)
        </label>
        <input
          id="inat-url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g., https://www.inaturalist.org/observations/species_counts?place_id=97394"
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-400 mb-1">
          Username to Analyze
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g., sbushes"
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          required
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Find Rarest Species'
        )}
      </button>
    </form>
  );
};

export default InputForm;
