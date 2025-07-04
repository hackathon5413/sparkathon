import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, TrendingUp, DollarSign, Package, Clock, ShoppingCart, 
  Check, X, Download, RefreshCw, Search, ArrowUpDown, ArrowUp, ArrowDown,
  BarChart3, PieChart, TrendingDown, Filter, Calendar, Eye, EyeOff
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area
} from 'recharts';
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
  const [appliedDiscounts, setAppliedDiscounts] = useState(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [displayCount, setDisplayCount] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showCharts, setShowCharts] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('all');

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
    const inventoryValue = processed.reduce((sum, p) => sum + (p.price * p.stock), 0);

    setDashboardMetrics({
      criticalProducts,
      highPriorityProducts,
      totalDiscountedProducts,
      totalPotentialSavings,
      totalPotentialLoss,
      actualSavings,
      appliedCount: appliedDiscounts.size,
      inventoryValue,
      wasteReductionPercent: ((totalPotentialSavings / (totalPotentialSavings + totalPotentialLoss)) * 100) || 0
    });
  }, [currentDate, appliedDiscounts]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = processedProducts.filter(product => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (selectedUrgency !== 'all' && product.urgency !== selectedUrgency) return false;
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Date range filter
      if (selectedDateRange !== 'all') {
        const days = parseInt(selectedDateRange);
        if (product.daysToExpiry > days) return false;
      }
      
      return true;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle different data types
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [processedProducts, selectedCategory, selectedUrgency, searchTerm, selectedDateRange, sortConfig]);

  // Chart data preparations
  const urgencyData = useMemo(() => {
    const data = ['critical', 'high', 'medium', 'low', 'none'].map(urgency => {
      const count = processedProducts.filter(p => p.urgency === urgency).length;
      return {
        name: urgency.charAt(0).toUpperCase() + urgency.slice(1),
        value: count,
        fill: urgency === 'critical' ? '#dc2626' : 
              urgency === 'high' ? '#d97706' : 
              urgency === 'medium' ? '#ca8a04' : 
              urgency === 'low' ? '#16a34a' : '#6b7280'
      };
    }).filter(item => item.value > 0);
    return data;
  }, [processedProducts]);

  const categoryData = useMemo(() => {
    const categories = {};
    processedProducts.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = {
          name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
          total: 0,
          withDiscount: 0,
          potentialSavings: 0
        };
      }
      categories[product.category].total += 1;
      if (product.discount > 0) {
        categories[product.category].withDiscount += 1;
      }
      categories[product.category].potentialSavings += product.savings;
    });
    return Object.values(categories);
  }, [processedProducts]);

  const expiryTrendData = useMemo(() => {
    const trends = [];
    for (let i = 0; i <= 14; i++) {
      const count = processedProducts.filter(p => p.daysToExpiry === i).length;
      trends.push({
        day: i,
        count,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${i} days`
      });
    }
    return trends;
  }, [processedProducts]);

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp size={14} className="text-walmart-blue" /> : 
      <ArrowDown size={14} className="text-walmart-blue" />;
  };

  // Apply discount to individual product
  const applyDiscount = (productId, productName) => {
    setAppliedDiscounts(prev => new Set([...prev, productId]));
    setSuccessMessage(`✅ Discount applied to ${productName}`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Remove applied discount
  const removeDiscount = (productId, productName) => {
    setAppliedDiscounts(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    setSuccessMessage(`❌ Discount removed from ${productName}`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Apply all recommended discounts
  const applyAllRecommendations = () => {
    setIsLoading(true);
    const productsWithDiscounts = filteredProducts.filter(p => p.discount > 0);
    const newAppliedDiscounts = new Set([...appliedDiscounts]);
    
    productsWithDiscounts.forEach(product => {
      newAppliedDiscounts.add(product.id);
    });

    setTimeout(() => {
      setAppliedDiscounts(newAppliedDiscounts);
      setSuccessMessage(`🎉 Applied discounts to ${productsWithDiscounts.length} products!`);
      setShowSuccessMessage(true);
      setIsLoading(false);
      setTimeout(() => setShowSuccessMessage(false), 4000);
    }, 1500);
  };

  // Load more products
  const loadMore = () => {
    setDisplayCount(prev => prev + 50);
  };

  // Reset all applied discounts
  const resetAllDiscounts = () => {
    setAppliedDiscounts(new Set());
    setSuccessMessage('🔄 All discounts have been reset');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Export data functionality
  const exportData = (format) => {
    const exportableData = filteredProducts.map(product => ({
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      expiryDate: product.expiry_date,
      daysToExpiry: product.daysToExpiry,
      recommendedDiscount: product.discount,
      discountedPrice: product.discountedPrice,
      priority: product.urgency,
      reason: product.reason,
      isApplied: product.isApplied,
      potentialSavings: product.savings
    }));

    if (format === 'json') {
      const dataStr = JSON.stringify(exportableData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `walmart-pricing-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else if (format === 'csv') {
      const csvContent = [
        Object.keys(exportableData[0]).join(','),
        ...exportableData.map(row => Object.values(row).join(','))
      ].join('\n');
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const exportFileDefaultName = `walmart-pricing-${new Date().toISOString().split('T')[0]}.csv`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
    
    setShowExportModal(false);
    setSuccessMessage(`📊 Data exported as ${format.toUpperCase()}`);
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

  const SortableHeader = ({ children, sortKey, className = "" }) => (
    <th 
      className={`px-3 py-3 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {children}
        {getSortIcon(sortKey)}
      </div>
    </th>
  );

  const ProductRow = ({ product }) => {
    const badgeClass = product.urgency === 'critical' ? 'badge-danger' : 
                      product.urgency === 'high' ? 'badge-warning' : 'badge-success';

    return (
      <tr className={`${product.isApplied ? 'bg-green-50' : ''} hover:bg-gray-50 transition-colors`}>
        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            {product.isApplied && <Check size={16} className="text-green-600" />}
            <div>
              <div className="font-medium text-gray-900">{product.name}</div>
              <div className="text-sm text-gray-500">{product.section}</div>
            </div>
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
        <td className="px-3 py-3">
          <div>
            <div className={product.isApplied ? 'line-through text-gray-500' : 'text-gray-900'}>
              {formatCurrency(product.price)}
            </div>
            {product.isApplied && product.discount > 0 && (
              <div className="text-green-600 font-medium">
                {formatCurrency(product.discountedPrice)}
              </div>
            )}
          </div>
        </td>
        <td className="px-3 py-3">
          {product.discount > 0 ? (
            <div>
              <div className="font-medium text-red-600">
                {formatDiscount(product.discount)}
              </div>
              <div className="text-sm text-green-600">
                Save {formatCurrency(product.price - product.discountedPrice)}
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
            <div className="flex gap-2">
              {!product.isApplied ? (
                <button 
                  onClick={() => applyDiscount(product.id, product.name)}
                  className="btn-primary text-sm py-1 px-3 flex items-center gap-1 hover:scale-105 transition-transform"
                >
                  <Check size={14} />
                  Apply
                </button>
              ) : (
                <button 
                  onClick={() => removeDiscount(product.id, product.name)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded flex items-center gap-1 hover:scale-105 transition-transform"
                >
                  <X size={14} />
                  Remove
                </button>
              )}
            </div>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg animate-bounce">
          {successMessage}
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 transform transition-all duration-300 scale-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Download size={20} />
              Export Data
            </h3>
            <p className="text-gray-600 mb-4">Choose export format for {filteredProducts.length} products:</p>
            <div className="flex gap-3">
              <button 
                onClick={() => exportData('csv')}
                className="btn-primary flex-1 hover:scale-105 transition-transform"
              >
                📊 Export CSV
              </button>
              <button 
                onClick={() => exportData('json')}
                className="btn-success flex-1 hover:scale-105 transition-transform"
              >
                📄 Export JSON
              </button>
              <button 
                onClick={() => setShowExportModal(false)}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-walmart-blue mb-2 flex items-center gap-3">
              <BarChart3 size={40} />
              Walmart Dynamic Pricing Dashboard
            </h1>
            <p className="text-gray-600">AI-Powered Markdown Recommendations to Reduce Food Waste</p>
            {dashboardMetrics.appliedCount > 0 && (
              <p className="text-green-600 font-medium mt-1 flex items-center gap-2">
                <Check size={16} />
                {dashboardMetrics.appliedCount} discounts applied | 
                Actual savings: {formatCurrency(dashboardMetrics.actualSavings || 0)}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setShowCharts(!showCharts)}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              {showCharts ? <EyeOff size={16} /> : <Eye size={16} />}
              {showCharts ? 'Hide' : 'Show'} Charts
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Download size={16} />
              Export Data
            </button>
            <button 
              onClick={resetAllDiscounts}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={16} />
              Reset All
            </button>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <input 
                type="date" 
                value={currentDate.toISOString().split('T')[0]}
                onChange={(e) => setCurrentDate(new Date(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
              />
            </div>
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
          trend={-5}
        />
        <MetricCard 
          title="High Priority" 
          value={dashboardMetrics.highPriorityProducts || 0}
          subtitle="Apply discounts today"
          icon={Clock}
          colorClasses="from-orange-600 to-orange-700"
          trend={2}
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
          title="Potential Savings" 
          value={formatCurrency(dashboardMetrics.totalPotentialSavings || 0)}
          subtitle="With AI recommendations"
          icon={DollarSign}
          colorClasses="from-green-600 to-green-700"
          trend={18}
        />
        <MetricCard 
          title="Waste Reduction" 
          value={`${(dashboardMetrics.wasteReductionPercent || 0).toFixed(1)}%`}
          subtitle="Expected improvement"
          icon={Package}
          colorClasses="from-cyan-600 to-cyan-700"
          trend={25}
        />
        <MetricCard 
          title="Applied Discounts" 
          value={dashboardMetrics.appliedCount || 0}
          subtitle={`of ${dashboardMetrics.totalDiscountedProducts || 0} recommended`}
          icon={ShoppingCart}
          colorClasses="from-walmart-blue to-walmart-blue-dark"
        />
      </div>

      {/* Charts Section */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Priority Distribution Pie Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart size={20} />
              Priority Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={urgencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {urgencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Analysis Bar Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Category Analysis
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#0071ce" name="Total Products" />
                <Bar dataKey="withDiscount" fill="#16a34a" name="With Discount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expiry Trend Line Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Expiry Timeline
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={expiryTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => `${value} days to expiry`}
                  formatter={(value) => [value, 'Products']}
                />
                <Area type="monotone" dataKey="count" stroke="#dc2626" fill="#fca5a5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
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
            <label className="text-sm font-medium text-gray-700">Priority:</label>
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
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Expires in:</label>
            <select 
              value={selectedDateRange} 
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">1 Week</option>
              <option value="14">2 Weeks</option>
            </select>
          </div>
          <div className="lg:ml-auto flex gap-3">
            <button 
              onClick={applyAllRecommendations}
              disabled={isLoading || filteredProducts.filter(p => p.discount > 0 && !p.isApplied).length === 0}
              className="btn-success w-full lg:w-auto flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Apply All ({filteredProducts.filter(p => p.discount > 0 && !p.isApplied).length})
                </>
              )}
            </button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {processedProducts.length} products
        </div>
      </div>

      {/* Enhanced Sortable Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <SortableHeader sortKey="name">Product</SortableHeader>
                <SortableHeader sortKey="stock">Stock</SortableHeader>
                <SortableHeader sortKey="daysToExpiry">Days to Expiry</SortableHeader>
                <SortableHeader sortKey="price">Price</SortableHeader>
                <SortableHeader sortKey="discount">Discount</SortableHeader>
                <SortableHeader sortKey="urgency">Priority</SortableHeader>
                <th className="px-3 py-3 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-200">Reason</th>
                <th className="px-3 py-3 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.slice(0, displayCount).map(product => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length > displayCount && (
          <div className="px-6 py-4 text-center bg-gray-50 border-t border-gray-200">
            <p className="text-gray-600 mb-3">
              Showing {displayCount} of {filteredProducts.length} products
            </p>
            <button 
              onClick={loadMore}
              className="btn-primary hover:scale-105 transition-transform"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
