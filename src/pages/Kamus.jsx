import React, { useState } from 'react';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const dictionaryData = [
    { term: 'Asma', definition: 'Kondisi kronis di mana saluran udara menyempit dan membengkak serta menghasilkan lendir berlebih.' },
    { term: 'Bronkitis', definition: 'Peradangan pada lapisan saluran bronkial Anda, yang membawa udara ke dan dari paru-paru Anda.' },
    { term: 'PPOK (Penyakit Paru Obstruktif Kronis)', definition: 'Penyakit radang paru-paru kronis yang menyebabkan aliran udara terhambat dari paru-paru.' },
    { term: 'Pneumonia', definition: 'Infeksi yang mengobarkan kantung udara di salah satu atau kedua paru-paru.' },
    { term: 'Tuberkulosis (TBC)', definition: 'Penyakit menular serius yang terutama menyerang paru-paru Anda.' },
    { term: 'Emfisema', definition: 'Kondisi paru-paru yang menyebabkan sesak napas; kantung udara di paru-paru (alveoli) rusak.' },
    { term: 'Dispnea', definition: 'Istilah medis untuk sesak napas.' },
    { term: 'Sputum', definition: 'Campuran air liur dan lendir yang batuk dari saluran pernapasan.' },
    { term: 'Wheezing (Mengi)', definition: 'Suara siulan bernada tinggi yang dibuat saat bernapas.' },
    { term: 'Sianosis', definition: 'Warna kebiruan pada kulit atau selaput lendir karena oksigen yang tidak mencukupi dalam darah.' },
    { term: 'Hipoksia', definition: 'Kondisi di mana tubuh atau bagian tubuh kekurangan oksigen yang cukup di tingkat jaringan.' },
    { term: 'Spirometri', definition: 'Tes umum yang digunakan untuk menilai seberapa baik paru-paru Anda bekerja dengan mengukur berapa banyak udara yang Anda hirup.' }
];

const Kamus = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTerms = dictionaryData.filter(item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg shadow-blue-200">
                <div className="flex items-center mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Kamus Kesehatan</h1>
                        <p className="text-blue-100">Ensiklopedia istilah medis pernapasan</p>
                    </div>
                </div>

                <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-3.5 text-blue-200 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari istilah (misal: Asma, Wheezing)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all backdrop-blur-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTerms.length > 0 ? (
                    filteredTerms.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
                        >
                            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                                {item.term}
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {item.definition}
                            </p>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">Istilah tidak ditemukan</h3>
                        <p className="text-slate-500">Coba kata kunci lain.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Kamus;
