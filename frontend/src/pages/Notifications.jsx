import { useState } from 'react';
import { alertsAPI } from '../services/api';

const Notifications = () => {
  const [checking, setChecking] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleCheckAlerts = async () => {
    setChecking(true);
    setNotifications([]);

    try {
      const response = await alertsAPI.check();
      const triggers = response.data?.triggered || [];
      if (triggers.length === 0) {
        setNotifications([{ _id: 'empty', message: 'No prices have dropped below your target yet.' }]);
      } else {
        setNotifications(triggers);
      }
    } catch (error) {
      setNotifications([{ _id: 'error', message: 'Failed to check alerts. Please try again.' }]);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Alert Notifications</h1>
        <p className="text-gray-600">Check if any tracked products have dropped below your target price.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Triggered Alerts</h2>
            <p className="text-sm text-gray-600 mt-1">Click to fetch latest price-drop notifications.</p>
          </div>
          <button
            onClick={handleCheckAlerts}
            disabled={checking}
            className="whitespace-nowrap px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50"
          >
            {checking ? 'Checking...' : 'Check Now'}
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="space-y-3 mt-6">
            {notifications.map((notif, i) => (
              <div
                key={notif._id || i}
                className={`p-4 rounded-xl flex items-start gap-4 ${
                  notif.message ? 'bg-gray-50 text-gray-700' : 'bg-white border border-gray-100 shadow-sm border-l-4 border-emerald-500'
                }`}
              >
                {notif.message ? (
                  <p className="text-sm font-medium">{notif.message}</p>
                ) : (
                  <>
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Price Dropped! - {notif.product?.title || notif.title || notif.product || 'Product'}
                      </p>
                      <p className="text-emerald-600 font-medium mt-1">
                        Now at ₹{notif.price} (Target: ₹{notif.target})
                      </p>
                      {notif.platform && (
                        <p className="text-sm text-gray-500 mt-1">Platform: {notif.platform}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

