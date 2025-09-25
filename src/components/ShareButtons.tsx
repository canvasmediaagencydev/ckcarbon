"use client";

import { FaShare, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
          <FaShare className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
        </div>
        Share Article
      </h3>
      <div className="space-y-2 sm:space-y-3">
        <button
          onClick={shareOnTwitter}
          className="flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-500 text-white rounded-xl sm:rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <FaTwitter className="mr-3 sm:mr-4 w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-sm sm:text-base">Share on Twitter</span>
        </button>
        <button
          onClick={shareOnFacebook}
          className="flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <FaFacebook className="mr-3 sm:mr-4 w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-sm sm:text-base">Share on Facebook</span>
        </button>
        <button
          onClick={shareOnLinkedIn}
          className="flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-800 text-white rounded-xl sm:rounded-2xl hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <FaLinkedin className="mr-3 sm:mr-4 w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-sm sm:text-base">Share on LinkedIn</span>
        </button>
      </div>
    </div>
  );
}