import { useState } from 'react';

/**
 * Hook personalizado para manejar la lógica de traducción
 * @returns {Object} { 
 *   inputValue, 
 *   setInputValue, 
 *   translationResult, 
 *   loading, 
 *   error, 
 *   handleTranslate, 
 *   handleClear 
 * }
 */
export const useTranslator = () => {
    const [inputValue, setInputValue] = useState('');
    const [translationResult, setTranslationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTranslate = async () => {
        if (!inputValue.trim()) return;

        setLoading(true);
        setError(null);
        setTranslationResult(null);

        try {
         
            const apiUrl = import.meta.env.VITE_TRANSLATION_API_URL;

            console.log('🌐 Translator - API URL:', apiUrl);
            console.log('📤 Translator - Request payload:', { text: inputValue });

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputValue }),
            });

            console.log('📥 Translator - Response status:', response.status);
            console.log('📥 Translator - Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Translator - Error response:', errorText);
                throw new Error(`Error en la solicitud de traducción (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Translator - Response data:', data);

            if (data.ok) {
                setTranslationResult(data);
            } else {
                throw new Error('La respuesta de la API no fue exitosa');
            }
        } catch (err) {
            console.error('❌ Translator - Error details:', err);
            console.error('❌ Translator - Error name:', err.name);
            console.error('❌ Translator - Error message:', err.message);

            // More specific error messages
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                setError('No se pudo conectar con el servicio de traducción. Por favor verifica tu conexión a internet.');
            } else if (err.message.includes('CORS')) {
                setError('Error de permisos al acceder al servicio de traducción.');
            } else {
                setError(err.message || 'Hubo un error al traducir el texto. Por favor intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setInputValue('');
        setTranslationResult(null);
        setError(null);
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);

            let voices = window.speechSynthesis.getVoices();

            const selectVoice = () => {
                const esVoices = voices.filter(voice => voice.lang.startsWith('es'));
                let bestVoice = esVoices.find(voice =>
                    voice.name.includes('Google') ||
                    voice.name.includes('Paulina') ||
                    voice.name.includes('Monica') ||
                    voice.name.includes('Jorge')
                );

                if (!bestVoice && esVoices.length > 0) {
                    bestVoice = esVoices[0];
                }

                if (bestVoice) {
                    utterance.voice = bestVoice;
                    utterance.lang = bestVoice.lang;
                } else {
                    utterance.lang = 'es-ES';
                }

                utterance.rate = 0.9;
                utterance.pitch = 1;
                window.speechSynthesis.speak(utterance);
            };

            if (voices.length > 0) {
                selectVoice();
            } else {
                window.speechSynthesis.onvoiceschanged = () => {
                    voices = window.speechSynthesis.getVoices();
                    selectVoice();
                    window.speechSynthesis.onvoiceschanged = null;
                };
            }
        }
    };

    return {
        inputValue,
        setInputValue,
        translationResult,
        loading,
        error,
        handleTranslate,
        handleClear,
        speak
    };
};
