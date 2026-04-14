# Product Model Schema Design for Coffee Shop

## Overview
The Product model represents items available in the coffee shop - beverages, pastries, merchandise, etc.

---

## Schema Fields Explained

### Core Fields (Required)

#### 1. **name** - Product Name
```javascript
name: {
  type: String,
  required: true,
  trim: true,
  indexed: true,
}
```

- **Purpose:** Display name of the product
- **Type:** String
- **Required:** ✅ Yes (empty products don't make sense)
- **Trim:** Removes leading/trailing whitespace
- **Indexed:** Faster search queries (important for product search feature)

**Examples:**
- "Espresso"
- "Cappuccino"
- "Iced Latte"
- "Chocolate Croissant"

---

#### 2. **description** - Product Details
```javascript
description: {
  type: String,
  required: true,
}
```

- **Purpose:** Detailed info about the product
- **Type:** String
- **Required:** ✅ Yes (customers need to know what they're buying)
- **Length:** Can be long (100+ characters recommended)

**Examples:**
- "Rich, bold espresso shots with creamy microfoam milk"
- "Smooth, velvety cappuccino with perfect foam ratio"
- "Freshly baked croissant with butter and jam filling"

**Why Important:**
- Helps customers decide
- Improves online shopping experience
- Good for SEO if description contains keywords

---

#### 3. **price** - Product Cost
```javascript
price: {
  type: Number,
  required: true,
  min: [0, 'Price cannot be negative'],
}
```

- **Purpose:** How much customer pays
- **Type:** Number (decimal values allowed: 4.99, 5.50)
- **Required:** ✅ Yes (essential for business)
- **Min Validation:** Cannot be negative

**Storage Format:**
```
Stored as: 4.99
Displayed as: $4.99 (frontend adds currency symbol)
```

**Examples:**
- 3.50 (small coffee)
- 4.99 (medium coffee)
- 5.99 (large coffee)

---

#### 4. **category** - Product Type
```javascript
category: {
  type: String,
  required: true,
  enum: ['espresso', 'cold-drinks', 'hot-drinks', 'pastries', 'merchandise'],
}
```

- **Purpose:** Organize products by type
- **Type:** String (limit to specific values with `enum`)
- **Required:** ✅ Yes
- **Enum:** Only these values allowed:
  - `"espresso"` - Espresso-based drinks
  - `"cold-drinks"` - Cold beverages (iced)
  - `"hot-drinks"` - Hot tea, hot chocolate
  - `"pastries"` - Baked goods
  - `"merchandise"` - Coffee beans, mugs, etc.

**Why Enum?**
- Prevents typos/invalid categories
- Makes filtering consistent
- Database can optimize queries

**Examples:**
```javascript
// Valid
{ category: "espresso" }
{ category: "cold-drinks" }

// Invalid (will be rejected)
{ category: "cappucino" }  // ❌ Typo
{ category: "ESPRESSO" }   // ❌ Wrong case
```

---

#### 5. **image** - Product Photo
```javascript
image: {
  type: String,
  default: null,
}
```

- **Purpose:** Visual representation of product
- **Type:** String (URL or file path)
- **Optional:** ❌ No (but can be empty/null)
- **Default:** null (frontend shows placeholder if no image)

**Storage Options:**
```javascript
// Option 1: Image URL
{ image: "https://coffeeshop.com/images/cappuccino.jpg" }

// Option 2: File path
{ image: "/images/cappuccino.jpg" }

// Option 3: Empty (uses default placeholder)
{ image: null }
```

**Best Practice:**
- Store in CDN or cloud storage (AWS S3, Cloudinary)
- Use URLs pointing to storage service
- Add image upload feature to admin panel

---

### Additional Fields (Optional but Useful)

#### 6. **stock** - Inventory Count
```javascript
stock: {
  type: Number,
  default: 0,
}
```

- **Purpose:** Track quantity available
- **Type:** Number
- **Default:** 0 (no stock)

**Logic:**
```
stock > 0 → Show "Available" ✓
stock = 0 → Show "Out of Stock"
stock < 0 → ❌ Error (shouldn't happen)
```

**Coffee Shop Use:**
- Most items have unlimited stock
- Pastries may have limited quantity
- Merchandise (beans) has countable stock

---

#### 7. **available** - Quick Status Flag
```javascript
available: {
  type: Boolean,
  default: true,
}
```

- **Purpose:** Quick availability check
- **Type:** Boolean (true/false)
- **Default:** true (available by default)

**When false:**
- Product hidden from customers
- Out of stock temporarily
- Discontinued item
- Seasonal item (off-season)

**Difference from stock field:**
```
stock field: Exact quantity count
available field: Binary on/off status
```

---

#### 8. **rating** - Customer Rating
```javascript
rating: {
  type: Number,
  default: 0,
  min: 0,
  max: 5,
}
```

- **Purpose:** Average customer rating
- **Type:** Number (0-5)
- **Default:** 0 (no ratings yet)
- **Min/Max:** Validates range

**Example:**
```
4.5 ⭐⭐⭐⭐✨ (very popular)
3.8 ⭐⭐⭐⭐ (good)
2.5 ⭐⭐✨ (needs improvement)
```

**How to calculate:**
```javascript
rating = (sum of all review ratings) / (number of reviews)
```

---

#### 9. **reviews** - Review Count
```javascript
reviews: {
  type: Number,
  default: 0,
}
```

- **Purpose:** Track number of ratings/reviews
- **Type:** Number
- **Default:** 0 (no reviews yet)

**Shows credibility:**
```
10 reviews @ 4.5 stars → More trustworthy
2 reviews @ 5.0 stars → Less proven
```

---

#### 10. **featured** - Promotion Flag
```javascript
featured: {
  type: Boolean,
  default: false,
}
```

- **Purpose:** Mark bestsellers or promoted items
- **Type:** Boolean
- **Default:** false (not featured)

**Uses:**
- Homepage "Featured Products" section
- Special promotions
- New item launches
- Top sellers

---

#### 11. **allergens** - Allergen Information
```javascript
allergens: {
  type: String,
  default: null,
}
```

- **Purpose:** Important health/safety info
- **Type:** String
- **Optional:** ✅ Can be null

**Examples:**
```
"Contains dairy, may contain nuts"
"Dairy-free, vegan, gluten-free"
"Contains: milk, soy, tree nuts"
```

---

### Automatic Fields (Timestamps)

#### **createdAt**
Automatically set when document created:
```javascript
createdAt: "2024-03-24T10:30:00.000Z"
```

#### **updatedAt**
Automatically updated when document modified:
```javascript
updatedAt: "2024-03-24T15:45:00.000Z"
```

**Enabled by:** `{ timestamps: true }`

---

## Complete Schema Structure

```javascript
Product {
  // Required fields (must have values)
  _id: ObjectId                    // Auto-generated
  name: String                     // "Cappuccino"
  description: String              // "Creamy espresso with microfoam..."
  price: Number                    // 4.99
  category: String (enum)          // "espresso"
  
  // Optional but recommended
  image: String                    // URL to product image
  stock: Number                    // 0-100+
  available: Boolean               // true/false
  rating: Number                   // 0-5
  reviews: Number                  // Count of reviews
  featured: Boolean                // true/false
  allergens: String                // "Contains dairy..."
  
  // Auto-generated
  createdAt: Date                  // When added
  updatedAt: Date                  // When last modified
}
```

---

## Example Products

### Example 1: Espresso Drink
```javascript
{
  name: "Cappuccino",
  description: "Smooth cappuccino with perfect espresso-to-milk ratio and silky foam",
  price: 4.99,
  category: "espresso",
  image: "https://cdn.coffeeshop.com/cappuccino.jpg",
  stock: 0,           // Unlimited stock (coffee drinks)
  available: true,
  rating: 4.7,
  reviews: 42,
  featured: true,
  allergens: "Contains dairy"
}
```

### Example 2: Cold Drink
```javascript
{
  name: "Iced Latte",
  description: "Chilled espresso with cold milk and ice, perfect for summer",
  price: 5.50,
  category: "cold-drinks",
  image: "https://cdn.coffeeshop.com/iced-latte.jpg",
  stock: 0,
  available: true,
  rating: 4.3,
  reviews: 28,
  featured: false,
  allergens: "Contains dairy"
}
```

### Example 3: Pastry
```javascript
{
  name: "Chocolate Croissant",
  description: "Fresh-baked croissant with premium chocolate filling",
  price: 3.99,
  category: "pastries",
  image: "https://cdn.coffeeshop.com/croissant.jpg",
  stock: 12,          // Limited quantity
  available: true,
  rating: 4.6,
  reviews: 35,
  featured: false,
  allergens: "Contains dairy, wheat, may contain tree nuts"
}
```

### Example 4: Merchandise (Coffee Beans)
```javascript
{
  name: "Ethiopian Yirgacheffe Beans - 1lb",
  description: "Premium single-origin coffee beans with notes of berry and jasmine",
  price: 14.99,
  category: "merchandise",
  image: "https://cdn.coffeeshop.com/yirgacheffe-beans.jpg",
  stock: 25,          // Exact quantity tracked
  available: true,
  rating: 4.9,
  reviews: 67,
  featured: true,
  allergens: null     // No allergens
}
```

---

## Schema Design Principles

### 1. **Normalization**
Each field stores one piece of information:
```
✅ GOOD: name: "Cappuccino", price: 4.99
❌ BAD:  product: "Cappuccino - $4.99"
```

### 2. **Type Safety**
Define exact data types to prevent errors:
```
✅ price: Number     (ensures math operations work)
❌ price: String     (would break calculations)
```

### 3. **Validation**
Use validators to maintain data integrity:
```javascript
price: {
  type: Number,
  required: true,
  min: 0            // Can't have negative prices
}
```

### 4. **Defaults**
Provide sensible defaults:
```javascript
available: { type: Boolean, default: true }  // Most products are available
stock: { type: Number, default: 0 }
```

### 5. **Indexing**
Index frequently searched fields:
```javascript
name: { indexed: true }  // Customers search by name
```

---

## Database Queries Examples

### Find all available products
```javascript
Product.find({ available: true })
```

### Find espresso drinks only
```javascript
Product.find({ category: "espresso" })
```

### Find featured products sorted by rating
```javascript
Product.find({ featured: true })
  .sort({ rating: -1 })
```

### Search products by name
```javascript
Product.find({ name: { $regex: "cappuccino", $options: "i" } })
```

### Find products by price range
```javascript
Product.find({ price: { $gte: 3, $lte: 6 } })
```

### Get top-rated products
```javascript
Product.find()
  .sort({ rating: -1 })
  .limit(10)
```

---

## Frontend Display Example

```javascript
// Controller returns product
const product = {
  name: "Cappuccino",
  price: 4.99,
  image: "https://cdn.coffeeshop.com/cappuccino.jpg",
  description: "Smooth cappuccino...",
  rating: 4.7,
  reviews: 42
};

// Frontend displays:
/*
┌─────────────────────────┐
│   [PRODUCT IMAGE]       │
├─────────────────────────┤
│ Cappuccino              │
│ ⭐ 4.7 (42 reviews)     │
│                         │
│ Smooth cappuccino...    │
│                         │
│ $4.99    [Add to Cart]  │
└─────────────────────────┘
*/
```

---

## Admin Features Based on Schema

### Product Management Dashboard
```
✏️ Edit: name, description, price, image, stock
🏆 Mark Featured: featured = true/false
🚫 Remove: available = false
🏷️ Category: espresso, cold-drinks, etc.
⚠️ Allergens: dairy, nuts, gluten info
```

### Inventory Management
```
Track stock levels
Alert when out of stock
Adjust quantity
Mark discontinued
```

---

## Best Practices

✅ **DO:**
- Always validate price is positive
- Use category enum to prevent typos
- Include clear descriptions (100+ chars)
- Store image URLs, not actual files in DB
- Set featured only for bestsellers
- Keep allergen info updated
- Use timestamps to track changes

❌ **DON'T:**
- Store duplicate data
- Mix different units in one field
- Leave required fields empty
- Store images in MongoDB (use CDN)
- Ignore allergen information
- Create categories on-the-fly (use enum)

---

## Next Steps

1. **Create admin endpoints** to add/edit/delete products
2. **Add image upload** functionality
3. **Implement search** with name indexing
4. **Add filtering** by category, price, rating
5. **Create review system** to auto-calculate rating
6. **Setup inventory** alerts when stock low
7. **Add promotions** using featured flag
