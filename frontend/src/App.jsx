import React, { useState } from 'react';
import { BarChart3, PieChart, Package, Calendar, ChevronDown } from 'lucide-react';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import Products from './pages/Products';

const App = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'products', label: 'Products', icon: Package },
  ];

  // Date preset options
  const datePresets = [
    { label: 'Today', getValue: () => new Date() },
    { label: 'Tomorrow', getValue: () => { const d = new Date(); d.setDate(d.getDate() + 1); return d; } },
    { label: 'Next Week', getValue: () => { const d = new Date(); d.setDate(d.getDate() + 7); return d; } },
    { label: 'Custom Date', getValue: null }
  ];

  const formatDisplayDate = (date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleDatePreset = (preset) => {
    if (preset.getValue) {
      setCurrentDate(preset.getValue());
      setShowDatePicker(false);
    }
  };

  const renderPage = () => {
    const commonProps = { currentDate, setCurrentDate };
    
    switch (currentPage) {
      case 'overview':
        return <Overview {...commonProps} />;
      case 'analytics':
        return <Analytics {...commonProps} />;
      case 'products':
        return <Products {...commonProps} />;
      default:
        return <Overview {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-walmart-blue">
                  Walmart Dynamic Pricing
                </h1>
                <p className="text-sm text-gray-500">AI-Powered Markdown System</p>
              </div>
            </div>

            {/* Enhanced Date Selector */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors duration-200 min-w-[200px]"
              >
                <Calendar size={16} className="text-walmart-blue" />
                <div className="text-left flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDisplayDate(currentDate)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentDate.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Date Picker Dropdown */}
              {showDatePicker && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Simulate Date for Analysis
                    </h3>
                    
                    {/* Quick Presets */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {datePresets.slice(0, -1).map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => handleDatePreset(preset)}
                          className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                            formatDisplayDate(currentDate) === preset.label
                              ? 'bg-walmart-blue text-white border-walmart-blue'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Date Input */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Custom Date
                      </label>
                      <input
                        type="date"
                        value={currentDate.toISOString().split('T')[0]}
                        onChange={(e) => setCurrentDate(new Date(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
                      />
                      
                      {/* Date Info */}
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        💡 Changing the date will recalculate all AI recommendations based on the new timeline
                      </div>
                    </div>

                    {/* Close Button */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="w-full btn-primary text-sm"
                      >
                        Apply Date
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Backdrop to close dropdown */}
              {showDatePicker && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDatePicker(false)}
                />
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex mt-6 border-b border-gray-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                    currentPage === item.id
                      ? 'border-walmart-blue text-walmart-blue bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                  {/* Active indicator */}
                  {currentPage === item.id && (
                    <div className="w-1.5 h-1.5 bg-walmart-blue rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-8">
        {renderPage()}
      </main>

      {/* Floating Date Indicator (when dropdown is closed) */}
      {!showDatePicker && currentDate.toDateString() !== new Date().toDateString() && (
        <div className="fixed bottom-6 right-6 bg-walmart-blue text-white px-4 py-2 rounded-lg shadow-lg z-30">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} />
            <span>Simulating: {formatDisplayDate(currentDate)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
