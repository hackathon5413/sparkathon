// Indian Grocery Store Dynamic Pricing Demo
// Comprehensive Indian products with realistic pricing, brands, and consumption patterns

export const sampleProducts = [
  // DAIRY PRODUCTS (Short expiry, high turnover)
  {
    "id": 1,
    "name": "Amul Fresh Milk 500ml",
    "category": "dairy",
    "price": 28,
    "expiry_date": "2025-06-27",
    "stock": 120,
    "unit": "500ml",
    "sales_last_7_days": [25, 32, 18, 28, 35, 22, 30],
    "typical_consumption_days": 2,
    "section": "Dairy & Beverages",
    "brand": "Amul",
    "image": "/api/placeholder/150/150",
    "description": "Fresh pasteurized milk, perfect for daily consumption"
  },
  {
    "id": 2,
    "name": "Mother Dairy Toned Milk 1L",
    "category": "dairy", 
    "price": 54,
    "expiry_date": "2025-06-26",
    "stock": 85,
    "unit": "1 liter",
    "sales_last_7_days": [15, 22, 12, 18, 24, 10, 16],
    "typical_consumption_days": 1,
    "section": "Dairy & Beverages",
    "brand": "Mother Dairy",
    "image": "/api/placeholder/150/150",
    "description": "Low-fat toned milk for healthy living"
  },
  {
    "id": 3,
    "name": "Amul Masti Dahi 400g",
    "category": "dairy",
    "price": 35,
    "expiry_date": "2025-06-28",
    "stock": 65,
    "unit": "400g",
    "sales_last_7_days": [8, 12, 6, 10, 14, 7, 11],
    "typical_consumption_days": 3,
    "section": "Dairy & Beverages",
    "brand": "Amul",
    "image": "/api/placeholder/150/150",
    "description": "Fresh and creamy yogurt, rich in probiotics"
  },
  {
    "id": 4,
    "name": "Britannia Cheese Slices 200g",
    "category": "dairy",
    "price": 145,
    "expiry_date": "2025-07-15",
    "stock": 42,
    "unit": "200g pack",
    "sales_last_7_days": [3, 5, 2, 4, 6, 3, 4],
    "typical_consumption_days": 45,
    "section": "Dairy & Beverages",
    "brand": "Britannia"
  },
  {
    "id": 5,
    "name": "Amul Butter 100g",
    "category": "dairy",
    "price": 58,
    "expiry_date": "2025-08-10",
    "stock": 38,
    "unit": "100g",
    "sales_last_7_days": [6, 8, 4, 7, 9, 5, 6],
    "typical_consumption_days": 60,
    "section": "Dairy & Beverages",
    "brand": "Amul"
  },
  
  // BAKERY & BREAD
  {
    "id": 6,
    "name": "Britannia Bread 400g",
    "category": "bakery",
    "price": 25,
    "expiry_date": "2025-06-27",
    "stock": 45,
    "unit": "400g loaf",
    "sales_last_7_days": [18, 24, 15, 20, 26, 12, 19],
    "typical_consumption_days": 3,
    "section": "Bakery",
    "brand": "Britannia"
  },
  {
    "id": 7,
    "name": "Modern Pav Bread 6pc",
    "category": "bakery",
    "price": 12,
    "expiry_date": "2025-06-26",
    "stock": 80,
    "unit": "6 pieces",
    "sales_last_7_days": [22, 28, 16, 24, 30, 18, 25],
    "typical_consumption_days": 1,
    "section": "Bakery",
    "brand": "Modern"
  },
  {
    "id": 8,
    "name": "Harvest Gold Atta Bread 400g",
    "category": "bakery",
    "price": 35,
    "expiry_date": "2025-06-28",
    "stock": 32,
    "unit": "400g",
    "sales_last_7_days": [8, 12, 6, 10, 13, 7, 9],
    "typical_consumption_days": 4,
    "section": "Bakery",
    "brand": "Harvest Gold"
  },
  
  // VEGETABLES & FRUITS
  {
    "id": 9,
    "name": "Fresh Bananas",
    "category": "produce",
    "price": 60,
    "expiry_date": "2025-06-28",
    "stock": 150,
    "unit": "1 kg",
    "sales_last_7_days": [35, 42, 28, 38, 45, 25, 33],
    "typical_consumption_days": 4,
    "section": "Fruits & Vegetables",
    "brand": "Fresh"
  },
  {
    "id": 10,
    "name": "Onions Red",
    "category": "produce",
    "price": 40,
    "expiry_date": "2025-07-10",
    "stock": 200,
    "unit": "1 kg",
    "sales_last_7_days": [25, 30, 20, 28, 32, 18, 24],
    "typical_consumption_days": 15,
    "section": "Fruits & Vegetables",
    "brand": "Fresh"
  },
  {
    "id": 11,
    "name": "Potatoes",
    "category": "produce",
    "price": 35,
    "expiry_date": "2025-07-05",
    "stock": 180,
    "unit": "1 kg",
    "sales_last_7_days": [28, 35, 22, 30, 38, 20, 26],
    "typical_consumption_days": 12,
    "section": "Fruits & Vegetables",
    "brand": "Fresh"
  },
  {
    "id": 12,
    "name": "Tomatoes",
    "category": "produce",
    "price": 80,
    "expiry_date": "2025-06-29",
    "stock": 95,
    "unit": "1 kg",
    "sales_last_7_days": [20, 25, 15, 22, 28, 12, 18],
    "typical_consumption_days": 5,
    "section": "Fruits & Vegetables",
    "brand": "Fresh"
  },
  {
    "id": 13,
    "name": "Green Leafy Vegetables Mix",
    "category": "produce",
    "price": 25,
    "expiry_date": "2025-06-27",
    "stock": 75,
    "unit": "250g bunch",
    "sales_last_7_days": [15, 20, 10, 16, 22, 8, 14],
    "typical_consumption_days": 2,
    "section": "Fruits & Vegetables",
    "brand": "Fresh"
  },
  
  // RICE, PULSES & GRAINS
  {
    "id": 14,
    "name": "India Gate Basmati Rice 1kg",
    "category": "grains",
    "price": 180,
    "expiry_date": "2026-06-26",
    "stock": 120,
    "unit": "1 kg",
    "sales_last_7_days": [12, 15, 8, 13, 17, 9, 11],
    "typical_consumption_days": 365,
    "section": "Rice, Pulses & Grains",
    "brand": "India Gate"
  },
  {
    "id": 15,
    "name": "Toor Dal 1kg",
    "category": "grains",
    "price": 120,
    "expiry_date": "2026-03-15",
    "stock": 85,
    "unit": "1 kg",
    "sales_last_7_days": [8, 12, 6, 10, 14, 7, 9],
    "typical_consumption_days": 180,
    "section": "Rice, Pulses & Grains",
    "brand": "Fresh"
  },
  {
    "id": 16,
    "name": "Ashirvaad Atta 5kg",
    "category": "grains",
    "price": 285,
    "expiry_date": "2025-12-26",
    "stock": 65,
    "unit": "5 kg",
    "sales_last_7_days": [6, 9, 4, 7, 11, 5, 8],
    "typical_consumption_days": 90,
    "section": "Rice, Pulses & Grains",
    "brand": "Ashirvaad"
  },
  
  // COOKING ESSENTIALS
  {
    "id": 17,
    "name": "Tata Salt 1kg",
    "category": "essentials",
    "price": 22,
    "expiry_date": "2027-06-26",
    "stock": 150,
    "unit": "1 kg",
    "sales_last_7_days": [10, 14, 8, 12, 16, 9, 11],
    "typical_consumption_days": 120,
    "section": "Cooking Essentials",
    "brand": "Tata"
  },
  {
    "id": 18,
    "name": "Sugar 1kg",
    "category": "essentials",
    "price": 45,
    "expiry_date": "2027-01-15",
    "stock": 200,
    "unit": "1 kg",
    "sales_last_7_days": [15, 20, 12, 17, 22, 10, 14],
    "typical_consumption_days": 60,
    "section": "Cooking Essentials",
    "brand": "Fresh"
  },
  {
    "id": 19,
    "name": "Fortune Sunflower Oil 1L",
    "category": "essentials",
    "price": 145,
    "expiry_date": "2025-12-26",
    "stock": 90,
    "unit": "1 liter",
    "sales_last_7_days": [8, 12, 6, 10, 14, 7, 9],
    "typical_consumption_days": 45,
    "section": "Cooking Essentials",
    "brand": "Fortune"
  },
  
  // PACKAGED FOODS
  {
    "id": 20,
    "name": "Maggi Noodles 4-Pack",
    "category": "packaged",
    "price": 56,
    "expiry_date": "2025-10-15",
    "stock": 180,
    "unit": "4 pack",
    "sales_last_7_days": [25, 32, 18, 28, 35, 15, 22],
    "typical_consumption_days": 120,
    "section": "Packaged Foods",
    "brand": "Maggi"
  },
  {
    "id": 21,
    "name": "MTR Ready to Eat Meals",
    "category": "packaged",
    "price": 85,
    "expiry_date": "2025-08-20",
    "stock": 65,
    "unit": "300g pack",
    "sales_last_7_days": [8, 12, 5, 9, 14, 6, 10],
    "typical_consumption_days": 90,
    "section": "Packaged Foods",
    "brand": "MTR"
  },
  
  // BEVERAGES
  {
    "id": 22,
    "name": "Pepsi 600ml",
    "category": "beverages",
    "price": 25,
    "expiry_date": "2025-09-15",
    "stock": 120,
    "unit": "600ml",
    "sales_last_7_days": [15, 22, 12, 18, 25, 10, 16],
    "typical_consumption_days": 180,
    "section": "Beverages",
    "brand": "Pepsi"
  },
  {
    "id": 23,
    "name": "Bisleri Water 1L",
    "category": "beverages",
    "price": 20,
    "expiry_date": "2026-06-26",
    "stock": 200,
    "unit": "1 liter",
    "sales_last_7_days": [30, 38, 25, 32, 40, 22, 28],
    "typical_consumption_days": 365,
    "section": "Beverages",
    "brand": "Bisleri"
  },
  
  // SNACKS
  {
    "id": 24,
    "name": "Lays Chips 52g",
    "category": "snacks",
    "price": 20,
    "expiry_date": "2025-08-10",
    "stock": 150,
    "unit": "52g pack",
    "sales_last_7_days": [20, 28, 15, 22, 30, 12, 18],
    "typical_consumption_days": 60,
    "section": "Snacks",
    "brand": "Lays"
  },
  {
    "id": 25,
    "name": "Parle-G Biscuits 376g",
    "category": "snacks",
    "price": 35,
    "expiry_date": "2025-09-20",
    "stock": 95,
    "unit": "376g pack",
    "sales_last_7_days": [18, 24, 14, 20, 26, 12, 16],
    "typical_consumption_days": 45,
    "section": "Snacks",
    "brand": "Parle"
  }
];

// Function to generate more Indian products programmatically for demo
export function generateMoreProducts(baseProducts, targetCount = 500) {
  const products = [...baseProducts];
  
  const indianProductTemplates = [
    // Dairy Products
    { name: "Nestle Milk", category: "dairy", price: [25, 55], expiry: [1, 3], consumption: [1, 3], section: "Dairy & Beverages", brand: "Nestle" },
    { name: "Britannia Paneer", category: "dairy", price: [85, 120], expiry: [3, 5], consumption: [2, 4], section: "Dairy & Beverages", brand: "Britannia" },
    { name: "Amul Lassi", category: "dairy", price: [15, 25], expiry: [2, 4], consumption: [1, 2], section: "Dairy & Beverages", brand: "Amul" },
    
    // Bakery Products
    { name: "Britannia Marie Biscuits", category: "bakery", price: [25, 45], expiry: [60, 120], consumption: [15, 30], section: "Bakery", brand: "Britannia" },
    { name: "Parle Rusk", category: "bakery", price: [35, 55], expiry: [45, 90], consumption: [20, 40], section: "Bakery", brand: "Parle" },
    { name: "Modern Brown Bread", category: "bakery", price: [35, 45], expiry: [3, 5], consumption: [2, 4], section: "Bakery", brand: "Modern" },
    
    // Vegetables & Fruits
    { name: "Green Chillies", category: "produce", price: [40, 80], expiry: [3, 7], consumption: [5, 10], section: "Fruits & Vegetables", brand: "Fresh" },
    { name: "Ginger", category: "produce", price: [60, 120], expiry: [7, 15], consumption: [10, 20], section: "Fruits & Vegetables", brand: "Fresh" },
    { name: "Cauliflower", category: "produce", price: [30, 60], expiry: [3, 7], consumption: [3, 5], section: "Fruits & Vegetables", brand: "Fresh" },
    { name: "Apples", category: "produce", price: [120, 200], expiry: [7, 15], consumption: [5, 10], section: "Fruits & Vegetables", brand: "Fresh" },
    { name: "Oranges", category: "produce", price: [80, 140], expiry: [5, 12], consumption: [4, 8], section: "Fruits & Vegetables", brand: "Fresh" },
    
    // Rice, Pulses & Grains
    { name: "Moong Dal", category: "grains", price: [100, 140], expiry: [180, 365], consumption: [60, 120], section: "Rice, Pulses & Grains", brand: "Fresh" },
    { name: "Chana Dal", category: "grains", price: [80, 120], expiry: [180, 365], consumption: [60, 120], section: "Rice, Pulses & Grains", brand: "Fresh" },
    { name: "Sona Masoori Rice", category: "grains", price: [120, 180], expiry: [300, 400], consumption: [45, 90], section: "Rice, Pulses & Grains", brand: "India Gate" },
    { name: "Besan Flour", category: "grains", price: [60, 90], expiry: [120, 180], consumption: [30, 60], section: "Rice, Pulses & Grains", brand: "Fresh" },
    
    // Cooking Essentials
    { name: "Turmeric Powder", category: "essentials", price: [40, 80], expiry: [365, 730], consumption: [90, 180], section: "Cooking Essentials", brand: "MDH" },
    { name: "Red Chilli Powder", category: "essentials", price: [60, 120], expiry: [365, 730], consumption: [90, 180], section: "Cooking Essentials", brand: "MDH" },
    { name: "Garam Masala", category: "essentials", price: [45, 85], expiry: [365, 730], consumption: [120, 240], section: "Cooking Essentials", brand: "Everest" },
    { name: "Mustard Oil", category: "essentials", price: [140, 180], expiry: [180, 365], consumption: [30, 60], section: "Cooking Essentials", brand: "Fortune" },
    
    // Packaged Foods
    { name: "Haldiram Namkeen", category: "packaged", price: [35, 85], expiry: [60, 120], consumption: [15, 30], section: "Packaged Foods", brand: "Haldiram" },
    { name: "Yippee Noodles", category: "packaged", price: [12, 25], expiry: [120, 180], consumption: [30, 60], section: "Packaged Foods", brand: "Yippee" },
    { name: "Atta Noodles", category: "packaged", price: [45, 75], expiry: [120, 180], consumption: [30, 60], section: "Packaged Foods", brand: "Maggi" },
    
    // Beverages
    { name: "Frooti Mango Drink", category: "beverages", price: [10, 20], expiry: [120, 180], consumption: [60, 120], section: "Beverages", brand: "Frooti" },
    { name: "Real Juice", category: "beverages", price: [80, 120], expiry: [90, 150], consumption: [30, 60], section: "Beverages", brand: "Real" },
    { name: "Thums Up", category: "beverages", price: [20, 40], expiry: [150, 200], consumption: [90, 150], section: "Beverages", brand: "Thums Up" },
    
    // Snacks
    { name: "Kurkure", category: "snacks", price: [10, 25], expiry: [60, 90], consumption: [20, 40], section: "Snacks", brand: "Kurkure" },
    { name: "Good Day Biscuits", category: "snacks", price: [25, 45], expiry: [60, 120], consumption: [15, 30], section: "Snacks", brand: "Britannia" },
    { name: "Hide & Seek Biscuits", category: "snacks", price: [30, 50], expiry: [60, 120], consumption: [15, 30], section: "Snacks", brand: "Parle" }
  ];
  
  for (let i = products.length; i < targetCount; i++) {
    const template = indianProductTemplates[i % indianProductTemplates.length];
    
    // Generate random expiry date based on template
    const today = new Date();
    const expiryDate = new Date(today);
    const expiryRange = template.expiry;
    const daysToAdd = Math.floor(Math.random() * (expiryRange[1] - expiryRange[0])) + expiryRange[0];
    expiryDate.setDate(today.getDate() + daysToAdd);
    
    // Generate realistic sales data based on product type
    const baseSales = template.category === 'produce' ? Math.floor(Math.random() * 25) + 10 :
                     template.category === 'dairy' ? Math.floor(Math.random() * 20) + 8 :
                     template.category === 'bakery' ? Math.floor(Math.random() * 15) + 5 :
                     Math.floor(Math.random() * 12) + 3;
    
    const salesVariation = Math.floor(baseSales * 0.4);
    const sales = Array.from({length: 7}, () => 
      Math.max(1, baseSales + Math.floor(Math.random() * salesVariation * 2) - salesVariation)
    );
    
    products.push({
      id: i + 1,
      name: `${template.name} ${i + 1 - baseProducts.length}`,
      category: template.category,
      price: Math.floor(Math.random() * (template.price[1] - template.price[0])) + template.price[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      stock: Math.floor(Math.random() * 150) + 20,
      unit: template.category === 'produce' ? '1 kg' : 
            template.category === 'dairy' ? '500ml' :
            template.category === 'grains' ? '1 kg' : '1 pack',
      sales_last_7_days: sales,
      typical_consumption_days: Math.floor(Math.random() * (template.consumption[1] - template.consumption[0])) + template.consumption[0],
      section: template.section,
      brand: template.brand
    });
  }
  
  return products;
}

// Export the full product list with more realistic count
export const products = generateMoreProducts(sampleProducts, 200);

// Export summary statistics for dashboard
export const productStats = {
  totalProducts: products.length,
  categories: [...new Set(products.map(p => p.category))],
  sections: [...new Set(products.map(p => p.section))],
  brands: [...new Set(products.map(p => p.brand))],
  totalInventoryValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  averageStock: Math.round(products.reduce((sum, p) => sum + p.stock, 0) / products.length),
  averagePrice: Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
};
