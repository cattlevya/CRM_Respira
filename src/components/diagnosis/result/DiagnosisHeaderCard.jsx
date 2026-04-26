import React from 'react';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import clsx from 'clsx';

const DiagnosisHeaderCard = ({ diagnosis, severity, confidence }) => {
    const isCritical = severity === 'critical';
    const isHigh = severity === 'high';

    // Color Logic (Soft Backgrounds + Strong Borders)
    const themeColor = isCritical ? 'text-red-700' : isHigh ? 'text-orange-700' : 'text-emerald-700';
    const bgColor = isCritical ? 'bg-red-50' : isHigh ? 'bg-orange-50' : 'bg-emerald-50';
    const borderColor = isCritical ? 'border-red-500' : isHigh ? 'border-orange-500' : 'border-emerald-500';
    const iconColor = isCritical ? 'text-red-600' : isHigh ? 'text-orange-600' : 'text-emerald-600';

    return (
        <div className={clsx(
            "w-full rounded-2xl p-6 md:p-8 border-l-8 shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition-all",
            bgColor,
            borderColor
        )}>
            {/* Left Side: Diagnosis Info (70%) */}
            <div className="flex-1 min-w-0"> {/* min-w-0 ensures text wrapping works in flex child */}
                <div className="flex items-center gap-2 mb-3">
                    {isCritical || isHigh ? (
                        <AlertTriangle className={clsx("w-6 h-6", iconColor)} />
                    ) : (
                        <CheckCircle className={clsx("w-6 h-6", iconColor)} />
                    )}
                    <span className={clsx("text-sm font-bold uppercase tracking-wider", themeColor)}>
                        Hasil Analisa AI
                    </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-2 break-words">
                    {diagnosis}
                </h1>

                <p className="text-slate-700 text-lg leading-relaxed max-w-2xl">
                    Berdasarkan pola gejala klinis yang terdeteksi dan analisis riwayat medis.
                </p>
            </div>

            {/* Right Side: Confidence Score (30%) */}
            <div className="w-full md:w-64 bg-white/60 rounded-xl p-6 backdrop-blur-sm border border-white/50 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Tingkat Keyakinan
                </span>
                <span className={clsx("text-6xl font-black tracking-tighter", themeColor)}>
                    {confidence}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium mt-1 bg-white/80 px-2 py-1 rounded-full">
                    Akurasi Tinggi
                </span>
            </div>
        </div>
    );
};

export default DiagnosisHeaderCard;
