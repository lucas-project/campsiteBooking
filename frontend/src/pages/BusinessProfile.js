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
    Checkbox,
    FormGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
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
    Wifi as WifiIcon,
    LocalParking as ParkingIcon,
    Pool as PoolIcon,
    Restaurant as RestaurantIcon,
    Pets as PetsIcon,
    LocalLaundryService as LaundryIcon,
    Fireplace as FireplaceIcon,
    BeachAccess as BeachIcon,
    DirectionsBoat as BoatIcon,
    DirectionsBike as BikeIcon,
    Hiking as HikingIcon,
    Shower as ShowerIcon,
    Wc as ToiletIcon,
    Kitchen as KitchenIcon,
    LocalCafe as CafeIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import Navigator from '../components/Navigator';
import { useAuth } from '../contexts/AuthContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

// Add this constant for predefined amenities
const PREDEFINED_AMENITIES = [
    { id: 'wifi', label: 'Wi-Fi', icon: WifiIcon },
    { id: 'parking', label: 'Parking', icon: ParkingIcon },
    { id: 'pool', label: 'Swimming Pool', icon: PoolIcon },
    { id: 'restaurant', label: 'Restaurant', icon: RestaurantIcon },
    { id: 'pets', label: 'Pet Friendly', icon: PetsIcon },
    { id: 'laundry', label: 'Laundry', icon: LaundryIcon },
    { id: 'firepit', label: 'Fire Pit', icon: FireplaceIcon },
    { id: 'beach', label: 'Beach Access', icon: BeachIcon },
    { id: 'boat', label: 'Boat Rental', icon: BoatIcon },
    { id: 'bike', label: 'Bike Rental', icon: BikeIcon },
    { id: 'hiking', label: 'Hiking Trails', icon: HikingIcon },
    { id: 'shower', label: 'Showers', icon: ShowerIcon },
    { id: 'toilet', label: 'Toilets', icon: ToiletIcon },
    { id: 'kitchen', label: 'Kitchen', icon: KitchenIcon },
    { id: 'cafe', label: 'Cafe', icon: CafeIcon },
    { id: 'security', label: '24/7 Security', icon: SecurityIcon },
];

// Add this constant for predefined rules
const PREDEFINED_RULES = [
    {
        category: 'Check-in/Check-out',
        rules: [
            { id: 'checkin', label: 'Check-in time: 2:00 PM', isCustomizable: true },
            { id: 'checkout', label: 'Check-out time: 11:00 AM', isCustomizable: true },
            { id: 'late_checkout', label: 'Late check-out must be arranged in advance' },
        ]
    },
    {
        category: 'Safety',
        rules: [
            { id: 'fire_safety', label: 'Campfires only in designated fire pits' },
            { id: 'quiet_hours', label: 'Quiet hours: 10:00 PM - 7:00 AM', isCustomizable: true },
            { id: 'supervision', label: 'Children must be supervised at all times' },
            { id: 'emergency', label: 'Emergency contact information must be provided' },
        ]
    },
    {
        category: 'Environmental',
        rules: [
            { id: 'trash', label: 'Pack in, pack out - Take all trash with you' },
            { id: 'wildlife', label: 'Do not feed or approach wildlife' },
            { id: 'vegetation', label: 'Do not damage or remove vegetation' },
            { id: 'water', label: 'No washing dishes in streams or lakes' },
        ]
    },
    {
        category: 'Camping Etiquette',
        rules: [
            { id: 'noise', label: 'No loud music or excessive noise' },
            { id: 'pets', label: 'Pets must be leashed and cleaned up after' },
            { id: 'parking', label: 'Park only in designated areas' },
            { id: 'group_size', label: 'Maximum group size: 6 people per site', isCustomizable: true },
        ]
    }
];

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
        bookings: [],
        customRules: []
    });

    const [openDialog, setOpenDialog] = useState({
        amenity: false,
        rule: false,
        faq: false
    });

    const [newItem, setNewItem] = useState({
        amenity: '',
        rule: { title: '', content: '' },
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
                body: JSON.stringify({
                    ...businessInfo,
                    amenities: businessInfo.amenities // Now sending array of amenity IDs
                }),
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
        if (type === 'rule') {
            // Skip if either title or content is empty
            if (!newItem.rule?.title?.trim() || !newItem.rule?.content?.trim()) return;
            
            setBusinessInfo(prev => ({
                ...prev,
                customRules: [...(prev.customRules || []), {
                    title: newItem.rule.title,
                    content: newItem.rule.content
                }]
            }));
            setNewItem(prev => ({ ...prev, rule: { title: '', content: '' } }));
            setOpenDialog(prev => ({ ...prev, rule: false }));
            return; // Exit early after handling rule
        }

        // Handle other types (amenity, faq)
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
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Amenities</Typography>
                                {editMode && (
                                    <Button
                                        variant="contained"
                                        onClick={() => handleSave()}
                                        startIcon={<SaveIcon />}
                                    >
                                        Save Changes
                                    </Button>
                                )}
                            </Box>
                            
                            <FormGroup>
                                <Grid container spacing={2}>
                                    {PREDEFINED_AMENITIES
                                        // Filter amenities based on edit mode
                                        .filter(amenity => editMode || businessInfo.amenities.includes(amenity.id))
                                        .map((amenity) => {
                                            const Icon = amenity.icon;
                                            return (
                                                <Grid item xs={12} sm={6} md={4} key={amenity.id}>
                                                    <Paper 
                                                        elevation={1} 
                                                        sx={{ 
                                                            p: 2,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            bgcolor: businessInfo.amenities.includes(amenity.id) ? 'action.selected' : 'background.paper'
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={businessInfo.amenities.includes(amenity.id)}
                                                                    onChange={(e) => {
                                                                        if (editMode) {
                                                                            setBusinessInfo(prev => ({
                                                                                ...prev,
                                                                                amenities: e.target.checked
                                                                                    ? [...prev.amenities, amenity.id]
                                                                                    : prev.amenities.filter(id => id !== amenity.id)
                                                                            }));
                                                                        }
                                                                    }}
                                                                    disabled={!editMode}
                                                                    sx={{ 
                                                                        display: editMode ? 'inline-flex' : 'none' 
                                                                    }}
                                                                />
                                                            }
                                                            label={
                                                                <Box sx={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    gap: 1,
                                                                    color: businessInfo.amenities.includes(amenity.id) ? 'primary.main' : 'text.primary'
                                                                }}>
                                                                    <Icon color={businessInfo.amenities.includes(amenity.id) ? "primary" : "action"} />
                                                                    <Typography>{amenity.label}</Typography>
                                                                </Box>
                                                            }
                                                        />
                                                    </Paper>
                                                </Grid>
                                            );
                                        })}
                                </Grid>
                            </FormGroup>
                        </Paper>
                    </TabPanel>

                    {/* Rules Tab */}
                    <TabPanel value={value} index={2}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Campsite Rules</Typography>
                                {editMode && (
                                    <Button
                                        variant="contained"
                                        onClick={() => handleSave()}
                                        startIcon={<SaveIcon />}
                                        size="small"
                                    >
                                        Save Changes
                                    </Button>
                                )}
                            </Box>

                            {/* Custom Rules Section - Shown First */}
                            {(businessInfo.customRules && businessInfo.customRules.length > 0) && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            color: 'primary.main',
                                            mb: 1,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            pb: 0.5
                                        }}
                                    >
                                        Special Rules
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {businessInfo.customRules.map((rule, index) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Paper 
                                                    elevation={1} 
                                                    sx={{ 
                                                        p: 1.5,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        bgcolor: 'background.default'
                                                    }}
                                                >
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 1,
                                                        mb: 0.5
                                                    }}>
                                                        <Typography 
                                                            sx={{ 
                                                                bgcolor: 'primary.main',
                                                                color: 'white',
                                                                minWidth: 20,
                                                                height: 20,
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </Typography>
                                                        <Typography 
                                                            variant="subtitle2"
                                                            sx={{ flex: 1 }}
                                                        >
                                                            {rule.title}
                                                        </Typography>
                                                        {editMode && (
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => {
                                                                    setBusinessInfo(prev => ({
                                                                        ...prev,
                                                                        customRules: prev.customRules.filter((_, i) => i !== index)
                                                                    }));
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                    <Typography 
                                                        variant="body2" 
                                                        color="text.secondary"
                                                        sx={{ ml: 3.5 }}
                                                    >
                                                        {rule.content}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* Predefined Rules - Only show checked ones in view mode */}
                            {PREDEFINED_RULES.map((category) => {
                                const categoryRules = category.rules.filter(rule => 
                                    editMode || businessInfo.rules.includes(rule.id)
                                );

                                if (!editMode && categoryRules.length === 0) return null;

                                return (
                                    <Box key={category.category} sx={{ mb: 2 }}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                color: 'primary.main',
                                                mb: 1,
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                pb: 0.5
                                            }}
                                        >
                                            {category.category}
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            {categoryRules.map((rule) => (
                                                <Grid item xs={12} sm={6} key={rule.id}>
                                                    <Paper
                                                        elevation={1}
                                                        sx={{
                                                            p: 1.5,
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            bgcolor: businessInfo.rules.includes(rule.id) ? 'action.selected' : 'background.paper'
                                                        }}
                                                    >
                                                        {editMode && (
                                                            <Checkbox
                                                                checked={businessInfo.rules.includes(rule.id)}
                                                                onChange={(e) => {
                                                                    setBusinessInfo(prev => ({
                                                                        ...prev,
                                                                        rules: e.target.checked
                                                                            ? [...prev.rules, rule.id]
                                                                            : prev.rules.filter(id => id !== rule.id)
                                                                    }));
                                                                }}
                                                                size="small"
                                                            />
                                                        )}
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2">{rule.label}</Typography>
                                                            {editMode && rule.isCustomizable && (
                                                                <TextField
                                                                    size="small"
                                                                    fullWidth
                                                                    placeholder="Customize this rule"
                                                                    variant="outlined"
                                                                    sx={{ mt: 1, fontSize: '0.875rem' }}
                                                                    value={businessInfo.customRules?.[rule.id] || ''}
                                                                    onChange={(e) => {
                                                                        setBusinessInfo(prev => ({
                                                                            ...prev,
                                                                            customRules: {
                                                                                ...prev.customRules,
                                                                                [rule.id]: e.target.value
                                                                            }
                                                                        }));
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                );
                            })}

                            {editMode && (
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenDialog({ ...openDialog, rule: true })}
                                    size="small"
                                    sx={{ mt: 2 }}
                                >
                                    Add Custom Rule
                                </Button>
                            )}
                        </Paper>
                    </TabPanel>

                    {/* FAQs Tab */}
                    <TabPanel value={value} index={3}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Frequently Asked Questions</Typography>
                                {editMode && (
                                    <Button
                                        variant="contained"
                                        onClick={() => setOpenDialog({ ...openDialog, faq: true })}
                                        startIcon={<AddIcon />}
                                        size="small"
                                    >
                                        Add FAQ
                                    </Button>
                                )}
                            </Box>
                            <Grid container spacing={2}>
                                {(businessInfo.faqs || []).map((faq, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Paper 
                                            elevation={1}
                                            sx={{ 
                                                p: 2,
                                                bgcolor: 'background.default',
                                                position: 'relative'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                <Typography
                                                    sx={{
                                                        bgcolor: 'grey.800',
                                                        color: 'white',
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.875rem',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    {index + 1}
                                                </Typography>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography 
                                                        variant="subtitle1" 
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            color: 'grey.900',
                                                            mb: 1
                                                        }}
                                                    >
                                                        {faq.question}
                                                    </Typography>
                                                    <Typography 
                                                        variant="body2" 
                                                        color="text.secondary"
                                                        sx={{ pl: 0 }}
                                                    >
                                                        {faq.answer}
                                                    </Typography>
                                                </Box>
                                                {editMode && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteItem('faq', index)}
                                                        sx={{
                                                            color: 'grey.500',
                                                            '&:hover': {
                                                                color: 'error.main'
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Campsite Management</Typography>
                                {editMode && (
                                    <Button
                                        variant="contained"
                                        onClick={() => setCampsiteDialog(true)}
                                        startIcon={<AddIcon />}
                                        size="small"
                                    >
                                        Add Campsite
                                    </Button>
                                )}
                            </Box>

                            <Grid container spacing={2}>
                                {campsites.map((campsite) => (
                                    <Grid item xs={12} key={campsite.id}>
                                        <Paper 
                                            elevation={1}
                                            sx={{ 
                                                overflow: 'hidden',
                                                bgcolor: 'background.default'
                                            }}
                                        >
                                            <Grid container spacing={2} sx={{ p: 2 }}>
                                                {/* Image Section */}
                                                <Grid item xs={12} sm={3}>
                                                    {campsite.images?.[0] ? (
                                                        <Box
                                                            component="img"
                                                            src={campsite.images[0].url}
                                                            alt={campsite.name}
                                                            sx={{
                                                                width: '100%',
                                                                height: 160,
                                                                objectFit: 'cover',
                                                                borderRadius: 1
                                                            }}
                                                        />
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                width: '100%',
                                                                height: 160,
                                                                bgcolor: 'grey.100',
                                                                borderRadius: 1,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <PhotoCameraIcon color="disabled" />
                                                        </Box>
                                                    )}
                                                </Grid>

                                                {/* Info Section */}
                                                <Grid item xs={12} sm={9}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                                                            {campsite.name}
                                                        </Typography>
                                                        {editMode && (
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => {
                                                                        setEditingCampsite(campsite);
                                                                        setEditCampsiteDialog(true);
                                                                    }}
                                                                    sx={{ color: 'grey.600' }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeleteCampsite(campsite.id)}
                                                                    sx={{ color: 'grey.600' }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                                        <Grid item xs={6} sm={3}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Price per night
                                                            </Typography>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                ${campsite.price}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6} sm={3}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Max Capacity
                                                            </Typography>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                {campsite.capacity} people
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>

                                                    <Typography 
                                                        variant="body2" 
                                                        color="text.secondary"
                                                        sx={{ mb: 2 }}
                                                    >
                                                        {campsite.description}
                                                    </Typography>

                                                    {/* Compact Calendar */}
                                                    <Accordion 
                                                        sx={{ 
                                                            '&:before': { display: 'none' },
                                                            boxShadow: 'none',
                                                            bgcolor: 'transparent'
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            sx={{ 
                                                                px: 1,
                                                                py: 0,
                                                                minHeight: 36,
                                                                '& .MuiAccordionSummary-content': {
                                                                    my: 0
                                                                }
                                                            }}
                                                        >
                                                            <Typography variant="subtitle2" color="primary">
                                                                View Availability
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails sx={{ px: 0, py: 1 }}>
                                                            <Box sx={{ 
                                                                display: 'grid', 
                                                                gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
                                                                gap: 0.5
                                                            }}>
                                                                {Array.from({ length: 31 }, (_, i) => (
                                                                    <Button
                                                                        key={i}
                                                                        variant="outlined"
                                                                        size="small"
                                                                        sx={{
                                                                            minWidth: 36,
                                                                            height: 36,
                                                                            p: 0,
                                                                            fontSize: '0.75rem',
                                                                            backgroundColor: campsite.availability.some(
                                                                                slot => new Date(slot.start).getDate() === i + 1
                                                                            ) ? 'error.light' : 'inherit',
                                                                            borderColor: 'divider',
                                                                            '&:hover': {
                                                                                borderColor: 'primary.main'
                                                                            }
                                                                        }}
                                                                    >
                                                                        {i + 1}
                                                                    </Button>
                                                                ))}
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Grid>
                                            </Grid>

                                            {/* Thumbnail Gallery */}
                                            {campsite.images?.length > 1 && (
                                                <Box sx={{ 
                                                    p: 2, 
                                                    pt: 0,
                                                    display: 'flex',
                                                    gap: 1,
                                                    overflowX: 'auto',
                                                    '&::-webkit-scrollbar': {
                                                        height: 6
                                                    },
                                                    '&::-webkit-scrollbar-thumb': {
                                                        backgroundColor: 'grey.300',
                                                        borderRadius: 3
                                                    }
                                                }}>
                                                    {campsite.images.slice(1).map((image, index) => (
                                                        <Box
                                                            key={index}
                                                            component="img"
                                                            src={image.url}
                                                            alt={`Campsite ${index + 1}`}
                                                            sx={{
                                                                height: 60,
                                                                width: 80,
                                                                objectFit: 'cover',
                                                                borderRadius: 1,
                                                                flexShrink: 0
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
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
                    <DialogTitle>Add Custom Rule</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                autoFocus
                                label="Rule Title"
                                fullWidth
                                value={newItem.rule.title}
                                onChange={(e) => setNewItem(prev => ({
                                    ...prev,
                                    rule: { ...prev.rule, title: e.target.value }
                                }))}
                                placeholder="e.g., Quiet Hours, Pet Policy"
                            />
                            <TextField
                                label="Rule Content"
                                fullWidth
                                multiline
                                rows={4}
                                value={newItem.rule.content}
                                onChange={(e) => setNewItem(prev => ({
                                    ...prev,
                                    rule: { ...prev.rule, content: e.target.value }
                                }))}
                                placeholder="Describe the rule in detail..."
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog({ ...openDialog, rule: false })}>Cancel</Button>
                        <Button 
                            onClick={() => handleAddItem('rule')} 
                            variant="contained"
                            disabled={!newItem.rule.title.trim() || !newItem.rule.content.trim()}
                        >
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog 
                    open={openDialog.faq} 
                    onClose={() => setOpenDialog({ ...openDialog, faq: false })}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ 
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        pb: 2,
                        bgcolor: 'grey.50'
                    }}>
                        <Typography variant="h6" component="div" sx={{ color: 'grey.900' }}>
                            Add Frequently Asked Question
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Add common questions and detailed answers to help your customers
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.900' }}>
                                    Question
                                </Typography>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    placeholder="e.g., What are your check-in and check-out times?"
                                    value={newItem.faq.question}
                                    onChange={(e) => setNewItem(prev => ({
                                        ...prev,
                                        faq: { ...prev.faq, question: e.target.value }
                                    }))}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <Box sx={{ 
                                                mr: 1, 
                                                color: 'grey.800',
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontWeight: 600
                                            }}>
                                                Q:
                                            </Box>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.900' }}>
                                    Answer
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Provide a clear and detailed answer..."
                                    value={newItem.faq.answer}
                                    onChange={(e) => setNewItem(prev => ({
                                        ...prev,
                                        faq: { ...prev.faq, answer: e.target.value }
                                    }))}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <Box sx={{ 
                                                mr: 1, 
                                                color: 'grey.800',
                                                alignSelf: 'flex-start',
                                                mt: 1,
                                                fontWeight: 600
                                            }}>
                                                A:
                                            </Box>
                                        ),
                                    }}
                                />
                            </Box>
                            {/* Preview Section */}
                            {(newItem.faq.question || newItem.faq.answer) && (
                                <Box sx={{ 
                                    p: 2, 
                                    bgcolor: 'grey.50',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 2 }}>
                                        Preview
                                    </Typography>
                                    {newItem.faq.question && (
                                        <Typography variant="subtitle1" sx={{ color: 'grey.900', mb: 1 }}>
                                            Q: {newItem.faq.question}
                                        </Typography>
                                    )}
                                    {newItem.faq.answer && (
                                        <Typography variant="body2" color="text.secondary">
                                            A: {newItem.faq.answer}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                        <Button 
                            onClick={() => setOpenDialog({ ...openDialog, faq: false })}
                            sx={{ color: 'grey.700' }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => handleAddItem('faq')} 
                            variant="contained"
                            disabled={!newItem.faq.question.trim() || !newItem.faq.answer.trim()}
                            startIcon={<AddIcon />}
                            sx={{ 
                                bgcolor: 'grey.800',
                                '&:hover': {
                                    bgcolor: 'grey.900'
                                }
                            }}
                        >
                            Add FAQ
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default BusinessProfile; 