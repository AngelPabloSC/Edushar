import { useState, useEffect } from 'react';
import { useDialong } from '../ui/useDialog';
import { useSnackBarContext } from '../context/SnackbarContext';
import { useFetchDataPromise } from '../api/useFetchDataPromise';

export const useAdminModeration = () => {
    const { getFechData } = useFetchDataPromise();
    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();

    // State
    const [actionCallback, setActionCallback] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading true
    const [selectedContributionId, setSelectedContributionId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [contributions, setContributions] = useState([]);
    const [stats, setStats] = useState({
        pending: { count: 0, new: 0 },
        approvedToday: { count: 0, percentage: 0 },
        rejected: { count: 0 }
    });
    const [history, setHistory] = useState([]);
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [filterType, setFilterType] = useState('all');

    // Derived state
    const filteredContributions = contributions.filter(item => {
        // Filter by search query
        const matchesSearch = searchQuery.toLowerCase() === '' ||
            (item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.data?.wordShuar?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.data?.title_shuar?.toLowerCase().includes(searchQuery.toLowerCase()));

        // Filter by type
        const matchesType = filterType === 'all' ||
            (filterType === 'dictionary' && item.type === 'dictionary') ||
            (filterType === 'story' && item.type === 'story');

        return matchesSearch && matchesType;
    });

    const selectedContribution = contributions.find(c => c.id === selectedContributionId);

    // Fetch Data
    useEffect(() => {
        const fetchContributions = async () => {
            setLoading(true);
            try {
                const response = await getFechData({
                    endPoint: 'api/contributions/list',
                    method: 'POST',
                    additionalData: {}
                });

                if (response.code === 'COD_OK') {
                    // Map API data to UI structure if needed
                    // Assuming API returns items similar to mock for now, or we adapt
                    const items = response.data?.items || [];

                    // Adapt if necessary (Example mapping)
                    const adaptedItems = items.map(item => ({
                        id: item.id,
                        type: item.type, // 'story' or 'dictionary'
                        status: item.status,
                        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Reciente',
                        // User info might need to be fetched or is included? 
                        // The provided JSON shows userId. If user object isn't expanded, we might need a placeholder or fetch.
                        // For now assuming the backend might expand it or we use placeholder.
                        user: {
                            name: item.userName || 'Estudiante',
                            avatar: item.userPhoto || 'https://mui.com/static/images/avatar/1.jpg',
                            timeAgo: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Reciente'
                        },
                        // Keep the specific data structure for the modal
                        data: item.data
                    }));

                    setContributions(adaptedItems);

                    // Fetch history for stats
                    const historyResponse = await getFechData({
                        endPoint: 'api/contributions/history',
                        method: 'POST',
                        additionalData: { id: '' }
                    });

                    if (historyResponse.code === 'COD_OK') {
                        const history = historyResponse.data?.history || [];
                        const today = new Date().toDateString();

                        // Calculate stats
                        const pending = items.filter(item => item.status === 'pending');
                        const approvedToday = history.filter(item =>
                            item.status === 'approved' &&
                            new Date(item.resolvedAt).toDateString() === today
                        );
                        const rejected = history.filter(item => item.status === 'rejected');

                        // Calculate "new" pending (created in last 24 hours)
                        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                        const newPending = pending.filter(item =>
                            new Date(item.createdAt) > oneDayAgo
                        );

                        // Calculate approved percentage (vs yesterday)
                        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
                        const approvedYesterday = history.filter(item =>
                            item.status === 'approved' &&
                            new Date(item.resolvedAt).toDateString() === yesterday
                        );

                        const percentage = approvedYesterday.length > 0
                            ? Math.round(((approvedToday.length - approvedYesterday.length) / approvedYesterday.length) * 100)
                            : approvedToday.length > 0 ? 100 : 0;

                        setStats({
                            pending: { count: pending.length, new: newPending.length },
                            approvedToday: { count: approvedToday.length, percentage },
                            rejected: { count: rejected.length }
                        });

                        // Store history for dialog
                        setHistory(history);
                    }

                    // Select first if available and none selected
                    // if (adaptedItems.length > 0 && !selectedContributionId) {
                    //     setSelectedContributionId(adaptedItems[0].id);
                    // }
                } else {
                    // handleSetDataSnackbar({ message: 'Error al cargar contribuciones', type: 'error' });
                }
            } catch (error) {
                console.error("Error fetching contributions:", error);
                // handleSetDataSnackbar({ message: 'Error de conexión', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, [getFechData]);

    // Handlers
    const handleAction = async (actionType) => {
        setLoading(true);
        try {
            const endPoint = actionType === 'approve'
                ? 'api/contributions/approve'
                : 'api/contributions/reject';

            const response = await getFechData({
                endPoint,
                method: 'POST',
                additionalData: {
                    id: selectedContributionId
                }
            });

            if (response.code === 'COD_OK') {
                if (actionType === 'approve') {
                    handleSetDataSnackbar({ message: 'Contribución aprobada correctamente', type: 'success' });
                } else {
                    handleSetDataSnackbar({ message: 'Contribución rechazada', type: 'success' }); // Changed type to success/info usually, or keep error if it implies deletion? User used 'reject' in prompt. usually reject is success operation but negative outcome. 'success' or 'info' is better for "Successully rejected". Let's stick to 'success' for the operation.
                }
                // Remove item locally
                setContributions(prev => prev.filter(c => c.id !== selectedContributionId));
                setSelectedContributionId(null);
            } else {
                handleSetDataSnackbar({ message: response.message || 'Error al procesar la solicitud', type: 'error' });
            }
        } catch (error) {
            console.error("Error processing contribution:", error);
            handleSetDataSnackbar({ message: 'Error de conexión', type: 'error' });
        } finally {
            setLoading(false);
        }
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
        stats,
        stats,
        contributions, // Now from API
        filteredContributions,
        filterType,

        // Dialog State
        isOpen,
        dialongContent,
        actionCallback,
        history,
        historyDialogOpen,

        // Setters
        setSelectedContributionId,
        setSearchQuery,
        setFilterType,
        setHistoryDialogOpen,

        // Handlers
        handleConfirmation,
        handleCloseDialog
    };
};
