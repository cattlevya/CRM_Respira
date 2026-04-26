import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Trophy, Timer, Zap } from 'lucide-react';
import { Card, cn } from '../ui/Widgets';

const BreathingWidget = () => {
    // --- STATE: BREATHING EXERCISE ---
    const [mode, setMode] = useState('relax'); // 'relax' | 'focus'
    const [isBreathing, setIsBreathing] = useState(false);
    const [phase, setPhase] = useState('SIAP?'); // Text: TARIK, TAHAN, HEMBUS
    const [timer, setTimer] = useState(0); // Countdown number

    // Animation Controls
    const [scale, setScale] = useState(1);
    const [opacity, setOpacity] = useState(0.5);

    // --- STATE: BREATH HOLD GAME ---
    const [isHolding, setIsHolding] = useState(false);
    const [gameTime, setGameTime] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const gameIntervalRef = useRef(null);

    // --- CONFIGURATION ---
    const CONFIG = {
        relax: {
            name: 'Relax',
            cycles: [
                { label: 'TARIK NAPAS', duration: 4, scale: 1.5, opacity: 1 },
                { label: 'TAHAN', duration: 7, scale: 1.5, opacity: 0.8 },
                { label: 'HEMBUSKAN', duration: 8, scale: 1, opacity: 0.4 }
            ]
        },
        focus: {
            name: 'Fokus',
            cycles: [
                { label: 'TARIK NAPAS', duration: 4, scale: 1.5, opacity: 1 },
                { label: 'TAHAN', duration: 4, scale: 1.5, opacity: 0.8 },
                { label: 'HEMBUSKAN', duration: 4, scale: 1, opacity: 0.4 },
                { label: 'TAHAN', duration: 4, scale: 1, opacity: 0.4 }
            ]
        }
    };

    // --- LOGIC: BREATHING EXERCISE ---
    useEffect(() => {
        let interval = null;
        let phaseIndex = 0;
        let elapsed = 0;

        if (isBreathing) {
            const currentConfig = CONFIG[mode];

            // Init First Phase
            const updatePhase = (idx) => {
                const p = currentConfig.cycles[idx];
                setPhase(p.label);
                setTimer(p.duration);
                setScale(p.scale);
                setOpacity(p.opacity);
            };

            updatePhase(0);

            interval = setInterval(() => {
                elapsed++;
                const currentPhaseDuration = currentConfig.cycles[phaseIndex].duration;

                if (elapsed < currentPhaseDuration) {
                    setTimer(currentPhaseDuration - elapsed);
                } else {
                    // Next Phase
                    elapsed = 0;
                    phaseIndex = (phaseIndex + 1) % currentConfig.cycles.length;
                    updatePhase(phaseIndex);
                }
            }, 1000);
        } else {
            // Reset
            setPhase('SIAP?');
            setTimer(0);
            setScale(1);
            setOpacity(0.5);
        }

        return () => clearInterval(interval);
    }, [isBreathing, mode]);

    // --- LOGIC: BREATH HOLD GAME (PRESS & HOLD) ---
    const startHolding = (e) => {
        e.preventDefault(); // Prevent text selection/context menu
        setIsHolding(true);
        setIsBreathing(false); // Stop breathing exercise
        setGameTime(0);
        const startTime = Date.now();

        gameIntervalRef.current = requestAnimationFrame(function update() {
            setGameTime((Date.now() - startTime) / 1000);
            gameIntervalRef.current = requestAnimationFrame(update);
        });
    };

    const stopHolding = () => {
        setIsHolding(false);
        if (gameIntervalRef.current) cancelAnimationFrame(gameIntervalRef.current);
        if (gameTime > highScore) setHighScore(gameTime);
    };

    // Determine color based on hold time
    const getHoldColor = () => {
        if (gameTime < 15) return 'from-cyan-400 to-blue-500';
        if (gameTime < 45) return 'from-emerald-400 to-green-500';
        return 'from-amber-300 to-yellow-500';
    };

    const getHoldStatus = () => {
        if (gameTime < 15) return 'Mulai...';
        if (gameTime < 45) return 'Bagus!';
        return 'LUAR BIASA!';
    };

    return (
        <Card className="h-full min-h-[500px] bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl text-white shadow-2xl flex flex-col relative overflow-hidden group">

            {/* Background Ambient Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={cn("absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-500/10 blur-[100px] transition-all duration-1000", isBreathing ? "opacity-100 scale-110" : "opacity-50 scale-100")} />
            </div>

            {/* --- HEADER --- */}
            <div className="relative z-10 p-6 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Wind className="w-5 h-5 text-cyan-300" />
                        Latihan Pernapasan
                    </h2>
                    <p className="text-slate-300 text-xs mt-1">Relaksasi & Ukur Kapasitas Paru</p>
                </div>

                {/* Toggle */}
                <div className="bg-black/20 backdrop-blur-md rounded-full p-1 flex border border-white/5">
                    <button
                        onClick={() => !isBreathing && setMode('relax')}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all",
                            mode === 'relax' ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25" : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        Relax
                    </button>
                    <button
                        onClick={() => !isBreathing && setMode('focus')}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all",
                            mode === 'focus' ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25" : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        Fokus
                    </button>
                </div>
            </div>

            {/* --- MAIN BODY: 2D PULSE OF LIGHT --- */}
            <div className="flex-1 relative z-10 flex flex-col items-center justify-center -mt-8">
                <div className="relative w-64 h-64 flex items-center justify-center">

                    {/* Ripple 1 (Outer) */}
                    <motion.div
                        animate={{
                            scale: isBreathing ? scale * 1.6 : 1,
                            opacity: isBreathing ? 0 : 0.1,
                        }}
                        transition={{ duration: isBreathing ? timer : 2, ease: "easeOut", repeat: isBreathing ? Infinity : 0 }}
                        className="absolute w-40 h-40 rounded-full border border-cyan-400/30"
                    />

                    {/* Ripple 2 (Middle) */}
                    <motion.div
                        animate={{
                            scale: isBreathing ? scale * 1.3 : 1,
                            opacity: isBreathing ? 0.2 : 0.1,
                        }}
                        transition={{ duration: isBreathing ? timer : 1, ease: "easeInOut" }}
                        className="absolute w-40 h-40 rounded-full bg-cyan-400/10 blur-md"
                    />

                    {/* Core Light (Button) */}
                    <motion.button
                        animate={{
                            scale: isBreathing ? scale : 1,
                            backgroundColor: isBreathing ? "rgba(34, 211, 238, 0.2)" : "rgba(255, 255, 255, 0.05)",
                            boxShadow: isBreathing ? "0 0 60px rgba(34, 211, 238, 0.4)" : "0 0 0px rgba(0,0,0,0)"
                        }}
                        transition={{ duration: isBreathing ? timer : 1, ease: "easeInOut" }}
                        className="w-40 h-40 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center relative z-20 cursor-pointer hover:bg-white/10 transition-colors active:scale-95"
                        onClick={() => setIsBreathing(!isBreathing)}
                    >
                        <div className="text-center">
                            {isBreathing ? (
                                <>
                                    <motion.div
                                        key={phase}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-cyan-200 font-bold text-sm tracking-widest uppercase mb-1"
                                    >
                                        {phase}
                                    </motion.div>
                                    <div className="text-4xl font-bold text-white font-mono">
                                        {timer}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-white/80">
                                    <Zap className="w-8 h-8 mb-2 text-cyan-300" />
                                    <span className="text-xs font-bold tracking-widest uppercase">Mulai</span>
                                </div>
                            )}
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* --- FOOTER: BREATH HOLD CHALLENGE (PRESS & HOLD) --- */}
            <div className="relative z-20 p-6 bg-black/20 backdrop-blur-md border-t border-white/5">
                <div className="flex justify-between items-end mb-3">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <Trophy className="w-3 h-3 text-yellow-500" />
                            Tantangan Tahan Napas
                        </h3>
                        <div className="text-[10px] text-slate-500 mt-1">Rekor: {highScore.toFixed(2)}s</div>
                    </div>
                    <div className={cn("text-2xl font-mono font-bold transition-colors duration-300", isHolding ? "text-white" : "text-slate-500")}>
                        {gameTime.toFixed(2)}<span className="text-sm font-sans ml-1 text-slate-600">s</span>
                    </div>
                </div>

                {/* Interactive Bar */}
                <div className="relative h-14 w-full rounded-2xl overflow-hidden bg-slate-800/50 border border-white/10 shadow-inner group-hover:border-white/20 transition-colors">
                    {/* Progress Fill */}
                    <motion.div
                        className={cn("absolute inset-0 bg-gradient-to-r opacity-90 transition-all duration-300", getHoldColor())}
                        initial={{ width: "0%" }}
                        animate={{ width: isHolding ? "100%" : "0%" }}
                        transition={{ duration: isHolding ? 60 : 0.5, ease: "linear" }} // Fill over 60s target
                    />

                    {/* Button Area */}
                    <button
                        onMouseDown={startHolding}
                        onMouseUp={stopHolding}
                        onMouseLeave={stopHolding}
                        onTouchStart={startHolding}
                        onTouchEnd={stopHolding}
                        className="absolute inset-0 w-full h-full flex items-center justify-center z-10 outline-none focus:outline-none cursor-pointer active:cursor-grabbing"
                    >
                        <span className={cn("font-bold tracking-widest uppercase text-sm transition-all duration-300 flex items-center gap-2", isHolding ? "text-white scale-110" : "text-slate-400 group-hover:text-white")}>
                            {isHolding ? (
                                <>
                                    <span className="animate-pulse w-2 h-2 rounded-full bg-white" />
                                    {getHoldStatus()}
                                </>
                            ) : (
                                "Tekan & Tahan"
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default BreathingWidget;
