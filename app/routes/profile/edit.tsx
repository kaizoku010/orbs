import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchCurrentUser } from "~/mocks/services";

export default function EditProfile() {
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
      <h1 className="text-3xl font-bold text-kizuna-green mb-6">Edit Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter your email"
              />
            </div>
          </form>
        </div>

        {/* Avatar Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Avatar</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="avatar">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter avatar URL"
              />
            </div>
            <div className="flex items-center gap-4">
              <img
                src="https://via.placeholder.com/100"
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full border"
              />
              <button className="bg-kizuna-green text-white px-4 py-2 rounded">
                Upload
              </button>
            </div>
          </form>
        </div>

        {/* Skills Section */}
        <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <form>
            <textarea
              id="skills"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="List your skills"
              rows={4}
            ></textarea>
            <button className="bg-kizuna-green text-white px-4 py-2 rounded mt-4">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}