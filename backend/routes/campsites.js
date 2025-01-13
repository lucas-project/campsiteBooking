const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Campsite Schema
const campsiteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: Number,
    capacity: Number,
    images: [{
        url: String,
        name: String
    }],
    availability: [{
        start: Date,
        end: Date,
        status: String
    }]
}, { timestamps: true });

const Campsite = mongoose.model('Campsite', campsiteSchema);

// Create a new campsite with image upload
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const imageFiles = req.files;
        const imageUrls = imageFiles.map(file => ({
            url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            name: file.originalname
        }));

        const campsite = new Campsite({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            capacity: req.body.capacity,
            images: imageUrls,
            availability: []
        });

        await campsite.save();
        res.status(201).json(campsite);
    } catch (error) {
        console.error('Error creating campsite:', error);
        res.status(500).json({ message: 'Error creating campsite' });
    }
});

// Get all campsites
router.get('/', async (req, res) => {
    try {
        const campsites = await Campsite.find();
        res.json(campsites);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campsites' });
    }
});

// Update campsite
router.put('/:id', upload.array('images', 5), async (req, res) => {
    try {
        const campsite = await Campsite.findById(req.params.id);
        if (!campsite) {
            return res.status(404).json({ message: 'Campsite not found' });
        }

        // Handle new images if any
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
                name: file.originalname
            }));
            campsite.images = [...campsite.images, ...newImages];
        }

        // Update other fields
        campsite.name = req.body.name || campsite.name;
        campsite.description = req.body.description || campsite.description;
        campsite.price = req.body.price || campsite.price;
        campsite.capacity = req.body.capacity || campsite.capacity;

        await campsite.save();
        res.json(campsite);
    } catch (error) {
        res.status(500).json({ message: 'Error updating campsite' });
    }
});

// Delete campsite
router.delete('/:id', async (req, res) => {
    try {
        await Campsite.findByIdAndDelete(req.params.id);
        res.json({ message: 'Campsite deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting campsite' });
    }
});

module.exports = router; 