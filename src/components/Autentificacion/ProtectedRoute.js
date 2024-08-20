import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { decrypt } from '../../utils/crypto'; 

const ProtectedRoute = ({ children, allowedPermissions }) => {
    const location = useLocation();
    
    const encryptedUserData = localStorage.getItem('userData');
    let userPermissions = [];

    if (encryptedUserData) {
        try {
            const userData = decrypt(encryptedUserData);
            if (userData && userData.TipoPermiso) {
                userPermissions = userData.TipoPermiso;
            }
        } catch (error) {
            console.error("Error decrypting user data:", error);
        }
    }

    const hasPermission = allowedPermissions.some(permission => userPermissions.includes(permission));

    if (!hasPermission) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
