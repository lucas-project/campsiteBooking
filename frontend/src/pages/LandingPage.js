import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Button,
} from '@mui/material';
import Grid2 from '@mui/material/Grid';
import Navigator from '../components/Navigator';
import Footer from '../components/Footer';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <Box>
            <Navigator />
            
            {/* Hero Section */}
            <Box className="hero-section">
                <Container maxWidth="lg">
                    <Grid2 container spacing={4} alignItems="center" minHeight="80vh">
                        <Grid2 item xs={12} md={6}>
                            <Typography variant="h1" component="h1" className="hero-title">
                                Simplify Your Campsite Bookings
                            </Typography>
                            <Typography variant="h5" component="p" className="hero-subtitle" sx={{ my: 3 }}>
                                Modern booking solution for campsite owners
                            </Typography>
                            <Button 
                                variant="contained" 
                                size="large" 
                                className="cta-button"
                            >
                                Start Free Trial
                            </Button>
                        </Grid2>
                        <Grid2 item xs={12} md={6}>
                            <Box
                                component="img"
                                src="https://via.placeholder.com/600x400"
                                alt="Campsite booking system"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: 2
                                }}
                            />
                        </Grid2>
                    </Grid2>
                </Container>
            </Box>

            {/* Features Section */}
            <Box className="features-section" sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" component="h2" className="section-title" sx={{ mb: 6, textAlign: 'center' }}>
                        Why Choose Us
                    </Typography>
                    <Grid2 container spacing={4}>
                        <Grid2 item xs={12} md={4}>
                            <Box className="feature-card" sx={{ p: 3, textAlign: 'center' }}>
                                <Box
                                    component="img"
                                    src="https://via.placeholder.com/100"
                                    alt="Easy to use"
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                                    Easy to Use
                                </Typography>
                                <Typography>
                                    Simple and intuitive interface for both you and your customers
                                </Typography>
                            </Box>
                        </Grid2>
                        <Grid2 item xs={12} md={4}>
                            <Box className="feature-card" sx={{ p: 3, textAlign: 'center' }}>
                                <Box
                                    component="img"
                                    src="https://via.placeholder.com/100"
                                    alt="Affordable"
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                                    Affordable
                                </Typography>
                                <Typography>
                                    Cost-effective solution with flexible subscription plans
                                </Typography>
                            </Box>
                        </Grid2>
                        <Grid2 item xs={12} md={4}>
                            <Box className="feature-card" sx={{ p: 3, textAlign: 'center' }}>
                                <Box
                                    component="img"
                                    src="https://via.placeholder.com/100"
                                    alt="Secure"
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                                    Secure
                                </Typography>
                                <Typography>
                                    Protected payments and data security guaranteed
                                </Typography>
                            </Box>
                        </Grid2>
                    </Grid2>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default LandingPage; 