import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dealsAPI } from '../services/api';

const ComparePage = () => {
  const { title } = useParams();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      if (!title) return;
      try {
        const response = await dealsAPI.compare(title);
        setDeals(response.data.allDeals || []);
      } catch (error) {
        console.error("Comparison failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [title]);

  const formatPrice = (p) => {
    const val = Number(p);
    if (isNaN(val)) return 'N/A';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Comparison Data</h2>
          <p className="text-gray-600 mb-6">We couldn't find active deals for "{title}".</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Home</Link>
        </div>
      </div>
    );
  }

  // Filter deals and find the lowest valid price
  const validDeals = deals.filter(d => !isNaN(Number(d.discountPrice || d.price)));
  const lowestPrice = validDeals.length > 0 
    ? Math.min(...validDeals.map(d => Number(d.discountPrice || d.price)))
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Price Comparison</h1>
        <p className="text-lg text-gray-600 mt-2 line-clamp-2">{title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals
          .sort((a, b) => {
            const priceA = Number(a.discountPrice || a.price) || Infinity;
            const priceB = Number(b.discountPrice || b.price) || Infinity;
            return priceA - priceB;
          })
          .map((deal, index) => {
            const currentPrice = Number(deal.discountPrice || deal.price);
            const isLowest = lowestPrice !== null && currentPrice === lowestPrice;
          return (
            <div 
              key={deal._id || deal.id || index}
              className={`bg-white rounded-2xl p-6 relative flex flex-col items-center text-center transition-all ${
                isLowest 
                  ? 'ring-2 ring-emerald-500 shadow-lg scale-105 z-10' 
                  : 'border border-gray-100 shadow-sm hover:shadow-md'
              }`}
            >
              {isLowest && (
                <div className="mb-4 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                  ★ BEST PRICE
                </div>
              )}
              
              <div className="h-32 mb-6 flex items-center justify-center w-full bg-gray-50 rounded-xl p-2">
                {deal.imageUrl ? (
                  <img src={deal.imageUrl} alt={deal.platform} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                ) : (
                  <span className="text-gray-400 font-medium">{deal.platform}</span>
                )}
              </div>
              
              <h3 className="text-xl font-bold font-mono text-gray-900 mb-1">{deal.platform}</h3>
              <div className="text-3xl font-extrabold text-gray-900 mb-6">
                {formatPrice(deal.discountPrice || deal.price)}
              </div>
              
              <div className="mt-auto w-full flex flex-col gap-2">
                <a 
                  href={deal.productUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl font-medium shadow-sm transition-colors ${
                    isLowest 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  View Deal
                </a>
                <Link 
                  to={`/alerts?productId=${deal._id || deal.id}&title=${encodeURIComponent(deal.title)}`}
                  className="w-full py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50 border border-transparent transition-colors text-sm"
                >
                  Set Alert
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparePage;
