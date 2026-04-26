import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText, Send } from 'lucide-react';
import { Button } from '../ui/Widgets';
import { api } from '../../services/api';

const ConsultationRequestModal = ({ isOpen, onClose, userId, history, onSuccess }) => {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.bookConsultation({
                userId,
                diagnosisId: selectedDiagnosis,
                date,
                notes
            });
            if (res.success) {
                onSuccess();
                onClose();
            } else {
                alert('Gagal mengajukan konsultasi');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 text-lg">Ajukan Konsultasi</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Hasil Diagnosa</label>
                            <select
                                required
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedDiagnosis}
                                onChange={(e) => setSelectedDiagnosis(e.target.value)}
                            >
                                <option value="">-- Pilih Riwayat --</option>
                                {history.map(log => (
                                    <option key={log.id} value={log.id}>
                                        {new Date(log.created_at).toLocaleDateString('id-ID')} - {log.final_result}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Yang Diajukan</label>
                            <input
                                type="date"
                                required
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Catatan / Keluhan</label>
                            <textarea
                                required
                                rows="3"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Jelaskan keluhan Anda..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg shadow-blue-500/20"
                            >
                                {loading ? 'Mengirim...' : 'Kirim Permintaan'}
                                {!loading && <Send size={16} className="ml-2" />}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConsultationRequestModal;
