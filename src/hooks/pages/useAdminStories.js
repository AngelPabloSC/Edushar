import { useState } from 'react';

const mockStories = [
    {
        id: 1,
        title: { shuar: "Nunkui y la abundancia", es: "Nunkui y la abundancia" },
        category: "Mito",
        author: "Shuar Community",
        status: "Publicado",
        cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_nSmxciuv3UgGKXptWVLyy5P8kf913fivx4_sn4EhyW7get1YB3STQmrUHfeWvStIMIlEXCDyMJH_qlgQ582G46HuXrxgkRtyMBUs-lmGiXRfTmEiq2hPW0kl-mZOKVuGdC2jkk7fBzDPGZJh8KJIWdHX1Ut6BdNp1sf7uFVFHx2dCAK2gq_hfhksrBp3dCI1llEL_YcXfiN5alsifMruHD6lHiW3dAYW_8zbgP6sAiV1v5-o-l1xibrmryWp4EpzQxWKEd9m_WM" // From user HTML
    },
    {
        id: 2,
        title: { shuar: "El origen del fuego", es: "El origen del fuego" },
        category: "Tradición",
        author: "Juan Arcos",
        status: "Borrador",
        cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIhvIjhVcl-g7hA7gv9DIKv0ovFp4pfKqOsE52H2vPf_c6UDcBpkz2I2TXUYnoP3Mx6WPRLu7wCUddpX0u0RBHWeBd--Np9g7uQnzyE4_nrnNcWVF8saJhljWyhSh-RjOQYgFnWbOEaHQ_LokHMS6Lwcosp1eRGd_3r-58NR0aDluosBKYEjcWiNpdxbyv8XP8PAv28C6DnyDlcrj9njDRqshJickw5RvOgTs6nGgH1V7Wv6mm0ZjKRbD6UsUMq_XNbG3ZkSOSW9HZ"
    },
    {
        id: 3,
        title: { shuar: "El tigre y el conejo", es: "El tigre y el conejo" },
        category: "Fábula",
        author: "Maria Jua",
        status: "Publicado",
        cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0MmPnElLXBLP5mydU-owdZoFiWedIgz9WXT-myzUNzH2diQxGppbV0XL3vIPpbAe9orEcX9NNJ2c7eEOvPZawc6LH36xFlfgAyaAXwhjcM0twDAZ1WHxwDIbyuFGxat1a37ezVcXSGMwKYtzxPdjwnkNPK8cQiabjhd1O_Zbn2y36xSJoqEBawjcn8cwxpl0NbBiRtHMBBSRgRWX07Wrd_MQdKEMh2qrYLyK1TLQw5o4tWk9yYujZAmE5bP4-JMFJgp4jCELGrrHa"
    },
    {
        id: 4,
        title: { shuar: "Etsa y el demonio", es: "Etsa y el demonio" },
        category: "Mito",
        author: "Tradición Oral",
        status: "Publicado",
        cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqZ7MR2qnWO2e-DfrvM7ib1wZLD24Z8lLtMj2G7TiN5nP1OBxFrSPh1dvos4S3sbK_blDiyRl5q_jbYv4r5j51i9alXHJZRS19NQsxwquzLHxo1k5gxjSmrFMj5S_9mjoeZo6buBzp98s0BWywYPS3g6E5WBL5SFfrpzhIKV7isMqLZk3_nRisnnScT8ta3Dua4amWQ1G-crqNaVbXEiTpNUzq5vwDMnNX1LqJtbupLMqiyRju1rjFfBwFpBUiJwJzBybXKG7L7A43"
    }
];

export const useAdminStories = () => {
    const [activeTab, setActiveTab] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [stories, setStories] = useState(mockStories);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleDelete = (id) => {
        setStories(prev => prev.filter(story => story.id !== id));
    };

    const filteredData = stories.filter(story => {
        // Filter by tab
        if (activeTab !== 'Todos') {
            if (story.category !== activeTab) return false;
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                story.title.es.toLowerCase().includes(query) ||
                story.title.shuar.toLowerCase().includes(query) ||
                story.author.toLowerCase().includes(query)
            );
        }

        return true;
    });

    return {
        activeTab,
        handleTabChange,
        searchQuery,
        setSearchQuery,
        data: filteredData,
        handleDelete,
        stats: {
            total: stories.length,
            published: stories.filter(s => s.status === 'Publicado').length,
            drafts: stories.filter(s => s.status === 'Borrador').length
        }
    };
};
