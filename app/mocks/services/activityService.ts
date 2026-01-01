// Activity Service - Manages the community activity log
import { realisticDelay } from '../delays';
import { activities, type Activity, type ActivityType } from '../data/activities';

export interface ActivityResponse {
  success: boolean;
  activities?: Activity[];
  error?: string;
}

/**
 * Get all activities (latest first)
 */
export async function fetchAllActivities(): Promise<ActivityResponse> {
  await realisticDelay();
  const sorted = [...activities].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return { success: true, activities: sorted.slice(0, 50) };
}

/**
 * Get activities for a specific user
 */
export async function fetchUserActivities(userId: string): Promise<ActivityResponse> {
  await realisticDelay();
  const userActivities = activities.filter(
    a => a.userId === userId || a.targetUserId === userId
  );
  const sorted = [...userActivities].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return { success: true, activities: sorted };
}

/**
 * Log a new activity
 */
export async function logActivity(activity: Omit<Activity, 'id'>): Promise<ActivityResponse> {
  await realisticDelay();
  
  const newActivity: Activity = {
    id: `activity-${Date.now()}`,
    ...activity,
    timestamp: activity.timestamp || new Date().toISOString()
  };

  activities.unshift(newActivity);
  
  // Keep only last 50 activities
  if (activities.length > 50) {
    activities.pop();
  }

  return { success: true, activities: [newActivity] };
}

/**
 * Get activities by type
 */
export async function fetchActivitiesByType(type: ActivityType): Promise<ActivityResponse> {
  await realisticDelay();
  const filtered = activities.filter(a => a.type === type);
  const sorted = [...filtered].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return { success: true, activities: sorted };
}

/**
 * Get recent activity (from last N minutes)
 */
export async function fetchRecentActivities(minutesAgo: number = 60): Promise<ActivityResponse> {
  await realisticDelay();
  const cutoff = Date.now() - minutesAgo * 60 * 1000;
  const recent = activities.filter(a => new Date(a.timestamp).getTime() > cutoff);
  const sorted = [...recent].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return { success: true, activities: sorted };
}
