import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Button,
    Card,
    CardContent,
    CardActions,
} from '@mui/material';
import Grid2 from '@mui/material/Grid';
import Navigator from '../components/Navigator';
import Footer from '../components/Footer';

const PricingPage = () => {
    const pricingPlans = [
        {
            title: 'Basic',
            price: '$29',
            features: [
                'Up to 20 campsites',
                'Basic booking management',
                'Email support',
                'Basic analytics'
            ],
            buttonText: 'Start with Basic'
        },
        {
            title: 'Professional',
            price: '$79',
            features: [
                'Up to 100 campsites',
                'Advanced booking management',
                'Priority support',
                'Detailed analytics',
                'Custom branding'
            ],
            buttonText: 'Go Professional',
            highlighted: true
        },
        {
            title: 'Enterprise',
            price: 'Custom',
            features: [
                'Unlimited campsites',
                'Full feature access',
                '24/7 support',
                'Advanced analytics',
                'Custom integration'
            ],
            buttonText: 'Contact Sales'
        }
    ];

    return (
        <Box>
            <Navigator />
            
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h2" component="h1" sx={{ mb: 6, textAlign: 'center' }}>
                    Simple, Transparent Pricing
                </Typography>
                
                <Grid2 container spacing={4}>
                    {pricingPlans.map((plan) => (
                        <Grid2 item xs={12} md={4} key={plan.title}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    ...(plan.highlighted && {
                                        border: '2px solid primary.main',
                                        boxShadow: 3
                                    })
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
                                        {plan.title}
                                    </Typography>
                                    <Typography variant="h3" component="div" sx={{ mb: 3 }}>
                                        {plan.price}
                                        {plan.price !== 'Custom' && <Typography component="span">/month</Typography>}
                                    </Typography>
                                    {plan.features.map((feature) => (
                                        <Typography key={feature} sx={{ mb: 1 }}>
                                            • {feature}
                                        </Typography>
                                    ))}
                                </CardContent>
                                <CardActions sx={{ p: 2 }}>
                                    <Button 
                                        fullWidth 
                                        variant={plan.highlighted ? "contained" : "outlined"}
                                        size="large"
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            </Container>

            <Footer />
        </Box>
    );
};

export default PricingPage; 