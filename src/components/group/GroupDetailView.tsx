import React, { useState } from 'react';
import { Group } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { useExperience } from '../../context/ExperienceContext';
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Building,
  Bell,
  Lock,
  Unlock,
  LogOut,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { GroupChat } from './GroupChat';
import { InformStoreModal } from './InformStoreModal';

interface GroupDetailViewProps {
  group: Group;
  onBack: () => void;
}

export const GroupDetailView: React.FC<GroupDetailViewProps> = ({ group, onBack }) => {
  const { closeGroup, reopenGroup, leaveGroup, chatMessages, sendChatMessage, sendInformStore } = usePlatform();
  const { user } = useAuth();
  const { theme } = useExperience();

  const [isInformModalOpen, setIsInformModalOpen] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const isCreator = user?.id === group.creatorId || user?.id === group.creatorUid;
  const isMember = group.members.some((m) => m.userId === user?.id);
  const isClosed = group.status === 'CLOSED' || group.closed || group.completed;

  const messages = chatMessages[group.id] || [];

  const handleConfirmClose = () => {
    if (!user) return;
    closeGroup(group.id, user.id);
    setShowCloseConfirm(false);
  };

  const handleReopen = () => {
    if (!user) return;
    reopenGroup(group.id, user.id);
  };

  const handleLeaveGroup = () => {
    if (!user) return;
    leaveGroup(group.id, user.id);
    onBack();
  };

  return (
    <div className="bg-white min-h-screen py-6 max-w-full">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Offers</span>
          </button>

          <div className="flex items-center gap-2">
            {isClosed ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Group Status: Complete</span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-extrabold rounded-full flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>Group Status: Open</span>
              </span>
            )}
          </div>
        </div>

        {/* Group Header Card */}
        <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white rounded">
                {group.brandName || 'Brand Store'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {group.productName}
              </h1>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5 font-medium">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{group.storeName} • {group.offerTitle}</span>
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2">
              {isMember && !isClosed && (
                <button
                  onClick={() => setIsInformModalOpen(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notify Store</span>
                </button>
              )}

              {isCreator && !isClosed && (
                <button
                  onClick={() => setShowCloseConfirm(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Close Group</span>
                </button>
              )}

              {isCreator && isClosed && (
                <button
                  onClick={handleReopen}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Reopen Group</span>
                </button>
              )}

              {isMember && !isCreator && (
                <button
                  onClick={handleLeaveGroup}
                  className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit Group</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal for Closing Group */}
        {showCloseConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-base font-bold text-slate-900">Close & Complete Group?</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Closing this group will lock it so no new members can join. Status will change to <strong>Complete</strong>. Are you sure?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClose}
                  className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  Yes, Close Group
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Group Members List */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-500" />
            <span>Group Members ({group.members.length} / {group.maxCapacity || 10})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {group.members.map((member) => (
              <div
                key={member.userId}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5"
              >
                {member.userAvatar ? (
                  <img
                    src={member.userAvatar}
                    alt={member.userName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {member.userName.charAt(0)}
                  </div>
                )}
                <div className="truncate text-xs">
                  <p className="font-bold text-slate-900 truncate">{member.userName}</p>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">
                    {member.role === 'creator' ? 'Creator' : 'Member'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Real-Time Chat System */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Group Chat (Members Only)
            </span>
          </div>

          <GroupChat
            groupId={group.id}
            messages={messages}
            onSendMessage={(text) => sendChatMessage(group.id, user?.id || 'usr', user?.name || 'User', text)}
            onReportMessage={() => {}}
          />
        </div>

        {/* Inform Store Modal */}
        <InformStoreModal
          isOpen={isInformModalOpen}
          onClose={() => setIsInformModalOpen(false)}
          group={group}
          onSubmit={(plannedDate, plannedTime, groupSize, message) => {
            sendInformStore(
              group.id,
              plannedDate,
              plannedTime,
              groupSize,
              message,
              user?.id || 'usr',
              user?.name || 'User'
            );
            setIsInformModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};
