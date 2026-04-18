import React from 'react'
import { NavLink } from 'react-router'

export default function Blog() {
  const articles = [
    {
      id: 'brewing-tips',
      title: 'The Art of Coffee Brewing: Tips from Our Head Barista',
      date: 'March 15, 2024',
      category: 'Tutorial',
      excerpt: 'Learn the secrets to brewing the perfect cup at home. Discover water temperature, grind size, and timing techniques.',
      image: '📚',
    },
    {
      id: 'ethiopian-journey',
      title: 'Exploring Single-Origin Coffees: An Ethiopian Journey',
      date: 'March 10, 2024',
      category: 'Origins',
      excerpt: 'Dive into the rich flavors of Ethiopian Yirgacheffe beans and discover why they\'re among our most requested.',
      image: '🌍',
    },
    {
      id: 'spring-collection',
      title: 'Seasonal Roasts: Spring Collection Now Available',
      date: 'March 5, 2024',
      category: 'Releases',
      excerpt: 'Introducing our spring collection featuring light roasts with bright, fruity notes perfect for the season.',
      image: '🌸',
    },
    {
      id: 'espresso-science',
      title: 'The Science Behind Espresso Extraction',
      date: 'February 28, 2024',
      category: 'Science',
      excerpt: 'Understand what happens during the 25-second espresso pull and why precision matters in every shot.',
      image: '🔬',
    },
    {
      id: 'fair-trade',
      title: 'Sustainable Coffee Trading: Our Fair Trade Commitment',
      date: 'February 20, 2024',
      category: 'Sustainability',
      excerpt: 'Learn about our partnership with Ethiopian farmers and how we ensure every bean is ethically sourced.',
      image: '🌱',
    },
    {
      id: 'coffee-pairings',
      title: 'Best Coffee Pairs: Perfect Pairings for Every Brew',
      date: 'February 15, 2024',
      category: 'Pairing',
      excerpt: 'Discover which pastries and foods complement different coffee profiles for the ultimate café experience.',
      image: '🥐',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
      {/* Hero Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-amber-900 to-amber-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-4">Coffee Chronicles</h1>
          <p className="text-xl text-amber-100">Stories, tips, and insights from the world of specialty coffee</p>
        </div>
      </div>

      {/* Featured Article */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <NavLink to="/blog/brewing-tips" className="block">
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-2xl overflow-hidden border border-amber-900/30 hover:border-amber-700/50 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:scale-105 cursor-pointer">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-amber-900 to-amber-800 text-9xl">
                  📖
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-block bg-amber-700 text-white px-4 py-1 rounded-full text-sm font-semibold">Featured</span>
                  </div>
                  <h2 className="text-3xl font-bold text-amber-100 mb-3">The Art of Coffee Brewing: Tips from Our Head Barista</h2>
                  <p className="text-gray-300 mb-4">Discover the secrets to brewing the perfect cup at home and learn the professional techniques used by our expert baristas.</p>
                  <div className="flex gap-4 items-center text-sm text-gray-400">
                    <span>March 15, 2024</span>
                    <span>•</span>
                    <span>8 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="py-16 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#252525]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-100 mb-12">Latest Articles</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] rounded-xl overflow-hidden border border-amber-900/30 hover:border-amber-700/50 transition-all hover:shadow-lg hover:shadow-amber-900/30 hover:scale-105 cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-amber-800 to-amber-900 flex items-center justify-center text-6xl">
                  {article.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-amber-400 uppercase">{article.category}</span>
                    <span className="text-xs text-gray-500">{article.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-amber-100 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <NavLink 
                    to={`/blog/${article.id}`}
                    className="text-amber-400 font-semibold hover:text-amber-300 transition-colors inline-flex items-center gap-2"
                  >
                    Read More
                    <span>→</span>
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-16 px-4 bg-[#0f0f0f]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-amber-100 mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-400 mb-8">Get weekly coffee tips, exclusive recipes, and updates on new releases delivered to your inbox.</p>

          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-[#1a1a1a] border border-amber-900/30 text-white placeholder-gray-600 focus:outline-none focus:border-amber-700 transition-colors"
            />
            <button className="px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
