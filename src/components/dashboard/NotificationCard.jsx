import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, Button, cn, Badge } from '../ui/Widgets';

const NotificationCard = ({ message, onReply }) => {
    return (
        <Card className="h-full p-6 bg-white border-slate-100 shadow-sm rounded-3xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pesan Masuk</h3>
                {message?.unreadCount > 0 && <Badge variant="danger" className="rounded-full px-2">{message.unreadCount}</Badge>}
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {message ? (
                    <div
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={onReply}
                    >
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageSquare size={18} />
                        </div>
                        <div className="overflow-hidden text-left">
                            <p className="text-sm font-bold text-slate-800 truncate">{message.sender_name || 'Admin'}</p>
                            <p className="text-xs text-slate-500 truncate">{message.content || 'Isi pesan...'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 py-2">
                        <MessageSquare size={24} className="mb-2 opacity-20" />
                        <p className="text-xs">Tidak ada pesan baru.</p>
                    </div>
                )}
            </div>

            <Button onClick={onReply} variant="outline" className="w-full text-xs rounded-xl border-slate-200 mt-4">
                {message ? 'Balas Pesan' : 'Mulai Chat'}
            </Button>
        </Card>
    );
};

export default NotificationCard;
