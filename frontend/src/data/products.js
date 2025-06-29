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
    "name": "Amul Taaza Toned Milk 1 Litre",
    "category": "dairy",
    "price": 58.00,
    "expiry_date": getDateString(1), // Tomorrow
    "stock": 45,
    "unit": "1 litre",
    "sales_last_7_days": [8, 12, 6, 9, 11, 7, 10],
    "typical_consumption_days": 5,
    "section": "Dairy"
  },
  {
    "id": 2,
    "name": "Mother Dairy Full Cream Milk 500ml",
    "category": "dairy", 
    "price": 32.00,
    "expiry_date": getDateString(2), // Day after tomorrow
    "stock": 23,
    "unit": "500 ml",
    "sales_last_7_days": [5, 8, 4, 6, 7, 3, 5],
    "typical_consumption_days": 3,
    "section": "Dairy"
  },
  {
    "id": 3,
    "name": "Amul Greek Yogurt 400g",
    "category": "dairy",
    "price": 180.00,
    "expiry_date": getDateString(3), // 3 days
    "stock": 18,
    "unit": "400g",
    "sales_last_7_days": [3, 4, 2, 5, 3, 4, 2],
    "typical_consumption_days": 7,
    "section": "Dairy"
  },
  {
    "id": 4,
    "name": "Britannia Cheese Slices 200g",
    "category": "dairy",
    "price": 145.00,
    "expiry_date": getDateString(16), // 16 days
    "stock": 35,
    "unit": "200g",
    "sales_last_7_days": [6, 8, 5, 7, 9, 4, 6],
    "typical_consumption_days": 14,
    "section": "Dairy"
  },
  
  // PRODUCE - Very short shelf life (1-4 days)
  {
    "id": 5,
    "name": "Fresh Bananas per kg",
    "category": "produce",
    "price": 60.00,
    "expiry_date": getDateString(2), // 2 days
    "stock": 120,
    "unit": "per kg",
    "sales_last_7_days": [25, 30, 18, 22, 28, 15, 20],
    "typical_consumption_days": 3,
    "section": "Produce"
  },
  {
    "id": 6,
    "name": "Fresh Strawberries 250g Pack",
    "category": "produce",
    "price": 120.00,
    "expiry_date": getDateString(1), // Tomorrow
    "stock": 42,
    "unit": "250g",
    "sales_last_7_days": [8, 12, 6, 10, 14, 5, 8],
    "typical_consumption_days": 2,
    "section": "Produce"
  },
  {
    "id": 7,
    "name": "Fresh Lettuce 1 piece",
    "category": "produce",
    "price": 40.00,
    "expiry_date": getDateString(4), // 4 days
    "stock": 28,
    "unit": "1 piece",
    "sales_last_7_days": [4, 6, 3, 5, 7, 2, 4],
    "typical_consumption_days": 5,
    "section": "Produce"
  },
  {
    "id": 8,
    "name": "Fresh Carrots 1kg",
    "category": "produce",
    "price": 45.00,
    "expiry_date": getDateString(8), // 8 days
    "stock": 55,
    "unit": "1 kg",
    "sales_last_7_days": [7, 9, 5, 8, 10, 6, 7],
    "typical_consumption_days": 10,
    "section": "Produce"
  },
  
  // BAKERY - Short shelf life (2-5 days)
  {
    "id": 9,
    "name": "Britannia Bread 450g",
    "category": "bakery",
    "price": 28.00,
    "expiry_date": getDateString(3), // 3 days
    "stock": 65,
    "unit": "450g loaf",
    "sales_last_7_days": [12, 15, 8, 11, 13, 9, 10],
    "typical_consumption_days": 4,
    "section": "Bakery"
  },
  {
    "id": 10,
    "name": "Fresh Croissants 4-pack",
    "category": "bakery",
    "price": 85.00,
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
    "name": "Ready-to-eat Caesar Salad",
    "category": "prepared",
    "price": 150.00,
    "expiry_date": getDateString(1), // Tomorrow
    "stock": 31,
    "unit": "300g",
    "sales_last_7_days": [5, 7, 4, 6, 8, 3, 5],
    "typical_consumption_days": 1,
    "section": "Deli"
  },
  {
    "id": 12,
    "name": "Roasted Chicken 1kg",
    "category": "prepared",
    "price": 380.00,
    "expiry_date": getDateString(2), // 2 days
    "stock": 18,
    "unit": "1 kg",
    "sales_last_7_days": [6, 8, 4, 7, 9, 5, 6],
    "typical_consumption_days": 2,
    "section": "Deli"
  },
  
  // MEAT & SEAFOOD - Short shelf life (2-4 days)
  {
    "id": 13,
    "name": "Fresh Mutton Keema 500g",
    "category": "meat",
    "price": 350.00,
    "expiry_date": getDateString(3), // 3 days
    "stock": 38,
    "unit": "500g",
    "sales_last_7_days": [8, 10, 6, 9, 12, 7, 8],
    "typical_consumption_days": 2,
    "section": "Meat & Seafood"
  },
  {
    "id": 14,
    "name": "Fresh Chicken Breast 1kg",
    "category": "meat",
    "price": 240.00,
    "expiry_date": getDateString(4), // 4 days
    "stock": 25,
    "unit": "1 kg",
    "sales_last_7_days": [4, 6, 3, 5, 7, 4, 5],
    "typical_consumption_days": 3,
    "section": "Meat & Seafood"
  },
  
  // ADDITIONAL DAIRY - Longer shelf life
  {
    "id": 15,
    "name": "Amul Butter 500g",
    "category": "dairy",
    "price": 260.00,
    "expiry_date": getDateString(20), // 20 days
    "stock": 48,
    "unit": "500g",
    "sales_last_7_days": [6, 8, 5, 7, 9, 4, 6],
    "typical_consumption_days": 30,
    "section": "Dairy"
  },
  {
    "id": 16,
    "name": "Britannia Cream Cheese 200g",
    "category": "dairy",
    "price": 125.00,
    "expiry_date": getDateString(12), // 12 days
    "stock": 42,
    "unit": "200g",
    "sales_last_7_days": [5, 7, 4, 6, 8, 3, 5],
    "typical_consumption_days": 21,
    "section": "Dairy"
  },
  {
    "id": 17,
    "name": "Amul Fresh Cream 200ml",
    "category": "dairy",
    "price": 65.00,
    "expiry_date": getDateString(6), // 6 days
    "stock": 29,
    "unit": "200ml",
    "sales_last_7_days": [4, 6, 3, 5, 7, 2, 4],
    "typical_consumption_days": 14,
    "section": "Dairy"
  },
  
  // ADDITIONAL PRODUCE - Medium shelf life
  {
    "id": 18,
    "name": "Fresh Apples Shimla 1kg",
    "category": "produce",
    "price": 180.00,
    "expiry_date": getDateString(14), // 14 days
    "stock": 67,
    "unit": "1 kg",
    "sales_last_7_days": [9, 12, 7, 10, 13, 8, 9],
    "typical_consumption_days": 14,
    "section": "Produce"
  },
  {
    "id": 19,
    "name": "Fresh Broccoli 500g",
    "category": "produce",
    "price": 80.00,
    "expiry_date": getDateString(5), // 5 days
    "stock": 34,
    "unit": "500g",
    "sales_last_7_days": [5, 7, 4, 6, 8, 3, 5],
    "typical_consumption_days": 7,
    "section": "Produce"
  },
  {
    "id": 20,
    "name": "Fresh Spinach 250g",
    "category": "produce",
    "price": 25.00,
    "expiry_date": getDateString(3), // 3 days
    "stock": 41,
    "unit": "250g",
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
    { prefix: 'Patanjali', suffix: 'Organic', priceRange: [25, 150] },
    { prefix: 'Amul', suffix: 'Fresh', priceRange: [30, 300] },
    { prefix: 'Britannia', suffix: 'Premium', priceRange: [20, 120] },
    { prefix: 'ITC', suffix: 'Natural', priceRange: [35, 200] }
  ];
  
  // Category-specific shelf life ranges (in days)
  const shelfLifeRanges = {
    'dairy': [1, 15],
    'produce': [1, 10], 
    'bakery': [1, 7],
    'meat': [1, 5],
    'prepared': [1, 3]
  };
  
  // Indian price ranges by category
  const indianPriceRanges = {
    'dairy': [25, 280],
    'produce': [20, 200],
    'bakery': [15, 120],
    'meat': [180, 450],
    'prepared': [80, 400]
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
      price: Math.round(Math.random() * (indianPriceRanges[category][1] - indianPriceRanges[category][0]) + indianPriceRanges[category][0]),
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
