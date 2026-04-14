import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Product name (e.g., "Espresso", "Cappuccino", "Iced Latte")
    // String type, required, and trimmed to remove leading/trailing spaces
    // indexed: true for faster search queries
    name: {
      type: String,
      required: true,
      trim: true,
      indexed: true,
    },

    // Product description (e.g., "Rich, bold espresso shots with creamy microfoam")
    // String type, required for detailed product information
    // Helps customers understand what they're ordering
    description: {
      type: String,
      required: true,
    },

    // Product price in dollars (e.g., 4.99, 5.50)
    // Number type, required
    // Must be positive, so we add min validation
    // For database storage: $4.99 = 4.99
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },

    // Product category (e.g., "espresso", "cold-drinks", "pastries")
    // String type, required for organizing products
    // Helps customers filter by type
    category: {
      type: String,
      required: true,
      enum: ['espresso', 'cold-drinks', 'hot-drinks', 'pastries', 'merchandise'],
    },

    // Product image URL (e.g., "https://coffeeshop.com/images/cappuccino.jpg")
    // String type, optional but recommended
    // Stores path or URL to product image
    // If not provided, frontend shows default placeholder
    image: {
      type: String,
      default: null,
    },

    // Stock status (quantity available)
    // Number type, tracks how many items in stock
    // 0 = out of stock, >0 = available
    // If not specified, defaults to unlimited
    stock: {
      type: Number,
      default: 0,
    },

    // Availability status (simple boolean)
    // Boolean type, default true (available)
    // false = hidden from customers or out of stock
    // Used for quick availability check without counting stock
    available: {
      type: Boolean,
      default: true,
    },

    // Product rating (0-5 stars)
    // Number type, defaults to 0
    // Updated based on customer reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Number of reviews/ratings
    // Number type, tracks how many ratings received
    reviews: {
      type: Number,
      default: 0,
    },

    // Is product featured/popular?
    // Boolean type, marks bestsellers or featured items
    // Shows on homepage or special promotions
    featured: {
      type: Boolean,
      default: false,
    },

    // Additional notes or allergen info
    // String type, optional
    // Example: "Contains dairy, may contain nuts"
    allergens: {
      type: String,
      default: null,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    // createdAt: when product added to menu
    // updatedAt: when product info last changed
    timestamps: true,
  }
);

// Create model from schema
const Product = mongoose.model('Product', productSchema);

export default Product;
