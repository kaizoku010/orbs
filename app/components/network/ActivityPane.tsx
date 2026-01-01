import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { fetchAllActivities } from '~/mocks/services/activityService';
import type { Activity } from '~/mocks/data/activities';

interface ActivityPaneProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function ActivityPane({
  autoRefresh = true,
  refreshInterval = 2000
}: ActivityPaneProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      const response = await fetchAllActivities();
      if (response.success && response.activities) {
        setActivities(response.activities);
      }
      setLoading(false);
    };

    loadActivities();

    if (!autoRefresh) return;

    const interval = setInterval(loadActivities, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getActivityEmoji = (type: Activity['type']) => {
    switch (type) {
      case 'confirmation': return '✅';
      case 'completion': return '🎉';
      case 'badge_unlocked': return '🏆';
      case 'rating_received': return '⭐';
      case 'connected': return '🔗';
      case 'open': return '📍';
      default: return '•';
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'confirmation': return 'text-green-600';
      case 'completion': return 'text-purple-600';
      case 'badge_unlocked': return 'text-yellow-600';
      case 'rating_received': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 sticky top-0 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-black text-charcoal uppercase tracking-widest">
            Live Activity
          </h2>
          <button
            onClick={() => {
              setLoading(true);
              fetchAllActivities().then(response => {
                if (response.success && response.activities) {
                  setActivities(response.activities);
                }
                setLoading(false);
              });
            }}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {activities.length > 0 ? `Showing ${activities.length} events` : 'No events yet'}
        </p>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading && activities.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-sm">No activity yet</p>
            <p className="text-xs mt-2 opacity-60">Events will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activities.map((activity, idx) => (
              <div
                key={activity.id || idx}
                className="p-4 hover:bg-slate-50 transition-colors animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex items-start gap-3">
                  {/* Emoji Icon */}
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {getActivityEmoji(activity.type)}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-tight mb-1">
                      {formatTime(activity.timestamp)}
                    </p>
                    <p className={`text-sm font-bold leading-snug break-words ${getActivityColor(activity.type)}`}>
                      {activity.message}
                    </p>

                    {/* Rating display */}
                    {activity.rating && (
                      <div className="mt-2 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={i < activity.rating! ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {activities.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-center">
          {autoRefresh ? 'Auto-updating every 2s' : 'Manual updates'}
        </div>
      )}
    </div>
  );
}
