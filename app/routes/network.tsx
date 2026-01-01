import React, { useState, useEffect } from 'react';
import { NetworkScene } from "../components/network/NetworkScene";
import { ActivityPane } from "../components/network/ActivityPane";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Shield, Award, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import {
    subscribeToUsers,
    subscribeToRequests,
    saveRequestToFirestore,
    saveUserToFirestore
} from "~/services/firebaseService";
import { fetchCurrentUser } from "../mocks/services";

export default function NetworkPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current user once
        async function loadMe() {
            const meRes = await fetchCurrentUser();

            // Check if user is authenticated
            if (!meRes.success || !meRes.user) {
                // No user logged in, redirect to login
                navigate('/auth/login');
                return;
            }

            setCurrentUser(meRes.user);
            setLoading(false);
        }
        loadMe();

        // Subscribe to live data
        const unsubscribeUsers = subscribeToUsers((data) => {
            setUsers(data);
        });

        const unsubscribeRequests = subscribeToRequests((data) => {
            setRequests(data);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeRequests();
        };
    }, [navigate]);

    const handleUserClick = (user: any) => {
        setSelectedUser(user);
    };

    const handleRespondToRequest = async (req: any) => {
        if (!currentUser) return;

        const updatedReq = { ...req, status: 'connected', supporterId: currentUser.id };
        await saveRequestToFirestore(updatedReq);
    };

    const handleCancelRequest = async (reqId: string) => {
        // In a real app we'd update status to 'cancelled' or delete
        // For now, let's just keep it simple
    };

    const handleCreateRequest = async (data: any) => {
        if (!currentUser) return;
        const newReq = {
            id: `req-${Date.now()}`,
            askerId: currentUser.id,
            status: 'open',
            createdAt: new Date().toISOString(),
            ...data,
            budget: Number(data.budget)
        };
        await saveRequestToFirestore(newReq);
    };

    return (
        <div className="w-full h-screen bg-[#050510] overflow-hidden relative font-sans">
            {/* Header / Nav */}
            <div className="absolute top-0 left-0 w-full z-20 px-4 py-4 sm:px-8 sm:py-8 flex justify-between items-start pointer-events-none">
                <button
                    onClick={() => navigate("/home")}
                    className="pointer-events-auto flex items-center gap-2 sm:gap-3 text-white/50 hover:text-white transition-colors bg-[#1a1a2e] px-3 py-2 sm:px-4 rounded-[10px] border border-white/5 shadow-md group"
                >
                    <ArrowLeft size={16} className="sm:w-[18px]" />
                    <span className="font-bold text-[10px] sm:text-xs tracking-tight uppercase">Home</span>
                </button>
                <div className="text-right pointer-events-auto bg-[#1a1a2e] p-2 sm:p-3 rounded-[10px] border border-white/5 shadow-sm">
                    <h1 className="text-[10px] sm:text-sm font-black text-white tracking-widest leading-none mb-1 uppercase">Live Network</h1>
                    <p className="text-[7px] sm:text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Kampala Central</p>
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
                <div className="w-full h-full flex gap-4 p-4">
                    {/* Left Activity Pane */}
                    <div className="w-80 hidden lg:block">
                        <ActivityPane />
                    </div>

                    {/* Main Network Scene */}
                    <div className="flex-1">
                        <NetworkScene
                            users={users}
                            requests={requests}
                            onUserClick={handleUserClick}
                            selectedUserId={selectedUser?.id}
                            currentUserId={currentUser?.id}
                            onUserClose={() => setSelectedUser(null)}
                            onRespondToRequest={handleRespondToRequest}
                            onCancelRequest={handleCancelRequest}
                            onPostRequest={handleCreateRequest}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
