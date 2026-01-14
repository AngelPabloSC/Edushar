import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Avatar,
    Button,
    Paper,
    Grid,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import BookIcon from '@mui/icons-material/Book';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TranslateIcon from '@mui/icons-material/Translate';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const AdminProfile = () => {
    // Mock data del admin
    const [admin] = useState({
        name: 'Admin',
        email: 'admin@edushar.com',
        phone: '+593 99 123 4567',
        location: 'Morona Santiago, Ecuador',
        joinDate: 'Enero 2024',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=442A2A&color=fff&size=128',
        role: 'Administrador Principal',
    });

    const stats = {
        totalLessons: 12,
        totalStories: 8,
        totalWords: 6,
        totalUsers: 150,
        publishedThisMonth: 5,
        pendingReviews: 3,
    };

    const recentActivity = [
        { id: 1, action: 'Publicó una nueva lección', item: 'Saludos en Shuar', time: 'Hace 2 horas', type: 'lesson' },
        { id: 2, action: 'Aprobó un cuento', item: 'El Jaguar Sagrado', time: 'Hace 5 horas', type: 'story' },
        { id: 3, action: 'Agregó 3 palabras al diccionario', item: 'Diccionario', time: 'Hace 1 día', type: 'dictionary' },
        { id: 4, action: 'Editó una lección', item: 'Números en Shuar', time: 'Hace 2 días', type: 'lesson' },
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'lesson': return <BookIcon sx={{ fontSize: 20, color: 'primary.main' }} />;
            case 'story': return <AutoStoriesIcon sx={{ fontSize: 20, color: 'info.main' }} />;
            case 'dictionary': return <TranslateIcon sx={{ fontSize: 20, color: 'success.main' }} />;
            default: return <CheckCircleIcon sx={{ fontSize: 20 }} />;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Profile Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3 }}>
                        <Avatar
                            src={admin.avatar}
                            alt={admin.name}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid',
                                borderColor: 'primary.light',
                                boxShadow: 3,
                            }}
                        />
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="h3" fontWeight={900} gutterBottom>
                                {admin.name}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                {admin.role}
                            </Typography>
                            <Chip
                                label="Activo"
                                color="success"
                                size="small"
                                sx={{ fontWeight: 600, mt: 1 }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            sx={{
                                borderRadius: 3,
                                fontWeight: 700,
                                borderWidth: 2,
                                '&:hover': { borderWidth: 2 }
                            }}
                        >
                            Editar Perfil
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SettingsIcon />}
                            sx={{
                                borderRadius: 3,
                                fontWeight: 700,
                                bgcolor: 'text.primary',
                                '&:hover': { bgcolor: 'text.secondary' }
                            }}
                        >
                            Configuración
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Contact Info */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <EmailIcon sx={{ color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>EMAIL</Typography>
                                <Typography variant="body1" fontWeight={600}>{admin.email}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PhoneIcon sx={{ color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>TELÉFONO</Typography>
                                <Typography variant="body1" fontWeight={600}>{admin.phone}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LocationOnIcon sx={{ color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>UBICACIÓN</Typography>
                                <Typography variant="body1" fontWeight={600}>{admin.location}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CalendarTodayIcon sx={{ color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>MIEMBRO DESDE</Typography>
                                <Typography variant="body1" fontWeight={600}>{admin.joinDate}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                        <Typography variant="h5" fontWeight={800} gutterBottom sx={{ mb: 3 }}>
                            Estadísticas de Contenido
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                                    <BookIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                    <Typography variant="h4" fontWeight={900} color="primary.main">{stats.totalLessons}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>LECCIONES</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                                    <AutoStoriesIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                                    <Typography variant="h4" fontWeight={900} color="info.main">{stats.totalStories}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>CUENTOS</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                                    <TranslateIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                                    <Typography variant="h4" fontWeight={900} color="success.main">{stats.totalWords}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>PALABRAS</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                                    <PeopleIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                                    <Typography variant="h4" fontWeight={900} color="warning.main">{stats.totalUsers}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>USUARIOS</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 2 }}>
                                    <TrendingUpIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                                    <Typography variant="h4" fontWeight={900} color="secondary.main">{stats.publishedThisMonth}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>ESTE MES</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                                    <AccessTimeIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                                    <Typography variant="h4" fontWeight={900} color="error.main">{stats.pendingReviews}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>PENDIENTES</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h5" fontWeight={800} gutterBottom sx={{ mb: 2 }}>
                            Actividad Reciente
                        </Typography>
                        <List sx={{ p: 0 }}>
                            {recentActivity.map((activity) => (
                                <ListItem
                                    key={activity.id}
                                    sx={{
                                        px: 0,
                                        py: 2,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        '&:last-child': { borderBottom: 'none' }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        {getActivityIcon(activity.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" fontWeight={600}>
                                                {activity.action}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="caption" color="primary.main" fontWeight={600}>
                                                    {activity.item}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    {activity.time}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminProfile;
