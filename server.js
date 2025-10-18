
console.log('🔍 MONGO_URI:', process.env.MONGO_URI);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// 🔹 Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 🔹 Order Schema & Model
const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    phone: String,
    email: String,
    address: String,
  },
  delivery: String,
  payMethod: String,
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending'
  },
  paid: {
    type: Boolean,
    default: false
  },
  tracking: [
    {
      time: Date,
      status: String,
      note: String,
      location: String
    }
  ]
});

const Order = mongoose.model('Order', orderSchema);

// 🔹 Save Order Endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ id: order._id });
  } catch (err) {
    console.error('❌ Order save error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Track Order Endpoint
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Invalid Order ID or server error' });
  }
});

// 🔹 Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  /*console.log(`🚀 Server running on http://localhost:${PORT}`);
*/
});










