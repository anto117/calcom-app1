// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const nodemailer = require('nodemailer');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB schema with TTL
// const bookingSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   phone: String,
//   datetime: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     expires: '30d', // 🕒 Auto-delete 30 days after creation
//   },
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// // Email transporter (Gmail SMTP)
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // POST: Book an appointment
// app.post('/api/book', async (req, res) => {
//   const { name, email, phone, datetime } = req.body;
//   console.log('📥 Received form data:', req.body);

//   if (!name?.trim() || !datetime?.trim() || !/^\d{10}$/.test(phone)) {
//     return res.status(400).json({ message: 'Name, valid phone, and Date/Time are required' });
//   }

//   const existing = await Booking.findOne({ datetime });
//   if (existing) {
//     return res.status(409).json({ message: 'Time slot is already booked' });
//   }

//   const booking = new Booking({ name, email, phone, datetime });
//   await booking.save();

//   if (email?.trim()) {
//     try {
//       await transporter.sendMail({
//         from: `"Appointment Scheduler" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: 'Your Appointment Confirmation',
//         html: `
//           <p>Hello ${name},</p>
//           <p>Your appointment has been successfully booked.</p>
//           <p><strong>Date & Time:</strong> ${datetime}</p>
//           <p><strong>Phone:</strong> ${phone}</p>
//           <p>Thank you!</p>
//         `,
//       });
//       console.log(`📧 Confirmation email sent to ${email}`);
//     } catch (error) {
//       console.error('❌ Email send failed:', error);
//     }
//   }

//   res.json({ message: 'Appointment booked successfully' });
// });

// // GET: All bookings for admin
// app.get('/api/bookings', async (req, res) => {
//   const bookings = await Booking.find().sort({ datetime: 1 });
//   res.json(bookings);
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const http = require('http'); // ✅ For socket.io
const { Server } = require('socket.io'); // ✅ socket.io

const app = express();
const server = http.createServer(app); // ✅ Wrap express in HTTP server
const io = new Server(server, {
  cors: { origin: '*' } // Allow frontend to connect
});

app.use(cors());
app.use(express.json());

// MongoDB schema with TTL
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  datetime: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d', // 🕒 Auto-delete 30 days after creation
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Email transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST: Book an appointment
app.post('/api/book', async (req, res) => {
  const { name, email, phone, datetime } = req.body;
  console.log('📥 Received form data:', req.body);

  if (!name?.trim() || !datetime?.trim() || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: 'Name, valid phone, and Date/Time are required' });
  }

  const existing = await Booking.findOne({ datetime });
  if (existing) {
    return res.status(409).json({ message: 'Time slot is already booked' });
  }

  const booking = new Booking({ name, email, phone, datetime });
  await booking.save();

  // ✅ Emit event to all connected clients
  io.emit('bookingConfirmed', { name, datetime, phone });

  // Send email if provided
  if (email?.trim()) {
    try {
      await transporter.sendMail({
        from: `"Appointment Scheduler" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Appointment Confirmation',
        html: `
          <p>Hello ${name},</p>
          <p>Your appointment has been successfully booked.</p>
          <p><strong>Date & Time:</strong> ${datetime}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p>Thank you!</p>
        `,
      });
      console.log(`📧 Confirmation email sent to ${email}`);
    } catch (error) {
      console.error('❌ Email send failed:', error);
    }
  }

  res.json({ message: 'Appointment booked successfully' });
});

// GET: All bookings for admin
app.get('/api/bookings', async (req, res) => {
  const bookings = await Booking.find().sort({ datetime: 1 });
  res.json(bookings);
});

// ✅ Socket connection listener
io.on('connection', (socket) => {
  console.log('🟢 New WebSocket connection:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// ✅ Start the server with socket.io
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
