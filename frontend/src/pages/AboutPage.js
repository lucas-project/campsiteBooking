import React from 'react';
import { 
    Box, 
    Container, 
    Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Grid';
import Navigator from '../components/Navigator';
import Footer from '../components/Footer';

const AboutPage = () => {
    return (
        <Box>
            <Navigator />
            
            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h2" component="h1" sx={{ mb: 6, textAlign: 'center' }}>
                    About Us
                </Typography>
                
                <Grid2 container spacing={6}>
                    <Grid2 item xs={12} md={6}>
                        <Box
                            component="img"
                            src="https://via.placeholder.com/600x400"
                            alt="Our Story"
                            sx={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: 2
                            }}
                        />
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                        <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
                            Our Story
                        </Typography>
                        <Typography paragraph>
                            Founded in 2024, we set out to revolutionize the way campsite bookings are managed. 
                            Our team of outdoor enthusiasts and tech experts came together to create a solution 
                            that makes campsite management simple and efficient.
                        </Typography>
                        <Typography paragraph>
                            We understand the unique challenges that campsite owners face, and our platform is 
                            designed specifically to address these needs while providing an exceptional experience 
                            for campers.
                        </Typography>
                    </Grid2>

                    <Grid2 item xs={12}>
                        <Typography variant="h4" component="h2" sx={{ mb: 3, mt: 4 }}>
                            Our Mission
                        </Typography>
                        <Typography paragraph>
                            We're committed to making campsite management accessible to everyone. Our mission 
                            is to provide innovative, user-friendly solutions that help campsite owners focus 
                            on what matters most - creating amazing outdoor experiences for their guests.
                        </Typography>
                    </Grid2>
                </Grid2>
            </Container>

            <Footer />
        </Box>
    );
};

export default AboutPage; 