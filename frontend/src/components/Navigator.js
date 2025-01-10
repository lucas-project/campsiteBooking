import React from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box,
    Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigator = () => {
    const navigate = useNavigate();
    const { isAuthenticated, signOut } = useAuth();

    const handleSignIn = () => {
        navigate('/signin');
    };

    const handleSignOut = () => {
        signOut();
        navigate('/');
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: 'none',
                color: '#1d1d1f'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ minHeight: '48px', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '1.2rem'
                            }}
                            onClick={() => navigate('/')}
                        >
                            CampSite
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                                color="inherit"
                                onClick={() => navigate('/about')}
                                sx={{ 
                                    textTransform: 'none',
                                    fontWeight: 400,
                                    fontSize: '0.9rem'
                                }}
                            >
                                About
                            </Button>
                            <Button 
                                color="inherit"
                                onClick={() => navigate('/pricing')}
                                sx={{ 
                                    textTransform: 'none',
                                    fontWeight: 400,
                                    fontSize: '0.9rem'
                                }}
                            >
                                Pricing
                            </Button>
                        </Box>
                    </Box>
                    <Box>
                        {isAuthenticated ? (
                            <Button 
                                color="inherit"
                                onClick={handleSignOut}
                                sx={{ 
                                    textTransform: 'none',
                                    fontWeight: 400,
                                    fontSize: '0.9rem'
                                }}
                            >
                                Sign Out
                            </Button>
                        ) : (
                            <Button 
                                color="inherit"
                                onClick={handleSignIn}
                                sx={{ 
                                    textTransform: 'none',
                                    fontWeight: 400,
                                    fontSize: '0.9rem'
                                }}
                            >
                                Sign In
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navigator; 