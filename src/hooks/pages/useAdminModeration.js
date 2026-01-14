import { useState } from 'react';
import { useDialong } from '../useDialog';
import { useSnackBarContext } from '../context/SnackbarContext';
import { moderationStats, contributions } from '../../data/adminData';

export const useAdminModeration = () => {
    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();

    // State
    const [actionCallback, setActionCallback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedContributionId, setSelectedContributionId] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Derived state
    const selectedContribution = contributions.find(c => c.id === selectedContributionId);

    // Handlers
    const handleAction = (actionType) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (actionType === 'approve') {
                handleSetDataSnackbar({ message: 'Contribución aprobada correctamente', type: 'success' });
            } else if (actionType === 'changes') {
                handleSetDataSnackbar({ message: 'Se han solicitado cambios al estudiante', type: 'info' });
            } else if (actionType === 'reject') {
                handleSetDataSnackbar({ message: 'Contribución rechazada', type: 'error' });
            }
        }, 600);
    };

    const handleConfirmation = (type) => {
        let config = {
            title: '',
            message: '',
            color: 'primary',
            confirmText: 'Confirmar'
        };

        if (type === 'approve') {
            config = {
                title: '¿Aprobar Contribución?',
                message: 'Esta acción publicará la contribución en el diccionario oficial. ¿Estás seguro?',
                color: 'success',
                confirmText: 'Sí, Aprobar'
            };
        } else if (type === 'changes') {
            config = {
                title: '¿Solicitar Cambios?',
                message: 'Se enviará una notificación al estudiante para que revise su contribución. ¿Continuar?',
                color: 'info',
                confirmText: 'Solicitar Cambios'
            };
        } else if (type === 'reject') {
            config = {
                title: '¿Rechazar Contribución?',
                message: 'Esta acción rechazará permanentemente la contribución. ¿Estás seguro?',
                color: 'error',
                confirmText: 'Sí, Rechazar'
            };
        }

        setDialongContent(config);
        setActionCallback(() => () => {
            handleAction(type);
            handleCloseDialog();
        });
        handleOpenDialog();
    };

    return {
        // State
        loading,
        selectedContributionId,
        searchQuery,
        selectedContribution,
        moderationStats,
        contributions, // Could be filtered here if using search query

        // Dialog State
        isOpen,
        dialongContent,
        actionCallback,

        // Setters
        setSelectedContributionId,
        setSearchQuery,

        // Handlers
        handleConfirmation,
        handleCloseDialog
    };
};
