import React, { useState } from 'react';
import { GroupChatMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Send } from 'lucide-react';

interface GroupChatProps {
  groupId: string;
  messages: GroupChatMessage[];
  onSendMessage: (text: string) => void;
  onReportMessage: (msgId: string) => void;
}

export const GroupChat: React.FC<GroupChatProps> = ({
  groupId,
  messages = [],
  onSendMessage,
  onReportMessage,
}) => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[380px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length > 0 ? (
          messages.map((msg) => {
            if (msg.isSystem) {
              return (
                <div key={msg.id} className="text-center py-1">
                  <span className="px-3 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-full border border-slate-300">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isMine = user ? msg.senderId === user.id : false;

            return (
              <div
                key={msg.id}
                className={`flex gap-2 text-xs ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                {!isMine && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {msg.senderName.charAt(0)}
                  </div>
                )}

                <div className={`max-w-[75%] space-y-1 ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="font-extrabold text-[10px] text-slate-500">
                      {isMine ? 'You' : msg.senderName}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl ${
                      isMine
                        ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none font-medium'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs italic">
            No group messages yet. Introduce yourself and coordinate your store visit!
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          placeholder="Write a message to group members..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3 py-2 text-xs bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
