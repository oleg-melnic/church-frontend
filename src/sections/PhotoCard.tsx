import React from "react";
import { PhotoItem } from "./../sections/PhotoTypes";

interface PhotoCardProps {
  photo: PhotoItem;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <article className="flex overflow-hidden flex-col rounded-lg shadow-md">
      <img
        src={photo.imageUrl}
        alt={photo.title}
        className="w-full h-[256px] object-cover"
      />
      <div className="p-4 bg-white">
        <h3 className="mb-1 text-lg text-black">{photo.title}</h3>
        <time className="text-sm text-gray-600">{photo.date}</time>
      </div>
    </article>
  );
};
