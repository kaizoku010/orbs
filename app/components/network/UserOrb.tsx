import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Star, Shield, X, History, TrendingUp, ArrowLeft, PlusCircle, Check, Sparkles, AlertCircle } from "lucide-react";
import { NETWORK_CATEGORIES } from '~/constants/categories';

interface UserOrbProps {
    position: [number, number, number];
    status: 'available' | 'delivering' | 'offline';
    user: any;
    onClick: (user: any) => void;
    selected?: boolean;
    onClose?: () => void;
    history?: any;
    orbColor?: string;
    isMe?: boolean;
    hideLabels?: boolean;
    hideInfo?: boolean;
    hasRequest?: boolean;
    activeRequests?: any[];
    onRespondToRequest?: (request: any) => void;
    currentUserId?: string;
    chatTargetUser?: any;
}

export function UserOrb({
    position,
    status,
    user,
    onClick,
    selected,
    onClose,
    history,
    orbColor = '#ffffff',
    isMe = false,
    hideLabels = false,
    hideInfo = false,
    hasRequest = false,
    activeRequests = [],
    onRespondToRequest,
    currentUserId,
    chatTargetUser
}: UserOrbProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const [hovered, setHovered] = useState(false);
    
    // Timer state for enroute requests
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    
    // Cooldown state
    const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
    const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);

    // Pre-calculate stable particle positions
    const particleCount = isMe ? 600 : 300;
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const radius = 0.5;
        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;

            const r = radius * (0.9 + Math.random() * 0.2);
            pos[i * 3] = r * Math.cos(theta) * Math.sin(phi);
            pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, [particleCount]);
    // Timer effect for enroute requests
    useEffect(() => {
        // Find active enroute requests for this user
        const activeRequest = activeRequests?.find(
            r => (r.supporterId === user.id || r.askerId === user.id) && r.status === 'enroute' && r.startedAt && r.estimatedDuration
        );

        if (!activeRequest?.startedAt || !activeRequest?.estimatedDuration) {
            setRemainingTime(0);
            setProgress(0);
            return;
        }

        const interval = setInterval(() => {
            const startTime = new Date(activeRequest.startedAt).getTime();
            const duration = activeRequest.estimatedDuration * 60 * 1000; // Convert to milliseconds
            const endTime = startTime + duration;
            const now = Date.now();
            const remaining = Math.max(0, endTime - now);

            setRemainingTime(remaining);
            setProgress((duration - remaining) / duration * 100);

            // Auto-complete when timer reaches 0
            if (remaining <= 0) {
                clearInterval(interval);
                // Mark as fulfilled (would call update service here)
                console.log('Request auto-completed');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [user.id, activeRequests]);

    // Cooldown effect
    useEffect(() => {
        if (!user.cooldownExpiry) {
            setIsOnCooldown(false);
            setCooldownRemaining(0);
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const expiry = new Date(user.cooldownExpiry!).getTime();
            const remaining = Math.max(0, expiry - now);

            setCooldownRemaining(remaining);
            setIsOnCooldown(remaining > 0);

            if (remaining <= 0) {
                clearInterval(interval);
                setIsOnCooldown(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [user.cooldownExpiry]);

    useFrame((state) => {
        if (pointsRef.current) {
            const time = state.clock.elapsedTime;

            // Pulsing & Scale
            const baseScale = selected ? 2.2 : (isMe ? 1.8 : 1.0);
            const hoverScale = hovered ? 1.15 : 1;
            const organicPulse = 1 + Math.sin(time * (isMe ? 3 : 1.5)) * 0.05;

            const targetScale = baseScale * hoverScale * organicPulse;
            pointsRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            // Rotation
            pointsRef.current.rotation.y += (isMe ? 0.01 : 0.005);
            pointsRef.current.rotation.z += 0.002;
        }
    });

    return (
        <group position={position}>
            <Float
                speed={1.5}
                rotationIntensity={isMe ? 1.5 : 0.5}
                floatIntensity={0.5}
            >
                <group
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(user);
                    }}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    {/* Native points for maximum stability across devices */}
                    <points ref={pointsRef}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                args={[positions, 3]}
                            />
                        </bufferGeometry>
                        <pointsMaterial
                            size={isMe ? 0.05 : 0.03}
                            color={orbColor}
                            transparent
                            opacity={status === 'offline' ? 0.3 : 0.8}
                            blending={THREE.AdditiveBlending}
                            sizeAttenuation={true}
                            depthWrite={false}
                        />
                    </points>

                    {/* Interaction box */}
                    <mesh visible={false}>
                        <sphereGeometry args={[0.7, 16, 16]} />
                        <meshBasicMaterial transparent opacity={0} />
                    </mesh>

                    {/* Active Request Pulse / Ring */}
                    {hasRequest && (
                        <mesh rotation={[-Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[0.8, 0.9, 32]} />
                            <meshBasicMaterial
                                color={orbColor}
                                transparent
                                opacity={0.4 + Math.sin(Date.now() * 0.005) * 0.2}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                    )}
                </group>
            </Float>

            {/* Label */}
            {!selected && !hideLabels && (
                <Html
                    position={[0, 1.4, 0]}
                    center
                    distanceFactor={40}
                    zIndexRange={[50, 0]}
                >
                    <div className="select-none transition-all duration-300 font-sans flex flex-col items-center gap-0.5 pointer-events-none">
                        {hasRequest && !isMe && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPendingPane('requests');
                                    onClick(user);
                                }}
                                className="bg-kizuna-green text-white text-[8px] font-black px-2 py-0.5 rounded-[4px] uppercase tracking-[0.15em] animate-pulse shadow-lg mb-1 pointer-events-auto cursor-pointer hover:scale-110 transition-transform active:scale-95"
                            >
                                Active Request
                            </div>
                        )}
                        <span className={`px-1.5 py-0.5 rounded-[6px] ${isMe ? 'bg-white/40 text-black/60' : 'bg-black/40 text-white/50'} text-[6px] font-bold whitespace-nowrap border border-white/5 backdrop-blur-[2px] uppercase tracking-[0.1em]`}>
                            {isMe ? 'YOU' : user.name}
                        </span>
                    </div>
                </Html>
            )}

            {selected && !hideInfo && (
                <group position={[0, 0, 0]}>
                    <Html center position={[0, 0, 0]} zIndexRange={[200, 100]}>
                        <div className="w-[calc(100vw-40px)] max-w-[380px] max-h-[80vh] bg-white p-5 sm:p-6 rounded-[10px] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300 pointer-events-auto select-none font-sans overflow-y-auto">
                            {/* Close Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                                className="sticky top-0 absolute top-4 right-4 text-charcoal/20 hover:text-charcoal transition-colors p-2 z-10"
                            >
                                <X size={20} />
                            </button>

                            {/* User Header */}
                            <div className="flex items-center gap-4 mb-5 pr-8">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-[10px] overflow-hidden border border-slate-100">
                                        <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                    </div>
                                    {user.verified && (
                                        <div className="absolute -top-1 -right-1 bg-kizuna-green p-1 rounded-full text-white shadow-sm">
                                            <Shield size={12} fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl text-charcoal tracking-tight leading-tight">{user.name}</h3>
                                    <div className="flex items-center gap-1.5 text-yellow-500 mt-1">
                                        <Star size={14} fill="currentColor" />
                                        <span className="text-sm font-bold text-charcoal">{user.rating || 0}</span>
                                        <span className="text-charcoal/30 text-[10px] font-bold uppercase ml-1">
                                            {user.totalConnections || 0} Deals
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-charcoal/60 mb-5 leading-relaxed">
                                {user.bio || "A valued member of the community."}
                            </p>

                            {/* Timer & Progress for Enroute Requests */}
                            {remainingTime > 0 && (
                                <div className="mb-5 p-4 bg-kizuna-green/10 rounded-[10px] border border-kizuna-green/20">
                                    <p className="text-xs font-bold text-kizuna-green uppercase tracking-wider mb-3">Request In Progress</p>
                                    
                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
                                        <div
                                            className="bg-kizuna-green h-full transition-all duration-300 rounded-full"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>

                                    {/* Timer Display */}
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-kizuna-green">
                                            {Math.floor(remainingTime / 60000)}:{String(Math.floor((remainingTime % 60000) / 1000)).padStart(2, '0')}
                                        </p>
                                        <p className="text-xs text-charcoal/60 mt-1">remaining</p>
                                    </div>
                                </div>
                            )}

                            {/* Cooldown Display */}
                            {isOnCooldown && (
                                <div className="mb-5 p-4 bg-orange-100 rounded-[10px] border border-orange-300">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle size={14} className="text-orange-700" />
                                        <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">On Cooldown</p>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="w-full bg-orange-200 rounded-full h-2 mb-3 overflow-hidden">
                                        <div
                                            className="bg-orange-500 h-full transition-all duration-300 rounded-full"
                                            style={{ width: `${100 - (cooldownRemaining / (30 * 60 * 1000)) * 100}%` }}
                                        />
                                    </div>

                                    {/* Cooldown Timer */}
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-orange-700">
                                            {Math.floor(cooldownRemaining / 60000)}:{String(Math.floor((cooldownRemaining % 60000) / 1000)).padStart(2, '0')}
                                        </p>
                                        <p className="text-xs text-orange-600 mt-1">until ready</p>
                                    </div>
                                </div>
                            )}

                            {/* History Section */}
                            <div className="mb-5 pb-5 border-b border-slate-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <History size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Network History</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-[8px] border border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Shared Deals</span>
                                        <span className="text-slate-900 font-bold">{history?.deliveries || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-[8px] border border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Trust Score</span>
                                        <div className="flex items-center gap-1.5 bg-kizuna-green text-white p-1 px-2.5 rounded-[6px]">
                                            <TrendingUp size={12} />
                                            <span className="font-bold text-[10px]">{history?.trust || "0%"}</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-100">
                                        <div className="text-[10px] text-slate-600 mb-2 uppercase font-bold tracking-widest">Private Review</div>
                                        <div className="flex gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={12} fill={s <= (history?.lastRating || 0) ? "#eab308" : "none"} className={s <= (history?.lastRating || 0) ? "text-yellow-500" : "text-slate-200"} />
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed italic">
                                            "{history?.lastReview || "No prior history with this member."}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Active Requests Section */}
                            {activeRequests.length > 0 && (
                                <div className="mb-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <PlusCircle size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Active Requests ({activeRequests.length})</span>
                                    </div>

                                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                        {activeRequests.map((req: any) => {
                                            const cat = NETWORK_CATEGORIES.find(c => c.id === req.categoryId);
                                            const isOwnRequest = currentUserId && req.askerId === currentUserId;
                                            const isChatting = chatTargetUser?.id === req.askerId; // Only show confirm if chatting with requester
                                            
                                            return (
                                                <div key={req.id} className="p-3 bg-slate-50 rounded-[8px] border border-slate-100 hover:border-kizuna-green/30 transition-all">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0" style={{ color: cat?.color }}>
                                                                {cat?.icon || <Sparkles size={12} />}
                                                            </div>
                                                            <h4 className="font-bold text-xs text-charcoal tracking-tight line-clamp-1">{req.title}</h4>
                                                        </div>
                                                        <span className="text-[9px] font-black text-kizuna-green uppercase ml-2 flex-shrink-0">UGX {req.budget.toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-[9px] text-slate-500 line-clamp-2 leading-relaxed mb-2">{req.description}</p>
                                                    {!isOwnRequest && isChatting && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onRespondToRequest?.(req);
                                                            }}
                                                            className="w-full py-1.5 bg-kizuna-green text-white rounded-[5px] font-bold text-[9px] uppercase tracking-widest hover:bg-kizuna-green-dark transition-all"
                                                        >
                                                            Respond to Request
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Html>
                </group>
            )}
        </group>
    );
}
