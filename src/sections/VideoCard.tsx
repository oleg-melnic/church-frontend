import React from "react";
import { VideoItem } from "./../sections/PhotoTypes";

interface VideoCardProps {
  video: VideoItem;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <article className="flex overflow-hidden flex-col bg-white rounded-lg shadow-md">
      <div className="relative">
        <img
          src={video.imageUrl}
          alt={video.title}
          className="w-full h-[288px] object-cover"
        />
        <div className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-40">
          <div>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[48px] h-[48px]"
            >
              <g clipPath="url(#clip0_2_3501)">
                <path
                  d="M0 24C0 17.6348 2.52856 11.5303 7.02944 7.02944C11.5303 2.52856 17.6348 0 24 0C30.3652 0 36.4697 2.52856 40.9706 7.02944C45.4714 11.5303 48 17.6348 48 24C48 30.3652 45.4714 36.4697 40.9706 40.9706C36.4697 45.4714 30.3652 48 24 48C17.6348 48 11.5303 45.4714 7.02944 40.9706C2.52856 36.4697 0 30.3652 0 24ZM17.6531 13.7906C16.9406 14.1844 16.5 14.9437 16.5 15.75V32.25C16.5 33.0656 16.9406 33.8156 17.6531 34.2094C18.3656 34.6031 19.2281 34.5937 19.9313 34.1625L33.4313 25.9125C34.0969 25.5 34.5094 24.7781 34.5094 23.9906C34.5094 23.2031 34.0969 22.4812 33.4313 22.0687L19.9313 13.8187C19.2375 13.3969 18.3656 13.3781 17.6531 13.7719V13.7906Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_2_3501">
                  <path d="M0 0H48V48H0V0Z" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-lg text-black">{video.title}</h3>
        <p className="text-sm text-gray-600">{video.duration}</p>
      </div>
    </article>
  );
};
