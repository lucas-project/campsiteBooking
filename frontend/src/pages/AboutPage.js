import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Grid,
    Paper
} from '@mui/material';
import Navigator from '../components/Navigator';

const AboutPage = () => {
    return (
        <Box>
            <Navigator />
            <Box sx={{ pt: 8 }}> {/* Added padding for fixed navbar */}
                <Container maxWidth="lg">
                    <Box sx={{ py: 8 }}>
                        <Typography variant="h2" component="h1" align="center" gutterBottom>
                            About CampSite
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            Revolutionizing the way campsite owners manage their business
                        </Typography>

                        <Grid container spacing={4} sx={{ mt: 4 }}>
                            <Grid item xs={12} md={4}>
                                <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Our Mission
                                    </Typography>
                                    <Typography color="text.secondary">
                                        To simplify campsite management and enhance the outdoor experience for everyone.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Our Vision
                                    </Typography>
                                    <Typography color="text.secondary">
                                        To become the leading platform for campsite bookings and management worldwide.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Our Values
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Innovation, sustainability, and exceptional customer service.
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default AboutPage; 