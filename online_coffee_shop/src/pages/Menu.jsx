import React, { useState } from 'react'

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('espresso')

  const menuItems = {
    espresso: [
      { name: 'Single Shot', description: 'Pure concentrated espresso', price: '$3.50' },
      { name: 'Double Shot', description: 'Rich and bold double espresso', price: '$4.50' },
      { name: 'Triple Shot', description: 'For espresso lovers seeking intensity', price: '$5.50' },
      { name: 'Americano', description: 'Espresso shots with hot water', price: '$4.00' },
    ],
    milk: [
      { name: 'Latte', description: 'Espresso with steamed milk and light foam', price: '$5.50' },
      { name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and thick foam', price: '$5.50' },
      { name: 'Macchiato', description: 'Espresso "marked" with a touch of milk foam', price: '$4.50' },
      { name: 'Flat White', description: 'Espresso with velvety steamed milk', price: '$5.75' },
      { name: 'Cortado', description: 'Equal parts espresso and steamed milk', price: '$4.50' },
    ],
    cold: [
      { name: 'Cold Brew', description: 'Smooth 18-hour steeped coffee', price: '$4.50' },
      { name: 'Iced Latte', description: 'Chilled latte over ice', price: '$5.50' },
      { name: 'Iced Cappuccino', description: 'Creamy cappuccino served cold', price: '$5.50' },
      { name: 'Cold Brew Float', description: 'Cold brew with vanilla ice cream', price: '$6.50' },
    ],
    specialty: [
      { name: 'Mocha', description: 'Latte with rich chocolate', price: '$6.00' },
      { name: 'Caramel Latte', description: 'Creamy latte with caramel drizzle', price: '$6.00' },
      { name: 'Vanilla Latte', description: 'Smooth latte infused with vanilla', price: '$5.75' },
      { name: 'Hazelnut Cappuccino', description: 'Classic cappuccino with hazelnut', price: '$5.75' },
      { name: 'Spiced Chai Latte', description: 'Aromatic chai with steamed milk', price: '$5.50' },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
      {/* Hero Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-amber-900 to-amber-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-4">Our Coffee Menu</h1>
          <p className="text-xl text-amber-100">Carefully curated selections from around the world</p>
        </div>
      </div>

      {/* Menu Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { key: 'espresso', label: 'Espresso', emoji: '☕' },
              { key: 'milk', label: 'Milk Drinks', emoji: '🥛' },
              { key: 'cold', label: 'Cold Brews', emoji: '❄️' },
              { key: 'specialty', label: 'Specialty', emoji: '✨' },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-amber-700 text-white shadow-lg'
                    : 'bg-[#1a1a1a] text-amber-300 border border-amber-700 hover:border-amber-500'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {menuItems[activeCategory].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-amber-900/30 hover:border-amber-700/50 transition-all hover:shadow-lg hover:shadow-amber-900/30 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-amber-400 font-bold text-xl">{item.price}</span>
                </div>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="py-16 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#252525]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-100 mb-8 text-center">Add-ons & Extras</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-amber-900/30">
              <h3 className="text-amber-200 font-bold mb-4">Milk Options</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>• Whole Milk</li>
                <li>• Almond Milk +$0.75</li>
                <li>• Oat Milk +$0.75</li>
                <li>• Soy Milk +$0.50</li>
                <li>• Coconut Milk +$0.75</li>
              </ul>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-amber-900/30">
              <h3 className="text-amber-200 font-bold mb-4">Syrups & Sauces</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>• Vanilla Syrup +$0.50</li>
                <li>• Caramel Sauce +$0.75</li>
                <li>• Chocolate Sauce +$0.75</li>
                <li>• Hazelnut Syrup +$0.50</li>
                <li>• Honey Drizzle +$0.50</li>
              </ul>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-amber-900/30">
              <h3 className="text-amber-200 font-bold mb-4">Extras</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>• Extra Shot +$1.00</li>
                <li>• Whipped Cream +$0.50</li>
                <li>• Cinnamon Topping +$0.25</li>
                <li>• Chocolate Sprinkles +$0.35</li>
                <li>• Extra Hot +Free</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sizes Section */}
      <div className="py-16 px-4 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-100 mb-8 text-center">Sizes Available</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-amber-900/30 text-center">
              <div className="text-4xl mb-3">☕</div>
              <h3 className="text-amber-200 font-bold mb-2">Small</h3>
              <p className="text-gray-400">8 oz</p>
            </div>
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-amber-900/30 text-center">
              <div className="text-4xl mb-3">☕</div>
              <h3 className="text-amber-200 font-bold mb-2">Medium</h3>
              <p className="text-gray-400">12 oz</p>
            </div>
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-amber-900/30 text-center">
              <div className="text-4xl mb-3">☕</div>
              <h3 className="text-amber-200 font-bold mb-2">Large</h3>
              <p className="text-gray-400">16 oz</p>
            </div>
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-amber-900/30 text-center">
              <div className="text-4xl mb-3">☕</div>
              <h3 className="text-amber-200 font-bold mb-2">Extra Large</h3>
              <p className="text-gray-400">20 oz</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
