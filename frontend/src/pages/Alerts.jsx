import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { alertsAPI } from '../services/api';

const Alerts = () => {
  const [searchParams] = useSearchParams();
  const initProductId = searchParams.get('productId') || '';
  const initTitle = searchParams.get('title') || '';

  const [formData, setFormData] = useState({
    productId: initProductId,
    title: initTitle,
    targetPrice: ''
  });
  
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchAlerts = async () => {
    try {
      const response = await alertsAPI.getAll();
      setAlerts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch alerts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ type: '', text: '' });

    try {
      await alertsAPI.create({ 
        productId: formData.productId, 
        targetPrice: Number(formData.targetPrice) 
      });
      setMsg({ type: 'success', text: 'Alert created successfully!' });
      setFormData({ ...formData, targetPrice: '' });
      fetchAlerts(); // refresh list
    } catch (error) {
      setMsg({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to create alert.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Price Alerts</h1>
        <p className="text-gray-600">Never miss a deal. We'll monitor prices and let you know when they drop.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Alert</h2>
            
            {msg.text && (
              <div className={`p-3 rounded-lg text-sm mb-6 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                <input
                  type="text"
                  name="productId"
                  required
                  readOnly={!!initProductId}
                  className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none ${initProductId ? 'bg-gray-50 text-gray-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                  value={formData.productId}
                  onChange={handleChange}
                />
              </div>
              {formData.title && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 line-clamp-1"
                    value={formData.title}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="targetPrice"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.targetPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-4 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Set Alert'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Alerts */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-bold text-gray-900">Your Active Alerts</h3>
              <span className="text-sm text-gray-500">
                Check notifications from the Notifications page.
              </span>
            </div>
            
            {loading ? (
              <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
            ) : alerts.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {alerts.map(alert => (
                    <li key={alert._id || alert.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{alert.product?.title || `Product ID: ${alert.productId}`}</p>
                        <p className="text-sm text-gray-500 mt-1">Target: <span className="font-medium text-gray-800">₹{alert.targetPrice}</span></p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${alert.isTriggered ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {alert.isTriggered ? 'Triggered' : 'Active'}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-gray-50 text-gray-500 text-center py-10 rounded-2xl border border-gray-100 border-dashed">
                You haven't set any price alerts yet.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Alerts;
