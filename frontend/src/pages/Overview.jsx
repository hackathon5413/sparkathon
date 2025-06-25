import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, TrendingUp, DollarSign, Package, Clock, ShoppingCart, 
  Check, X, RefreshCw, ArrowRight, TrendingDown
} from 'lucide-react';
import { products } from '../data/products';
import { 
  calculateOptimalDiscount, 
  calculateDiscountedPrice, 
  calculatePotentialLoss,
  formatCurrency,
  formatDiscount,
  getDaysUntilExpiry
} from '../utils/pricingLogic';

const Overview = ({ currentDate }) => {
  const [processedProducts, setProcessedProducts] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({});
  const [appliedDiscounts, setAppliedDiscounts] = useState(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
        savings: (product.price - discountedPrice) * product.stock,
        isApplied: appliedDiscounts.has(product.id)
      };
    });

    setProcessedProducts(processed);

    // Calculate dashboard metrics
    const criticalProducts = processed.filter(p => p.urgency === 'critical').length;
    const highPriorityProducts = processed.filter(p => p.urgency === 'high').length;
    const totalDiscountedProducts = processed.filter(p => p.discount > 0).length;
    const appliedProducts = processed.filter(p => appliedDiscounts.has(p.id));
    const totalPotentialSavings = processed.reduce((sum, p) => sum + p.savings, 0);
    const totalPotentialLoss = processed.reduce((sum, p) => sum + p.potentialLoss, 0);
    const actualSavings = appliedProducts.reduce((sum, p) => sum + p.savings, 0);

    setDashboardMetrics({
      criticalProducts,
      highPriorityProducts,
      totalDiscountedProducts,
      totalPotentialSavings,
      totalPotentialLoss,
      actualSavings,
      appliedCount: appliedDiscounts.size,
      wasteReductionPercent: ((totalPotentialSavings / (totalPotentialSavings + totalPotentialLoss)) * 100) || 0
    });
  }, [currentDate, appliedDiscounts]);

  // Apply discount to individual product
  const applyDiscount = (productId, productName) => {
    setAppliedDiscounts(prev => new Set([...prev, productId]));
    setSuccessMessage(`✅ Discount applied to ${productName}`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, colorClasses = "from-walmart-blue to-walmart-blue-dark", trend = null }) => (
    <div className={`bg-gradient-to-br ${colorClasses} text-white rounded-xl p-6 text-center shadow-lg min-h-[140px] flex flex-col justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-center mb-2">
        <Icon size={24} />
        {trend && (
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-2xl md:text-3xl font-bold mb-2 leading-tight break-words">{value}</div>
      <div className="text-sm opacity-90 leading-tight">{title}</div>
      {subtitle && <div className="text-xs mt-1 opacity-80">{subtitle}</div>}
    </div>
  );

  const ActionCard = ({ title, description, buttonText, onClick, urgency = 'medium', count = 0 }) => {
    const urgencyColors = {
      critical: 'border-red-500 bg-red-50',
      high: 'border-orange-500 bg-orange-50',
      medium: 'border-yellow-500 bg-yellow-50',
      low: 'border-green-500 bg-green-50'
    };

    return (
      <div className={`card border-l-4 ${urgencyColors[urgency]} hover:shadow-lg transition-shadow`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-600 text-sm mb-3">{description}</p>
            {count > 0 && (
              <span className="inline-block px-2 py-1 bg-walmart-blue text-white text-xs rounded-full mb-3">
                {count} items
              </span>
            )}
          </div>
          <button
            onClick={onClick}
            className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform"
          >
            {buttonText}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  // Get critical and high priority products for quick action
  const criticalProducts = processedProducts.filter(p => p.urgency === 'critical' && !p.isApplied).slice(0, 5);
  const highPriorityProducts = processedProducts.filter(p => p.urgency === 'high' && !p.isApplied).slice(0, 3);

  return (
    <div>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg animate-bounce">
          {successMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Real-time insights and critical actions for food waste reduction</p>
        {dashboardMetrics.appliedCount > 0 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium flex items-center gap-2">
              <Check size={16} />
              {dashboardMetrics.appliedCount} discounts currently applied | 
              Actual savings: {formatCurrency(dashboardMetrics.actualSavings || 0)}
            </p>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Critical Products" 
          value={dashboardMetrics.criticalProducts || 0}
          subtitle="Need immediate action"
          icon={AlertTriangle}
          colorClasses="from-red-600 to-red-700"
          trend={-5}
        />
        <MetricCard 
          title="Potential Savings" 
          value={formatCurrency(dashboardMetrics.totalPotentialSavings || 0)}
          subtitle="With AI recommendations"
          icon={DollarSign}
          colorClasses="from-green-600 to-green-700"
          trend={18}
        />
        <MetricCard 
          title="Revenue at Risk" 
          value={formatCurrency(dashboardMetrics.totalPotentialLoss || 0)}
          subtitle="Without action"
          icon={TrendingDown}
          colorClasses="from-purple-600 to-purple-700"
          trend={-12}
        />
        <MetricCard 
          title="Waste Reduction" 
          value={`${(dashboardMetrics.wasteReductionPercent || 0).toFixed(1)}%`}
          subtitle="Expected improvement"
          icon={Package}
          colorClasses="from-cyan-600 to-cyan-700"
          trend={25}
        />
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ActionCard
          title="Critical Actions Required"
          description="Products expiring within 24 hours need immediate markdown"
          buttonText="View Critical Items"
          urgency="critical"
          count={criticalProducts.length}
          onClick={() => {/* Navigate to products page with critical filter */}}
        />
        <ActionCard
          title="High Priority Markdowns"
          description="Apply discounts to high-priority items expiring soon"
          buttonText="Review Recommendations"
          urgency="high"
          count={highPriorityProducts.length}
          onClick={() => {/* Navigate to products page with high priority filter */}}
        />
      </div>

      {/* Quick Actions - Critical Products */}
      {criticalProducts.length > 0 && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={20} />
              Critical Products - Immediate Action Required
            </h3>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">
              {criticalProducts.length} items
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Expires</th>
                  <th>Discount</th>
                  <th>Potential Loss</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {criticalProducts.map(product => (
                  <tr key={product.id} className="hover:bg-red-50">
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.section}</div>
                      </div>
                    </td>
                    <td className="text-gray-900">{product.stock}</td>
                    <td>
                      <span className="text-red-600 font-medium">
                        {product.daysToExpiry === 0 ? 'Today' : `${product.daysToExpiry} days`}
                      </span>
                    </td>
                    <td>
                      <div className="font-medium text-red-600">
                        {formatDiscount(product.discount)}
                      </div>
                      <div className="text-sm text-green-600">
                        {formatCurrency(product.discountedPrice)}
                      </div>
                    </td>
                    <td className="text-red-600 font-medium">
                      {formatCurrency(product.potentialLoss)}
                    </td>
                    <td>
                      <button 
                        onClick={() => applyDiscount(product.id, product.name)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded flex items-center gap-1 hover:scale-105 transition-transform"
                      >
                        <Check size={14} />
                        Apply Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* High Priority Products */}
      {highPriorityProducts.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="text-orange-600" size={20} />
              High Priority Products
            </h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
              {highPriorityProducts.length} items
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highPriorityProducts.map(product => (
              <div key={product.id} className="border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                  <span className="text-orange-600 text-sm font-medium">
                    {product.daysToExpiry} days
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Stock: {product.stock} | {formatDiscount(product.discount)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">Save: </span>
                    <span className="text-green-600 font-medium">
                      {formatCurrency(product.savings)}
                    </span>
                  </div>
                  <button 
                    onClick={() => applyDiscount(product.id, product.name)}
                    className="btn-primary text-xs py-1 px-2 flex items-center gap-1"
                  >
                    <Check size={12} />
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
