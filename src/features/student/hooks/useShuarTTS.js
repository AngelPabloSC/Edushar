import { useState, useCallback, useRef } from 'react';
import { Client } from "@gradio/client";

/**
 * Hook to interact with the Shuar TTS API (cacardenas7/shuar-tts-mms)
 * Handles audio generation, caching, and playback.
 */
export const useShuarTTS = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const audioCache = useRef({}); 
    const audioRef = useRef(null);

    const playAudio = useCallback(async (text) => {
        if (!text) return;

        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }

        try {
            setIsLoading(true);
            setError(null);

            let audioUrl = audioCache.current[text];

            if (!audioUrl) {
                // Connect to the Gradio space
                const client = await Client.connect("cacardenas7/shuar-tts-mms");

                // The API returns a result object
                const result = await client.predict("/synthesize", {
                    text: text,
                });

                // The result.data usually contains the file info. 
                // Based on Gradio client docs, it might be result.data[0].url
                if (result.data && result.data[0] && result.data[0].url) {
                    audioUrl = result.data[0].url;
                    audioCache.current[text] = audioUrl;
                } else {
                    throw new Error("No audio URL returned from API");
                }
            }

            // Play the audio
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onended = () => {
                setIsPlaying(false);
            };

            audio.onplay = () => {
                setIsPlaying(true);
                setIsLoading(false);
            };

            audio.onerror = (e) => {
                console.error("Error playing audio:", e);
                setError("Error playback");
                setIsPlaying(false);
                setIsLoading(false);
            };

            await audio.play();

        } catch (err) {
            console.error("TTS Error:", err);
            setError(err.message || "Error generating audio");
            setIsLoading(false);
        }
    }, []);

    return {
        play: playAudio,
        isPlaying,
        isLoading,
        error
    };
};
