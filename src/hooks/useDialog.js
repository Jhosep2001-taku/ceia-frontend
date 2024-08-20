import { useState } from 'react';

const useDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogType, setDialogType] = useState(null);

    const openDialog = (type) => {
        setDialogType(type);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setDialogType(null);
        setIsOpen(false);
    };

    return {
        isOpen,
        dialogType,
        openDialog,
        closeDialog
    };
};

export default useDialog;
