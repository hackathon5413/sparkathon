// Sample product data for Walmart Dynamic Pricing Demo
// This represents typical products with varying expiry dates and stock levels

// Helper function to get date string relative to today
const getDateString = (daysFromToday) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0];
};

export const sampleProducts = [
  // DAIRY PRODUCTS - Short shelf life (1-3 days)
  {
    "id": 1,
    "name": "Great Value Whole Milk 1 Gallon",
    "category": "dairy",
    "price": 3.48,
    "expiry_date": getDateString(1), // Tomorrow
    "stock": 45,
    "unit": "1 gallon",
    "sales_last_7_days": [8, 12, 6, 9, 11, 7, 10],
    "typical_consumption_days": 5,
    "section": "Dairy"
  },
  {
    "id": 2,
    "name": "Great Value 2% Milk Half Gallon",
    "category": "dairy", 
    "price": 2.18,
    "expiry_date": getDateString(2), // Day after tomorrow
    "stock": 23,
    "unit": "0.5 gallon",
    "sales_last_7_days": [5, 8, 4, 6, 7, 3, 5],
    "typical_consumption_days": 3,
    "section": "Dairy"
  },
  {
    "id": 3,
    "name": "Great Value Greek Yogurt 32oz",
    "category": "dairy",
    "price": 4.96,
    "expiry_date": getDateString(3), // 3 days
    "stock": 18,
    "unit": "32 oz",
    "sales_last_7_days": [3, 4, 2, 5, 3, 4, 2],
    "typical_consumption_days": 7,
    "section": "Dairy"
  },
  {
    "id": 4,
    "name": "Great Value Shredded Cheddar Cheese 8oz",
    "category": "dairy",
    "price": 2.47,
    "expiry_date": getDateString(16), // 16 days
    "stock": 35,
    "unit": "8 oz",
    "sales_last_7_days": [6, 8, 5, 7, 9, 4, 6],
    "typical_consumption_days": 14,
    "section": "Dairy"
  },
  
  // PRODUCE - Very short shelf life (1-4 days)
  {
    "id": 5,
    "name": "Fresh Bananas per lb",
    "category": "produce",
    "price": 0.68,
    "expiry_date": getDateString(2), // 2 days
    "stock": 120,
    "unit": "per lb",
    "sales_last_7_days": [25, 30, 18, 22, 28, 15, 20],
    "typical_consumption_days": 3,
    "section": "Produce"
  },
  {
    "id": 6,
    "name": "Fresh Strawberries 1lb Container",
    "category": "produce",
    "price": 3.98,
    "expiry_date": getDateString(1), // Tomorrow
    "stock": 42,
    "unit": "1 lb",
    "sales_last_7_days": [8, 12, 6, 10, 14, 5, 8],
    "typical_consumption_days": 2,
    "section": "Produce"
  },
  {
    "id": 7,
    "name": "Romaine Lettuce Hearts 3-pack",
    "category": "produce",
    "price": 2.48,
    "expiry_date": getDateString(4), // 4 days
    "stock": 28,
    "unit": "3-pack",
    "sales_last_7_days": [4, 6, 3, 5, 7, 2, 4],
    "typical_consumption_days": 5,
    "section": "Produce"
  },
  {
    "id": 8,
    "name": "Baby Carrots 2lb Bag",
    "category": "produce",
    "price": 1.98,
    "expiry_date": getDateString(8), // 8 days
    "stock": 55,
    "unit": "2 lb",
    "sales_last_7_days": [7, 9, 5, 8, 10, 6, 7],
    "typical_consumption_days": 10,
    "section": "Produce"
  },
  
  // BAKERY - Short shelf life (2-5 days)
  {
    "id": 9,
    "name": "Freshness Guaranteed White Bread",
    "category": "bakery",
    "price": 1.00,
    "expiry_date": getDateString(3), // 3 days
    "stock": 65,
    "unit": "20 oz loaf",
    "sales_last_7_days": [12, 15, 8, 11, 13, 9, 10],
    "typical_consumption_days": 4,
    "section": "Bakery"
  },
  {
    "id": 10,
    "name": "Freshness Guaranteed Croissants 4-pack",
    "category": "bakery",
    "price": 2.98,
    "expiry_date": getDateString(2), // 2 days
    "stock": 22,
    "unit": "4-pack",
    "sales_last_7_days": [3, 5, 2, 4, 6, 1, 3],
    "typical_consumption_days": 2,
    "section": "Bakery"
  },
  
  // DELI/PREPARED FOODS - Very short shelf life (1-2 days)
  {
    "id": 11,
    "name": "Marketside Caesar Salad Kit",
    "category": "prepared",
    "price": 3.48,
    "expiry_date": getDateString(1), // Tomorrow
    "stock": 31,
    "unit": "10.5 oz",
    "sales_last_7_days": [5, 7, 4, 6, 8, 3, 5],
    "typical_consumption_days": 1,
    "section": "Deli"
  },
  {
    "id": 12,
    "name": "Marketside Rotisserie Chicken",
    "category": "prepared",
    "price": 4.98,
    "expiry_date": getDateString(2), // 2 days
    "stock": 18,
    "unit": "whole chicken",
    "sales_last_7_days": [6, 8, 4, 7, 9, 5, 6],
    "typical_consumption_days": 2,
    "section": "Deli"
  },
  
  // MEAT & SEAFOOD - Short shelf life (2-4 days)
  {
    "id": 13,
    "name": "Great Value Ground Beef 80/20 1lb",
    "category": "meat",
    "price": 4.67,
    "expiry_date": getDateString(3), // 3 days
    "stock": 38,
    "unit": "1 lb",
    "sales_last_7_days": [8, 10, 6, 9, 12, 7, 8],
    "typical_consumption_days": 2,
    "section": "Meat & Seafood"
  },
  {
    "id": 14,
    "name": "Great Value Chicken Breast 2.5lb",
    "category": "meat",
    "price": 7.84,
    "expiry_date": getDateString(4), // 4 days
    "stock": 25,
    "unit": "2.5 lb",
    "sales_last_7_days": [4, 6, 3, 5, 7, 4, 5],
    "typical_consumption_days": 3,
    "section": "Meat & Seafood"
  },
  
  // ADDITIONAL DAIRY - Longer shelf life
  {
    "id": 15,
    "name": "Great Value Butter 4 Sticks",
    "category": "dairy",
    "price": 3.42,
    "expiry_date": getDateString(20), // 20 days
    "stock": 48,
    "unit": "1 lb",
    "sales_last_7_days": [6, 8, 5, 7, 9, 4, 6],
    "typical_consumption_days": 30,
    "section": "Dairy"
  },
  {
    "id": 16,
    "name": "Great Value Cream Cheese 8oz",
    "category": "dairy",
    "price": 1.28,
    "expiry_date": getDateString(12), // 12 days
    "stock": 42,
    "unit": "8 oz",
    "sales_last_7_days": [5, 7, 4, 6, 8, 3, 5],
    "typical_consumption_days": 21,
    "section": "Dairy"
  },
  {
    "id": 17,
    "name": "Great Value Sour Cream 16oz",
    "category": "dairy",
    "price": 1.98,
    "expiry_date": getDateString(6), // 6 days
    "stock": 29,
    "unit": "16 oz",
    "sales_last_7_days": [4, 6, 3, 5, 7, 2, 4],
    "typical_consumption_days": 14,
    "section": "Dairy"
  },
  
  // ADDITIONAL PRODUCE - Medium shelf life
  {
    "id": 18,
    "name": "Fresh Apples Gala 3lb Bag",
    "category": "produce",
    "price": 2.98,
    "expiry_date": getDateString(14), // 14 days
    "stock": 67,
    "unit": "3 lb",
    "sales_last_7_days": [9, 12, 7, 10, 13, 8, 9],
    "typical_consumption_days": 14,
    "section": "Produce"
  },
  {
    "id": 19,
    "name": "Fresh Broccoli Crowns 2lb",
    "category": "produce",
    "price": 2.47,
    "expiry_date": getDateString(5), // 5 days
    "stock": 34,
    "unit": "2 lb",
    "sales_last_7_days": [5, 7, 4, 6, 8, 3, 5],
    "typical_consumption_days": 7,
    "section": "Produce"
  },
  {
    "id": 20,
    "name": "Fresh Spinach 5oz Container",
    "category": "produce",
    "price": 1.98,
    "expiry_date": getDateString(3), // 3 days
    "stock": 41,
    "unit": "5 oz",
    "sales_last_7_days": [6, 8, 4, 7, 9, 5, 6],
    "typical_consumption_days": 3,
    "section": "Produce"
  }
];

// Function to generate more products programmatically for demo
export function generateMoreProducts(baseProducts, targetCount = 1000) {
  const products = [...baseProducts];
  const categories = ['dairy', 'produce', 'bakery', 'meat', 'prepared'];
  const sections = ['Dairy', 'Produce', 'Bakery', 'Meat & Seafood', 'Deli'];
  
  const productTemplates = [
    { prefix: 'Great Value', suffix: 'Family Pack', priceRange: [1, 8] },
    { prefix: 'Marketside', suffix: 'Fresh', priceRange: [2, 12] },
    { prefix: 'Freshness Guaranteed', suffix: 'Premium', priceRange: [1, 6] },
    { prefix: 'Equate', suffix: 'Organic', priceRange: [2, 15] }
  ];
  
  // Category-specific shelf life ranges (in days)
  const shelfLifeRanges = {
    'dairy': [1, 15],
    'produce': [1, 10], 
    'bakery': [1, 7],
    'meat': [1, 5],
    'prepared': [1, 3]
  };
  
  // US dollar price ranges by category
  const usPriceRanges = {
    'dairy': [0.98, 8.50],
    'produce': [0.68, 6.98],
    'bakery': [0.88, 4.98],
    'meat': [3.98, 12.50],
    'prepared': [2.48, 8.98]
  };
  
  for (let i = products.length; i < targetCount; i++) {
    const category = categories[i % categories.length];
    const section = sections[i % sections.length];
    const template = productTemplates[i % productTemplates.length];
    
    // Generate realistic expiry date based on category
    const [minDays, maxDays] = shelfLifeRanges[category];
    const daysUntilExpiry = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry);
    
    // Generate realistic sales data
    const baseSales = Math.floor(Math.random() * 15) + 2;
    const salesVariation = 3;
    const sales = Array.from({length: 7}, () => 
      Math.max(1, baseSales + Math.floor(Math.random() * salesVariation * 2) - salesVariation)
    );
    
    products.push({
      id: i + 1,
      name: `${template.prefix} ${category.charAt(0).toUpperCase() + category.slice(1)} Product ${i + 1}`,
      category: category,
      price: +(Math.random() * (usPriceRanges[category][1] - usPriceRanges[category][0]) + usPriceRanges[category][0]).toFixed(2),
      expiry_date: expiryDate.toISOString().split('T')[0],
      stock: Math.floor(Math.random() * 80) + 10,
      unit: "1 unit",
      sales_last_7_days: sales,
      typical_consumption_days: Math.floor(Math.random() * 20) + 1,
      section: section
    });
  }
  
  return products;
}

// Export the full product list
export const products = generateMoreProducts(sampleProducts, 1000);

// Export summary statistics for dashboard
export const productStats = {
  totalProducts: products.length,
  categories: [...new Set(products.map(p => p.category))],
  sections: [...new Set(products.map(p => p.section))],
  totalInventoryValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  averageStock: products.reduce((sum, p) => sum + p.stock, 0) / products.length
};
