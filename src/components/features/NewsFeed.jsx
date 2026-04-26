import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';

const newsData = [
    {
        id: 1,
        title: "Terobosan Baru: Vaksin TB M72/AS01E Masuk Fase 3",
        source: "WHO News",
        time: "2 Jam yang lalu",
        image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Vaksin+TB",
        category: "Riset"
    },
    {
        id: 2,
        title: "Waspada Lonjakan Kasus ISPA di Jabodetabek Akibat Polusi",
        source: "Kemenkes RI",
        time: "4 Jam yang lalu",
        image: "https://placehold.co/600x600/f1f5f9/334155?text=Polusi+Udara",
        category: "Public Health"
    },
    {
        id: 3,
        title: "Studi: Pengaruh Vape Terhadap Paru-paru Remaja",
        source: "Jurnal Respirologi",
        time: "1 Hari yang lalu",
        image: "https://placehold.co/600x350/cbd5e1/0f172a?text=Vape+Study",
        category: "Lifestyle"
    },
    {
        id: 4,
        title: "Teknologi AI dalam Deteksi Dini Kanker Paru",
        source: "Tech Health",
        time: "2 Hari yang lalu",
        image: "https://placehold.co/600x500/94a3b8/ffffff?text=AI+Health",
        category: "Teknologi"
    },
    {
        id: 5,
        title: "Panduan Baru Penanganan Asma pada Anak",
        source: "IDAI",
        time: "3 Hari yang lalu",
        image: "https://placehold.co/600x400/64748b/ffffff?text=Asma+Anak",
        category: "Pediatri"
    }
];

const NewsFeed = () => {
    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {newsData.map((item) => (
                <div key={item.id} className="break-inside-avoid bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="relative">
                        <img src={item.image} alt={item.title} className="w-full object-cover" />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold text-slate-900 rounded-full">
                            {item.category}
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center text-xs text-slate-400 mb-3">
                            <span className="font-medium text-blue-600">{item.source}</span>
                            <span className="mx-2">•</span>
                            <Clock className="w-3 h-3 mr-1" />
                            {item.time}
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-blue-600 transition-colors">
                            {item.title}
                        </h3>
                        <div className="mt-4 flex items-center text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                            Baca Selengkapnya
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NewsFeed;
