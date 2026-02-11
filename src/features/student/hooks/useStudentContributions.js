import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../features/auth/context/LoginContext';
import { useFetchDataPromise } from '../../../shared/hooks/useFetchDataPromise';
import { useDialog } from '../../../shared/hooks/useDialog';
import { useSnackBarContext } from '../../../shared/context/SnackbarContext';
import validationRules from '../../../shared/utils/validationRules';

export const useStudentContributions = () => {
    const { user } = useAuth();
    const { getFechData } = useFetchDataPromise();
    const { isOpen, dialogContent, handleOpenDialog, handleCloseDialog, setDialogContent } = useDialog();
    const { handleSetDataSnackbar } = useSnackBarContext();

    // State
    const [activeTab, setActiveTab] = useState('palabra');
    const [actionCallback, setActionCallback] = useState(null);
    const [errors, setErrors] = useState({});
    const [storyLangTab, setStoryLangTab] = useState(0);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);

    const [formData, setFormData] = useState({
        // Word fields
        palabraShuar: '',
        traduccionEspanol: '',
        categoria: '',
        ejemploUso: '',
        imageDescription: '',

        // Story fields
        titleShuar: '',
        titleEs: '',
        categoryStory: 'Mito',
        author: '',
        contentShuar: '',
        contentEs: '',
        cover: null
    });

    // Fetch contributions history
    useEffect(() => {
        const fetchContributions = async () => {
            if (!user || !user.id) return;

            setLoading(true);
            try {
                const response = await getFechData({
                    endPoint: 'api/contributions/list',
                    method: 'POST',
                    additionalData: {}
                });

                if (response.code === 'COD_OK') {
                    const items = response.data?.items || [];

                    // Filter by current user ID
                    const userContributions = items.filter(item => item.userId === user.id);

                    // Map to UI format
                    const mappedContributions = userContributions.map(item => ({
                        id: item.id,
                        tipo: item.type === 'dictionary' ? 'Palabra' : 'Cuento',
                        contenido: item.type === 'dictionary'
                            ? `${item.data?.wordShuar || ''} (${item.data?.wordSpanish || ''})`
                            : item.data?.title_español || item.data?.title_shuar || '',
                        fecha: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
                        estado: item.status === 'pending' ? 'pendiente'
                            : item.status === 'approved' ? 'aprobado'
                                : item.status === 'rejected' ? 'rechazado'
                                    : 'revision',
                        timestamp: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''
                    }));

                    setContributions(mappedContributions);
                }
            } catch (error) {
                console.error('Error fetching contributions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, [user, getFechData]);

    // Handlers
    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        // Clear ALL fields when switching tabs to prevent data bleeding
        setFormData({
            palabraShuar: '',
            traduccionEspanol: '',
            categoria: '',
            ejemploUso: '',
            imageDescription: '',
            titleShuar: '',
            titleEs: '',
            categoryStory: 'Mito',
            author: '',
            contentShuar: '',
            contentEs: '',
            cover: null
        });
        // Clear errors too
        setErrors({});
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, cover: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (activeTab === 'palabra') {
            if (!formData.palabraShuar) newErrors.palabraShuar = validationRules.required;
            if (!formData.traduccionEspanol) newErrors.traduccionEspanol = validationRules.required;
            if (!formData.categoria) newErrors.categoria = validationRules.required;
        } else if (activeTab === 'cuento') {
            if (!formData.titleShuar) newErrors.titleShuar = validationRules.required;
            if (!formData.titleEs) newErrors.titleEs = validationRules.required;
            if (!formData.author) newErrors.author = validationRules.required;
            if (!formData.contentShuar) newErrors.contentShuar = validationRules.required;
            if (!formData.contentEs) newErrors.contentEs = validationRules.required;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitDictionary = async () => {
        // Prevenir múltiples envíos
        if (isSubmittingRef.current) {
            console.warn('⚠️ Envío ya en proceso, ignorando clic duplicado');
            return;
        }

        if (!user) {
            handleSetDataSnackbar({ message: 'Error: Debes iniciar sesión para contribuir.', type: 'error' });
            handleCloseDialog();
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);

        try {
            const payload = {
                userId: user.id,
                type: 'dictionary',
                content: {
                    wordShuar: formData.palabraShuar,
                    wordSpanish: formData.traduccionEspanol,
                    imageDescription: formData.imageDescription || '',
                    category: formData.categoria,
                    examples: [formData.ejemploUso],
                    image: formData.cover
                }
            };
            console.log('Dictionary Payload:', payload);

            const response = await getFechData({
                endPoint: 'api/contributions/create',
                method: 'POST',
                additionalData: payload
            });

            if (response.code === 'COD_OK') {
                handleSetDataSnackbar({ message: '¡Gracias! Tu palabra ha sido enviada para revisión.', type: 'success' });

                // Reset form
                setFormData({
                    palabraShuar: '',
                    traduccionEspanol: '',
                    categoria: '',
                    ejemploUso: '',
                    imageDescription: '',
                    titleShuar: '',
                    titleEs: '',
                    categoryStory: 'Mito',
                    author: '',
                    contentShuar: '',
                    contentEs: '',
                    cover: null
                });
            } else {
                handleSetDataSnackbar({ message: response.message || 'Error al enviar palabra', type: 'error' });
            }
        } catch (error) {
            console.error('Error submitting dictionary:', error);
            handleSetDataSnackbar({ message: 'Error de conexión', type: 'error' });
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }

        handleCloseDialog();
    };

    const handleSubmitStory = async () => {
        // Prevenir múltiples envíos
        if (isSubmittingRef.current) {
            console.warn('⚠️ Envío ya en proceso, ignorando clic duplicado');
            return;
        }

        if (!user) {
            handleSetDataSnackbar({ message: 'Error: Debes iniciar sesión para contribuir.', type: 'error' });
            handleCloseDialog();
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);

        try {
            const payload = {
                userId: user.id,
                type: 'story',
                content: {
                    title_shuar: formData.titleShuar,
                    title_español: formData.titleEs,
                    author: formData.author,
                    category: formData.categoryStory,
                    contentShuar: formData.contentShuar,
                    contentSpanish: formData.contentEs,
                    coverImage: formData.cover,
                    imageDescription: formData.imageDescription || ''
                }
            };
            console.log('Story Payload:', payload);

            const response = await getFechData({
                endPoint: 'api/contributions/create',
                method: 'POST',
                additionalData: payload
            });

            if (response.code === 'COD_OK') {
                handleSetDataSnackbar({ message: '¡Gracias! Tu cuento ha sido enviado para revisión.', type: 'success' });

                // Reset form
                setFormData({
                    palabraShuar: '',
                    traduccionEspanol: '',
                    categoria: '',
                    ejemploUso: '',
                    imageDescription: '',
                    titleShuar: '',
                    titleEs: '',
                    categoryStory: 'Mito',
                    author: '',
                    contentShuar: '',
                    contentEs: '',
                    cover: null
                });
            } else {
                handleSetDataSnackbar({ message: response.message || 'Error al enviar cuento', type: 'error' });
            }
        } catch (error) {
            console.error('Error submitting story:', error);
            handleSetDataSnackbar({ message: 'Error de conexión', type: 'error' });
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }

        handleCloseDialog();
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            handleSetDataSnackbar({ message: 'Por favor corrige los errores antes de enviar', type: 'error' });
            return;
        }

        const isWord = activeTab === 'palabra';
        setDialogContent({
            title: '¿Confirmar envío?',
            message: `Tu ${isWord ? 'palabra' : 'cuento'} será ${isWord ? 'revisada' : 'revisado'} por un administrador antes de ser ${isWord ? 'publicada' : 'publicado'}. ¿Deseas continuar?`
        });
        setActionCallback(() => isWord ? handleSubmitDictionary : handleSubmitStory);
        handleOpenDialog();
    };

    // Helpers for UI
    const getStatusColor = (estado) => {
        switch (estado) {
            case 'aprobado': return 'success';
            case 'pendiente': return 'warning';
            case 'revision': return 'warning';
            case 'rechazado': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (estado) => {
        switch (estado) {
            case 'aprobado': return 'Aprobado';
            case 'pendiente': return 'Pendiente';
            case 'revision': return 'En Revisión';
            case 'rechazado': return 'Rechazado';
            default: return estado;
        }
    };

    return {
        // State
        activeTab,
        storyLangTab,
        formData,
        errors,
        contributions,
        recentContributions: contributions.slice(0, 5),
        loading,
        isSubmitting,
        isOpen,
        dialogContent,
        actionCallback,

        // Setters
        setActiveTab: handleTabChange,
        setStoryLangTab,

        // Handlers
        handleInputChange,
        handleImageUpload,
        handleSubmit,
        handleCloseDialog,

        // Helpers
        getStatusColor,
        getStatusLabel
    };
};
