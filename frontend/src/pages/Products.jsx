import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, Check, X, RefreshCw, Download
} from 'lucide-react';
import { products, productStats } from '../data/products';
import { 
  calculateOptimalDiscount, 
  calculateDiscountedPrice, 
  calculatePotentialLoss,
  formatCurrency,
  formatDiscount,
  getDaysUntilExpiry
} from '../utils/pricingLogic';
import { useAppContext } from '../App';

const Products = () => {
  const { currentDate, productFilters, setProductFilters } = useAppContext();
  const [processedProducts, setProcessedProducts] = useState([]);
  const [appliedDiscounts, setAppliedDiscounts] = useState(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [displayCount, setDisplayCount] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Filters and search - using shared state
  const { selectedCategory, selectedUrgency, selectedDateRange, searchTerm } = productFilters;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Update filter helper
  const updateFilter = (key, value) => {
    setProductFilters(prev => ({ ...prev, [key]: value }));
  };

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
    const productsWithDiscounts = filteredProducts.filter(p => p.discount > 0 && !p.isApplied);
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

  // Clear all filters
  const clearAllFilters = () => {
    setProductFilters({
      searchTerm: '',
      selectedCategory: 'all',
      selectedUrgency: 'all',
      selectedDateRange: 'all'
    });
    setSortConfig({ key: null, direction: 'asc' });
    setDisplayCount(50);
  };

  // Export data functionality
  const exportData = (format) => {
    const exportableData = filteredProducts.map(product => ({
      name: product.name,
      category: product.category,
      section: product.section,
      stock: product.stock,
      price: product.price,
      expiryDate: product.expiry_date,
      daysToExpiry: product.daysToExpiry,
      recommendedDiscount: product.discount,
      discountedPrice: product.discountedPrice,
      priority: product.urgency,
      reason: product.reason,
      isApplied: product.isApplied,
      potentialSavings: product.savings,
      potentialLoss: product.potentialLoss
    }));

    if (format === 'json') {
      const dataStr = JSON.stringify(exportableData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `walmart-products-${new Date().toISOString().split('T')[0]}.json`;
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
      const exportFileDefaultName = `walmart-products-${new Date().toISOString().split('T')[0]}.csv`;
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
        <td className="px-3 py-3 text-sm text-gray-600 max-w-xs truncate">
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
    <div>
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
              Export Products Data
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

      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Products Management</h2>
            <p className="text-sm lg:text-base text-gray-600">Complete product inventory with AI-powered pricing recommendations</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
            <button 
              onClick={() => setShowExportModal(true)}
              className="btn-primary flex items-center justify-center gap-2 text-sm py-2 px-4"
            >
              <Download size={16} />
              Export
            </button>
            <button 
              onClick={resetAllDiscounts}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <RefreshCw size={16} />
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-4 lg:mb-6 p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1 flex items-center gap-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500 hidden sm:block" />
            <select 
              value={selectedCategory} 
              onChange={(e) => updateFilter('selectedCategory', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {productStats.categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select 
              value={selectedUrgency} 
              onChange={(e) => updateFilter('selectedUrgency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <select 
              value={selectedDateRange} 
              onChange={(e) => updateFilter('selectedDateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
            >
              <option value="all">All Expiry Dates</option>
              <option value="1">Expires in 1 Day</option>
              <option value="3">Expires in 3 Days</option>
              <option value="7">Expires in 1 Week</option>
              <option value="14">Expires in 2 Weeks</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button 
              onClick={clearAllFilters}
              className="w-full border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 lg:pt-4 border-t border-gray-200 gap-3">
          <div className="text-sm text-gray-600">
            Showing {Math.min(displayCount, filteredProducts.length)} of {filteredProducts.length} products
            {searchTerm || selectedCategory !== 'all' || selectedUrgency !== 'all' || selectedDateRange !== 'all' ? 
              ` (filtered from ${processedProducts.length} total)` : ''}
          </div>
          <button 
            onClick={applyAllRecommendations}
            disabled={isLoading || filteredProducts.filter(p => p.discount > 0 && !p.isApplied).length === 0}
            className="btn-success flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform text-sm py-2 px-4"
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

      {/* Products Table */}
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

        {/* Load More */}
        {filteredProducts.length > displayCount && (
          <div className="px-6 py-4 text-center bg-gray-50 border-t border-gray-200">
            <p className="text-gray-600 mb-3">
              Showing {displayCount} of {filteredProducts.length} products
            </p>
            <button 
              onClick={loadMore}
              className="btn-primary hover:scale-105 transition-transform"
            >
              Load More Products (+50)
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-500 mb-2">No products found</div>
            <div className="text-sm text-gray-400">Try adjusting your filters or search terms</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
