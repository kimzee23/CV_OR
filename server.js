const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/portfolioDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
    name: String,
    role: String,
    testimonial: String,
    rating: Number,
    date: { type: Date, default: Date.now }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// API Routes
app.post('/api/testimonials', async (req, res) => {
    try {
        const { name, role, testimonial, rating } = req.body;

        const newTestimonial = new Testimonial({
            name,
            role,
            testimonial,
            rating
        });

        await newTestimonial.save();
        res.status(201).json({ message: 'Testimonial saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving testimonial' });
    }
});

app.get('/api/testimonials', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ date: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching testimonials' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});