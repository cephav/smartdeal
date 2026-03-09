import { useState, useEffect } from 'react';
import { dealsAPI } from '../services/api';
import DealCard from '../components/DealCard';

const Home = () => {
  const [topDeals, setTopDeals] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);

        const [topRes, bestRes] = await Promise.all([
          dealsAPI.getTop().catch(() => ({ data: [] })),
          dealsAPI.getBest().catch(() => ({ data: [] })),
        ]);
        
        setTopDeals(Array.isArray(topRes.data) ? topRes.data : []);
        setBestDeals(Array.isArray(bestRes.data) ? bestRes.data : []);
      } catch (error) {
        console.error("Failed to fetch deals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderSection = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(deal => (
            <DealCard key={deal._id || deal.id || Math.random()} deal={deal} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 mb-12 text-white shadow-xl">
        <h1 className="text-4xl font-extrabold mb-4">Discover Amazing Deals</h1>
        <p className="text-blue-100 text-lg max-w-2xl mb-8">
          AI-powered price monitoring to help you find the best value across multiple platforms instantly.
        </p>
      </div>

      {renderSection("🔥 Top Deals", topDeals)}
      {renderSection("💎 Best Deals", bestDeals)}

      {(!topDeals.length && !bestDeals.length) && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium">No deals available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
