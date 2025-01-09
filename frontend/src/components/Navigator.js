import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navigator = () => {
    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
                <Button component={RouterLink} to="/" color="inherit">
                    Home
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button component={RouterLink} to="/about" color="inherit">
                    About
                </Button>
                <Button component={RouterLink} to="/pricing" color="inherit">
                    Pricing
                </Button>
                <Button variant="contained" color="primary">
                    Sign In
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navigator; 