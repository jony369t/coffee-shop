import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Reference to user who placed the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Array of ordered items
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // Order totals
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Delivery details
    deliveryAddress: {
      street: String,
      city: String,
      postalCode: String,
      phone: String,
    },

    // Payment information
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'cash'],
      default: 'credit_card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },

    // Order status
    status: {
      type: String,
      enum: ['pending', 'preparing', 'on the way', 'delivered', 'cancelled'],
      default: 'pending',
    },

    // Cancellation details
    cancellation: {
      cancelled: {
        type: Boolean,
        default: false,
      },
      cancellationReason: String,
      cancelledAt: Date,
      refundStatus: {
        type: String,
        enum: ['none', 'pending', 'completed'],
        default: 'none',
      },
    },

    // Special notes/instructions
    specialNotes: String,

    // Estimated delivery time
    estimatedDelivery: Date,

    // Actual delivery time
    actualDelivery: Date,

    // Tracking number
    trackingNumber: String,

    // User confirmation of delivery
    userConfirmed: {
      type: Boolean,
      default: false,
    },
    confirmedAt: Date,
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

// Index for faster queries
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
