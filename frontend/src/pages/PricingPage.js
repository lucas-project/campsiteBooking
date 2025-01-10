import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Grid,
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import Navigator from '../components/Navigator';

const PricingPage = () => {
    const navigate = useNavigate();

    const tiers = [
        {
            title: 'Basic',
            price: '29',
            features: [
                'Up to 50 campsites',
                'Basic booking management',
                'Email support',
                'Basic analytics'
            ],
            buttonText: 'Start with Basic'
        },
        {
            title: 'Pro',
            price: '79',
            features: [
                'Unlimited campsites',
                'Advanced booking system',
                'Priority support',
                'Advanced analytics',
                'Custom branding'
            ],
            buttonText: 'Go Pro'
        },
        {
            title: 'Enterprise',
            price: '299',
            features: [
                'Multiple locations',
                'API access',
                '24/7 phone support',
                'Custom development',
                'Dedicated account manager'
            ],
            buttonText: 'Contact Sales'
        }
    ];

    return (
        <Box>
            <Navigator />
            <Box sx={{ pt: 8 }}> {/* Added padding for fixed navbar */}
                <Container maxWidth="lg">
                    <Box sx={{ py: 8 }}>
                        <Typography variant="h2" component="h1" align="center" gutterBottom>
                            Pricing Plans
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            Choose the perfect plan for your business
                        </Typography>

                        <Grid container spacing={4} sx={{ mt: 4 }}>
                            {tiers.map((tier) => (
                                <Grid item key={tier.title} xs={12} md={4}>
                                    <Paper 
                                        elevation={3} 
                                        sx={{ 
                                            p: 4, 
                                            textAlign: 'center',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Typography variant="h4" component="h2" gutterBottom>
                                            {tier.title}
                                        </Typography>
                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="h3" component="span">
                                                ${tier.price}
                                            </Typography>
                                            <Typography variant="h6" component="span" color="text.secondary">
                                                /mo
                                            </Typography>
                                        </Box>
                                        <List sx={{ mb: 4, flexGrow: 1 }}>
                                            {tier.features.map((feature) => (
                                                <ListItem key={feature} sx={{ px: 0 }}>
                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                        <CheckIcon color="primary" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={feature} />
                                                </ListItem>
                                            ))}
                                        </List>
                                        <Button 
                                            variant="contained" 
                                            size="large"
                                            onClick={() => navigate('/signup')}
                                            fullWidth
                                        >
                                            {tier.buttonText}
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default PricingPage; 