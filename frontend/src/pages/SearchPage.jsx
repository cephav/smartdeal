import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dealsAPI } from '../services/api';
import DealCard from '../components/DealCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalDeals: 0 });

  const performSearch = async (keyword, pageNum = 1) => {
    if (!keyword) return;
    setSearchParams({ q: keyword, page: pageNum });
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await dealsAPI.search(keyword, pageNum, 12);
      const data = response.data;
      
      if (data.deals) {
        setResults(data.deals);
        setPagination({
          page: data.page,
          totalPages: data.totalPages,
          totalDeals: data.totalDeals
        });
      } else {
        setResults(Array.isArray(data) ? data : []);
        setPagination({ page: 1, totalPages: 1, totalDeals: (Array.isArray(data) ? data.length : 0) });
      }
    } catch (error) {
      console.error("Search failed", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    const p = parseInt(searchParams.get('page')) || 1;
    if (q) {
      performSearch(q, p);
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 bg-clip-text">Find the Best Deals</h1>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Search across multiple platforms instantly to ensure you never overpay again.</p>
        <SearchBar onSearch={performSearch} initialValue={initialQuery} />
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && hasSearched && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4 flex items-center justify-between">
            <span>Search Results for "<span className="text-blue-600">{searchParams.get('q')}</span>"</span>
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{pagination.totalDeals} found</span>
          </h2>
          
          {results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map(deal => (
                  <DealCard key={deal._id || deal.id || Math.random()} deal={deal} />
                ))}
              </div>
              
              <Pagination 
                currentPage={pagination.page} 
                totalPages={pagination.totalPages} 
                onPageChange={(p) => performSearch(searchParams.get('q'), p)} 
              />
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any deals matching your search. Try different keywords or check back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
