import React from 'react';
import { 
    Box, 
    Container, 
    Grid, 
    Typography, 
    Link,
    Stack 
} from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: 'background.paper', py: 6, mt: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box component="img" 
                            src="https://via.placeholder.com/120x40" 
                            alt="Logo"
                            sx={{ height: 40, mb: 2 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            Making campsite bookings easier for everyone.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Stack spacing={2}>
                            <Typography variant="h6">Company</Typography>
                            <Link href="#" color="inherit">About</Link>
                            <Link href="#" color="inherit">Careers</Link>
                            <Link href="#" color="inherit">Contact</Link>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Stack spacing={2}>
                            <Typography variant="h6">Product</Typography>
                            <Link href="#" color="inherit">Features</Link>
                            <Link href="#" color="inherit">Pricing</Link>
                            <Link href="#" color="inherit">FAQ</Link>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={2}>
                            <Typography variant="h6">Contact Us</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: support@example.com
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Phone: (555) 123-4567
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                    © {new Date().getFullYear()} Your Company Name. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer; 