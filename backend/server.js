require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 