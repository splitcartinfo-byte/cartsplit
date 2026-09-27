import React, { useState } from 'react';
import { Group } from '../../types';
import { useExperience } from '../../context/ExperienceContext';
import { Store, Calendar, Clock, Users, Send, X } from 'lucide-react';

interface InformStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  onSubmit: (plannedDate: string, plannedTime: string, groupSize: number, message: string) => void;
}

export const InformStoreModal: React.FC<InformStoreModalProps> = ({
  isOpen,
  onClose,
  group,
  onSubmit,
}) => {
  const { theme } = useExperience();

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('17:30');
  const [size, setSize] = useState(group.members.length);
  const [message, setMessage] = useState('We are planning to visit your store together for this offer.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(date, time, size, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">Inform Store of Visit</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Recipient Store</p>
            <p className="font-extrabold text-slate-900 text-sm">{group.storeName}</p>
            <p className="text-slate-600">Offer: {group.offerTitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Planned Visit Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Approx Visit Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-600" /> Expected Group Size
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Custom Message for Store</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Please keep medium sizes ready..."
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 resize-none font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
            <span>SEND VISIT NOTIFICATION TO STORE</span>
          </button>
        </form>
      </div>
    </div>
  );
};
