import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Timer, Wind } from 'lucide-react';
import { Card } from '../ui/Widgets';

const LungTestWidget = ({ onComplete }) => {
    const [isHolding, setIsHolding] = useState(false);
    const [timer, setTimer] = useState(0);
    const [result, setResult] = useState(null); // 'low', 'medium', 'high'
    const intervalRef = useRef(null);

    const startTest = () => {
        setIsHolding(true);
        setTimer(0);
        setResult(null);
        intervalRef.current = setInterval(() => {
            setTimer((prev) => prev + 0.1);
        }, 100);
    };

    const stopTest = () => {
        setIsHolding(false);
        clearInterval(intervalRef.current);

        // Calculate Result
        let score = 0;
        let status = '';

        if (timer < 10) {
            status = 'low';
            score = 40;
        } else if (timer < 25) {
            status = 'medium';
            score = 75;
        } else {
            status = 'high';
            score = 95;
        }

        setResult(status);
        if (onComplete) onComplete(score);
    };

    // Cleanup
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    // Visuals based on timer
    const getCircleColor = () => {
        if (timer < 10) return 'border-red-500 shadow-red-500/50';
        if (timer < 25) return 'border-yellow-500 shadow-yellow-500/50';
        return 'border-green-500 shadow-green-500/50';
    };

    const getStatusText = () => {
        if (result === 'low') return 'Kapasitas Rendah';
        if (result === 'medium') return 'Kapasitas Cukup';
        if (result === 'high') return 'Kapasitas Optimal';
        return '';
    };

    return (
        <Card className="p-6 h-full flex flex-col items-center justify-center relative overflow-hidden bg-slate-900 text-white border-none">
            {/* Background Pulse */}
            {isHolding && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl"
                />
            )}

            <div className="z-10 text-center space-y-6 w-full">
                <div className="flex justify-between items-center w-full px-2">
                    <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                        <Wind className="w-5 h-5 text-cyan-400" />
                        Tes Kapasitas Paru
                    </h3>
                    <div className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                        Tahan Tombol
                    </div>
                </div>

                {/* Interactive Circle */}
                <div className="relative h-48 w-full flex items-center justify-center">
                    <motion.button
                        onMouseDown={startTest}
                        onMouseUp={stopTest}
                        onMouseLeave={stopTest} // Handle drag out
                        onTouchStart={startTest}
                        onTouchEnd={stopTest}
                        whileTap={{ scale: 0.95 }}
                        className={`
              w-32 h-32 rounded-full border-4 flex items-center justify-center
              transition-all duration-300 relative z-20 bg-slate-800
              ${isHolding ? getCircleColor() : 'border-slate-600 hover:border-cyan-500'}
            `}
                    >
                        {isHolding ? (
                            <span className="text-3xl font-mono font-bold text-white">
                                {timer.toFixed(1)}s
                            </span>
                        ) : (
                            <span className="text-sm font-medium text-slate-300 text-center px-4">
                                {result ? 'Coba Lagi' : 'Tekan & Tahan'}
                            </span>
                        )}
                    </motion.button>

                    {/* Growing Ring */}
                    {isHolding && (
                        <motion.div
                            initial={{ width: '8rem', height: '8rem', opacity: 1 }}
                            animate={{ width: '16rem', height: '16rem', opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute rounded-full border border-white/30"
                        />
                    )}
                </div>

                {/* Result Display */}
                <div className="h-8">
                    {result && !isHolding && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-lg font-bold ${result === 'low' ? 'text-red-400' :
                                    result === 'medium' ? 'text-yellow-400' : 'text-green-400'
                                }`}
                        >
                            {getStatusText()}
                        </motion.div>
                    )}
                    {!result && !isHolding && (
                        <p className="text-sm text-slate-400">
                            Tarik napas dalam, lalu tekan tombol selama mungkin.
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default LungTestWidget;
