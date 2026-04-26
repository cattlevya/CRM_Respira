import React from 'react';
import { AlertTriangle, CheckCircle, Activity, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const ResultHeader = ({ diagnosis, severity, confidence }) => {
    const getColorScheme = () => {
        switch (severity) {
            case 'critical':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-100',
                    text: 'text-red-700',
                    badge: 'bg-red-100 text-red-700 border-red-200',
                    icon: <AlertTriangle className="w-12 h-12 text-red-600" />
                };
            case 'high':
                return {
                    bg: 'bg-orange-50',
                    border: 'border-orange-100',
                    text: 'text-orange-700',
                    badge: 'bg-orange-100 text-orange-700 border-orange-200',
                    icon: <AlertTriangle className="w-12 h-12 text-orange-600" />
                };
            default:
                return {
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-100',
                    text: 'text-emerald-700',
                    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    icon: <CheckCircle className="w-12 h-12 text-emerald-600" />
                };
        }
    };

    const colors = getColorScheme();

    return (
        <div className={clsx("rounded-2xl border p-6 md:p-8 mb-6", colors.bg, colors.border)}>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className={clsx("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-3", colors.badge)}>
                        {severity === 'critical' ? 'Gawat Darurat' : severity === 'high' ? 'Perlu Perhatian' : 'Kondisi Stabil'}
                    </div>
                    <h2 className={clsx("text-3xl md:text-4xl font-bold mb-2", colors.text)}>
                        {diagnosis}
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Berdasarkan analisis gejala klinis dan pola pernapasan.
                    </p>
                </div>
                <div className="hidden md:block bg-white p-3 rounded-full shadow-sm">
                    {colors.icon}
                </div>
            </div>

            {/* AI Confidence Bar */}
            <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center text-slate-700 font-medium">
                        <Activity className="w-4 h-4 mr-2 text-blue-600" />
                        Tingkat Keyakinan AI
                    </div>
                    <span className="text-2xl font-bold text-slate-800">{confidence}%</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={clsx("h-full rounded-full transition-all duration-1000 ease-out",
                            severity === 'critical' ? 'bg-red-500' : severity === 'high' ? 'bg-orange-500' : 'bg-emerald-500'
                        )}
                        style={{ width: `${confidence}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResultHeader;
