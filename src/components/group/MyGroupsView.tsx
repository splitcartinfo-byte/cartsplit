import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { Group } from '../../types';
import {
  Users,
  ArrowLeft,
  MessageSquare,
  Building,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface MyGroupsViewProps {
  onBack: () => void;
  onSelectGroup: (group: Group) => void;
  onOpenAuth: () => void;
}

export const MyGroupsView: React.FC<MyGroupsViewProps> = ({
  onBack,
  onSelectGroup,
  onOpenAuth,
}) => {
  const { groups } = usePlatform();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'joined' | 'created'>('joined');

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-white min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <Users className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Sign in to view your shopping groups</h2>
          <p className="text-xs text-slate-500">
            Track joined and created shopping groups, chat with members, and coordinate store visits.
          </p>
          <button
            onClick={onOpenAuth}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  // Filter joined vs created groups
  const joinedGroups = groups.filter((g) =>
    g.members.some((m) => m.userId === user.id)
  );

  const createdGroups = groups.filter(
    (g) => g.creatorId === user.id || g.creatorUid === user.id
  );

  const displayedGroups = activeTab === 'joined' ? joinedGroups : createdGroups;

  return (
    <div className="bg-white min-h-screen py-6 max-w-full">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <h1 className="text-lg sm:text-xl font-black text-slate-900">My Shopping Groups</h1>
        </div>

        {/* TABS: Joined | Created */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'joined' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Joined Groups ({joinedGroups.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('created')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'created' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Created Groups ({createdGroups.length})</span>
          </button>
        </div>

        {/* GROUPS LIST */}
        {displayedGroups.length > 0 ? (
          <div className="space-y-3">
            {displayedGroups.map((group) => {
              const isClosed = group.status === 'CLOSED' || group.closed || group.completed;
              return (
                <div
                  key={group.id}
                  onClick={() => onSelectGroup(group)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={group.productImage}
                      alt={group.productName}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{group.productName}</span>
                        {isClosed ? (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded">
                            Complete
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-900 rounded">
                            Open
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Store: {group.storeName} • {group.offerTitle}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{group.members.length} Members</span>
                        <span>•</span>
                        <span>Creator: {group.creatorName || 'You'}</span>
                      </p>
                    </div>
                  </div>

                  <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all self-end sm:self-center">
                    Open Chat & Status →
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
            No groups found in {activeTab} tab. Browse offers to create or join a group!
          </div>
        )}
      </div>
    </div>
  );
};
