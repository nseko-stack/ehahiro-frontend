import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { onPriceUpdate, onPriceAlert, offPriceUpdate, offPriceAlert } from '../services/socket';
import { requestNotificationPermission, showPriceAlert } from '../services/notifications';
import PriceCard from '../components/PriceCard';
import WeatherWidget from '../components/WeatherWidget';
import { RefreshCw, TrendingUp, Bell } from 'lucide-react';

export default function Dashboard() {
  const [prices, setPrices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/prices/today');
      setPrices(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchPrices();
    fetchNotifications();

    // Set up real-time listeners
    const handlePriceUpdate = (data) => {
      console.log('Real-time price update:', data);
      // Refresh prices when any price is updated
      fetchPrices();
    };

    const handlePriceAlert = (data) => {
      console.log('Price alert received:', data);
      // Refresh notifications when new alerts arrive
      fetchNotifications();
      // Show browser notification if permissions granted
      showPriceAlert(data.crop_name, data.market_name || 'Market', data.price);
    };

    onPriceUpdate(handlePriceUpdate);
    onPriceAlert(handlePriceAlert);

    // Cleanup listeners on unmount
    return () => {
      offPriceUpdate(handlePriceUpdate);
      offPriceAlert(handlePriceAlert);
    };
  }, []);

  // Request notification permissions on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <>
      {/* NOTIFICATIONS */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all"
        >
          <Bell size={24} className="text-gray-600" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
        {showNotifications && (
          <div className="absolute top-16 right-0 bg-white shadow-xl rounded-2xl border border-gray-200 w-80 max-h-96 overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">No notifications yet</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-4 border-b last:border-b-0">
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          Today's Crop Prices
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Real-time market prices across Rwanda. Updated every hour.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={fetchPrices}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-green-300 transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw size={20} className={`transition-transform ${loading ? 'animate-spin' : ''}`} />
          <span className="font-semibold">Refresh Prices</span>
        </button>
      </div>

      {/* WEATHER WIDGET */}
      <div className="mb-8">
        <WeatherWidget marketLocation="Kigali" />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-6 rounded-2xl shadow-sm">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : prices.length === 0 ? (
        <div className="text-center py-24">
          <TrendingUp className="mx-auto h-24 w-24 text-gray-300 mb-6" />
          <h3 className="text-2xl font-semibold text-gray-500 mb-2">No prices yet</h3>
          <p className="text-gray-400">Market agents will update prices soon</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {prices.map((price) => (
            <PriceCard key={price.id} price={price} />
          ))}
        </div>
      )}
    </>
  );
}