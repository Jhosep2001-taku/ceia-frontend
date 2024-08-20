// CustomDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const CustomDialog = ({ open, onClose, title, onSubmit, children }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            {children}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">
                Cancelar
            </Button>
        </DialogActions>
    </Dialog>
);

export default CustomDialog;
