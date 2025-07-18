import React from 'react';

interface GalleryFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  albums: string[];
}

const GalleryFilter: React.FC<GalleryFilterProps> = ({ activeFilter, onFilterChange, albums }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-8">
      {albums.map((album) => (
        <button
          key={album}
          className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
            activeFilter === album
              ? 'bg-amber-700 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-amber-200'
          }`}
          onClick={() => onFilterChange(album)}
        >
          {album}
        </button>
      ))}
    </div>
  );
};

export default GalleryFilter;
