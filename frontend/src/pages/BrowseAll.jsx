import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dealsAPI } from '../services/api';
import DealCard from '../components/DealCard';
import Pagination from '../components/Pagination';

const BrowseAll = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = 12;

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalDeals: 0 });

  const fetchDeals = async (page) => {
    setLoading(true);
    try {
      const response = await dealsAPI.getAll(page, limit);
      const data = response.data;
      
      // Handle both paginated and direct array responses for safety
      if (data.deals) {
        setDeals(data.deals);
        setPagination({
          page: data.page,
          totalPages: data.totalPages,
          totalDeals: data.totalDeals
        });
      } else {
        setDeals(Array.isArray(data) ? data : []);
        setPagination({ page: 1, totalPages: 1, totalDeals: (Array.isArray(data) ? data.length : 0) });
      }
    } catch (error) {
      console.error("Failed to fetch deals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setSearchParams({ page });
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Browse All Deals</h1>
        <p className="text-gray-600">Explore every active deal across all platforms.</p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals.map(deal => (
              <DealCard key={deal._id || deal.id || Math.random()} deal={deal} />
            ))}
          </div>

          <Pagination 
            currentPage={pagination.page} 
            totalPages={pagination.totalPages} 
            onPageChange={handlePageChange} 
          />
          
          {deals.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
              <p className="text-gray-500">No deals found in the system yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseAll;
