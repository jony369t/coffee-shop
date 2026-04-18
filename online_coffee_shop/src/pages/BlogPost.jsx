import React from 'react';
import { useParams, NavLink } from 'react-router';

export default function BlogPost() {
  const { id } = useParams();

  const blogPosts = {
    'brewing-tips': {
      title: 'The Art of Coffee Brewing: Tips from Our Head Barista',
      date: 'March 15, 2024',
      category: 'Tutorial',
      readTime: '8 min',
      image: '📚',
      content: `
        <h2>Introduction</h2>
        <p>Brewing the perfect cup of coffee at home is both an art and a science. Whether you're a seasoned coffee enthusiast or just starting your journey, understanding the fundamentals can transform your daily routine into a ritual of excellence.</p>

        <h2>Water Temperature Matters</h2>
        <p>One of the most crucial factors in coffee brewing is water temperature. The ideal temperature for brewing coffee is between 195°F and 205°F (90°C to 96°C). Water that's too hot can over-extract the coffee, making it bitter, while water that's too cool will under-extract, resulting in a weak, sour cup.</p>
        <p>Pro Tip: If you don't have a thermometer, let boiling water cool for about 30 seconds before pouring.</p>

        <h2>Grind Size Optimization</h2>
        <p>The size of your coffee grounds directly affects extraction time. Different brewing methods require different grind sizes:</p>
        <ul>
          <li><strong>Coarse Grind:</strong> French press, cold brew</li>
          <li><strong>Medium Grind:</strong> Drip coffee makers, Chemex</li>
          <li><strong>Fine Grind:</strong> Espresso, Moka pot</li>
        </ul>
        <p>Investing in a quality burr grinder will give you consistent results every time.</p>

        <h2>Timing and Extraction</h2>
        <p>The contact time between water and coffee grounds determines how much flavor is extracted. Generally:</p>
        <ul>
          <li>Espresso: 25-30 seconds</li>
          <li>Pour-over: 3-4 minutes</li>
          <li>French press: 4 minutes</li>
          <li>Cold brew: 12-24 hours</li>
        </ul>

        <h2>Water Quality</h2>
        <p>Don't overlook the water! Mineral content affects taste. For best results, use filtered water or spring water rather than tap water, which can contain chlorine and other impurities that interfere with flavor.</p>

        <h2>Conclusion</h2>
        <p>Mastering these fundamentals will elevate your home brewing game significantly. Remember, the best coffee is the one you enjoy most, so experiment and find your perfect cup!</p>
      `,
    },
    'ethiopian-journey': {
      title: 'Exploring Single-Origin Coffees: An Ethiopian Journey',
      date: 'March 10, 2024',
      category: 'Origins',
      readTime: '6 min',
      image: '🌍',
      content: `
        <h2>The Birthplace of Coffee</h2>
        <p>Ethiopia is considered the birthplace of coffee, where wild coffee plants are believed to have originated. The country produces some of the world's most distinctive and flavorful beans, particularly from the Yirgacheffe region.</p>

        <h2>Yirgacheffe: The Jewel of Ethiopian Coffee</h2>
        <p>Yirgacheffe beans are prized for their complex flavor profile featuring:</p>
        <ul>
          <li>Fruity notes (berries, citrus)</li>
          <li>Floral undertones</li>
          <li>Light to medium body</li>
          <li>Bright acidity</li>
        </ul>

        <h2>Altitude and Terroir</h2>
        <p>Ethiopian coffees grown at high altitudes (often between 4,000-7,000 feet) develop more complex flavors. The cooler temperatures allow the beans to mature slowly, concentrating sugars and acids that contribute to the unique taste profile.</p>

        <h2>Traditional Farming Methods</h2>
        <p>Many Ethiopian coffee farmers still use traditional methods, including:</p>
        <ul>
          <li>Shade-growing among native trees</li>
          <li>Hand-harvesting and sorting</li>
          <li>Natural drying process on the ground</li>
        </ul>
        <p>These methods not only preserve the environment but also contribute to the exceptional quality of the beans.</p>

        <h2>Tasting Notes You'll Discover</h2>
        <p>When you brew a cup of Ethiopian Yirgacheffe, you might notice:</p>
        <ul>
          <li>Initial sweetness with berry notes</li>
          <li>Subtle floral hints reminiscent of jasmine</li>
          <li>A clean, crisp finish</li>
          <li>Complex layers that develop as the cup cools</li>
        </ul>

        <h2>Why We Love It</h2>
        <p>At our coffee shop, we're passionate about Ethiopian coffees because they represent the origin story of coffee itself. Each cup tells the story of the farmers, the land, and the traditions that have shaped coffee culture for centuries.</p>
      `,
    },
    'spring-collection': {
      title: 'Seasonal Roasts: Spring Collection Now Available',
      date: 'March 5, 2024',
      category: 'Releases',
      readTime: '5 min',
      image: '🌸',
      content: `
        <h2>Welcoming Spring with Fresh Roasts</h2>
        <p>As the flowers bloom and the weather warms, we're excited to introduce our exclusive Spring Collection featuring light, vibrant roasts that capture the essence of the season.</p>

        <h2>What Makes Spring Roasts Special?</h2>
        <p>Spring roasts are characterized by:</p>
        <ul>
          <li>Light roast profile for brightness</li>
          <li>Fruity and floral notes</li>
          <li>Crisp acidity that awakens the palate</li>
          <li>Clean, delicate body</li>
        </ul>

        <h2>Featured Beans in Our Spring Collection</h2>

        <h3>Kenyan AA - Floral & Bright</h3>
        <p>With notes of jasmine and citrus, this bean brings elegance to your morning cup. Perfect for those who enjoy complexity and refinement.</p>

        <h3>Colombian Geisha - Tropical Fruit Notes</h3>
        <p>A delicate bean with tropical undertones and a velvety mouthfeel. Smooth yet sophisticated.</p>

        <h3>Costa Rican Natural - Sweet & Balanced</h3>
        <p>Naturally processed for a sweeter profile with notes of berries and chocolate. A crowd-pleaser for spring.</p>

        <h2>Brewing Recommendations</h2>
        <p>For our spring collection, we recommend:</p>
        <ul>
          <li>Pour-over brewing to highlight the delicate flavors</li>
          <li>Water temperature of 200°F for optimal extraction</li>
          <li>Grinding just before brewing for maximum freshness</li>
        </ul>

        <h2>Perfect Spring Pairings</h2>
        <p>Enjoy our spring roasts with:</p>
        <ul>
          <li>Fresh pastries and croissants</li>
          <li>Light salads for a refreshing lunch</li>
          <li>Fruit-based desserts</li>
        </ul>

        <h2>Limited Time Offer</h2>
        <p>Our Spring Collection is available for a limited time only. Don't miss the opportunity to experience these exquisite roasts that celebrate the season of renewal!</p>
      `,
    },
    'espresso-science': {
      title: 'The Science Behind Espresso Extraction',
      date: 'February 28, 2024',
      category: 'Science',
      readTime: '7 min',
      image: '🔬',
      content: `
        <h2>Understanding Espresso Extraction</h2>
        <p>Espresso is one of the most precise forms of coffee brewing, requiring exact timing, pressure, and temperature. The magic happens in just 25-30 seconds as hot water is forced through finely ground coffee.</p>

        <h2>The Extraction Process</h2>
        <p>During espresso extraction, water dissolves soluble compounds from the coffee grounds in stages:</p>
        <ul>
          <li><strong>0-8 seconds:</strong> Rapid dissolution of solubles (sour acids)</li>
          <li><strong>8-25 seconds:</strong> Sweet and balanced extraction</li>
          <li><strong>25+ seconds:</strong> Over-extraction (bitter compounds)</li>
        </ul>

        <h2>Pressure and Its Role</h2>
        <p>Espresso machines use 9 bars of pressure to force water through the coffee grounds. This pressure:</p>
        <ul>
          <li>Increases contact surface area</li>
          <li>Forces water through the coffee bed uniformly</li>
          <li>Extracts oils that create espresso's signature crema</li>
        </ul>

        <h2>Grind Size Impact</h2>
        <p>For espresso, grind size is critical. Too coarse and water passes through too quickly (under-extraction). Too fine and water cannot penetrate (over-extraction). The ideal espresso grind is very fine, nearly powder-like.</p>

        <h2>Temperature Stability</h2>
        <p>Water temperature must remain between 195-205°F throughout extraction. Temperature fluctuations can dramatically affect the final cup, making it either sour or bitter.</p>

        <h2>Crema Formation</h2>
        <p>The golden crema atop espresso is not just for show. It's formed by emulsified oils and gas bubbles, indicating proper extraction and high-quality beans. The crema's color and thickness reveal how well the espresso was pulled.</p>

        <h2>Achieving the Perfect Shot</h2>
        <p>For baristas and enthusiasts, achieving the perfect espresso requires:</p>
        <ul>
          <li>Fresh beans (roasted within 4 weeks)</li>
          <li>Proper grinding (consistent medium-fine texture)</li>
          <li>Correct tamping pressure (30 pounds)</li>
          <li>Clean equipment (residual oils affect flavor)</li>
          <li>Precise timing (25-30 seconds from start to finish)</li>
        </ul>
      `,
    },
    'fair-trade': {
      title: 'Sustainable Coffee Trading: Our Fair Trade Commitment',
      date: 'February 20, 2024',
      category: 'Sustainability',
      readTime: '6 min',
      image: '🌱',
      content: `
        <h2>Our Promise to Farmers</h2>
        <p>At our coffee shop, we believe in creating a positive impact beyond the cup. Fair trade coffee isn't just a label—it's our commitment to ensuring that farmers receive fair compensation for their hard work.</p>

        <h2>What Fair Trade Really Means</h2>
        <p>Fair trade coffee certification ensures:</p>
        <ul>
          <li>Farmers receive minimum price guarantees</li>
          <li>Direct trade relationships eliminate middlemen</li>
          <li>Support for sustainable farming practices</li>
          <li>Investment in community development projects</li>
        </ul>

        <h2>Our Partnership with Ethiopian Farmers</h2>
        <p>We work directly with cooperatives in Ethiopia to source our premium Yirgacheffe beans. Through this partnership:</p>
        <ul>
          <li>Farmers earn 2-3x the market price</li>
          <li>Children have access to education programs</li>
          <li>Community wells and schools are built</li>
          <li>Agricultural techniques are improved through training</li>
        </ul>

        <h2>Sustainability at Every Step</h2>
        <p>Our commitment extends to environmental practices:</p>
        <ul>
          <li>Shade-growing preserves native forests</li>
          <li>Water conservation programs reduce waste</li>
          <li>Biodiversity is protected on farms</li>
          <li>Carbon offset programs mitigate climate impact</li>
        </ul>

        <h2>Impact by the Numbers</h2>
        <p>Through our fair trade partnerships:</p>
        <ul>
          <li>500+ farming families directly supported</li>
          <li>50+ schools funded through premiums</li>
          <li>1,000+ acres of forest preserved</li>
          <li>10,000+ tons of CO2 offset annually</li>
        </ul>

        <h2>Your Role as a Consumer</h2>
        <p>Every cup you buy supports this mission. By choosing fair trade coffee, you're:</p>
        <ul>
          <li>Supporting sustainable agriculture</li>
          <li>Improving lives in coffee-producing communities</li>
          <li>Preserving ecosystems</li>
          <li>Making a global impact one cup at a time</li>
        </ul>

        <h2>Join Us in Making a Difference</h2>
        <p>We invite you to be part of our fair trade journey. Together, we can create a coffee industry that's both delicious and ethical.</p>
      `,
    },
    'coffee-pairings': {
      title: 'Best Coffee Pairs: Perfect Pairings for Every Brew',
      date: 'February 15, 2024',
      category: 'Pairing',
      readTime: '5 min',
      image: '🥐',
      content: `
        <h2>The Art of Coffee Pairing</h2>
        <p>Just as wine pairs with food, coffee can be expertly matched with pastries and foods to enhance both the coffee and the food. The key is understanding flavor profiles and how they complement each other.</p>

        <h2>Espresso Pairings</h2>

        <h3>Espresso + Almond Biscotti</h3>
        <p>The nutty notes in biscotti echo the roasted flavors of espresso. The slight sweetness balances the boldness perfectly.</p>

        <h3>Espresso + Chocolate Croissant</h3>
        <p>Rich chocolate and bold espresso create a luxurious combination. The buttery pastry softens the espresso's intensity.</p>

        <h2>Latte Pairings</h2>

        <h3>Latte + Blueberry Muffin</h3>
        <p>The fruity notes of blueberry complement the creamy latte beautifully. Not too heavy, perfectly balanced.</p>

        <h3>Latte + Vanilla Donut</h3>
        <p>Vanilla and milk notes create a harmonious, comforting pairing. Perfect for a leisurely morning.</p>

        <h2>Cappuccino Pairings</h2>

        <h3>Cappuccino + Cannoli</h3>
        <p>The ricotta filling's sweetness balances cappuccino's milk and espresso blend. A classic Italian pairing.</p>

        <h3>Cappuccino + Cornetto</h3>
        <p>The flaky, light pastry pairs wonderfully with cappuccino's smooth, creamy texture.</p>

        <h2>Filter Coffee Pairings</h2>

        <h3>Filter Coffee + Carrot Cake</h3>
        <p>The bright acidity of filter coffee cuts through the richness of carrot cake. Complementary textures and flavors.</p>

        <h3>Filter Coffee + Butter Croissant</h3>
        <p>The clean, crisp coffee highlights the buttery layers of a fresh croissant.</p>

        <h2>Cold Brew Pairings</h2>

        <h3>Cold Brew + Fruit Tart</h3>
        <p>The smooth, slightly sweet cold brew pairs beautifully with fresh fruit. Refreshing and satisfying.</p>

        <h3>Cold Brew + Lemon Cake</h3>
        <p>Citrus and smooth coffee notes create a bright, energizing combination.</p>

        <h2>Savory Pairings</h2>
        <p>Don't forget about savory options!</p>
        <ul>
          <li>Espresso + Cheese Danish (umami meets richness)</li>
          <li>Filter Coffee + Avocado Toast (earthy and bright)</li>
          <li>Cold Brew + Turkey Sandwich (smooth and balanced)</li>
        </ul>

        <h2>Tips for Perfect Pairings</h2>
        <ul>
          <li>Match intensity: Bold coffee with bold flavors</li>
          <li>Complement or contrast: Choose based on your mood</li>
          <li>Consider texture: Smooth coffee with flaky pastries</li>
          <li>Balance sweetness: Coffee cuts through sugar</li>
          <li>Experiment: Find your personal favorites</li>
        </ul>
      `,
    },
  };

  const post = blogPosts[id];

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-100 mb-4">Blog Post Not Found</h1>
          <NavLink to="/blog" className="text-amber-400 hover:text-amber-300 font-semibold">
            ← Back to Blog
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
      {/* Hero Section */}
      <div className="py-12 px-4 bg-gradient-to-r from-amber-900 to-amber-800 text-white">
        <div className="max-w-3xl mx-auto">
          <NavLink to="/blog" className="text-amber-200 hover:text-amber-100 mb-4 inline-block">
            ← Back to Blog
          </NavLink>
          <div className="mb-6 text-7xl">{post.image}</div>
          <h1 className="text-4xl font-black mb-4">{post.title}</h1>
          <div className="flex gap-4 items-center text-sm text-amber-100">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime} read</span>
            <span>•</span>
            <span className="bg-amber-900/50 px-3 py-1 rounded-full">{post.category}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none">
            <div
              className="text-gray-300 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/<h2>/g, '<h2 className="text-3xl font-bold text-amber-100 mt-8 mb-4">')
                  .replace(/<h3>/g, '<h3 className="text-2xl font-bold text-amber-200 mt-6 mb-3">')
                  .replace(/<p>/g, '<p className="text-gray-300 mb-4">')
                  .replace(/<ul>/g, '<ul className="list-disc list-inside space-y-2 mb-4">')
                  .replace(/<li>/g, '<li className="text-gray-300">')
                  .replace(/<strong>/g, '<strong className="text-amber-200 font-bold">')
              }}
            />
          </div>
        </div>
      </div>

      {/* Back to Blog */}
      <div className="py-12 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#252525]">
        <div className="max-w-3xl mx-auto text-center">
          <NavLink 
            to="/blog" 
            className="inline-block px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition-all"
          >
            ← Back to All Articles
          </NavLink>
        </div>
      </div>
    </div>
  );
}
