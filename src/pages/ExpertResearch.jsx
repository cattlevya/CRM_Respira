import React, { useState, useEffect } from 'react';
import { Brain, Search, Check, X, FileText, Loader2, Sparkles, ArrowRight, GitMerge, Send, Clock, AlertCircle } from 'lucide-react';
import LogicManager from '../components/expert/LogicManager';
import { decisionTree } from '../data/decisionTree';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ExpertResearch = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('research'); // 'research' | 'logic' | 'history'
    const [loading, setLoading] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [submittedDrafts, setSubmittedDrafts] = useState([]);
    const [loadingSubmitted, setLoadingSubmitted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            loadSubmittedDrafts();
        }
    }, [user]);

    const loadSubmittedDrafts = async () => {
        setLoadingSubmitted(true);
        try {
            const res = await api.getResearchDrafts(user.id, user.role);
            if (res.success) {
                setSubmittedDrafts(res.drafts || []);
            }
        } catch (err) {
            console.error("Load submitted drafts error:", err);
        } finally {
            setLoadingSubmitted(false);
        }
    };

    const handleAutoResearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/expert/research`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'auto' }), // Signal for auto-research
            });
            const data = await res.json();
            if (data.success) {
                // Expecting an array of drafts
                setDrafts(prev => [...data.data, ...prev]);
            } else {
                setError(data.message || 'Gagal melakukan riset.');
            }
        } catch (err) {
            console.error(err);
            setError('Terjadi kesalahan koneksi.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitDraft = async (draft, index) => {
        try {
            const res = await api.submitResearchDraft(draft, draft.source_journal || 'Analisis AI General');
            if (res.success) {
                alert('Usulan riset AI berhasil diajukan ke admin untuk persetujuan!');
                setDrafts(prev => prev.filter((_, i) => i !== index));
                loadSubmittedDrafts();
            } else {
                alert(res.message || 'Gagal mengajukan usulan riset.');
            }
        } catch (err) {
            alert('Gagal mengirimkan usulan riset ke server.');
        }
    };

    const handleReject = (index) => {
        if (window.confirm('Hapus draft riset ini?')) {
            setDrafts(prev => prev.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto overflow-x-hidden">
            {/* Header */}
            <div className="text-center space-y-3 py-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-1">
                    <Brain className="w-7 h-7 text-blue-600" />
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 px-4">Expert Knowledge Center</h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base px-4">
                    Pusat kendali pengetahuan medis AI. Kelola logika diagnosis secara manual atau gunakan AI untuk riset otomatis.
                </p>
            </div>

            {/* TABS */}
            <div className="flex justify-center">
                <div className="bg-slate-100 p-1 rounded-xl flex w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('research')}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'research' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Riset AI
                    </button>
                    <button
                        onClick={() => setActiveTab('logic')}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'logic' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Logic Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Riwayat Usulan ({submittedDrafts.length})
                    </button>
                </div>
            </div>

            {activeTab === 'research' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Auto-Research Trigger */}
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={handleAutoResearch}
                            disabled={loading}
                            className="group relative overflow-hidden w-full md:w-auto min-h-[52px] px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12 -translate-x-full"></div>
                            <div className="flex items-center justify-center space-x-2 text-sm md:text-base font-semibold">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                                        <span>AI Sedang Memindai Jurnal...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 shrink-0" />
                                        <span>MULAI RISET OTOMATIS</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center border border-red-100 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Drafts List */}
                    <div className="space-y-4">
                        {drafts.length > 0 && (
                            <div className="flex items-center space-x-2 text-slate-800 font-bold text-base">
                                <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                                <h2>Hasil Temuan AI ({drafts.length})</h2>
                            </div>
                        )}

                        {drafts.map((draft, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
                                {/* Draft header */}
                                <div className="p-4 md:p-6">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${draft.type === 'symptom' ? 'bg-teal-50 text-teal-600' : 'bg-cyan-50 text-cyan-600'}`}>
                                            {draft.type === 'symptom' ? <GitMerge className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="font-bold text-slate-900 text-sm leading-tight break-words w-full">{draft.name || 'Temuan Baru'}</h3>
                                                <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider ${draft.type === 'symptom' ? 'bg-teal-50 text-teal-700' : 'bg-cyan-50 text-cyan-700'}`}>
                                                    {draft.type === 'symptom' ? 'Gejala Baru' : 'Aturan Logika'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2 break-words">Sumber: {draft.source_journal || 'Analisis AI General'}</p>
                                        </div>
                                    </div>

                                    {/* Action buttons — full width on mobile */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleReject(index)}
                                            className="flex-1 md:flex-none h-10 min-h-[44px] px-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-rose-600 font-medium transition-colors flex items-center justify-center text-sm"
                                        >
                                            <X className="w-4 h-4 mr-1" /> Abaikan
                                        </button>
                                        <button
                                            onClick={() => handleSubmitDraft(draft, index)}
                                            className="flex-1 md:flex-none h-10 min-h-[44px] px-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium transition-colors flex items-center justify-center shadow-sm text-sm gap-1.5"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>Ajukan Persetujuan Admin</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Detail section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-slate-100">
                                    <div className="p-4 md:p-5">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bukti Klinis</h4>
                                        <p className="text-xs md:text-sm text-slate-700 leading-relaxed break-words">{draft.clinical_evidence}</p>
                                    </div>
                                    <div className="p-4 md:p-5 border-t md:border-t-0 md:border-l border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Usulan Implementasi</h4>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <p className="text-xs md:text-sm text-slate-800 font-medium mb-2 break-words">{draft.suggested_action}</p>
                                            {draft.proposed_node && (
                                                <div className="text-[10px] font-mono text-slate-600 whitespace-pre-wrap break-all overflow-hidden">
                                                    {JSON.stringify(draft.proposed_node, null, 2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'logic' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <LogicManager initialTree={decisionTree} />
                </div>
            )}

            {activeTab === 'history' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold text-base">
                        <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                        <h2>Riwayat Usulan Riset Anda ({submittedDrafts.length})</h2>
                    </div>

                    {loadingSubmitted ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                        </div>
                    ) : submittedDrafts.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                            <h3 className="text-slate-700 font-bold text-sm">Belum Ada Usulan</h3>
                            <p className="text-slate-500 text-xs">Jalankan Riset AI lalu ajukan usulan untuk persetujuan admin.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {submittedDrafts.map((d) => {
                                const content = typeof d.content === 'string' ? JSON.parse(d.content) : d.content;
                                return (
                                    <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${content?.type === 'symptom' ? 'bg-teal-50 text-teal-600' : 'bg-cyan-50 text-cyan-600'}`}>
                                                    {content?.type === 'symptom' ? <GitMerge className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{content?.name || 'Temuan Baru'}</h3>
                                                    <p className="text-xs text-slate-500 mt-1">Sumber: {d.source_journal || 'Jurnal Terkait'}</p>
                                                    <span className="text-[10px] text-slate-400">Diajukan pada: {new Date(d.created_at).toLocaleString('id-ID')}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize tracking-wide inline-flex items-center gap-1.5 ${
                                                    d.status === 'approved' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                                                    d.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                                    'bg-slate-100 text-slate-700 border border-slate-200'
                                                }`}>
                                                    {d.status === 'approved' && <Check className="w-3.5 h-3.5" />}
                                                    {d.status === 'rejected' && <X className="w-3.5 h-3.5" />}
                                                    {d.status === 'pending' && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                                                    {d.status === 'approved' ? 'Disetujui' : d.status === 'rejected' ? 'Ditolak' : 'Menunggu Persetujuan'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-slate-100 bg-slate-50/50">
                                            <div className="p-4">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bukti Klinis</h4>
                                                <p className="text-xs text-slate-700 leading-relaxed">{content?.clinical_evidence}</p>
                                            </div>
                                            <div className="p-4 border-t md:border-t-0 md:border-l border-slate-100">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Implementasi</h4>
                                                <p className="text-xs text-slate-700 font-medium">{content?.suggested_action}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExpertResearch;

