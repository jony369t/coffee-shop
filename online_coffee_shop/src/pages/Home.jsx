import React from "react";
import { NavLink } from "react-router";

export default function Home() {
  const animationStyles = `
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.2); }
      50% { transform: scale(1); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
      <style>{animationStyles}</style>
      {/* Hero Section */}
      <div
        className="hero min-h-screen bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>

        <div className="hero-content text-center text-neutral-content relative z-10">
          <div className="max-w-2xl">
            <div
              className="mb-4 text-6xl animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              ☕
            </div>
            <h1 className="mb-6 text-7xl font-black bg-gradient-to-r from-amber-100 to-amber-300 bg-clip-text text-transparent">
              Coffee House
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-amber-50 font-light">
              Discover the art of coffee. From hand-selected beans to expertly
              crafted cups, we bring the world's finest flavors to your table.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <NavLink
                to="/menu"
                className="btn bg-gradient-to-r from-amber-700 to-amber-900 text-white border-none hover:from-amber-800 hover:to-black text-lg px-8 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Explore Menu
              </NavLink>
              <NavLink
                to="/about"
                className="btn bg-transparent border-2 border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-black text-lg px-8 font-semibold transition-colors"
              >
                Learn More
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Coffee Quality Section */}
      <div className="py-16 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#252525]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-100 mb-4">
              Why Choose Us
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 hover:scale-105 transition-transform">
              <div 
                className="text-5xl mb-4 inline-block"
                style={{
                  animation: 'bounce 2s infinite',
                }}
              >
                🌍
              </div>
              <h3 className="text-amber-200 font-bold text-lg mb-2">
                Sourced Globally
              </h3>
              <p className="text-gray-300 text-sm">
                Ethically sourced beans from the finest coffee regions worldwide
              </p>
            </div>
            <div className="text-center p-6 hover:scale-105 transition-transform">
              <div 
                className="text-5xl mb-4 inline-block"
                style={{
                  animation: 'spin 3s linear infinite',
                }}
              >
                🔥
              </div>
              <h3 className="text-amber-200 font-bold text-lg mb-2">
                Fresh Roasted
              </h3>
              <p className="text-gray-300 text-sm">
                Roasted in-house daily for maximum flavor and aroma
              </p>
            </div>
            <div className="text-center p-6 hover:scale-105 transition-transform">
              <div 
                className="text-5xl mb-4 inline-block"
                style={{
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              >
                👨‍🍳
              </div>
              <h3 className="text-amber-200 font-bold text-lg mb-2">
                Expert Baristas
              </h3>
              <p className="text-gray-300 text-sm">
                Certified baristas crafting each cup with precision
              </p>
            </div>
            <div className="text-center p-6 hover:scale-105 transition-transform">
              <div 
                className="text-5xl mb-4 inline-block"
                style={{
                  animation: 'heartbeat 1.3s ease-in-out infinite',
                }}
              >
                💯
              </div>
              <h3 className="text-amber-200 font-bold text-lg mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-300 text-sm">
                Only the finest Arabica and specialty beans selected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Coffee */}
      <div className="py-20 px-4 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-100 mb-4">
              Signature Collections
            </h2>
            <p className="text-gray-400 text-lg">Our most beloved creations</p>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Latte Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-amber-900/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1583124688253-60c350bc90d7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Latte"
                className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                <h3 className="text-3xl font-bold text-amber-100 mb-2">
                  Latte
                </h3>
                <p className="text-amber-50 mb-4 text-sm leading-relaxed">
                  Velvety smooth espresso paired with perfectly steamed milk,
                  creating the perfect balance of strength and creaminess.
                </p>
                <NavLink 
                  to="/menu"
                  className="btn bg-amber-700 hover:bg-amber-800 border-none text-white w-full font-bold"
                >
                  Discover
                </NavLink>
              </div>
            </div>

            {/* Cappuccino Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-amber-900/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
                alt="Cappuccino"
                className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                <h3 className="text-3xl font-bold text-amber-100 mb-2">
                  Cappuccino
                </h3>
                <p className="text-amber-50 mb-4 text-sm leading-relaxed">
                  The ultimate classic - bold espresso crowned with luxurious
                  foam art. Rich, bold, and beautifully presented.
                </p>
                <NavLink 
                  to="/menu"
                  className="btn bg-amber-700 hover:bg-amber-800 border-none text-white w-full font-bold"
                >
                  Discover
                </NavLink>
              </div>
            </div>

            {/* Cold Brew Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-amber-900/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29sZCUyMGJyZXd8ZW58MHx8MHx8fDA%3D"
                alt="Cold Brew"
                className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                <h3 className="text-3xl font-bold text-amber-100 mb-2">
                  Cold Brew
                </h3>
                <p className="text-amber-50 mb-4 text-sm leading-relaxed">
                  Smooth, refreshing, and naturally sweet. Slow-steeped for 18+
                  hours for the most complex flavors.
                </p>
                <NavLink 
                  to="/menu"
                  className="btn bg-amber-700 hover:bg-amber-800 border-none text-white w-full font-bold"
                >
                  Discover
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coffee Process Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-[#1a1a1a] to-[#252525]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-100 mb-4">
              Our Process
            </h2>
            <p className="text-gray-400 text-lg">
              From bean to cup with care and precision
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-amber-700 flex items-center justify-center text-white text-3xl font-bold">
                  1
                </div>
              </div>
              <h3 className="text-amber-200 font-bold text-lg mb-2">Select</h3>
              <p className="text-gray-400 text-sm">
                Hand-pick only the best coffee beans from ethical sources
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-amber-700 flex items-center justify-center text-white text-3xl font-bold">
                  2
                </div>
              </div>
              <h3 className="text-amber-200 font-bold text-lg mb-2">Roast</h3>
              <p className="text-gray-400 text-sm">
                Small-batch roasting to bring out unique flavor profiles
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-amber-700 flex items-center justify-center text-white text-3xl font-bold">
                  3
                </div>
              </div>
              <h3 className="text-amber-200 font-bold text-lg mb-2">Grind</h3>
              <p className="text-gray-400 text-sm">
                Fresh grinding moments before brewing for optimal flavor
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-amber-700 flex items-center justify-center text-white text-3xl font-bold">
                  4
                </div>
              </div>
              <h3 className="text-amber-200 font-bold text-lg mb-2">Craft</h3>
              <p className="text-gray-400 text-sm">
                Expert baristas create your perfect cup with passion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-100 mb-4">
              What Our Customers Say
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-8 border border-amber-900/30 hover:border-amber-700/50 transition-colors">
              <div className="flex gap-1 mb-4">
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed italic">
                "The latte here is absolutely incredible - smooth, perfectly
                balanced, and made with such care. I'm a coffee snob and this
                place nails it every single time."
              </p>
              <p className="text-amber-300 font-semibold">- Sarah M.</p>
            </div>

            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-8 border border-amber-900/30 hover:border-amber-700/50 transition-colors">
              <div className="flex gap-1 mb-4">
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed italic">
                "Not just great coffee, but an amazing atmosphere. This is my
                sanctuary. The baristas remember my name and my order. Simply
                the best."
              </p>
              <p className="text-amber-300 font-semibold">- James R.</p>
            </div>

            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-xl p-8 border border-amber-900/30 hover:border-amber-700/50 transition-colors">
              <div className="flex gap-1 mb-4">
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
                <span className="text-amber-400">★</span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed italic">
                "The cold brew is my daily ritual. So smooth and refreshing.
                I've tried it everywhere, but nothing compares to theirs. Highly
                recommended!"
              </p>
              <p className="text-amber-300 font-semibold">- Emma T.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-amber-900 to-amber-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 text-9xl opacity-20">☕</div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Experience Excellence?
          </h2>
          <p className="text-amber-100 text-lg mb-8">
            Visit us today and discover why our customers keep coming back
          </p>
          <NavLink
  to="/menu"
  className="relative inline-block px-12 py-4 font-bold text-lg text-white rounded-lg
  bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900
  hover:from-amber-800 hover:to-black
  transition-all duration-300 shadow-lg hover:shadow-amber-900/50"
>
  ☕ Explore Our Menu
</NavLink>
        </div>
      </div>
    </div>
  );
}
