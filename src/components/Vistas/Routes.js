import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../Autentificacion/ProtectedRoute';
import Usuarios from '../Usuarios/Usuarios';
import Permisos from '../Permisos/Permisos';
import Equipos from '../Equipos/Equipos';
import Unidades from '../Unidad/Unidades';
import ListarSolicitudes from '../solicitudes/ListarSolicitudes';
import PerfilUsuario from '../Perfil/PerfilUsuario';
import Unauthorized from '../Autentificacion/Unauthorized';
import HistorialMantenimientos from '../HistorialMantenimineto/HistorialMantenimientos';

const permissionsRequired = {
    '/usuarios': ['Administrador del Sistema', 'Gestion Usuarios'],
    '/permisos': ['Administrador del Sistema', 'Gestion Permisos'],
    '/equipos': ['Administrador del Sistema', 'Gestion Equipos'],
    '/unidades': ['Administrador del Sistema', 'Gestion Unidades'],
    '/solicitudes': ['Administrador del Sistema', 'Gestion Solicitudes'],
    '/perfil': ['Administrador del Sistema', 'Gestion Usuarios', 'Gestion Permisos', 'Gestion Equipos', 'Gestion Unidades', 'Gestion Solicitudes'],
    '/historiales': ['Administrador del Sistema', 'Gestion Mantenimientos'] // Agregado
};

const AppRoutes = () => (
    <Routes>
        <Route path="/usuarios" element={<ProtectedRoute allowedPermissions={permissionsRequired['/usuarios']}><Usuarios /></ProtectedRoute>} />
        <Route path="/permisos" element={<ProtectedRoute allowedPermissions={permissionsRequired['/permisos']}><Permisos /></ProtectedRoute>} />
        <Route path="/equipos" element={<ProtectedRoute allowedPermissions={permissionsRequired['/equipos']}><Equipos /></ProtectedRoute>} />
        <Route path="/unidades" element={<ProtectedRoute allowedPermissions={permissionsRequired['/unidades']}><Unidades /></ProtectedRoute>} />
        <Route path="/solicitudes" element={<ProtectedRoute allowedPermissions={permissionsRequired['/solicitudes']}><ListarSolicitudes /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute allowedPermissions={permissionsRequired['/perfil']}><PerfilUsuario /></ProtectedRoute>} />
        <Route path="/historiales" element={<ProtectedRoute allowedPermissions={permissionsRequired['/historiales']}><HistorialMantenimientos /></ProtectedRoute>} /> 
        <Route path="/" element={<Navigate to="/usuarios" replace />} />
        <Route path="*" element={<Unauthorized />} /> {/* Cambiado para manejar rutas no definidas */}
    </Routes>
);

export default AppRoutes;
