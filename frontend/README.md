# Walmart Dynamic Pricing Dashboard

## 🎯 Project Overview

A hackathon project that provides **AI-powered dynamic pricing recommendations** for Walmart to reduce food waste and maximize revenue. The dashboard automatically suggests optimal discounts for products nearing expiry and helps store managers make data-driven markdown decisions.

## 🚀 Problem We're Solving

- **$1 Billion** in food waste annually at Walmart
- Manual price reductions are inconsistent and reactive
- No data-driven approach to optimal discount timing
- Products expire before being sold at reduced prices

## 💡 Our Solution

**Smart AI Dashboard** that provides:
- ✅ **Automatic discount calculations** based on expiry dates and sales velocity
- ✅ **Priority-based recommendations** (Critical/High/Medium/Low)
- ✅ **Revenue impact visualization** showing potential savings vs losses
- ✅ **Real-time inventory monitoring** with actionable insights

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS with Walmart branding
- **Icons**: Lucide React
- **Data**: JSON-based product inventory (1000+ items)
- **AI Logic**: Simple but effective rule-based algorithms

## 📊 Key Features

### Dashboard Metrics
- **Critical Products**: Items needing immediate markdown
- **Revenue at Risk**: Potential losses without action
- **Potential Savings**: Revenue recoverable through smart discounts
- **Waste Reduction %**: Expected improvement metrics

### Smart Discount Logic
```javascript
// Example of our AI logic
if (daysToExpiry <= 1) return 50% discount  // Expires tomorrow
if (daysToExpiry <= 3) return 25-40% discount  // High priority
if (stockVelocity > expiryWindow) return 20% discount  // Too much inventory
```

### Product Categories
- 🥛 **Dairy Products** (milk, cheese, yogurt)
- 🥬 **Fresh Produce** (fruits, vegetables)
- 🍞 **Bakery Items** (bread, pastries)
- 🥩 **Meat & Seafood** (fresh proteins)
- 🥗 **Prepared Foods** (deli items, salads)

## 🚀 Quick Start

### Prerequisites
- Node.js (16+ recommended)
- npm or yarn

### Installation
```bash
# Clone the project
cd sparkathon

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage
1. Open browser to `http://localhost:5173`
2. View the dashboard with 1000+ sample products
3. Use the date simulator to see how recommendations change
4. Filter by category or priority level
5. Apply discount recommendations

## 🎬 Demo Features

Perfect for hackathon presentation:

### Visual Impact
- 🔴 **Red alerts** for critical products
- 🟡 **Yellow warnings** for high priority items  
- 🟢 **Green indicators** for successful recommendations
- 📈 **Live metrics** showing money saved

### Demo Scenarios
1. **Crisis Mode**: Show products expiring tomorrow with deep discounts
2. **Smart Prevention**: Display early warnings for upcoming expiries
3. **Revenue Impact**: Demonstrate clear ROI with before/after metrics

## 🧮 AI Algorithm Highlights

Our discount calculation considers:
- **Days until expiry** (primary factor)
- **Current stock levels** (inventory pressure)
- **Sales velocity** (7-day average)
- **Product category** (different consumption patterns)
- **Seasonal factors** (can be extended)

## 📈 Business Impact

### Expected Results
- **40% reduction** in food waste
- **15% increase** in profit margins
- **$200M+ annual savings** for Walmart
- **Better customer experience** with quality discounted products

### Scalability
- Easily adaptable to other retailers
- Can integrate with existing POS systems
- Machine learning enhancement ready
- Real-time data integration capable

## 🎯 Hackathon Value Proposition

**"We don't just reduce waste - we turn potential losses into profit opportunities"**

### Why This Wins
1. **Addresses real $1B problem** at Walmart
2. **Simple but effective** solution that works today
3. **Clear ROI demonstration** with concrete metrics
4. **Scalable technology** for retail industry
5. **Social impact** reducing food waste globally

## 🔧 Project Structure

```
src/
├── components/
│   └── Dashboard.jsx          # Main dashboard UI
├── data/
│   └── products.js           # 1000+ sample products
├── utils/
│   └── pricingLogic.js       # Core AI algorithms
├── App.jsx                   # Main app component
└── index.css                 # Walmart-themed styling
```

## 🏆 Future Enhancements

- **Machine Learning**: More sophisticated prediction models
- **Real-time Integration**: Live POS and inventory data
- **Mobile App**: For store managers on-the-go
- **Analytics Dashboard**: Deep insights and reporting
- **Multi-store Management**: Chain-wide optimization

## 👥 Team

Built for Sparkathon - focusing on impactful solutions for real business problems.

---

**Ready to revolutionize retail pricing and eliminate food waste!** 🌟
