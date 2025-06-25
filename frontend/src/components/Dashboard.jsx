import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, DollarSign, Package, Clock, ShoppingCart } from 'lucide-react';
import { products, productStats } from '../data/products';
import { 
  calculateOptimalDiscount, 
  calculateDiscountedPrice, 
  calculatePotentialLoss,
  formatCurrency,
  formatDiscount,
  getUrgencyColor,
  getDaysUntilExpiry
} from '../utils/pricingLogic';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [processedProducts, setProcessedProducts] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');

  // Process all products with pricing recommendations
  useEffect(() => {
    const processed = products.map(product => {
      const discountInfo = calculateOptimalDiscount(product, currentDate);
      const discountedPrice = calculateDiscountedPrice(product.price, discountInfo.discount);
      const potentialLoss = calculatePotentialLoss(product);
      const daysToExpiry = getDaysUntilExpiry(product.expiry_date, currentDate);
      
      return {
        ...product,
        ...discountInfo,
        discountedPrice,
        potentialLoss: potentialLoss.potentialRevenueLoss,
        daysToExpiry,
        savings: (product.price - discountedPrice) * product.stock
      };
    });

    setProcessedProducts(processed);

    // Calculate dashboard metrics
    const criticalProducts = processed.filter(p => p.urgency === 'critical').length;
    const highPriorityProducts = processed.filter(p => p.urgency === 'high').length;
    const totalDiscountedProducts = processed.filter(p => p.discount > 0).length;
    const totalPotentialSavings = processed.reduce((sum, p) => sum + p.savings, 0);
    const totalPotentialLoss = processed.reduce((sum, p) => sum + p.potentialLoss, 0);
    const inventoryValue = processed.reduce((sum, p) => sum + (p.price * p.stock), 0);

    setDashboardMetrics({
      criticalProducts,
      highPriorityProducts,
      totalDiscountedProducts,
      totalPotentialSavings,
      totalPotentialLoss,
      inventoryValue,
      wasteReductionPercent: ((totalPotentialSavings / (totalPotentialSavings + totalPotentialLoss)) * 100) || 0
    });
  }, [currentDate]);

  // Filter products based on selected filters
  const filteredProducts = processedProducts.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (selectedUrgency !== 'all' && product.urgency !== selectedUrgency) return false;
    return true;
  });

  const MetricCard = ({ title, value, subtitle, icon: Icon, colorClasses = "from-walmart-blue to-walmart-blue-dark" }) => (
    <div className={`bg-gradient-to-br ${colorClasses} text-white rounded-xl p-6 text-center shadow-lg min-h-[140px] flex flex-col justify-center`}>
      <div className="flex items-center justify-center mb-2">
        <Icon size={24} />
      </div>
      <div className="text-2xl md:text-3xl font-bold mb-2 leading-tight break-words">{value}</div>
      <div className="text-sm opacity-90 leading-tight">{title}</div>
      {subtitle && <div className="text-xs mt-1 opacity-80">{subtitle}</div>}
    </div>
  );

  const ProductRow = ({ product }) => {
    const badgeClass = product.urgency === 'critical' ? 'badge-danger' : 
                      product.urgency === 'high' ? 'badge-warning' : 'badge-success';

    return (
      <tr>
        <td className="px-3 py-3">
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">{product.section}</div>
          </div>
        </td>
        <td className="px-3 py-3 text-gray-900">{product.stock}</td>
        <td className="px-3 py-3">
          <span className={`font-medium ${
            product.daysToExpiry <= 3 ? 'text-red-600' : 
            product.daysToExpiry <= 7 ? 'text-orange-600' : 'text-green-600'
          }`}>
            {product.daysToExpiry} days
          </span>
        </td>
        <td className="px-3 py-3 text-gray-900">{formatCurrency(product.price)}</td>
        <td className="px-3 py-3">
          {product.discount > 0 ? (
            <div>
              <div className="font-medium text-red-600">
                {formatDiscount(product.discount)}
              </div>
              <div className="text-sm text-green-600">
                {formatCurrency(product.discountedPrice)}
              </div>
            </div>
          ) : (
            <span className="text-gray-500">No discount</span>
          )}
        </td>
        <td className="px-3 py-3">
          <span className={`badge ${badgeClass}`}>
            {product.urgency.toUpperCase()}
          </span>
        </td>
        <td className="px-3 py-3 text-sm text-gray-600">
          {product.reason}
        </td>
        <td className="px-3 py-3">
          {product.discount > 0 && (
            <button className="btn-primary text-sm py-1 px-3">
              Apply
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-walmart-blue mb-2">
              Walmart Dynamic Pricing Dashboard
            </h1>
            <p className="text-gray-600">AI-Powered Markdown Recommendations to Reduce Food Waste</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Simulate Date:</label>
            <input 
              type="date" 
              value={currentDate.toISOString().split('T')[0]}
              onChange={(e) => setCurrentDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <MetricCard 
          title="Critical Products" 
          value={dashboardMetrics.criticalProducts || 0}
          subtitle="Need immediate action"
          icon={AlertTriangle}
          colorClasses="from-red-600 to-red-700"
        />
        <MetricCard 
          title="High Priority" 
          value={dashboardMetrics.highPriorityProducts || 0}
          subtitle="Apply discounts today"
          icon={Clock}
          colorClasses="from-orange-600 to-orange-700"
        />
        <MetricCard 
          title="Revenue at Risk" 
          value={formatCurrency(dashboardMetrics.totalPotentialLoss || 0)}
          subtitle="Without action"
          icon={TrendingUp}
          colorClasses="from-purple-600 to-purple-700"
        />
        <MetricCard 
          title="Potential Savings" 
          value={formatCurrency(dashboardMetrics.totalPotentialSavings || 0)}
          subtitle="With AI recommendations"
          icon={DollarSign}
          colorClasses="from-green-600 to-green-700"
        />
        <MetricCard 
          title="Waste Reduction" 
          value={`${(dashboardMetrics.wasteReductionPercent || 0).toFixed(1)}%`}
          subtitle="Expected improvement"
          icon={Package}
          colorClasses="from-cyan-600 to-cyan-700"
        />
        <MetricCard 
          title="Products with Discounts" 
          value={dashboardMetrics.totalDiscountedProducts || 0}
          subtitle={`of ${products.length} total products`}
          icon={ShoppingCart}
          colorClasses="from-walmart-blue to-walmart-blue-dark"
        />
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {productStats.categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Urgency:</label>
            <select 
              value={selectedUrgency} 
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="lg:ml-auto">
            <button className="btn-success w-full lg:w-auto">
              Apply All Recommendations ({filteredProducts.filter(p => p.discount > 0).length})
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Days to Expiry</th>
                <th>Original Price</th>
                <th>Recommended Discount</th>
                <th>Priority</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.slice(0, 50).map(product => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length > 50 && (
          <div className="px-6 py-4 text-center bg-gray-50 border-t border-gray-200">
            <p className="text-gray-600">
              Showing 50 of {filteredProducts.length} products. 
              <button className="ml-2 text-walmart-blue hover:text-walmart-blue-dark underline">
                Load more
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
