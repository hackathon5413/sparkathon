import React, { useState, useEffect, useMemo } from 'react';
import { PieChart as PieChartIcon, BarChart3, TrendingUp, Download } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area, LineChart, Line
} from 'recharts';
import { products } from '../data/products';
import { 
  calculateOptimalDiscount, 
  calculateDiscountedPrice, 
  calculatePotentialLoss,
  formatCurrency,
  getDaysUntilExpiry
} from '../utils/pricingLogic';
import { useAppContext } from '../App';

const Analytics = () => {
  const { currentDate } = useAppContext();
  const [processedProducts, setProcessedProducts] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('savings');

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
  }, [currentDate]);

  // Chart data preparations
  const urgencyData = useMemo(() => {
    const data = ['critical', 'high', 'medium', 'low', 'none'].map(urgency => {
      const count = processedProducts.filter(p => p.urgency === urgency).length;
      const totalSavings = processedProducts
        .filter(p => p.urgency === urgency)
        .reduce((sum, p) => sum + p.savings, 0);
      
      return {
        name: urgency.charAt(0).toUpperCase() + urgency.slice(1),
        count,
        savings: totalSavings,
        fill: urgency === 'critical' ? '#dc2626' : 
              urgency === 'high' ? '#d97706' : 
              urgency === 'medium' ? '#ca8a04' : 
              urgency === 'low' ? '#16a34a' : '#6b7280'
      };
    }).filter(item => item.count > 0);
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
          potentialSavings: 0,
          averageDiscount: 0
        };
      }
      categories[product.category].total += 1;
      if (product.discount > 0) {
        categories[product.category].withDiscount += 1;
      }
      categories[product.category].potentialSavings += product.savings;
    });

    // Calculate average discount for each category
    Object.keys(categories).forEach(key => {
      const categoryProducts = processedProducts.filter(p => p.category === key && p.discount > 0);
      if (categoryProducts.length > 0) {
        categories[key].averageDiscount = categoryProducts.reduce((sum, p) => sum + p.discount, 0) / categoryProducts.length;
      }
    });

    return Object.values(categories);
  }, [processedProducts]);

  const expiryTrendData = useMemo(() => {
    const trends = [];
    for (let i = 0; i <= 14; i++) {
      const productsAtDay = processedProducts.filter(p => p.daysToExpiry === i);
      const count = productsAtDay.length;
      const totalValue = productsAtDay.reduce((sum, p) => sum + (p.price * p.stock), 0);
      const potentialSavings = productsAtDay.reduce((sum, p) => sum + p.savings, 0);
      
      trends.push({
        day: i,
        count,
        totalValue,
        potentialSavings,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${i} days`
      });
    }
    return trends;
  }, [processedProducts]);

  const discountDistributionData = useMemo(() => {
    const ranges = [
      { range: '0%', min: 0, max: 0 },
      { range: '1-10%', min: 1, max: 10 },
      { range: '11-25%', min: 11, max: 25 },
      { range: '26-40%', min: 26, max: 40 },
      { range: '41-50%', min: 41, max: 50 },
      { range: '50%+', min: 51, max: 100 }
    ];

    return ranges.map(range => {
      const count = processedProducts.filter(p => 
        p.discount >= range.min && p.discount <= range.max
      ).length;
      
      return {
        range: range.range,
        count,
        fill: range.range === '0%' ? '#6b7280' :
              range.range === '1-10%' ? '#16a34a' :
              range.range === '11-25%' ? '#ca8a04' :
              range.range === '26-40%' ? '#d97706' :
              range.range === '41-50%' ? '#dc2626' : '#7c2d12'
      };
    });
  }, [processedProducts]);

  const salesVelocityData = useMemo(() => {
    return processedProducts.slice(0, 15).map(product => {
      const avgSales = product.sales_last_7_days ? 
        product.sales_last_7_days.reduce((sum, day) => sum + day, 0) / 7 : 0;
      
      return {
        name: product.name.slice(0, 12) + (product.name.length > 12 ? '...' : ''),
        fullName: product.name,
        velocity: avgSales,
        stock: product.stock,
        daysToSell: avgSales > 0 ? Math.ceil(product.stock / avgSales) : 999
      };
    }).sort((a, b) => b.velocity - a.velocity);
  }, [processedProducts]);

  const exportChartData = () => {
    const data = {
      urgencyDistribution: urgencyData,
      categoryAnalysis: categoryData,
      expiryTrend: expiryTrendData,
      discountDistribution: discountDistributionData,
      salesVelocity: salesVelocityData,
      summary: {
        totalProducts: processedProducts.length,
        totalSavings: processedProducts.reduce((sum, p) => sum + p.savings, 0),
        averageDiscount: processedProducts.filter(p => p.discount > 0).reduce((sum, p) => sum + p.discount, 0) / processedProducts.filter(p => p.discount > 0).length || 0,
        generatedAt: new Date().toISOString()
      }
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `walmart-analytics-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600">Visual insights and trends for data-driven decision making</p>
          </div>
          <button 
            onClick={exportChartData}
            className="btn-primary flex items-center gap-2"
          >
            <Download size={16} />
            Export Analytics
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-walmart-blue mb-1">
            {processedProducts.length}
          </div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {formatCurrency(processedProducts.reduce((sum, p) => sum + p.savings, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Potential Savings</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {(processedProducts.filter(p => p.discount > 0).reduce((sum, p) => sum + p.discount, 0) / processedProducts.filter(p => p.discount > 0).length || 0).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Average Discount</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {processedProducts.filter(p => p.urgency === 'critical').length}
          </div>
          <div className="text-sm text-gray-600">Critical Items</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Priority Distribution Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChartIcon size={20} />
            Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={urgencyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="count"
              >
                {urgencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, 'Products']} />
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Expiry Timeline */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Expiry Timeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={expiryTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => `${value} days to expiry`}
                formatter={(value, name) => [
                  name === 'count' ? value : formatCurrency(value),
                  name === 'count' ? 'Products' : 
                  name === 'potentialSavings' ? 'Potential Savings' : 'Total Value'
                ]}
              />
              <Legend />
              <Area type="monotone" dataKey="count" stackId="1" stroke="#dc2626" fill="#fca5a5" />
              <Area type="monotone" dataKey="potentialSavings" stackId="2" stroke="#16a34a" fill="#86efac" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Discount Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChartIcon size={20} />
            Discount Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={discountDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="count"
                label={({ range, count }) => count > 0 ? `${range}: ${count}` : ''}
              >
                {discountDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Velocity Analysis */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          Sales Velocity Analysis - Top 15 Products
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesVelocityData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              fontSize={11}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(label, payload) => {
                const item = salesVelocityData.find(d => d.name === label);
                return item ? item.fullName : label;
              }}
              formatter={(value, name) => [
                name === 'velocity' ? `${value.toFixed(1)} units/day` :
                name === 'stock' ? `${value} units` :
                `${value} days`,
                name === 'velocity' ? 'Avg Daily Sales' :
                name === 'stock' ? 'Current Stock' : 'Days to Sell'
              ]}
            />
            <Legend />
            <Bar dataKey="velocity" fill="#0071ce" name="Daily Sales Velocity" />
            <Bar dataKey="stock" fill="#16a34a" name="Current Stock" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Savings Breakdown */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Category Savings Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'potentialSavings' ? formatCurrency(value) : `${value.toFixed(1)}%`,
                name === 'potentialSavings' ? 'Potential Savings' : 'Average Discount'
              ]}
            />
            <Legend />
            <Bar dataKey="potentialSavings" fill="#16a34a" name="Potential Savings" />
            <Bar dataKey="averageDiscount" fill="#d97706" name="Average Discount %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
