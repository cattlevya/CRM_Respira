import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import clsx from 'clsx';

export const ImageGrid = ({ options, onSelect, selectedValue }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {options.map((option) => (
                <div
                    key={option.value}
                    onClick={() => onSelect(option)}
                    className={clsx(
                        "cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 group relative",
                        selectedValue === option.value
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-slate-200 hover:border-blue-300"
                    )}
                >
                    <div className="aspect-video bg-slate-100 relative">
                        <img
                            src={option.image}
                            alt={option.label}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <div className="p-3 bg-white">
                        <h3 className="font-medium text-slate-900">{option.label}</h3>
                    </div>

                    {selectedValue === option.value && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export const AudioPlayer = ({ src, label, isSelected, onSelect }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Stop all other audios if needed (simple implementation here)
            document.querySelectorAll('audio').forEach(el => {
                if (el !== audioRef.current) el.pause();
            });
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            onClick={onSelect}
            className={clsx(
                "flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer",
                isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-300"
            )}
        >
            <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors flex-shrink-0"
            >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div className="ml-4 flex-1">
                <h4 className="font-medium text-slate-900">{label}</h4>
                <div className="flex items-center mt-1 space-x-1">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "w-1 rounded-full transition-all duration-300",
                                isPlaying ? "animate-pulse bg-blue-400" : "bg-slate-300"
                            )}
                            style={{
                                height: isPlaying ? `${Math.random() * 16 + 4}px` : '4px',
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <audio
                ref={audioRef}
                src={src}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />
        </div>
    );
};
