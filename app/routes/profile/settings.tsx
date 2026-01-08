import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "~/mocks/services";

export default function ProfileSettings() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const userRes = await fetchCurrentUser();
      if (!userRes.success || !userRes.user) {
        navigate('/auth/login');
      }
    }
    checkAuth();
  }, [navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-kizuna-green mb-6">Profile Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="notifications">
                Notification Preferences
              </label>
              <select
                id="notifications"
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="all">All Notifications</option>
                <option value="important">Only Important</option>
                <option value="none">None</option>
              </select>
            </div>
          </form>
        </div>

        {/* Privacy Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="privacy">
                Privacy Settings
              </label>
              <select
                id="privacy"
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </form>
        </div>

        {/* Account Section */}
        <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Change Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter new password"
              />
            </div>
            <button className="bg-kizuna-green text-white px-4 py-2 rounded">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}