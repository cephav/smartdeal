import { useState, useEffect } from 'react';
import { dashboardAPI, dealsAPI, salesAPI } from '../services/api';
import DealCard from '../components/DealCard';

const Dashboard = () => {
  const [data, setData] = useState({
  totalDeals: 0,
  topDeals: [],
  bestDeals: [],
  latestDeals: [],
  sales: []
});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchDashboard = async () => {
  try {

    const [dashRes, bestRes, allRes, salesRes] = await Promise.all([
      dashboardAPI.get().catch(() => ({ data: {} })),
      dealsAPI.getBest().catch(() => ({ data: [] })),
      dealsAPI.getAll(1, 1).catch(() => ({ data: { totalDeals: 0 } })),
      salesAPI.getSales().catch(() => ({ data: [] }))
    ]);

    const dash = dashRes.data || {};
    const bestDeals = Array.isArray(bestRes.data) ? bestRes.data : [];
    const totalDeals = Number(allRes.data?.totalDeals) || 0;
    const sales = Array.isArray(salesRes.data) ? salesRes.data : [];

    setData({
      totalDeals,
      topDeals: dash.topDeals || [],
      bestDeals,
      latestDeals: dash.latestDeals || [],
      sales
    });

  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
  } finally {
    setLoading(false);
  }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderDealGrid = (items) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium">No data available.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((deal) => (
          <DealCard key={deal._id || deal.id || Math.random()} deal={deal} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Quick analytics and highlights from SmartDeal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500">Total deals</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{data.totalDeals}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500">Top deals</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{data.topDeals.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500">Best deals</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{data.bestDeals.length}</p>
        </div>
      </div>
      <section className="mb-12">
  <h2 className="text-xl font-bold text-gray-900 mb-6">
    🔥 Live & Upcoming Sales
  </h2>

  {data.sales.length === 0 ? (
    <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
      <p className="text-gray-500 font-medium">No active sales found.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.sales.map((sale) => (
        <a
          key={sale._id}
          href={sale.saleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition block"
        >
          <h3 className="font-bold text-lg text-gray-900">
            {sale.platform}
          </h3>

          <p className="text-gray-600 mt-2">
            {sale.saleName}
          </p>

          <p
            className={`mt-3 text-sm font-semibold ${
              sale.status === "Live"
                ? "text-green-600"
                : sale.status === "Upcoming"
                ? "text-yellow-600"
                : "text-gray-500"
            }`}
          >
            {sale.status}
          </p>
        </a>
      ))}
    </div>
  )}
</section>
      
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🕒 Latest Deals</h2>
        {data.latestDeals.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium">No data available.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {data.latestDeals.map((deal) => (
                <li key={deal._id || deal.id || Math.random()} className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-1">{deal.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{deal.platform}</p>
                  </div>
                  <div className="text-right pl-4">
                    <p className="font-bold text-gray-900">₹{deal.discountPrice ?? deal.price ?? '—'}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
