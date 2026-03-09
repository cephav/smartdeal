import { useState } from 'react';
import { Link } from 'react-router-dom';

const DealCard = ({ deal }) => {
  const [hidden, setHidden] = useState(false);

  if (!deal || !deal.imageUrl) {
    return null;
  }

  const id = deal._id || deal.id;
  const title = deal.title || 'Unknown Product';
  const price = deal.discountPrice || deal.price || 0;
  const platform = deal.platform || 'Unknown';
  const imageUrl = deal.imageUrl;

  if (hidden) {
    return null;
  }

  const formatPrice = (p) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col h-full">
      <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
        <img 
          src={imageUrl} 
          alt={title} 
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={() => setHidden(true)}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
          {platform}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(price)}
          </span>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Link 
            to={`/compare/${encodeURIComponent(title)}`}
            className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Compare
          </Link>
          <Link 
            to={`/alerts?productId=${id}&title=${encodeURIComponent(title)}`}
            className="flex-1 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Alert
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
