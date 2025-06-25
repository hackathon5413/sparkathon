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
 * Main function to calculate optimal discount percentage
 * This is the core AI logic using simple rules and math
 */
export function calculateOptimalDiscount(product, currentDate = new Date()) {
  const daysToExpiry = getDaysUntilExpiry(product.expiry_date, currentDate);
  const avgDailySales = getAverageDailySales(product.sales_last_7_days);
  const daysToSellStock = getDaysToSellStock(product.stock, avgDailySales);
  
  // If already expired, mark for clearance
  if (daysToExpiry <= 0) {
    return {
      discount: 70,
      reason: "Expired - Clearance Sale",
      urgency: "critical",
      action: "immediate_clearance"
    };
  }
  
  // Critical - expires within 1 day
  if (daysToExpiry <= 1) {
    return {
      discount: 50,
      reason: "Expires tomorrow - Deep discount needed",
      urgency: "critical",
      action: "apply_immediately"
    };
  }
  
  // High priority - expires within 2-3 days
  if (daysToExpiry <= 3) {
    // If we have too much stock to sell in time, increase discount
    if (daysToSellStock > daysToExpiry) {
      return {
        discount: 40,
        reason: `High stock, expires in ${daysToExpiry} days`,
        urgency: "high",
        action: "apply_today"
      };
    }
    return {
      discount: 25,
      reason: `Expires in ${daysToExpiry} days`,
      urgency: "high",
      action: "apply_today"
    };
  }
  
  // Medium priority - expires within 4-7 days
  if (daysToExpiry <= 7) {
    // Check if current sales velocity can clear stock in time
    if (daysToSellStock > daysToExpiry) {
      return {
        discount: 20,
        reason: "Sales velocity too slow for expiry date",
        urgency: "medium",
        action: "schedule_discount"
      };
    }
    // Light discount to accelerate sales
    if (daysToExpiry <= 5) {
      return {
        discount: 10,
        reason: "Accelerate sales before expiry",
        urgency: "low",
        action: "consider_discount"
      };
    }
  }
  
  // Low priority - expires within 8-14 days but high stock
  if (daysToExpiry <= 14 && daysToSellStock > (daysToExpiry * 0.7)) {
    return {
      discount: 5,
      reason: "High inventory levels",
      urgency: "low",
      action: "monitor"
    };
  }
  
  // No discount needed
  return {
    discount: 0,
    reason: "Normal sales expected",
    urgency: "none",
    action: "no_action"
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
 * Calculate next batch quantity recommendation
 */
export function calculateOptimalRestockQuantity(product) {
  const avgDailySales = getAverageDailySales(product.sales_last_7_days);
  const daysToExpiry = getDaysUntilExpiry(product.expiry_date);
  
  // Simple logic: order for 7-10 days of sales based on current velocity
  const recommendedDays = 8; // Target 8 days of inventory
  const optimalQuantity = Math.ceil(avgDailySales * recommendedDays);
  
  return {
    recommendedQuantity: optimalQuantity,
    reasoning: `Based on ${avgDailySales.toFixed(1)} avg daily sales, ${recommendedDays} days supply`,
    currentStock: product.stock,
    stockStatus: product.stock < (avgDailySales * 3) ? 'low' : 'adequate'
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
 * Format currency for display
 */
export function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}

/**
 * Format discount percentage for display
 */
export function formatDiscount(percentage) {
  return `${percentage}% OFF`;
}
