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
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
          <FaShare className="w-4 h-4 text-green-600" />
        </div>
        Share Article
      </h3>
      <div className="space-y-3">
        <button
          onClick={shareOnTwitter}
          className="flex items-center w-full px-6 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <FaTwitter className="mr-4 w-5 h-5" />
          <span className="font-semibold">Share on Twitter</span>
        </button>
        <button
          onClick={shareOnFacebook}
          className="flex items-center w-full px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <FaFacebook className="mr-4 w-5 h-5" />
          <span className="font-semibold">Share on Facebook</span>
        </button>
        <button
          onClick={shareOnLinkedIn}
          className="flex items-center w-full px-6 py-4 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <FaLinkedin className="mr-4 w-5 h-5" />
          <span className="font-semibold">Share on LinkedIn</span>
        </button>
      </div>
    </div>
  );
}