import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, ChevronRight, Activity, Clock } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui/Widgets';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (user?.id) {
                const result = await api.getHistory(user.id);
                if (result.success) {
                    setHistory(result.data);
                }
            }
            setLoading(false);
        };
        fetchHistory();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="max-w-4xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <FileText className="text-teal-600" />
                        Riwayat Diagnosa
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Arsip lengkap hasil pemeriksaan kesehatan paru-paru Anda.
                    </p>
                </header>

                {history.length > 0 ? (
                    <div className="space-y-4">
                        {history.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="p-6 hover:shadow-md transition-shadow group">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant={item.confidence_score > 70 ? 'warning' : 'success'} className="text-xs">
                                                    {item.confidence_score > 70 ? 'Perlu Perhatian' : 'Kondisi Baik'}
                                                </Badge>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                                                {item.final_result}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Skor Kepercayaan Sistem: {item.confidence_score}%
                                            </p>
                                        </div>

                                        {/* Optional: Add a 'View Detail' button if we store full details later */}
                                        {/* <Button variant="ghost" className="text-slate-400 hover:text-teal-600">
                                            Detail <ChevronRight size={16} className="ml-1" />
                                        </Button> */}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                            <Activity size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Riwayat</h3>
                        <p className="text-slate-500 mb-8 max-w-md">
                            Anda belum melakukan pemeriksaan kesehatan. Lakukan diagnosa sekarang untuk mengetahui kondisi paru-paru Anda.
                        </p>
                        <Button
                            onClick={() => navigate('/diagnosa')}
                            className="bg-teal-600 hover:bg-teal-700 text-white border-none px-8"
                        >
                            Mulai Diagnosa Baru
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default History;
