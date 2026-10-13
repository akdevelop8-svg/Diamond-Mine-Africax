import React from 'react';
import { X, Bell, CheckCheck, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../hooks/useStore.ts';
import { store } from '../services/store.ts';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { currentUser, notifications } = useStore();

  if (!isOpen || !currentUser) return null;

  const userNotifs = notifications
    .filter((n) => n.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleMarkAllRead = () => {
    store.markAllNotificationsRead(currentUser.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-display font-bold text-sm text-slate-900">
              Notification Center
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="p-1.5 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold rounded-md hover:bg-blue-50 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden xs:inline">Read All</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 text-xs">
          {userNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No notifications yet.</p>
            </div>
          ) : (
            userNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => store.markNotificationRead(n.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-blue-50/60 border-blue-200 text-slate-900 font-medium shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display font-bold text-slate-900 text-xs">
                    {n.title}
                  </h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {n.message}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                  {n.relatedRequestId && (
                    <span className="font-mono text-blue-600 font-semibold">
                      #{n.relatedRequestId}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
