import { ChangeEvent, useEffect, useRef, useState, useMemo } from "react"

export type AudioType = {
    src: string
    title: string
    _id: string
}

export type PlayListType = AudioType[]

export const useAudioController = (playList: PlayListType, activeAudioId: string, setActiveAudioId: (id: string) => void) => {
    const [volume, setVolume] = useState(70);
    const [isSound, setIsSound] = useState(false);
    const [isLoop, setIsLoop] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const activeTrack = useMemo(() => playList.find(audio => audio._id === activeAudioId), [activeAudioId, playList.length])

    useEffect(() => {
        const handleUserInteraction = () => {
            if (!audioRef.current) return;
            audioRef.current.load();
            audioRef.current.play().catch((error) => console.error(error));
            setIsSound(true)
            document.removeEventListener("click", handleUserInteraction);
        };

        document.addEventListener("click", handleUserInteraction);

        return () => {
            document.removeEventListener("click", handleUserInteraction);
        };
    }, []);
    useEffect(() => {
        if (!isSound || (!activeTrack) || (!activeAudioId)) return
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = activeTrack.src || "";
            audioRef.current.load();
            audioRef.current.play();
        }
    }, [activeAudioId]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const playNextTrack = () => {
        const currentIndex = playList.findIndex(audio => audio._id === activeAudioId)
        const newIndex = playList.length - 1 !== currentIndex ? currentIndex + 1 : 0
        setActiveAudioId(playList[newIndex]._id)
    };

    const playPreviousTrack = () => {
        const currentIndex = playList.findIndex(audio => audio._id === activeAudioId)
        const newIndex = currentIndex === 0 ? playList.length - 1 : currentIndex - 1
        setActiveAudioId(playList[newIndex]._id)
    };

    const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setVolume(event.target.valueAsNumber);
    };
    const handleIsSoundChange = () => {
        setIsSound((prevState) => {
            const nextState = !prevState;
            if (audioRef.current) {
                if (nextState) {
                    audioRef.current.play();
                } else {
                    audioRef.current.pause();
                }
            }
            return nextState;
        });
    };

    const handleIsLoopChange = () => {
        setIsLoop((prevState) => !prevState);
    }

    const handleAudioEnded = () => {
        if (!isLoop) {
            playNextTrack();
        }
    }

    return {
        currentTrack: activeTrack,
        volume,
        isSound,
        audioRef,
        playNextTrack,
        playPreviousTrack,
        handleIsSoundChange,
        handleVolumeChange,
        handleIsLoopChange,
        handleAudioEnded,
        isLoop
    }
}