require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority'
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => {
    console.error('MongoDB Atlas connection error:', err);
    process.exit(1);
});

// Add error handlers
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

// Business Profile Schema
const businessProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, default: 'Your Business Name' },
    description: { type: String, default: 'Your business description goes here...' },
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    images: [{
        url: String,
        name: String
    }],
    amenities: [String],
    rules: [String],
    faqs: [{
        question: String,
        answer: String
    }]
}, { timestamps: true });

const BusinessProfile = mongoose.model('BusinessProfile', businessProfileSchema);

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, businessName } = req.body;
        
        // For now, we'll just send back a success response
        res.status(200).json({
            message: 'Signup successful',
            token: 'dummy-token',
            user: {
                email,
                businessName
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: 'Error creating account'
        });
    }
});

// Add signin endpoint
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // For now, we'll just send back a success response
        res.status(200).json({
            message: 'Sign in successful',
            token: 'dummy-token',
            user: {
                email
            }
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({
            message: 'Error signing in'
        });
    }
});

// Business Profile Routes
app.post('/api/business-profile', async (req, res) => {
    try {
        const { 
            name, description, location, phone, 
            email, website, images, amenities, 
            rules, faqs 
        } = req.body;

        // In production, get userId from JWT token
        const userId = 'demo-user';

        const profile = await BusinessProfile.findOneAndUpdate(
            { userId },
            {
                userId,
                name,
                description,
                location,
                phone,
                email,
                website,
                images,
                amenities,
                rules,
                faqs
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        console.log('Profile updated successfully');
        res.json(profile);
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({
            message: 'Error saving profile',
            error: error.message
        });
    }
});

app.get('/api/business-profile', async (req, res) => {
    try {
        // In production, get userId from JWT token
        const userId = 'demo-user';
        
        let profile = await BusinessProfile.findOne({ userId });
        
        if (!profile) {
            // Create default profile if none exists
            profile = await BusinessProfile.create({
                userId,
                name: 'Your Business Name',
                description: 'Your business description goes here...',
                location: '',
                phone: '',
                email: '',
                website: '',
                images: [],
                amenities: [],
                rules: [],
                faqs: []
            });
        }
        
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// Add this line with your other routes
app.use('/api/bookings', require('./routes/bookings'));

// Add these lines after your existing middleware
app.use('/api/campsites', require('./routes/campsites'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Keep your existing server startup code
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 