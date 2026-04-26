import React from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, Clock as ClockIcon, XCircle, Plus } from 'lucide-react';
import { Card, Badge, Button, cn } from '../ui/Widgets';

const ConsultationCard = ({ appointment, onBookNew, onCancel }) => {
    if (!appointment) {
        return (
            <Card className="h-full p-6 flex flex-col items-center justify-center text-center bg-white border-slate-100 shadow-sm rounded-3xl">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-slate-800 font-bold text-lg">Belum Ada Jadwal</h3>
                <p className="text-slate-500 text-sm mt-2 mb-6">Jadwalkan konsultasi dengan dokter spesialis kami.</p>
                <Button onClick={onBookNew} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-6">
                    Buat Janji Baru
                </Button>
            </Card>
        );
    }

    const { requested_date, status, doctor_name, doctor_title, doctor_institution } = appointment;
    // Handle both Date objects and strings (from dateStrings: true)
    const dateStrSafe = typeof requested_date === 'string' ? requested_date.replace(' ', 'T') : requested_date;
    const dateObj = new Date(dateStrSafe);
    const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const timeStr = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });



    return (
        <Card className="h-full bg-white border-slate-100 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden flex flex-col relative group p-6">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Clock size={100} className="text-teal-500" />
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jadwal Mendatang</span>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-100 shadow-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onBookNew();
                    }}
                    title="Buat Janji Baru"
                >
                    <Plus size={14} />
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center relative z-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">{dateStr}</h2>
                        <div className="flex items-center text-slate-500 font-medium mt-1">
                            <Clock size={16} className="mr-2 text-teal-500" />
                            {timeStr} WIB
                        </div>
                    </div>

                    {status === 'pending' && (
                        <div className="px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg text-[10px] font-bold text-amber-700 flex items-center shadow-sm">
                            <ClockIcon size={12} className="mr-1.5" />
                            Menunggu Konfirmasi
                        </div>
                    )}
                </div>

                {/* Doctor Info */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                        <User size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">{doctor_name || 'Dokter Spesialis'}</h4>
                        <p className="text-xs text-slate-500">{doctor_title || 'Sp.P'}</p>
                        <div className="flex items-center text-[10px] text-slate-400 mt-1">
                            <MapPin size={10} className="mr-1" />
                            {doctor_institution || 'RS Umum'}
                        </div>
                    </div>
                </div>

                {/* Actions */}

            </div>
        </Card>
    );
};

export default ConsultationCard;
