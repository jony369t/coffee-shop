import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // User's full name
    // String type, required to identify the user
    // trim() removes leading/trailing whitespace
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User's email address
    // String type, required for login and communication
    // unique: true ensures no duplicate emails (prevents multiple accounts with same email)
    // lowercase: true stores email in lowercase for consistent lookups
    // match: validates email format using regex
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    // User's hashed password
    // String type, required for authentication
    // Never store plain text passwords - always hash before saving!
    // This field should be hashed using bcrypt before saving to database
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // User's role/permission level
    // String type with enum restricts values to only "user" or "admin"
    // default: "user" - all new users are regular users by default
    // Admin users can: manage products, view all orders, manage users
    // Regular users can: browse products, place orders, manage their profile
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  // timestamps: true adds createdAt and updatedAt fields automatically
  // Useful for tracking when user account was created and last updated
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
