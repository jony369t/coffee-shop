
import React from "react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero min-h-[70vh]"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085)",
        }}
      >
        <div className="hero-overlay bg-black/50"></div>

        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-xl">
            <h1 className="mb-5 text-5xl font-bold">Coffee House ☕</h1>

            <p className="mb-5">
              Enjoy the best freshly brewed coffee. Discover amazing flavors
              crafted with passion.
            </p>

            <button className="btn bg-[#6b3421] text-white border-none hover:bg-[#8B4513]">
              Explore Menu
            </button>
          </div>
        </div>
      </div>

      {/* Coffee themed section */}
      <div className="bg-[#e7e1d5]">

        {/* Featured Coffee */}
        <div className="p-10">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Coffee
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1583124688253-60c350bc90d7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Latte"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Latte</h2>
                <p>Smooth espresso with steamed milk.</p>
                <div className="card-actions justify-end">
                  <button className="btn bg-[#6b3421] text-white border-none hover:bg-[#8B4513]">
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
                  alt="Cappuccino"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Cappuccino</h2>
                <p>Rich espresso with creamy foam.</p>
                <div className="card-actions justify-end">
                  <button className="btn bg-[#6b3421] text-white border-none hover:bg-[#8B4513]">
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29sZCUyMGJyZXd8ZW58MHx8MHx8fDA%3D"
                  alt="Cold Brew"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Cold Brew</h2>
                <p>Slow brewed for a smooth taste.</p>
                <div className="card-actions justify-end">
                  <button className="btn bg-[#6b3421] text-white border-none hover:bg-[#8B4513]">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-10">
          <h2 className="text-3xl font-bold text-center mb-8">
            Customer Reviews
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <p>"The latte here is amazing! Smooth and perfectly balanced."</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <p>
                  "Great coffee and relaxing environment. Highly recommended!"
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
