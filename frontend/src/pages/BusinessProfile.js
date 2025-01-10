import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Paper,
} from '@mui/material';
import Navigator from '../components/Navigator';

const BusinessProfile = () => {
    return (
        <Box>
            <Navigator />
            <Box sx={{ pt: 8 }}>
                <Container maxWidth="lg">
                    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Business Profile
                        </Typography>
                        <Typography variant="body1">
                            Welcome to your business dashboard. This page is under construction.
                        </Typography>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default BusinessProfile; 