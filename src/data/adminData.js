/**
 * Mock data for Admin Moderation Interface
 */

export const moderationStats = {
    pending: 24,
    approvedToday: 142,
    rejected: 8
};

export const contributions = [
    {
        id: 1,
        user: {
            name: 'Nantu Juank',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100', // Using unsplash for placeholder
            timeAgo: 'Hace 2 mins'
        },
        type: 'Palabra Sugerida',
        status: 'pending',
        content: {
            title: '"Kujancham"',
            shuar: 'Kujancham',
            spanish: 'Zarigüeya',
            context: '"Kujancham namanké pérmaíti" — La carne de zarigüeya es comestible.',
            category: 'Animales',
            image: 'https://images.unsplash.com/photo-1627916327663-125c1109033f?w=500',
            typeLabel: 'Término Shuar',
            translationLabel: 'Traducción sugerida'
        }
    },
    {
        id: 2,
        user: {
            name: 'Suku Maya',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
            timeAgo: 'Hace 1 hora'
        },
        type: 'Historia Corta',
        status: 'pending',
        content: {
            title: '"El origen del fuego"',
            description: 'Una versión alternativa del mito de Etsa...',
            typeLabel: 'Título',
            translationLabel: 'Resumen'
        }
    },
    {
        id: 3,
        user: {
            name: 'Arutam',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            timeAgo: 'Ayer'
        },
        type: 'Corrección',
        status: 'pending',
        content: {
            title: 'Definición de "Uchi"',
            details: 'La definición actual es muy limitada...',
            typeLabel: 'Término',
            translationLabel: 'Corrección'
        }
    },
    {
        id: 4,
        user: {
            name: 'Shuar-Fan',
            avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
            timeAgo: 'Ayer'
        },
        type: 'Palabra Sugerida',
        status: 'reviewed', // opacity-70 in design implies maybe reviewed or read
        content: {
            title: '"Pajám"',
            shuar: 'Pajám',
            spanish: 'Estrella',
            typeLabel: 'Término Shuar',
            translationLabel: 'Traducción sugerida'
        }
    }
];

export const adminMenu = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { label: 'Moderación', icon: 'check_circle', path: '/admin/moderacion', active: true },
    { label: 'Usuarios', icon: 'group', path: '/admin/usuarios' },
    { label: 'Editor Shuar', icon: 'menu_book', path: '/admin/editor' },
];
