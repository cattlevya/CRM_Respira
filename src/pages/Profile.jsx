import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Phone, Calendar, Activity, Droplet, Ruler, Weight } from 'lucide-react';
import { Card, Button } from '../components/ui/Widgets';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        height: '',
        weight: '',
        blood_type: '',
        birth_date: '',
        emergency_contact: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (user?.id) {
                    const result = await api.getProfile(user.id);
                    if (result.success) {
                        // Format date for input
                        let dateStr = '';
                        try {
                            if (result.data.birth_date) {
                                const d = new Date(result.data.birth_date);
                                if (!isNaN(d.getTime())) {
                                    dateStr = d.toISOString().split('T')[0];
                                }
                            }
                        } catch (e) {
                            console.error("Date parsing error:", e);
                        }

                        setFormData({
                            ...result.data,
                            birth_date: dateStr
                        });
                    }
                }
            } catch (err) {
                console.error("Profile load error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        const result = await api.updateProfile(user.id, formData);
        if (result.success) {
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
        } else {
            setMessage({ type: 'error', text: 'Gagal memperbarui profil.' });
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Pengaturan Profil</h1>
                    <p className="text-slate-500">Kelola data pribadi dan informasi medis Anda untuk akurasi diagnosa.</p>
                </header>

                <Card className="p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Informasi Akun</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Medical Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Data Biologis</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tinggi Badan (cm)</label>
                                    <div className="relative">
                                        <Ruler className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            name="height"
                                            value={formData.height || ''}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                            placeholder="170"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Berat Badan (kg)</label>
                                    <div className="relative">
                                        <Weight className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight || ''}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                            placeholder="65"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Golongan Darah</label>
                                    <div className="relative">
                                        <Droplet className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                        <select
                                            name="blood_type"
                                            value={formData.blood_type || ''}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none appearance-none bg-white transition-all"
                                        >
                                            <option value="">Pilih...</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="AB">AB</option>
                                            <option value="O">O</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Kontak Darurat</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                        <input
                                            type="date"
                                            name="birth_date"
                                            value={formData.birth_date || ''}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon Darurat</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="emergency_contact"
                                            value={formData.emergency_contact || ''}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                            placeholder="0812..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        {message.text && (
                            <div className={`p-4 rounded-lg text-sm flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {message.type === 'success' ? <Activity className="w-4 h-4 mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
                                {message.text}
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white border-none px-8 py-3 rounded-xl shadow-lg shadow-teal-500/30">
                                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>

                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
