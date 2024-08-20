import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Button,
    TextField,
    FormControl,
    FormHelperText,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Switch,
    Autocomplete,
    CircularProgress
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
    const [filteredUnidades, setFilteredUnidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [focusedFields, setFocusedFields] = useState({});
    const [imagenes, setImagenes] = useState([]);
    const [imagenPreview, setImagenPreview] = useState(null);

    const fetchUnidades = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${API_URL}/unidades`);
            setUnidades(response.data);
            setFilteredUnidades(response.data);
        } catch (error) {
            console.error('Hubo un error al obtener las unidades:', error);
        } finally {
            setLoading(false);
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
            const response = await axiosInstance.post(`${API_URL}/equipos`, formData, {
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
            <TextField
                id={name}
                name={name}
                label={label}
                value={equipo[name]}
                onChange={handleInputChange}
                onFocus={() => handleFocusChange(name, true)}
                onBlur={() => handleFocusChange(name, false)}
                multiline={multiline}
                rows={rows}
                required
                fullWidth
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
                                <Autocomplete
                                    id="IdUnidad"
                                    options={unidades}
                                    getOptionLabel={(option) => option.NombreUnidad || ''}
                                    value={unidades.find(unidad => unidad.IdUnidad === equipo.IdUnidad) || null}
                                    onChange={(event, newValue) => {
                                        setEquipo(prev => ({ ...prev, IdUnidad: newValue ? newValue.IdUnidad : '' }));
                                    }}
                                    loading={loading}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Unidad"
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loading ? <CircularProgress color="inherit" size={24} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                <FormHelperText>Seleccione la unidad a la que pertenece el equipo</FormHelperText>
                            </FormControl>
                            {renderTextField('Voltaje', 'Voltaje')}
                            {renderTextField('Potencia', 'Potencia')}
                            {renderTextField('Corriente', 'Corriente')}
                            {renderTextField('Observaciones', 'Observaciones', true, 4)}

                            <FormControl fullWidth margin="normal">
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
