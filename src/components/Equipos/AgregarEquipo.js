import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    Switch
} from '@mui/material';
import { API_URL } from '../../config';

const AgregarEquipo = ({ onEquipoAgregado }) => {
    const initialEquipoState = {
        Equipo: '',
        NIA: '',
        IdUnidad: '',
        Voltaje: '',
        Potencia: '',
        Corriente: '',
        Observaciones: '',
        Estado: 1
    };

    const [equipo, setEquipo] = useState(initialEquipoState);
    const [unidades, setUnidades] = useState([]);
    const [focusedFields, setFocusedFields] = useState({});
    const [imagenes, setImagenes] = useState([]);
    const [imagenPreview, setImagenPreview] = useState(null);

    const fetchUnidades = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/unidades`);
            setUnidades(response.data);
        } catch (error) {
            console.error('Hubo un error al obtener las unidades:', error);
        }
    }, []);

    useEffect(() => {
        fetchUnidades();
    }, [fetchUnidades]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(equipo).forEach(key => formData.append(key, equipo[key]));
        imagenes.forEach(imagen => formData.append('imagenes[]', imagen));

        try {
            const response = await axios.post(`${API_URL}/equipos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onEquipoAgregado(response.data);
            resetForm();
        } catch (error) {
            console.error('Hubo un error al agregar el equipo:', error);
        }
    };

    const resetForm = () => {
        setEquipo(initialEquipoState);
        setImagenes([]);
        setImagenPreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEquipo(prev => ({ ...prev, [name]: value }));
    };

    const handleFocusChange = (fieldName, isFocused) => {
        setFocusedFields(prev => ({ ...prev, [fieldName]: isFocused }));
    };

    const handleSwitchChange = () => {
        setEquipo({ ...equipo, Estado: equipo.Estado === 1 ? 0 : 1 });
    };

    const handleImagenSeleccionada = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setImagenes([file]);
        }
    };

    const renderTextField = (name, label, multiline = false, rows = 1) => (
        <FormControl fullWidth margin="normal">
            <InputLabel htmlFor={name} shrink={equipo[name] !== '' || focusedFields[name]}>
                {label}
            </InputLabel>
            <TextField
                id={name}
                name={name}
                value={equipo[name]}
                onChange={handleInputChange}
                onFocus={() => handleFocusChange(name, true)}
                onBlur={() => handleFocusChange(name, false)}
                multiline={multiline}
                rows={rows}
                required
            />
            <FormHelperText>{`Ingrese ${label.toLowerCase()} del equipo`}</FormHelperText>
        </FormControl>
    );

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="Agregar Equipo" />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            {renderTextField('Equipo', 'Equipo')}
                            {renderTextField('NIA', 'NIA')}
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="IdUnidad">Unidad</InputLabel>
                                <Select
                                    id="IdUnidad"
                                    name="IdUnidad"
                                    value={equipo.IdUnidad}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <MenuItem value="">Seleccione una unidad</MenuItem>
                                    {unidades.map(unidad => (
                                        <MenuItem key={unidad.IdUnidad} value={unidad.IdUnidad}>
                                            {unidad.NombreUnidad}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Seleccione la unidad a la que pertenece el equipo</FormHelperText>
                            </FormControl>
                            {renderTextField('Voltaje', 'Voltaje')}
                            {renderTextField('Potencia', 'Potencia')}
                            {renderTextField('Corriente', 'Corriente')}
                            {renderTextField('Observaciones', 'Observaciones', true, 4)}

                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="Estado" shrink={true}>Estado</InputLabel>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Switch
                                        id="Estado"
                                        checked={equipo.Estado === 1}
                                        onChange={handleSwitchChange}
                                    />
                                    <Typography variant="body1" sx={{ ml: 1 }}>
                                        {equipo.Estado === 1 ? 'Activo' : 'Baja'}
                                    </Typography>
                                </Box>
                                <FormHelperText>Seleccione el estado del equipo</FormHelperText>
                            </FormControl>

                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                Agregar Equipo
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AgregarEquipo;
