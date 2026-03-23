import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
      {/* Hero Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-amber-900 to-amber-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-4">Our Story</h1>
          <p className="text-xl text-amber-100">Crafting excellence in every cup since 2015</p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-xl p-8 border border-amber-900/30">
              <h2 className="text-3xl font-bold text-amber-100 mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                We believe that coffee is more than just a beverage—it's a ritual, a moment of connection, and a small indulgence in an often hectic day. Our mission is to provide our community with ethically sourced, expertly roasted, and meticulously crafted coffee that elevates everyday moments into memorable experiences.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-xl p-8 border border-amber-900/30">
              <h2 className="text-3xl font-bold text-amber-100 mb-4">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                To become a beloved local destination where coffee enthusiasts, professionals, and creatives come together. We envision a future where sustainable coffee trade is the norm, and where every cup tells the story of the farmers and lands that made it possible.
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-amber-100 text-center mb-4">Our Core Values</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-12"></div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-amber-900/30 text-center hover:border-amber-700/50 transition-colors">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-amber-200 font-bold text-lg mb-2">Sustainability</h3>
                <p className="text-gray-400 text-sm">Committed to eco-friendly practices and fair-trade partnerships</p>
              </div>

              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-amber-900/30 text-center hover:border-amber-700/50 transition-colors">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-amber-200 font-bold text-lg mb-2">Quality</h3>
                <p className="text-gray-400 text-sm">Unwavering commitment to excellence in every aspect</p>
              </div>

              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-amber-900/30 text-center hover:border-amber-700/50 transition-colors">
                <div className="text-5xl mb-4">❤️</div>
                <h3 className="text-amber-200 font-bold text-lg mb-2">Community</h3>
                <p className="text-gray-400 text-sm">Building relationships and supporting local initiatives</p>
              </div>

              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-amber-900/30 text-center hover:border-amber-700/50 transition-colors">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-amber-200 font-bold text-lg mb-2">Craft</h3>
                <p className="text-gray-400 text-sm">Taking pride in the artistry of roasting and brewing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="py-20 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#252525]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-amber-100 text-center mb-4">Meet Our Team</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-12"></div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl overflow-hidden border border-amber-900/30 hover:border-amber-700/50 transition-all hover:shadow-lg hover:shadow-amber-900/30">
              <div className="h-48 bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-6xl">👨‍💼</div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-100 mb-1">Alex Rodriguez</h3>
                <p className="text-amber-300 font-semibold mb-3">Founder & Head Roaster</p>
                <p className="text-gray-400 text-sm">Passionate coffee enthusiast with 15 years of experience in specialty coffee sourcing and roasting.</p>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl overflow-hidden border border-amber-900/30 hover:border-amber-700/50 transition-all hover:shadow-lg hover:shadow-amber-900/30">
              <div className="h-48 bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-6xl">👩‍💼</div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-100 mb-1">Sarah Chen</h3>
                <p className="text-amber-300 font-semibold mb-3">Lead Barista</p>
                <p className="text-gray-400 text-sm">Certified specialty barista with a talent for latte art and creating personalized coffee experiences.</p>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl overflow-hidden border border-amber-900/30 hover:border-amber-700/50 transition-all hover:shadow-lg hover:shadow-amber-900/30">
              <div className="h-48 bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-6xl">👩‍🍳</div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-100 mb-1">Maria Santos</h3>
                <p className="text-amber-300 font-semibold mb-3">Cafe Manager</p>
                <p className="text-gray-400 text-sm">Dedicated to creating a warm, welcoming atmosphere and ensuring every customer feels at home.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* By The Numbers */}
      <div className="py-20 px-4 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-amber-100 text-center mb-12">By The Numbers</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-amber-400 mb-2">8+</div>
              <p className="text-gray-300 text-lg">Years of Excellence</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-amber-400 mb-2">50K+</div>
              <p className="text-gray-300 text-lg">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-amber-400 mb-2">25</div>
              <p className="text-gray-300 text-lg">Coffee Origins</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-amber-400 mb-2">100%</div>
              <p className="text-gray-300 text-lg">Ethically Sourced</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
