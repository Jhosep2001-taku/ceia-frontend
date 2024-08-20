import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Button,
    TextField,
    Autocomplete,
    FormControl,
    FormHelperText,
    Box,
    InputLabel,
    Typography,
    MenuItem,
    Select,
    CircularProgress,
    Chip
} from '@mui/material';
import { API_URL } from '../../config';

const AgregarPermiso = ({ onAdd }) => {
    const [formData, setFormData] = useState({ IdUsuario: '', TipoPermiso: [] });
    const [usuarios, setUsuarios] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const tiposPermiso = [
        'Administrador del Sistema',
        'Gestion Usuarios',
        'Gestion Permisos',
        'Gestion Equipos',
        'Gestion Unidades',
        'Gestion Solicitudes',
        'Gestion Mantenimientos'
    ];

    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoadingUsuarios(true);
            try {
                const response = await axiosInstance.get(`${API_URL}/usuarios`);
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al obtener la lista de usuarios:', error);
            } finally {
                setLoadingUsuarios(false);
            }
        };
        fetchUsuarios();
    }, []);

    const handleAutocompleteChange = (event, newValue) => {
        if (newValue) {
            setFormData(prevState => ({
                ...prevState,
                IdUsuario: newValue.IdUsuario
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                IdUsuario: ''
            }));
        }
    };

    const handlePermisosChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormData(prevState => ({
            ...prevState,
            TipoPermiso: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            for (const permiso of formData.TipoPermiso) {
                const permisoData = { IdUsuario: formData.IdUsuario, TipoPermiso: permiso };
                const response = await axiosInstance.post(`${API_URL}/permisos`, permisoData);
                onAdd(response.data);
            }
            setFormData({ IdUsuario: '', TipoPermiso: [] });
        } catch (error) {
            console.error('Error al crear los permisos:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Agregar Permisos</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <Autocomplete
                        id="IdUsuario"
                        options={usuarios}
                        getOptionLabel={(option) => option.NombreCompleto || ''}
                        value={usuarios.find(user => user.IdUsuario === formData.IdUsuario) || null}
                        onChange={handleAutocompleteChange}
                        loading={loadingUsuarios}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Seleccione un Usuario"
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingUsuarios ? <CircularProgress color="inherit" size={24} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                    <FormHelperText>Selecciona el usuario para asignar los permisos</FormHelperText>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                    <InputLabel id="permisos-label">Tipos de Permisos</InputLabel>
                    <Select
                        labelId="permisos-label"
                        id="TipoPermiso"
                        multiple
                        value={formData.TipoPermiso}
                        onChange={handlePermisosChange}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {tiposPermiso.map((tipo) => (
                            <MenuItem key={tipo} value={tipo}>
                                {tipo}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Selecciona los tipos de permisos a asignar</FormHelperText>
                </FormControl>

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={submitting || !formData.IdUsuario || formData.TipoPermiso.length === 0}
                >
                    {submitting ? 'Agregando Permisos...' : 'Agregar Permisos'}
                </Button>
            </form>
        </Box>
    );
};

export default AgregarPermiso;