import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Switch,
    FormHelperText,
    Select,
    MenuItem
} from '@mui/material';
import { API_URL } from '../../config';

const ActualizarUnidad = ({ unidad, onUnidadActualizada }) => {
    const [unidadLocal, setUnidadLocal] = useState({
        TipoUnidad: '',
        NombreUnidad: '',
        IdUsuario: '',
        CorreoEncargado: '',
        CelularEncargado: '',
        Estado: 1
    });
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        if (unidad) {
            setUnidadLocal(unidad);
        }
        fetchUsuarios();
    }, [unidad]);

    const fetchUsuarios = async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/usuarios`);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUnidadLocal({ ...unidadLocal, [name]: value });
    };

    const handleEncargadoChange = (e) => {
        const selectedUsuario = usuarios.find(usuario => usuario.IdUsuario === e.target.value);
        if (selectedUsuario) {
            setUnidadLocal({
                ...unidadLocal,
                IdUsuario: selectedUsuario.IdUsuario,
                CorreoEncargado: selectedUsuario.Correo,
                CelularEncargado: selectedUsuario.Celular
            });
        }
    };

    const handleSwitchChange = () => {
        setUnidadLocal({ ...unidadLocal, Estado: unidadLocal.Estado === 1 ? 0 : 1 });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Actualizando unidad con ID:', unidad.IdUnidad);
        axiosInstance.put(`${API_URL}/unidades/${unidad.IdUnidad}`, unidadLocal)
            .then(response => {
                console.log('Unidad actualizada:', response.data);
                onUnidadActualizada(response.data);
            })
            .catch(error => {
                console.error('Hubo un error al actualizar la unidad:', error);
            });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Actualizar Unidad</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Tipo de Unidad"
                    type="text"
                    name="TipoUnidad"
                    value={unidadLocal.TipoUnidad}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Nombre de Unidad"
                    type="text"
                    name="NombreUnidad"
                    value={unidadLocal.NombreUnidad}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Encargado</InputLabel>
                    <Select
                        value={unidadLocal.IdUsuario}
                        onChange={handleEncargadoChange}
                        label="Encargado"
                    >
                        {usuarios.map((usuario) => (
                            <MenuItem key={usuario.IdUsuario} value={usuario.IdUsuario}>
                                {usuario.NombreCompleto}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Correo del Encargado"
                    type="email"
                    name="CorreoEncargado"
                    value={unidadLocal.CorreoEncargado}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                />

                <TextField
                    label="Celular del Encargado"
                    type="text"
                    name="CelularEncargado"
                    value={unidadLocal.CelularEncargado}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="Estado" shrink={true}>Estado</InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Switch
                            id="Estado"
                            checked={unidadLocal.Estado === 1}
                            onChange={handleSwitchChange}
                        />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                            {unidadLocal.Estado === 1 ? 'Activo' : 'Baja'}
                        </Typography>
                    </Box>
                    <FormHelperText>Seleccione el estado de la unidad</FormHelperText>
                </FormControl>

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                    Actualizar Unidad
                </Button>
            </form>
        </Box>
    );
};

export default ActualizarUnidad;