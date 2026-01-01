import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Star, Shield, X, History, TrendingUp, ArrowLeft, PlusCircle, Check, Sparkles } from "lucide-react";
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
    onRespondToRequest
}: UserOrbProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const [hovered, setHovered] = useState(false);
    const [activePane, setActivePane] = useState<'profile' | 'history' | 'requests'>('profile');
    const [pendingPane, setPendingPane] = useState<'profile' | 'history' | 'requests' | null>(null);

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

    React.useEffect(() => {
        if (selected) {
            if (pendingPane) {
                setActivePane(pendingPane);
                setPendingPane(null);
            }
        } else {
            setActivePane('profile');
            setPendingPane(null);
        }
    }, [selected, pendingPane]);

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
                        <div className="w-[calc(100vw-40px)] max-w-[340px] bg-white p-5 sm:p-6 rounded-[10px] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300 pointer-events-auto select-none font-sans">
                            {activePane === 'profile' ? (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                                        className="absolute top-4 right-4 text-charcoal/20 hover:text-charcoal transition-colors p-2"
                                    >
                                        <X size={20} />
                                    </button>

                                    <div className="flex items-center gap-4 mb-5">
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
                                        <div>
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

                                    <p className="text-sm text-charcoal/60 mb-6 leading-relaxed">
                                        {user.bio || "A valued member of the community."}
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActivePane('requests'); }}
                                            className="flex-1 py-3.5 bg-kizuna-green text-white rounded-[10px] font-bold text-sm hover:bg-kizuna-green-dark transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2"
                                        >
                                            {activeRequests.length > 0 && (
                                                <span className="bg-white text-kizuna-green text-[10px] px-1.5 rounded-full font-black">
                                                    {activeRequests.length}
                                                </span>
                                            )}
                                            View Requests
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActivePane('history'); }}
                                            className="px-4 py-3.5 bg-slate-50 text-slate-600 rounded-[10px] font-bold hover:bg-slate-100 transition-all flex items-center justify-center border border-slate-100 shadow-sm"
                                        >
                                            <History size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : activePane === 'history' ? (
                                <div className="text-white bg-slate-900 -m-6 p-6 rounded-[10px] border border-white/5">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                                        className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors p-2"
                                    >
                                        <X size={20} />
                                    </button>

                                    <div className="flex items-center gap-2 mb-6 opacity-40">
                                        <History size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Network History</span>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-[10px] border border-white/5">
                                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Shared Deals</span>
                                            <span className="text-white font-bold text-lg">{history?.deliveries || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-[10px] border border-white/5">
                                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Trust Score</span>
                                            <div className="flex items-center gap-1.5 bg-kizuna-green p-1 px-3 rounded-[10px]">
                                                <TrendingUp size={12} className="text-white" />
                                                <span className="text-white font-bold text-[10px]">{history?.trust || "0%"}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white/5 rounded-[10px] border border-white/5">
                                            <div className="text-[10px] text-white/20 mb-2 uppercase font-bold tracking-widest">Private Review</div>
                                            <div className="flex gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={12} fill={s <= (history?.lastRating || 0) ? "#eab308" : "none"} className={s <= (history?.lastRating || 0) ? "text-yellow-500" : "text-white/5"} />
                                                ))}
                                            </div>
                                            <p className="text-xs text-white/50 leading-relaxed italic">
                                                "{history?.lastReview || "No prior history with this member."}"
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActivePane('profile'); }}
                                        className="w-full py-3.5 bg-white/10 text-white rounded-[10px] font-bold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10"
                                    >
                                        <ArrowLeft size={16} />
                                        Back to Profile
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                                        className="absolute top-4 right-4 text-charcoal/20 hover:text-charcoal transition-colors p-2"
                                    >
                                        <X size={20} />
                                    </button>

                                    <div className="flex items-center gap-2 mb-6 text-slate-400">
                                        <PlusCircle size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Active Requests</span>
                                    </div>

                                    {activeRequests.length > 0 ? (
                                        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                                            {activeRequests.map((req: any) => {
                                                const cat = NETWORK_CATEGORIES.find(c => c.id === req.categoryId);
                                                return (
                                                    <div key={req.id} className="p-4 bg-slate-50 rounded-[10px] border border-slate-100 hover:border-kizuna-green/30 transition-all">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm" style={{ color: cat?.color }}>
                                                                    {cat?.icon || <Sparkles size={14} />}
                                                                </div>
                                                                <h4 className="font-bold text-xs text-charcoal tracking-tight">{req.title}</h4>
                                                            </div>
                                                            <span className="text-[10px] font-black text-kizuna-green uppercase">UGX {req.budget.toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-3">{req.description}</p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onRespondToRequest?.(req);
                                                            }}
                                                            className="w-full py-2 bg-kizuna-green text-white rounded-[6px] font-bold text-[10px] uppercase tracking-widest hover:bg-kizuna-green-dark transition-all"
                                                        >
                                                            Respond to Request
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-12 flex flex-col items-center text-center space-y-3">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                <PlusCircle size={24} />
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-8">No active help requests from this member.</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActivePane('profile'); }}
                                        className="w-full py-3.5 bg-slate-100 text-charcoal rounded-[10px] font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft size={16} />
                                        Back to Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </Html>
                </group>
            )}
        </group>
    );
}
