import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Login from './components/Autentificacion/Login';
import Layout from './components/Vistas/Layout';
import { theme } from './theme';
import { decrypt } from './utils/crypto';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]);

    useEffect(() => {
        const encryptedUserData = localStorage.getItem('userData');
        if (encryptedUserData) {
            const userData = decrypt(encryptedUserData);
            if (userData && userData.token) {
                setIsLoggedIn(true);
                if (userData.TipoPermiso) {
                    setUserPermissions(userData.TipoPermiso);
                }
            }
        }
    }, []); 

    const handleLoginSuccess = (loginData) => {
        setIsLoggedIn(true);
        setUserPermissions(loginData.TipoPermiso);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserPermissions([]);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                width: '100%',
                minHeight: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {!isLoggedIn ? (
                    <Login onLoginSuccess={handleLoginSuccess} />
                ) : (
                    <Router>
                        <Layout onLogout={handleLogout} userPermissions={userPermissions} />
                    </Router>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default App;