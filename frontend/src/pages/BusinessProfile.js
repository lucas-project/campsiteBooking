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
    Divider,
    Stack,
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
        faqs: []
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

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/business-profile');
            if (response.ok) {
                const data = await response.json();
                setBusinessInfo(data);
            }
        } catch (error) {
            setError('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
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
                    </Tabs>

                    {/* Photos Tab */}
                    <TabPanel value={value} index={0}>
                        <Grid container spacing={2}>
                            {businessInfo.images.map((image, index) => (
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
                            {businessInfo.amenities.map((amenity, index) => (
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
                            {businessInfo.rules.map((rule, index) => (
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
                            {businessInfo.faqs.map((faq, index) => (
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