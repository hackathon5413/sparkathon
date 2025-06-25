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

  const MetricCard = ({ title, value, subtitle, icon: Icon, color = "#0071ce" }) => (
    <div className="metric-card" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
        <Icon size={24} />
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{title}</div>
      {subtitle && <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>{subtitle}</div>}
    </div>
  );

  const ProductRow = ({ product }) => {
    const urgencyColor = getUrgencyColor(product.urgency);
    const badgeClass = product.urgency === 'critical' ? 'badge-danger' : 
                      product.urgency === 'high' ? 'badge-warning' : 'badge-success';

    return (
      <tr>
        <td>
          <div>
            <div style={{ fontWeight: '500' }}>{product.name}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{product.section}</div>
          </div>
        </td>
        <td>{product.stock}</td>
        <td>
          <span style={{ 
            color: product.daysToExpiry <= 3 ? '#dc2626' : product.daysToExpiry <= 7 ? '#d97706' : '#16a34a' 
          }}>
            {product.daysToExpiry} days
          </span>
        </td>
        <td>{formatCurrency(product.price)}</td>
        <td>
          {product.discount > 0 ? (
            <div>
              <div style={{ fontWeight: '500', color: '#dc2626' }}>
                {formatDiscount(product.discount)}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#16a34a' }}>
                {formatCurrency(product.discountedPrice)}
              </div>
            </div>
          ) : (
            <span style={{ color: '#6b7280' }}>No discount</span>
          )}
        </td>
        <td>
          <span className={`badge ${badgeClass}`}>
            {product.urgency.toUpperCase()}
          </span>
        </td>
        <td style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {product.reason}
        </td>
        <td>
          {product.discount > 0 && (
            <button className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}>
              Apply
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0071ce', marginBottom: '0.5rem' }}>
              Walmart Dynamic Pricing Dashboard
            </h1>
            <p style={{ color: '#6b7280' }}>AI-Powered Markdown Recommendations to Reduce Food Waste</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Simulate Date:</label>
            <input 
              type="date" 
              value={currentDate.toISOString().split('T')[0]}
              onChange={(e) => setCurrentDate(new Date(e.target.value))}
              style={{ 
                padding: '0.5rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <MetricCard 
          title="Critical Products" 
          value={dashboardMetrics.criticalProducts || 0}
          subtitle="Need immediate action"
          icon={AlertTriangle}
          color="#dc2626"
        />
        <MetricCard 
          title="High Priority" 
          value={dashboardMetrics.highPriorityProducts || 0}
          subtitle="Apply discounts today"
          icon={Clock}
          color="#d97706"
        />
        <MetricCard 
          title="Revenue at Risk" 
          value={formatCurrency(dashboardMetrics.totalPotentialLoss || 0)}
          subtitle="Without action"
          icon={TrendingUp}
          color="#7c3aed"
        />
        <MetricCard 
          title="Potential Savings" 
          value={formatCurrency(dashboardMetrics.totalPotentialSavings || 0)}
          subtitle="With AI recommendations"
          icon={DollarSign}
          color="#16a34a"
        />
        <MetricCard 
          title="Waste Reduction" 
          value={`${(dashboardMetrics.wasteReductionPercent || 0).toFixed(1)}%`}
          subtitle="Expected improvement"
          icon={Package}
          color="#0891b2"
        />
        <MetricCard 
          title="Products with Discounts" 
          value={dashboardMetrics.totalDiscountedProducts || 0}
          subtitle={`of ${products.length} total products`}
          icon={ShoppingCart}
          color="#0071ce"
        />
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', marginRight: '0.5rem' }}>Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            >
              <option value="all">All Categories</option>
              {productStats.categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', marginRight: '0.5rem' }}>Urgency:</label>
            <select 
              value={selectedUrgency} 
              onChange={(e) => setSelectedUrgency(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-success">
              Apply All Recommendations ({filteredProducts.filter(p => p.discount > 0).length})
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
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
          <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ color: '#6b7280' }}>
              Showing 50 of {filteredProducts.length} products. 
              <button style={{ marginLeft: '0.5rem', color: '#0071ce', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
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
