import React, { useState, useEffect } from 'react';
import { NetworkScene } from "../components/network/NetworkScene";
import { fetchAllUsers, fetchAllRequests, fetchCurrentUser } from "../mocks/services";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Shield, Award, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function NetworkPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadData() {
            try {
                const [uRes, rRes, meRes] = await Promise.all([
                    fetchAllUsers(),
                    fetchAllRequests(),
                    fetchCurrentUser()
                ]);
                if (uRes.success && uRes.users) setUsers(uRes.users);
                if (rRes.success && rRes.requests) setRequests(rRes.requests);
                if (meRes.success) setCurrentUser(meRes.user);
            } catch (error) {
                console.error("Failed to load network data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleUserClick = (user: any) => {
        setSelectedUser(user);
    };

    return (
        <div className="w-full h-screen bg-[#050510] overflow-hidden relative">
            {/* Header / Nav */}
            <div className="absolute top-0 left-0 w-full z-20 px-8 py-8 flex justify-between items-start pointer-events-none">
                <button
                    onClick={() => navigate("/home")}
                    className="pointer-events-auto flex items-center gap-3 text-white/50 hover:text-white transition-colors bg-[#1a1a2e] px-4 py-2 rounded-[10px] border border-white/5 shadow-md"
                >
                    <ArrowLeft size={18} />
                    <span className="font-bold text-xs tracking-tight uppercase">Back to Home</span>
                </button>
                <div className="text-right pointer-events-auto bg-[#1a1a2e] p-3 rounded-[10px] border border-white/5 shadow-sm">
                    <h1 className="text-sm font-black text-white tracking-widest leading-none mb-1 uppercase">Live Network</h1>
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Kampala Central Node</p>
                </div>
            </div>

            {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-kizuna-green/20 border-t-kizuna-green rounded-full animate-spin" />
                        <span className="text-white/40 text-sm font-medium tracking-widest uppercase">Initializing Network...</span>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full">
                    <NetworkScene
                        users={users}
                        requests={requests}
                        onUserClick={handleUserClick}
                        selectedUserId={selectedUser?.id}
                        currentUserId={currentUser?.id}
                        onUserClose={() => setSelectedUser(null)}
                    />


                </div>
            )}
        </div>
    );
}
