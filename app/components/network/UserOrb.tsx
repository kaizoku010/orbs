import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Star, Shield, X, History, TrendingUp, ArrowLeft } from "lucide-react";

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
    isMe = false
}: UserOrbProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const [hovered, setHovered] = useState(false);
    const [activePane, setActivePane] = useState<'profile' | 'history'>('profile');

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
        if (!selected) setActivePane('profile');
    }, [selected]);

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
                                count={positions.length / 3}
                                array={positions}
                                itemSize={3}
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
                </group>
            </Float>

            {/* Label */}
            <Html
                position={[0, 1.6, 0]}
                center
                distanceFactor={20}
            >
                <div className="pointer-events-none select-none transition-all duration-300">
                    <span className={`px-2.5 py-1 rounded-[10px] ${isMe ? 'bg-white text-black ring-2 ring-black' : 'bg-black/80 text-white'} text-[11px] font-bold whitespace-nowrap border border-white/5 shadow-sm`}>
                        {isMe ? 'YOU' : user.name}
                    </span>
                </div>
            </Html>

            {selected && (
                <group position={[0, 0, 0]}>
                    <Html center position={[0, 0, 0]} zIndexRange={[100, 0]}>
                        <div className="w-[340px] bg-white p-6 rounded-[10px] shadow-lg border border-slate-100 animate-in fade-in zoom-in duration-300 pointer-events-auto select-none">
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
                                        <button className="flex-1 py-3.5 bg-charcoal text-white rounded-[10px] font-bold text-sm hover:bg-black transition-all transform active:scale-95 shadow-md">
                                            Connect Now
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActivePane('history'); }}
                                            className="px-4 py-3.5 bg-slate-50 text-slate-600 rounded-[10px] font-bold hover:bg-slate-100 transition-all flex items-center justify-center border border-slate-100 shadow-sm"
                                        >
                                            <History size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
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
                            )}
                        </div>
                    </Html>
                </group>
            )}
        </group>
    );
}
