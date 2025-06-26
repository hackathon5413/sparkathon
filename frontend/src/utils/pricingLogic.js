// Core pricing logic for dynamic markdown calculations

/**
 * Calculate the number of days between current date and expiry date
 */
export function getDaysUntilExpiry(expiryDate, currentDate = new Date()) {
  const expiry = new Date(expiryDate);
  const current = new Date(currentDate);
  const diffTime = expiry - current;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Calculate average daily sales from sales history
 */
export function getAverageDailySales(salesHistory) {
  if (!salesHistory || salesHistory.length === 0) return 0;
  const total = salesHistory.reduce((sum, sales) => sum + sales, 0);
  return total / salesHistory.length;
}

/**
 * Calculate days needed to sell current stock based on sales velocity
 */
export function getDaysToSellStock(stock, averageDailySales) {
  if (averageDailySales <= 0) return Infinity;
  return Math.ceil(stock / averageDailySales);
}

/**
 * Product category configurations for dynamic pricing
 */
const categoryConfigs = {
  dairy: {
    maxShelfLife: 14,
    urgentThreshold: 0.3, // 30% of shelf life remaining
    criticalThreshold: 0.1, // 10% of shelf life remaining
    maxDiscount: 60,
    perishabilityFactor: 1.2
  },
  produce: {
    maxShelfLife: 10,
    urgentThreshold: 0.4, // 40% of shelf life remaining
    criticalThreshold: 0.2, // 20% of shelf life remaining
    maxDiscount: 65,
    perishabilityFactor: 1.5
  },
  bakery: {
    maxShelfLife: 7,
    urgentThreshold: 0.4,
    criticalThreshold: 0.15,
    maxDiscount: 50,
    perishabilityFactor: 1.3
  },
  prepared: {
    maxShelfLife: 3,
    urgentThreshold: 0.5, // 50% of shelf life remaining
    criticalThreshold: 0.25, // 25% of shelf life remaining
    maxDiscount: 70,
    perishabilityFactor: 2.0
  },
  meat: {
    maxShelfLife: 5,
    urgentThreshold: 0.4,
    criticalThreshold: 0.2,
    maxDiscount: 55,
    perishabilityFactor: 1.4
  },
  default: {
    maxShelfLife: 30,
    urgentThreshold: 0.2,
    criticalThreshold: 0.1,
    maxDiscount: 40,
    perishabilityFactor: 1.0
  }
};

/**
 * Calculate product's shelf life stage based on category and expiry
 */
function getShelfLifeStage(product, daysToExpiry) {
  const config = categoryConfigs[product.category] || categoryConfigs.default;
  const typicalShelfLife = product.typical_consumption_days || config.maxShelfLife;
  const shelfLifeRatio = daysToExpiry / typicalShelfLife;
  
  if (daysToExpiry <= 0) return 'expired';
  if (shelfLifeRatio <= config.criticalThreshold) return 'critical';
  if (shelfLifeRatio <= config.urgentThreshold) return 'urgent';
  if (shelfLifeRatio <= 0.7) return 'medium';
  return 'fresh';
}

/**
 * Calculate stock pressure factor
 */
function getStockPressure(product, daysToExpiry, avgDailySales) {
  const daysToSellStock = getDaysToSellStock(product.stock, avgDailySales);
  
  if (daysToSellStock === Infinity) return 'very_high';
  
  const stockPressureRatio = daysToSellStock / Math.max(daysToExpiry, 1);
  
  if (stockPressureRatio > 2.0) return 'very_high';
  if (stockPressureRatio > 1.5) return 'high';
  if (stockPressureRatio > 1.0) return 'medium';
  if (stockPressureRatio > 0.5) return 'low';
  return 'very_low';
}

/**
 * Main function to calculate optimal discount percentage
 * Enhanced logic that adapts to different product categories and shelf lives
 */
export function calculateOptimalDiscount(product, currentDate = new Date()) {
  const daysToExpiry = getDaysUntilExpiry(product.expiry_date, currentDate);
  const avgDailySales = getAverageDailySales(product.sales_last_7_days);
  const config = categoryConfigs[product.category] || categoryConfigs.default;
  
  const shelfLifeStage = getShelfLifeStage(product, daysToExpiry);
  const stockPressure = getStockPressure(product, daysToExpiry, avgDailySales);
  
  // Base discount calculations by shelf life stage
  let baseDiscount = 0;
  let urgency = 'none';
  let action = 'no_action';
  let reason = '';
  
  switch (shelfLifeStage) {
    case 'expired':
      baseDiscount = config.maxDiscount + 10;
      urgency = 'critical';
      action = 'immediate_clearance';
      reason = 'Expired - Immediate clearance required';
      break;
      
    case 'critical':
      baseDiscount = config.maxDiscount * 0.8; // 80% of max discount
      urgency = 'critical';
      action = 'apply_immediately';
      reason = `Critical - expires in ${daysToExpiry} day${daysToExpiry === 1 ? '' : 's'}`;
      break;
      
    case 'urgent':
      baseDiscount = config.maxDiscount * 0.5; // 50% of max discount
      urgency = 'high';
      action = 'apply_today';
      reason = `Urgent - ${Math.round((daysToExpiry / (product.typical_consumption_days || config.maxShelfLife)) * 100)}% of shelf life remaining`;
      break;
      
    case 'medium':
      baseDiscount = config.maxDiscount * 0.25; // 25% of max discount
      urgency = 'medium';
      action = 'schedule_discount';
      reason = 'Approaching expiry - preemptive discount';
      break;
      
    case 'fresh':
      baseDiscount = 0;
      urgency = 'none';
      action = 'monitor';
      reason = 'Fresh product - monitoring only';
      break;
  }
  
  // Adjust discount based on stock pressure
  let stockMultiplier = 1.0;
  switch (stockPressure) {
    case 'very_high':
      stockMultiplier = 1.8;
      reasonParts.push('Very high stock levels');
      if (urgency === 'none') {
        urgency = 'medium';
        action = 'consider_discount';
      }
      break;
    case 'high':
      stockMultiplier = 1.4;
      reason += ' + High stock levels';
      if (urgency === 'none') {
        urgency = 'low';
        action = 'consider_discount';
      }
      break;
    case 'medium':
      stockMultiplier = 1.1;
      reason += ' + Moderate stock levels';
      break;
    case 'low':
      stockMultiplier = 0.8;
      break;
    case 'very_low':
      stockMultiplier = 0.5;
      if (baseDiscount > 0) {
        reason += ' + Low stock - reduce discount';
      }
      break;
  }
  
  // Apply category perishability factor
  const perishabilityMultiplier = config.perishabilityFactor;
  
  // Calculate final discount
  let finalDiscount = Math.round(baseDiscount * stockMultiplier * perishabilityMultiplier);
  
  // Apply business rules and caps
  finalDiscount = Math.min(finalDiscount, config.maxDiscount + 15); // Hard cap
  finalDiscount = Math.max(finalDiscount, 0); // No negative discounts
  
  // Special case: if stock is very low and product is fresh, no discount
  if (shelfLifeStage === 'fresh' && (stockPressure === 'low' || stockPressure === 'very_low')) {
    finalDiscount = 0;
    reason = 'Fresh product with low stock - no discount needed';
    action = 'no_action';
  }
  
  return {
    discount: finalDiscount,
    reason: reason,
    urgency: urgency,
    action: action,
    analytics: {
      shelfLifeStage,
      stockPressure,
      daysToExpiry,
      category: product.category,
      perishabilityFactor: config.perishabilityFactor
    }
  };
}

/**
 * Calculate the discounted price
 */
export function calculateDiscountedPrice(originalPrice, discountPercentage) {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return originalPrice - discountAmount;
}

/**
 * Calculate potential revenue loss if product expires unsold
 */
export function calculatePotentialLoss(product) {
  const avgDailySales = getAverageDailySales(product.sales_last_7_days);
  const daysToExpiry = getDaysUntilExpiry(product.expiry_date);
  
  // Estimate how much we might not sell
  const expectedSales = Math.min(product.stock, avgDailySales * daysToExpiry);
  const potentialUnsold = product.stock - expectedSales;
  
  return {
    potentialUnsoldUnits: Math.max(0, potentialUnsold),
    potentialRevenueLoss: Math.max(0, potentialUnsold * product.price)
  };
}

/**
 * Calculate sales trend from recent history
 */
export function getSalesTrend(salesHistory) {
  if (!salesHistory || salesHistory.length < 3) return 'stable';
  
  const recentSales = salesHistory.slice(-3); // Last 3 days
  const earlierSales = salesHistory.slice(0, 3); // First 3 days
  
  const recentAvg = recentSales.reduce((sum, sales) => sum + sales, 0) / recentSales.length;
  const earlierAvg = earlierSales.reduce((sum, sales) => sum + sales, 0) / earlierSales.length;
  
  const trendRatio = recentAvg / (earlierAvg || 1);
  
  if (trendRatio > 1.3) return 'increasing';
  if (trendRatio > 1.1) return 'slightly_increasing';
  if (trendRatio < 0.7) return 'decreasing';
  if (trendRatio < 0.9) return 'slightly_decreasing';
  return 'stable';
}

/**
 * Calculate demand volatility
 */
export function getDemandVolatility(salesHistory) {
  if (!salesHistory || salesHistory.length < 2) return 'low';
  
  const avg = getAverageDailySales(salesHistory);
  const variance = salesHistory.reduce((sum, sales) => {
    return sum + Math.pow(sales - avg, 2);
  }, 0) / salesHistory.length;
  
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / (avg || 1);
  
  if (coefficientOfVariation > 0.5) return 'high';
  if (coefficientOfVariation > 0.3) return 'medium';
  return 'low';
}

/**
 * Enhanced restock calculation with trend analysis
 */
export function calculateOptimalRestockQuantity(product) {
  const avgDailySales = getAverageDailySales(product.sales_last_7_days);
  const salesTrend = getSalesTrend(product.sales_last_7_days);
  const demandVolatility = getDemandVolatility(product.sales_last_7_days);
  const config = categoryConfigs[product.category] || categoryConfigs.default;
  
  // Base calculation
  let baseTargetDays = 7; // Default 7 days
  
  // Adjust based on category
  if (config.maxShelfLife <= 3) baseTargetDays = 2; // Very perishable
  else if (config.maxShelfLife <= 7) baseTargetDays = 4; // Perishable
  else if (config.maxShelfLife >= 21) baseTargetDays = 14; // Long shelf life
  
  // Adjust based on trend
  let trendMultiplier = 1.0;
  switch (salesTrend) {
    case 'increasing':
      trendMultiplier = 1.4;
      break;
    case 'slightly_increasing':
      trendMultiplier = 1.2;
      break;
    case 'decreasing':
      trendMultiplier = 0.7;
      break;
    case 'slightly_decreasing':
      trendMultiplier = 0.8;
      break;
  }
  
  // Adjust based on volatility
  let volatilityMultiplier = 1.0;
  switch (demandVolatility) {
    case 'high':
      volatilityMultiplier = 1.3; // Buffer for unpredictable demand
      break;
    case 'medium':
      volatilityMultiplier = 1.1;
      break;
  }
  
  const adjustedTargetDays = baseTargetDays * trendMultiplier * volatilityMultiplier;
  const optimalQuantity = Math.ceil(avgDailySales * adjustedTargetDays);
  
  // Ensure minimum order
  const minimumOrder = Math.max(1, Math.ceil(avgDailySales * 2));
  const finalQuantity = Math.max(optimalQuantity, minimumOrder);
  
  let stockStatus = 'adequate';
  const criticalLevel = avgDailySales * 2;
  const lowLevel = avgDailySales * 4;
  
  if (product.stock <= criticalLevel) stockStatus = 'critical';
  else if (product.stock <= lowLevel) stockStatus = 'low';
  else if (product.stock > avgDailySales * 10) stockStatus = 'excess';
  
  return {
    recommendedQuantity: finalQuantity,
    reasoning: `${adjustedTargetDays.toFixed(1)} days supply (${avgDailySales.toFixed(1)} avg daily, ${salesTrend} trend, ${demandVolatility} volatility)`,
    currentStock: product.stock,
    stockStatus: stockStatus,
    analytics: {
      salesTrend,
      demandVolatility,
      trendMultiplier,
      volatilityMultiplier,
      baseTargetDays,
      adjustedTargetDays
    }
  };
}

/**
 * Calculate comprehensive product performance metrics
 */
export function getProductPerformanceMetrics(product, currentDate = new Date()) {
  const daysToExpiry = getDaysUntilExpiry(product.expiry_date, currentDate);
  const avgDailySales = getAverageDailySales(product.sales_last_7_days);
  const salesTrend = getSalesTrend(product.sales_last_7_days);
  const demandVolatility = getDemandVolatility(product.sales_last_7_days);
  const discountInfo = calculateOptimalDiscount(product, currentDate);
  const potentialLoss = calculatePotentialLoss(product);
  const restockInfo = calculateOptimalRestockQuantity(product);
  
  // Calculate revenue metrics
  const currentValue = product.stock * product.price;
  const discountedPrice = calculateDiscountedPrice(product.price, discountInfo.discount);
  const discountedValue = product.stock * discountedPrice;
  const potentialSavings = currentValue - potentialLoss.potentialRevenueLoss;
  
  // Performance score (0-100)
  let performanceScore = 100;
  
  // Deduct points for urgency
  switch (discountInfo.urgency) {
    case 'critical': performanceScore -= 40; break;
    case 'high': performanceScore -= 25; break;
    case 'medium': performanceScore -= 15; break;
    case 'low': performanceScore -= 5; break;
  }
  
  // Deduct points for poor sales trend
  switch (salesTrend) {
    case 'decreasing': performanceScore -= 20; break;
    case 'slightly_decreasing': performanceScore -= 10; break;
  }
  
  // Deduct points for high volatility
  if (demandVolatility === 'high') performanceScore -= 15;
  else if (demandVolatility === 'medium') performanceScore -= 5;
  
  // Deduct points for excess stock
  if (restockInfo.stockStatus === 'excess') performanceScore -= 20;
  else if (restockInfo.stockStatus === 'critical') performanceScore -= 30;
  
  performanceScore = Math.max(0, Math.min(100, performanceScore));
  
  return {
    productId: product.id,
    productName: product.name,
    category: product.category,
    performanceScore,
    daysToExpiry,
    currentPrice: product.price,
    recommendedDiscount: discountInfo.discount,
    discountedPrice,
    salesMetrics: {
      avgDailySales,
      salesTrend,
      demandVolatility,
      salesHistory: product.sales_last_7_days
    },
    stockMetrics: {
      currentStock: product.stock,
      stockStatus: restockInfo.stockStatus,
      recommendedRestock: restockInfo.recommendedQuantity
    },
    financialMetrics: {
      currentValue,
      discountedValue,
      potentialLoss: potentialLoss.potentialRevenueLoss,
      potentialSavings
    },
    actionPlan: {
      urgency: discountInfo.urgency,
      action: discountInfo.action,
      reason: discountInfo.reason
    }
  };
}

/**
 * Seasonal and event-based pricing adjustments
 */
const seasonalFactors = {
  // Month-based factors (1-12)
  monthFactors: {
    1: { produce: 0.9, dairy: 1.0, bakery: 0.95 }, // January - lower produce demand
    2: { produce: 0.9, dairy: 1.0, bakery: 0.95 }, // February
    3: { produce: 1.1, dairy: 1.0, bakery: 1.0 },  // March - spring produce
    4: { produce: 1.2, dairy: 1.0, bakery: 1.1 },  // April - easter baking
    5: { produce: 1.3, dairy: 1.0, bakery: 1.0 },  // May - fresh produce season
    6: { produce: 1.4, dairy: 1.1, bakery: 0.9 },  // June - summer produce peak
    7: { produce: 1.5, dairy: 1.1, bakery: 0.9 },  // July - peak summer
    8: { produce: 1.4, dairy: 1.1, bakery: 0.9 },  // August
    9: { produce: 1.2, dairy: 1.0, bakery: 1.0 },  // September - back to school
    10: { produce: 1.0, dairy: 1.0, bakery: 1.1 }, // October - fall baking
    11: { produce: 0.9, dairy: 1.2, bakery: 1.3 }, // November - thanksgiving
    12: { produce: 0.9, dairy: 1.3, bakery: 1.4 }  // December - holiday baking
  },
  
  // Day of week factors (0 = Sunday, 6 = Saturday)
  dayFactors: {
    0: 1.2, // Sunday - higher demand
    1: 0.8, // Monday - lower demand
    2: 0.9, // Tuesday
    3: 0.9, // Wednesday
    4: 1.0, // Thursday
    5: 1.1, // Friday - weekend prep
    6: 1.3  // Saturday - highest demand
  }
};

/**
 * Apply seasonal and temporal adjustments to pricing
 */
export function applySeasonalAdjustments(baseDiscount, product, currentDate = new Date()) {
  const month = currentDate.getMonth() + 1; // 1-12
  const dayOfWeek = currentDate.getDay(); // 0-6
  
  const monthFactor = seasonalFactors.monthFactors[month]?.[product.category] || 1.0;
  const dayFactor = seasonalFactors.dayFactors[dayOfWeek] || 1.0;
  
  // Higher demand = less discount needed
  // Lower demand = more discount needed
  let adjustmentFactor = 1.0;
  
  if (monthFactor > 1.1) {
    // High seasonal demand - reduce discount
    adjustmentFactor *= 0.8;
  } else if (monthFactor < 0.9) {
    // Low seasonal demand - increase discount
    adjustmentFactor *= 1.2;
  }
  
  if (dayFactor > 1.2) {
    // High day demand - reduce discount
    adjustmentFactor *= 0.9;
  } else if (dayFactor < 0.9) {
    // Low day demand - increase discount
    adjustmentFactor *= 1.1;
  }
  
  const adjustedDiscount = Math.round(baseDiscount * adjustmentFactor);
  
  return {
    originalDiscount: baseDiscount,
    adjustedDiscount,
    seasonalFactors: {
      month: monthFactor,
      dayOfWeek: dayFactor,
      adjustmentFactor
    }
  };
}

/**
 * Enhanced discount calculation with seasonal adjustments
 */
export function calculateOptimalDiscountWithSeasonality(product, currentDate = new Date()) {
  const baseResult = calculateOptimalDiscount(product, currentDate);
  const seasonalAdjustment = applySeasonalAdjustments(baseResult.discount, product, currentDate);
  
  return {
    ...baseResult,
    discount: seasonalAdjustment.adjustedDiscount,
    originalDiscount: seasonalAdjustment.originalDiscount,
    seasonalFactors: seasonalAdjustment.seasonalFactors,
    reason: baseResult.reason + (seasonalAdjustment.adjustedDiscount !== seasonalAdjustment.originalDiscount 
      ? ` (seasonally adjusted from ${seasonalAdjustment.originalDiscount}%)` 
      : '')
  };
}

/**
 * Batch analyze multiple products and return prioritized action list
 */
export function analyzeProductPortfolio(products, currentDate = new Date()) {
  const analyses = products.map(product => getProductPerformanceMetrics(product, currentDate));
  
  // Sort by urgency and potential loss
  const prioritized = analyses.sort((a, b) => {
    // First priority: urgency level
    const urgencyPriority = {
      'critical': 4,
      'high': 3,
      'medium': 2,
      'low': 1,
      'none': 0
    };
    
    const urgencyDiff = urgencyPriority[b.actionPlan.urgency] - urgencyPriority[a.actionPlan.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    
    // Second priority: potential loss
    return b.financialMetrics.potentialLoss - a.financialMetrics.potentialLoss;
  });
  
  // Calculate portfolio metrics
  const totalValue = analyses.reduce((sum, analysis) => sum + analysis.financialMetrics.currentValue, 0);
  const totalPotentialLoss = analyses.reduce((sum, analysis) => sum + analysis.financialMetrics.potentialLoss, 0);
  const totalPotentialSavings = analyses.reduce((sum, analysis) => sum + analysis.financialMetrics.potentialSavings, 0);
  
  const criticalProducts = analyses.filter(a => a.actionPlan.urgency === 'critical').length;
  const highPriorityProducts = analyses.filter(a => a.actionPlan.urgency === 'high').length;
  
  const avgPerformanceScore = analyses.reduce((sum, analysis) => sum + analysis.performanceScore, 0) / analyses.length;
  
  return {
    products: prioritized,
    portfolioMetrics: {
      totalProducts: products.length,
      totalValue,
      totalPotentialLoss,
      totalPotentialSavings,
      avgPerformanceScore: Math.round(avgPerformanceScore),
      riskDistribution: {
        critical: criticalProducts,
        high: highPriorityProducts,
        medium: analyses.filter(a => a.actionPlan.urgency === 'medium').length,
        low: analyses.filter(a => a.actionPlan.urgency === 'low').length,
        none: analyses.filter(a => a.actionPlan.urgency === 'none').length
      }
    },
    recommendations: {
      immediateAction: prioritized.filter(p => p.actionPlan.urgency === 'critical' || p.actionPlan.urgency === 'high'),
      monitor: prioritized.filter(p => p.actionPlan.urgency === 'medium'),
      stable: prioritized.filter(p => p.actionPlan.urgency === 'low' || p.actionPlan.urgency === 'none')
    }
  };
}

/**
 * Calculate category-specific insights
 */
export function getCategoryInsights(products, currentDate = new Date()) {
  const categoryStats = {};
  
  products.forEach(product => {
    const category = product.category;
    if (!categoryStats[category]) {
      categoryStats[category] = {
        products: [],
        totalValue: 0,
        totalStock: 0,
        avgPerformanceScore: 0,
        criticalCount: 0,
        totalPotentialLoss: 0
      };
    }
    
    const metrics = getProductPerformanceMetrics(product, currentDate);
    categoryStats[category].products.push(metrics);
    categoryStats[category].totalValue += metrics.financialMetrics.currentValue;
    categoryStats[category].totalStock += product.stock;
    categoryStats[category].avgPerformanceScore += metrics.performanceScore;
    categoryStats[category].totalPotentialLoss += metrics.financialMetrics.potentialLoss;
    
    if (metrics.actionPlan.urgency === 'critical' || metrics.actionPlan.urgency === 'high') {
      categoryStats[category].criticalCount++;
    }
  });
  
  // Calculate averages
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    stats.avgPerformanceScore = Math.round(stats.avgPerformanceScore / stats.products.length);
    stats.riskLevel = stats.criticalCount / stats.products.length;
  });
  
  return categoryStats;
}

/**
 * Generate comprehensive pricing and inventory recommendations
 */
export function generateActionableInsights(products, currentDate = new Date()) {
  const portfolioAnalysis = analyzeProductPortfolio(products, currentDate);
  const categoryInsights = getCategoryInsights(products, currentDate);
  
  // Generate executive summary
  const totalProducts = products.length;
  const criticalProducts = portfolioAnalysis.portfolioMetrics.riskDistribution.critical;
  const highPriorityProducts = portfolioAnalysis.portfolioMetrics.riskDistribution.high;
  const atRiskProducts = criticalProducts + highPriorityProducts;
  
  const totalPotentialLoss = portfolioAnalysis.portfolioMetrics.totalPotentialLoss;
  const totalValue = portfolioAnalysis.portfolioMetrics.totalValue;
  const riskPercentage = ((totalPotentialLoss / totalValue) * 100).toFixed(1);
  
  // Generate action items
  const actionItems = [];
  
  // Critical items need immediate attention
  portfolioAnalysis.recommendations.immediateAction.forEach(product => {
    actionItems.push({
      priority: 'CRITICAL',
      action: `Apply ${product.recommendedDiscount}% discount to ${product.productName}`,
      reason: product.actionPlan.reason,
      expectedSavings: product.financialMetrics.potentialSavings,
      category: product.category,
      productId: product.productId
    });
  });
  
  // Category-level recommendations
  Object.entries(categoryInsights).forEach(([category, stats]) => {
    if (stats.riskLevel > 0.3) { // More than 30% of products at risk
      actionItems.push({
        priority: 'HIGH',
        action: `Review ${category} category inventory management`,
        reason: `${Math.round(stats.riskLevel * 100)}% of ${category} products need immediate attention`,
        expectedSavings: stats.totalPotentialLoss,
        category: category
      });
    }
  });
  
  // Seasonal recommendations
  const month = currentDate.getMonth() + 1;
  const seasonalRecommendations = [];
  
  if (month >= 6 && month <= 8) { // Summer
    seasonalRecommendations.push({
      category: 'produce',
      recommendation: 'Increase produce inventory for peak summer demand',
      factor: 'seasonal_demand_high'
    });
  } else if (month === 12 || month === 11) { // Holiday season
    seasonalRecommendations.push({
      category: 'bakery',
      recommendation: 'Prepare for increased bakery demand during holidays',
      factor: 'seasonal_demand_high'
    });
    seasonalRecommendations.push({
      category: 'dairy',
      recommendation: 'Stock additional dairy products for holiday cooking',
      factor: 'seasonal_demand_high'
    });
  }
  
  // Performance insights
  const topPerformers = portfolioAnalysis.products
    .filter(p => p.performanceScore >= 80)
    .slice(0, 5);
    
  const underPerformers = portfolioAnalysis.products
    .filter(p => p.performanceScore < 60)
    .slice(0, 5);
  
  return {
    executiveSummary: {
      totalProducts,
      atRiskProducts,
      riskPercentage: `${riskPercentage}%`,
      totalValue: formatCurrency(totalValue),
      potentialLoss: formatCurrency(totalPotentialLoss),
      avgPerformanceScore: portfolioAnalysis.portfolioMetrics.avgPerformanceScore,
      overallHealth: portfolioAnalysis.portfolioMetrics.avgPerformanceScore >= 80 ? 'Excellent' :
                     portfolioAnalysis.portfolioMetrics.avgPerformanceScore >= 70 ? 'Good' :
                     portfolioAnalysis.portfolioMetrics.avgPerformanceScore >= 60 ? 'Fair' : 'Poor'
    },
    
    actionItems: actionItems.sort((a, b) => {
      const priorityOrder = { 'CRITICAL': 3, 'HIGH': 2, 'MEDIUM': 1, 'LOW': 0 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
    
    categoryInsights: Object.entries(categoryInsights).map(([category, stats]) => ({
      category,
      productCount: stats.products.length,
      totalValue: formatCurrency(stats.totalValue),
      avgPerformanceScore: stats.avgPerformanceScore,
      criticalProductCount: stats.criticalCount,
      riskLevel: `${Math.round(stats.riskLevel * 100)}%`,
      potentialLoss: formatCurrency(stats.totalPotentialLoss),
      status: stats.riskLevel > 0.4 ? 'High Risk' : 
              stats.riskLevel > 0.2 ? 'Medium Risk' : 'Low Risk'
    })),
    
    seasonalRecommendations,
    
    performanceInsights: {
      topPerformers: topPerformers.map(p => ({
        name: p.productName,
        category: p.category,
        score: p.performanceScore,
        reason: 'Strong sales velocity with optimal inventory levels'
      })),
      
      underPerformers: underPerformers.map(p => ({
        name: p.productName,
        category: p.category,
        score: p.performanceScore,
        reason: p.actionPlan.reason,
        recommendedAction: p.actionPlan.action
      }))
    },
    
    financialProjections: {
      potentialSavingsFromDiscounts: formatCurrency(
        portfolioAnalysis.portfolioMetrics.totalPotentialSavings
      ),
      worstCaseScenario: formatCurrency(totalPotentialLoss),
      bestCaseScenario: formatCurrency(
        portfolioAnalysis.portfolioMetrics.totalPotentialSavings * 0.8 // 80% recovery rate
      )
    },
    
    timestamp: currentDate.toISOString(),
    reportGeneratedFor: `${totalProducts} products across ${Object.keys(categoryInsights).length} categories`
  };
}

/**
 * Get urgency level color for UI
 */
export function getUrgencyColor(urgency) {
  switch (urgency) {
    case 'critical': return '#dc2626'; // red
    case 'high': return '#d97706';     // orange
    case 'medium': return '#ca8a04';   // yellow
    case 'low': return '#16a34a';      // green
    default: return '#6b7280';         // gray
  }
}

/**
 * Format currency for display with smart number formatting
 */
export function formatCurrency(amount) {
  if (amount >= 10000000) { // 1 crore+
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 lakh+
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 thousand+
    return `₹${(amount / 1000).toFixed(1)}K`;
  } else {
    return `₹${amount.toFixed(2)}`;
  }
}

/**
 * Format large numbers for better readability
 */
export function formatNumber(num) {
  if (num >= 10000000) { // 1 crore+
    return `${(num / 10000000).toFixed(1)}Cr`;
  } else if (num >= 100000) { // 1 lakh+
    return `${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) { // 1 thousand+
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
}

/**
 * Format discount percentage for display
 */
export function formatDiscount(percentage) {
  return `${percentage}% OFF`;
}

/**
 * Simulate pricing scenarios for what-if analysis
 */
export function simulatePricingScenarios(product, scenarios, currentDate = new Date()) {
  const results = {};
  
  scenarios.forEach(scenario => {
    const testProduct = { ...product };
    
    // Apply scenario modifications
    if (scenario.stockMultiplier) {
      testProduct.stock = Math.round(product.stock * scenario.stockMultiplier);
    }
    
    if (scenario.salesMultiplier) {
      testProduct.sales_last_7_days = product.sales_last_7_days.map(s => 
        Math.round(s * scenario.salesMultiplier)
      );
    }
    
    if (scenario.dayOffset) {
      const testDate = new Date(currentDate);
      testDate.setDate(testDate.getDate() + scenario.dayOffset);
      results[scenario.name] = calculateOptimalDiscountWithSeasonality(testProduct, testDate);
    } else {
      results[scenario.name] = calculateOptimalDiscountWithSeasonality(testProduct, currentDate);
    }
  });
  
  return results;
}

/**
 * Get competitive pricing insights (placeholder for future ML integration)
 */
export function getCompetitivePricingInsights(product) {
  // This would integrate with competitor pricing APIs in a real implementation
  // For now, providing rule-based insights
  
  const categoryBenchmarks = {
    dairy: { avgDiscount: 15, maxDiscount: 45 },
    produce: { avgDiscount: 20, maxDiscount: 60 },
    bakery: { avgDiscount: 18, maxDiscount: 50 },
    prepared: { avgDiscount: 25, maxDiscount: 70 },
    meat: { avgDiscount: 22, maxDiscount: 55 }
  };
  
  const benchmark = categoryBenchmarks[product.category] || categoryBenchmarks.dairy;
  const currentDiscount = calculateOptimalDiscount(product).discount;
  
  let competitivePosition = 'neutral';
  if (currentDiscount > benchmark.avgDiscount + 10) {
    competitivePosition = 'aggressive';
  } else if (currentDiscount < benchmark.avgDiscount - 5) {
    competitivePosition = 'conservative';
  }
  
  return {
    categoryAverage: benchmark.avgDiscount,
    categoryMax: benchmark.maxDiscount,
    currentDiscount,
    competitivePosition,
    recommendation: competitivePosition === 'conservative' 
      ? 'Consider increasing discount to match market' 
      : competitivePosition === 'aggressive' 
        ? 'Review if high discount is necessary' 
        : 'Pricing is competitive'
  };
}

/**
 * Export all enhanced functions for easy import
 */
export const PricingEngine = {
  // Core functions
  calculateOptimalDiscount,
  calculateOptimalDiscountWithSeasonality,
  calculateDiscountedPrice,
  
  // Analysis functions
  getProductPerformanceMetrics,
  analyzeProductPortfolio,
  getCategoryInsights,
  generateActionableInsights,
  
  // Utility functions
  getDaysUntilExpiry,
  getAverageDailySales,
  getDaysToSellStock,
  getSalesTrend,
  getDemandVolatility,
  
  // Advanced features
  applySeasonalAdjustments,
  simulatePricingScenarios,
  getCompetitivePricingInsights,
  
  // Formatting functions
  formatCurrency,
  formatNumber,
  formatDiscount,
  getUrgencyColor
};
