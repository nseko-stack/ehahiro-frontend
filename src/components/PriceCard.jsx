export default function PriceCard({ price }) {
  const getTrendColor = (price) => {
    return price > 300 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-green-200 transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 pr-4 flex-1 truncate">
          {price.crop_name}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTrendColor(price.price)}`}>
          {price.price > 300 ? '+15%' : '-8%'}
        </span>
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold text-green-700">RWF {price.price}</span>
          <span className="text-sm text-gray-500">/kg</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">{price.market_name}</p>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <span>{new Date(price.date).toLocaleDateString('en-RW')}</span>
        <span>by {price.agent_name}</span>
      </div>
    </div>
  );
}