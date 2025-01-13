import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    IconButton,
    Tab,
    Tabs,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Stack,
    FormControlLabel,
    Switch,
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    PhotoCamera as PhotoCameraIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Language as WebsiteIcon,
} from '@mui/icons-material';
import Navigator from '../components/Navigator';
import { useAuth } from '../contexts/AuthContext';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const BusinessProfile = () => {
    const [value, setValue] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { isAuthenticated } = useAuth();

    const [businessInfo, setBusinessInfo] = useState({
        name: '',
        description: '',
        location: '',
        phone: '',
        email: '',
        website: '',
        images: [],
        amenities: [],
        rules: [],
        faqs: [],
        businessHours: {
            start: '09:00',
            end: '17:00'
        },
        bookings: []
    });

    const [openDialog, setOpenDialog] = useState({
        amenity: false,
        rule: false,
        faq: false
    });

    const [newItem, setNewItem] = useState({
        amenity: '',
        rule: '',
        faq: { question: '', answer: '' }
    });

    const [bookingForm, setBookingForm] = useState({
        date: null,
        time: null,
        service: '',
        notes: ''
    });

    const [bookingView, setBookingView] = useState('upcoming'); // 'upcoming', 'past', 'pending'
    const [availabilityDialog, setAvailabilityDialog] = useState(false);
    const [availability, setAvailability] = useState({
        monday: { isOpen: true, start: '09:00', end: '17:00' },
        tuesday: { isOpen: true, start: '09:00', end: '17:00' },
        wednesday: { isOpen: true, start: '09:00', end: '17:00' },
        thursday: { isOpen: true, start: '09:00', end: '17:00' },
        friday: { isOpen: true, start: '09:00', end: '17:00' },
        saturday: { isOpen: false, start: '09:00', end: '17:00' },
        sunday: { isOpen: false, start: '09:00', end: '17:00' },
    });

    const [campsites, setCampsites] = useState([]);
    const [selectedCampsite, setSelectedCampsite] = useState(null);
    const [campsiteDialog, setCampsiteDialog] = useState(false);
    const [newCampsite, setNewCampsite] = useState({
        name: '',
        description: '',
        price: '',
        capacity: '',
        images: [],
        availability: []
    });

    const [editCampsiteDialog, setEditCampsiteDialog] = useState(false);
    const [editingCampsite, setEditingCampsite] = useState(null);

    useEffect(() => {
        loadProfileData();
        loadCampsites();
    }, []);

    const loadProfileData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/business-profile');
            if (response.ok) {
                const data = await response.json();
                setBusinessInfo(prevState => ({
                    ...prevState,
                    ...data,
                    images: data.images || [],
                    amenities: data.amenities || [],
                    rules: data.rules || [],
                    faqs: data.faqs || [],
                    bookings: data.bookings || [],
                    businessHours: data.businessHours || {
                        start: '09:00',
                        end: '17:00'
                    }
                }));
            }
        } catch (error) {
            setError('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const loadCampsites = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/campsites');
            if (response.ok) {
                const data = await response.json();
                setCampsites(data);
            }
        } catch (error) {
            setError('Failed to load campsites');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvailabilitySelect = (campsite, slotInfo) => {
        if (!editMode) return;

        const newAvailability = {
            start: slotInfo.start,
            end: slotInfo.end,
            status: 'booked'
        };

        setCampsites(prev => prev.map(site => 
            site.id === campsite.id 
                ? {
                    ...site,
                    availability: [...site.availability, newAvailability]
                }
                : site
        ));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await fetch('http://localhost:5000/api/business-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(businessInfo),
            });

            if (response.ok) {
                setSuccess('Profile updated successfully');
                setEditMode(false);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            setError('Failed to save changes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        setIsLoading(true);

        try {
            const newImages = await Promise.all(files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve({
                            url: e.target.result,
                            name: file.name
                        });
                    };
                    reader.readAsDataURL(file);
                });
            }));

            setBusinessInfo(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        } catch (error) {
            setError('Failed to upload images');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (field) => (event) => {
        setBusinessInfo(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleAddItem = (type) => {
        if (type === 'faq' && (!newItem.faq.question || !newItem.faq.answer)) return;
        if (type !== 'faq' && !newItem[type]) return;

        setBusinessInfo(prev => ({
            ...prev,
            [type + 's']: type === 'faq' 
                ? [...prev.faqs, newItem.faq]
                : [...prev[type + 's'], newItem[type]]
        }));

        setNewItem(prev => ({
            ...prev,
            [type]: type === 'faq' ? { question: '', answer: '' } : ''
        }));
        setOpenDialog(prev => ({ ...prev, [type]: false }));
    };

    const handleDeleteItem = (type, index) => {
        setBusinessInfo(prev => ({
            ...prev,
            [type + 's']: prev[type + 's'].filter((_, i) => i !== index)
        }));
    };

    const handleBookingSubmit = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    businessId: businessInfo.id,
                    ...bookingForm
                }),
            });

            if (response.ok) {
                setSuccess('Booking request submitted successfully');
                setBookingForm({
                    date: null,
                    time: null,
                    service: '',
                    notes: ''
                });
                // Refresh booking data
                loadProfileData();
            } else {
                throw new Error('Failed to submit booking');
            }
        } catch (error) {
            setError('Failed to submit booking request');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookingAction = async (bookingId, action) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setSuccess(`Booking ${action} successfully`);
                loadProfileData(); // Refresh booking data
            } else {
                throw new Error(`Failed to ${action} booking`);
            }
        } catch (error) {
            setError(`Failed to ${action} booking`);
        }
    };

    const handleCampsiteImageUpload = async (event, campsiteId = null) => {
        const files = Array.from(event.target.files);
        const formData = new FormData();
        
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            if (campsiteId) {
                // Update existing campsite
                const response = await fetch(`http://localhost:5000/api/campsites/${campsiteId}`, {
                    method: 'PUT',
                    body: formData
                });
                
                if (response.ok) {
                    const updatedCampsite = await response.json();
                    setCampsites(prev => prev.map(site => 
                        site._id === campsiteId ? updatedCampsite : site
                    ));
                    setSuccess('Images uploaded successfully');
                }
            } else {
                // Store images temporarily for new campsite
                const imageUrls = await Promise.all(files.map(file => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            resolve({
                                url: e.target.result,
                                name: file.name
                            });
                        };
                        reader.readAsDataURL(file);
                    });
                }));

                setNewCampsite(prev => ({
                    ...prev,
                    images: [...prev.images, ...imageUrls]
                }));
            }
        } catch (error) {
            setError('Failed to upload images');
        }
    };

    const handleAddCampsite = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newCampsite.name);
            formData.append('description', newCampsite.description);
            formData.append('price', newCampsite.price);
            formData.append('capacity', newCampsite.capacity);
            
            // Append each image file
            newCampsite.images.forEach((image, index) => {
                // Convert base64 to file if needed
                if (image.url.startsWith('data:')) {
                    const file = dataURLtoFile(image.url, image.name);
                    formData.append('images', file);
                }
            });

            const response = await fetch('http://localhost:5000/api/campsites', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const campsite = await response.json();
                setCampsites(prev => [...prev, campsite]);
                setCampsiteDialog(false);
                setNewCampsite({
                    name: '',
                    description: '',
                    price: '',
                    capacity: '',
                    images: [],
                    availability: []
                });
                setSuccess('Campsite added successfully');
            }
        } catch (error) {
            setError('Failed to add campsite');
        }
    };

    // Helper function to convert base64 to file
    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    };

    const handleDeleteCampsite = async (campsiteId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/campsites/${campsiteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCampsites(prev => prev.filter(site => site.id !== campsiteId));
                setSuccess('Campsite deleted successfully');
            }
        } catch (error) {
            setError('Failed to delete campsite');
        }
    };

    const handleEditCampsite = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/campsites/${editingCampsite.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingCampsite),
            });

            if (response.ok) {
                setCampsites(prev => prev.map(site => 
                    site.id === editingCampsite.id ? editingCampsite : site
                ));
                setEditCampsiteDialog(false);
                setEditingCampsite(null);
                setSuccess('Campsite updated successfully');
            }
        } catch (error) {
            setError('Failed to update campsite');
        }
    };

    if (isLoading && !businessInfo.name) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Navigator />
            <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
                )}

                {/* Header Section */}
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        {editMode ? (
                            <TextField
                                fullWidth
                                label="Business Name"
                                value={businessInfo.name}
                                onChange={handleInputChange('name')}
                                sx={{ mr: 2 }}
                            />
                        ) : (
                            <Typography variant="h4" component="h1">
                                {businessInfo.name || 'Your Business Name'}
                            </Typography>
                        )}
                        <Button
                            variant={editMode ? "contained" : "outlined"}
                            startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                            onClick={editMode ? handleSave : () => setEditMode(true)}
                            disabled={isLoading}
                        >
                            {editMode ? 'Save Changes' : 'Edit Profile'}
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            {editMode ? (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Business Description"
                                    value={businessInfo.description}
                                    onChange={handleInputChange('description')}
                                />
                            ) : (
                                <Typography>
                                    {businessInfo.description || 'Add your business description'}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationIcon color="action" />
                                    {editMode ? (
                                        <TextField
                                            fullWidth
                                            label="Location"
                                            value={businessInfo.location}
                                            onChange={handleInputChange('location')}
                                        />
                                    ) : (
                                        <Typography>{businessInfo.location || 'Add location'}</Typography>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PhoneIcon color="action" />
                                    {editMode ? (
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            value={businessInfo.phone}
                                            onChange={handleInputChange('phone')}
                                        />
                                    ) : (
                                        <Typography>{businessInfo.phone || 'Add phone number'}</Typography>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EmailIcon color="action" />
                                    {editMode ? (
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={businessInfo.email}
                                            onChange={handleInputChange('email')}
                                        />
                                    ) : (
                                        <Typography>{businessInfo.email || 'Add email'}</Typography>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <WebsiteIcon color="action" />
                                    {editMode ? (
                                        <TextField
                                            fullWidth
                                            label="Website"
                                            value={businessInfo.website}
                                            onChange={handleInputChange('website')}
                                        />
                                    ) : (
                                        <Typography>{businessInfo.website || 'Add website'}</Typography>
                                    )}
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tabs Section */}
                <Paper elevation={3}>
                    <Tabs
                        value={value}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Photos" />
                        <Tab label="Amenities" />
                        <Tab label="Rules" />
                        <Tab label="FAQs" />
                        <Tab label="Book Now" />
                        <Tab label="Campsites" />
                    </Tabs>

                    {/* Photos Tab */}
                    <TabPanel value={value} index={0}>
                        <Grid container spacing={2}>
                            {(businessInfo.images || []).map((image, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={image.url}
                                            alt={`Business image ${index + 1}`}
                                        />
                                        {editMode && (
                                            <CardContent sx={{ p: 1 }}>
                                                <IconButton
                                                    onClick={() => handleDeleteItem('image', index)}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </CardContent>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                            {editMode && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card
                                        sx={{
                                            height: '200px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                        component="label"
                                    >
                                        <input
                                            type="file"
                                            hidden
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <PhotoCameraIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                                            <Typography color="text.secondary">
                                                Add Photos
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </TabPanel>

                    {/* Amenities Tab */}
                    <TabPanel value={value} index={1}>
                        <Grid container spacing={2}>
                            {(businessInfo.amenities || []).map((amenity, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="body1">
                                                {amenity}
                                            </Typography>
                                            {editMode && (
                                                <IconButton
                                                    onClick={() => handleDeleteItem('amenity', index)}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {editMode && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setOpenDialog({ ...openDialog, amenity: true })}
                                    >
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <AddIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                                            <Typography color="text.secondary">
                                                Add Amenity
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </TabPanel>

                    {/* Rules Tab */}
                    <TabPanel value={value} index={2}>
                        <Grid container spacing={2}>
                            {(businessInfo.rules || []).map((rule, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="body1">
                                                {rule}
                                            </Typography>
                                            {editMode && (
                                                <IconButton
                                                    onClick={() => handleDeleteItem('rule', index)}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {editMode && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setOpenDialog({ ...openDialog, rule: true })}
                                    >
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <AddIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                                            <Typography color="text.secondary">
                                                Add Rule
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </TabPanel>

                    {/* FAQs Tab */}
                    <TabPanel value={value} index={3}>
                        <Grid container spacing={2}>
                            {(businessInfo.faqs || []).map((faq, index) => (
                                <Grid item xs={12} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {faq.question}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {faq.answer}
                                            </Typography>
                                            {editMode && (
                                                <Box sx={{ mt: 1 }}>
                                                    <IconButton
                                                        onClick={() => handleDeleteItem('faq', index)}
                                                        size="small"
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {editMode && (
                                <Grid item xs={12}>
                                    <Card
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            p: 2,
                                        }}
                                        onClick={() => setOpenDialog({ ...openDialog, faq: true })}
                                    >
                                        <AddIcon sx={{ mr: 1 }} />
                                        <Typography>Add FAQ</Typography>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </TabPanel>

                    {/* Bookings Tab */}
                    <TabPanel value={value} index={4}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Booking Management</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => setAvailabilityDialog(true)}
                                    startIcon={<EditIcon />}
                                >
                                    Set Availability
                                </Button>
                            </Box>

                            <Tabs
                                value={bookingView}
                                onChange={(e, newValue) => setBookingView(newValue)}
                                sx={{ mb: 2 }}
                            >
                                <Tab value="pending" label="Pending Requests" />
                                <Tab value="upcoming" label="Upcoming Bookings" />
                                <Tab value="past" label="Past Bookings" />
                            </Tabs>

                            <Grid container spacing={2}>
                                {(businessInfo.bookings || [])
                                    .filter(booking => {
                                        const bookingDate = new Date(booking.date);
                                        const today = new Date();
                                        
                                        switch(bookingView) {
                                            case 'pending':
                                                return booking.status === 'pending';
                                            case 'upcoming':
                                                return booking.status === 'confirmed' && bookingDate >= today;
                                            case 'past':
                                                return bookingDate < today;
                                            default:
                                                return true;
                                        }
                                    })
                                    .map((booking, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Card>
                                                <CardContent>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={4}>
                                                            <Typography variant="subtitle1" color="primary">
                                                                Date: {new Date(booking.date).toLocaleDateString()}
                                                            </Typography>
                                                            <Typography variant="subtitle1">
                                                                Time: {booking.time}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
                                                            <Typography variant="body1">
                                                                Service: {booking.service}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Status: {booking.status}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
                                                            {booking.status === 'pending' && (
                                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        onClick={() => handleBookingAction(booking.id, 'confirm')}
                                                                    >
                                                                        Confirm
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="error"
                                                                        onClick={() => handleBookingAction(booking.id, 'reject')}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </Box>
                                                            )}
                                                            {booking.status === 'confirmed' && (
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    onClick={() => handleBookingAction(booking.id, 'cancel')}
                                                                    sx={{ float: 'right' }}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            )}
                                                        </Grid>
                                                        {booking.notes && (
                                                            <Grid item xs={12}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Notes: {booking.notes}
                                                                </Typography>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                            </Grid>
                        </Paper>

                        {/* Availability Dialog */}
                        <Dialog 
                            open={availabilityDialog} 
                            onClose={() => setAvailabilityDialog(false)}
                            maxWidth="md"
                            fullWidth
                        >
                            <DialogTitle>Set Business Hours</DialogTitle>
                            <DialogContent>
                                <Grid container spacing={2}>
                                    {Object.entries(availability).map(([day, hours]) => (
                                        <Grid item xs={12} key={day}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography sx={{ width: 100, textTransform: 'capitalize' }}>
                                                    {day}
                                                </Typography>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={hours.isOpen}
                                                            onChange={(e) => setAvailability(prev => ({
                                                                ...prev,
                                                                [day]: { ...prev[day], isOpen: e.target.checked }
                                                            }))}
                                                        />
                                                    }
                                                    label={hours.isOpen ? "Open" : "Closed"}
                                                />
                                                {hours.isOpen && (
                                                    <>
                                                        <TextField
                                                            type="time"
                                                            value={hours.start}
                                                            onChange={(e) => setAvailability(prev => ({
                                                                ...prev,
                                                                [day]: { ...prev[day], start: e.target.value }
                                                            }))}
                                                            sx={{ width: 150 }}
                                                        />
                                                        <Typography>to</Typography>
                                                        <TextField
                                                            type="time"
                                                            value={hours.end}
                                                            onChange={(e) => setAvailability(prev => ({
                                                                ...prev,
                                                                [day]: { ...prev[day], end: e.target.value }
                                                            }))}
                                                            sx={{ width: 150 }}
                                                        />
                                                    </>
                                                )}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setAvailabilityDialog(false)}>Cancel</Button>
                                <Button variant="contained" onClick={() => {
                                    // TODO: Save availability to backend
                                    setAvailabilityDialog(false);
                                }}>
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </TabPanel>

                    {/* Campsites Tab */}
                    <TabPanel value={value} index={5}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6">Campsites</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setCampsiteDialog(true)}
                                >
                                    Add Campsite
                                </Button>
                            </Box>

                            <Grid container spacing={3}>
                                {campsites.map((campsite) => (
                                    <Grid item xs={12} md={6} key={campsite.id}>
                                        <Card>
                                            <CardMedia
                                                component="div"
                                                sx={{
                                                    position: 'relative',
                                                    height: 200,
                                                    display: 'flex',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {campsite.images.length > 0 ? (
                                                    <img
                                                        src={campsite.images[0].url}
                                                        alt={campsite.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            bgcolor: 'grey.200'
                                                        }}
                                                    >
                                                        <Typography color="text.secondary">No Image</Typography>
                                                    </Box>
                                                )}
                                                {editMode && (
                                                    <Box
                                                        component="label"
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: 8,
                                                            right: 8,
                                                            bgcolor: 'background.paper',
                                                            borderRadius: '50%'
                                                        }}
                                                    >
                                                        <input
                                                            type="file"
                                                            hidden
                                                            multiple
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                setSelectedCampsite(campsite);
                                                                handleCampsiteImageUpload(e);
                                                            }}
                                                        />
                                                        <IconButton component="span">
                                                            <PhotoCameraIcon />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </CardMedia>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="h6" gutterBottom>
                                                        {campsite.name}
                                                    </Typography>
                                                    {editMode && (
                                                        <Box>
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => {
                                                                    setEditingCampsite(campsite);
                                                                    setEditCampsiteDialog(true);
                                                                }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleDeleteCampsite(campsite.id)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    {campsite.description}
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2">
                                                            Price: ${campsite.price}/night
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2">
                                                            Capacity: {campsite.capacity} people
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                            <CardContent>
                                                <Box sx={{ height: 400, border: '1px solid #ddd', p: 2 }}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Availability Calendar (Coming Soon)
                                                    </Typography>
                                                    <Grid container spacing={1}>
                                                        {Array.from({ length: 31 }, (_, i) => (
                                                            <Grid item xs={1.7} key={i}>
                                                                <Button
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    sx={{
                                                                        height: '50px',
                                                                        backgroundColor: campsite.availability.some(
                                                                            slot => new Date(slot.start).getDate() === i + 1
                                                                        ) ? '#f44336' : '#fff'
                                                                    }}
                                                                >
                                                                    {i + 1}
                                                                </Button>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>

                        {/* Add Campsite Dialog */}
                        <Dialog
                            open={campsiteDialog}
                            onClose={() => setCampsiteDialog(false)}
                            maxWidth="md"
                            fullWidth
                        >
                            <DialogTitle>Add New Campsite</DialogTitle>
                            <DialogContent>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Campsite Name"
                                            value={newCampsite.name}
                                            onChange={(e) => setNewCampsite(prev => ({
                                                ...prev,
                                                name: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Description"
                                            value={newCampsite.description}
                                            onChange={(e) => setNewCampsite(prev => ({
                                                ...prev,
                                                description: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Price per Night"
                                            value={newCampsite.price}
                                            onChange={(e) => setNewCampsite(prev => ({
                                                ...prev,
                                                price: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Capacity"
                                            value={newCampsite.capacity}
                                            onChange={(e) => setNewCampsite(prev => ({
                                                ...prev,
                                                capacity: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<PhotoCameraIcon />}
                                            fullWidth
                                        >
                                            Upload Images
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                accept="image/*"
                                                onChange={handleCampsiteImageUpload}
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setCampsiteDialog(false)}>Cancel</Button>
                                <Button onClick={handleAddCampsite} variant="contained">
                                    Add Campsite
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Edit Campsite Dialog */}
                        <Dialog
                            open={editCampsiteDialog}
                            onClose={() => {
                                setEditCampsiteDialog(false);
                                setEditingCampsite(null);
                            }}
                            maxWidth="md"
                            fullWidth
                        >
                            <DialogTitle>Edit Campsite</DialogTitle>
                            <DialogContent>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Campsite Name"
                                            value={editingCampsite?.name || ''}
                                            onChange={(e) => setEditingCampsite(prev => ({
                                                ...prev,
                                                name: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={editingCampsite?.description || ''}
                                            onChange={(e) => setEditingCampsite(prev => ({
                                                ...prev,
                                                description: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Price per Night"
                                            value={editingCampsite?.price || ''}
                                            onChange={(e) => setEditingCampsite(prev => ({
                                                ...prev,
                                                price: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Capacity"
                                            value={editingCampsite?.capacity || ''}
                                            onChange={(e) => setEditingCampsite(prev => ({
                                                ...prev,
                                                capacity: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<PhotoCameraIcon />}
                                            fullWidth
                                        >
                                            Upload Images
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => {
                                                    setEditingCampsite(prev => ({
                                                        ...prev,
                                                        images: Array.from(e.target.files).map(file => ({
                                                            url: URL.createObjectURL(file),
                                                            name: file.name
                                                        })),
                                                    }));
                                                }}
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => {
                                    setEditCampsiteDialog(false);
                                    setEditingCampsite(null);
                                }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleEditCampsite} variant="contained">
                                    Save Changes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </TabPanel>
                </Paper>

                {/* Dialogs */}
                <Dialog open={openDialog.amenity} onClose={() => setOpenDialog({ ...openDialog, amenity: false })}>
                    <DialogTitle>Add Amenity</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Amenity"
                            fullWidth
                            value={newItem.amenity}
                            onChange={(e) => setNewItem({ ...newItem, amenity: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog({ ...openDialog, amenity: false })}>Cancel</Button>
                        <Button onClick={() => handleAddItem('amenity')} variant="contained">Add</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDialog.rule} onClose={() => setOpenDialog({ ...openDialog, rule: false })}>
                    <DialogTitle>Add Rule</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Rule"
                            fullWidth
                            value={newItem.rule}
                            onChange={(e) => setNewItem({ ...newItem, rule: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog({ ...openDialog, rule: false })}>Cancel</Button>
                        <Button onClick={() => handleAddItem('rule')} variant="contained">Add</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDialog.faq} onClose={() => setOpenDialog({ ...openDialog, faq: false })}>
                    <DialogTitle>Add FAQ</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Question"
                            fullWidth
                            value={newItem.faq.question}
                            onChange={(e) => setNewItem({
                                ...newItem,
                                faq: { ...newItem.faq, question: e.target.value }
                            })}
                        />
                        <TextField
                            margin="dense"
                            label="Answer"
                            fullWidth
                            multiline
                            rows={4}
                            value={newItem.faq.answer}
                            onChange={(e) => setNewItem({
                                ...newItem,
                                faq: { ...newItem.faq, answer: e.target.value }
                            })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog({ ...openDialog, faq: false })}>Cancel</Button>
                        <Button onClick={() => handleAddItem('faq')} variant="contained">Add</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default BusinessProfile; 