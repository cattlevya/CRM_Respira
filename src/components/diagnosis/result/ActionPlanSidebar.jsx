import React from 'react';
import { Stethoscope, Pill, Calendar, ArrowRight, Download, MapPin } from 'lucide-react';
import { Card } from '../../ui/Widgets';

const ActionPlanSidebar = ({ severity }) => {
    const isCritical = severity === 'critical';

    return (
        <div className="space-y-6">
            {/* Treatment Plan */}
            <Card className="p-6 border border-slate-200 shadow-sm h-full">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center">
                    <Stethoscope className="w-5 h-5 text-teal-600 mr-2" />
                    Rencana Perawatan
                </h3>

                <ul className="space-y-4">
                    <li className="flex items-start group">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 mr-3 group-hover:bg-teal-100 transition-colors">
                            <span className="font-bold text-sm">1</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">Konsultasi Dokter</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {isCritical
                                    ? "Segera temui dokter spesialis paru atau kunjungi IGD terdekat."
                                    : "Jadwalkan pemeriksaan dengan dokter umum dalam 3 hari ke depan."}
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start group">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 mr-3 group-hover:bg-teal-100 transition-colors">
                            <span className="font-bold text-sm">2</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">Pemeriksaan Lanjutan</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Kemungkinan diperlukan Rontgen Thorax atau Spirometri untuk konfirmasi.
                            </p>
                        </div>
                    </li>
                </ul>
            </Card>




            {/* Quick Actions */}
            <Card className="p-6 border border-slate-200 shadow-sm bg-slate-50">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                    Aksi Cepat
                </h3>
                <div className="space-y-3">
                    <button className="w-full py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center text-sm">
                        <Download className="w-4 h-4 mr-2 text-slate-500" />
                        Unduh PDF Hasil
                    </button>
                    <button className="w-full py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        Faskes Terdekat
                    </button>
                </div>
            </Card>
        </div >
    );
};

export default ActionPlanSidebar;
