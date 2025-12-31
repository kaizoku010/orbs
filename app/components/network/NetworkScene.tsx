import React, { useState, useMemo, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, ContactShadows } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Plus, Minus, Maximize, ArrowLeft } from 'lucide-react';
import { UserOrb } from './UserOrb';
import { ConnectionLine } from './ConnectionLine';

interface NetworkSceneProps {
    users: any[];
    requests: any[];
    onUserClick: (user: any) => void;
    selectedUserId?: string | null;
    currentUserId?: string | null;
    onUserClose?: () => void;
}

const ORB_COLORS = [
    '#ffffff', // White
    '#f472b6', // Pink
    '#60a5fa', // Blue
    '#4ade80', // Green
    '#fbbf24', // Amber
    '#a78bfa', // Violet
    '#22d3ee', // Cyan
    '#f87171', // Red
];

function CameraHandler({ targetPosition, zoomFactor, isResetting, onResetComplete }: { targetPosition: [number, number, number] | null, zoomFactor: number, isResetting?: boolean, onResetComplete?: () => void }) {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);
    const targetVec = useMemo(() => new THREE.Vector3(), []);
    // Closer zoom-in position for "Me" at [0,0,0]
    const initialCamPos = useMemo(() => new THREE.Vector3(0, 8, 12), []);

    useFrame(() => {
        if (!controlsRef.current) return;

        if (isResetting) {
            // Smoothly return to home
            camera.position.lerp(initialCamPos, 0.08);
            controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.08);

            // Check if we are close enough to stop "resetting"
            if (camera.position.distanceTo(initialCamPos) < 0.5) {
                onResetComplete?.();
            }
        } else if (targetPosition) {
            targetVec.set(...targetPosition);
            controlsRef.current.target.lerp(targetVec, 0.1);

            const zoomOffset = new THREE.Vector3(0, 4, 6).multiplyScalar(zoomFactor);
            const targetCamPos = targetVec.clone().add(zoomOffset);
            camera.position.lerp(targetCamPos, 0.05);
        } else if (zoomFactor !== 1) {
            // Manual zoom when no target is selected
            const targetDist = 100 * zoomFactor; // Base distance 100 for wider default
            const currentDist = camera.position.length();
            if (Math.abs(currentDist - targetDist) > 0.5) {
                camera.position.normalize().multiplyScalar(THREE.MathUtils.lerp(currentDist, targetDist, 0.05));
            }
        }

        controlsRef.current.update();
    });

    return (
        <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={2}
            maxDistance={150}
            makeDefault
        />
    );
}

export function NetworkScene({ users, requests, onUserClick, selectedUserId, currentUserId, onUserClose }: NetworkSceneProps) {
    const center = { lat: 0.33, lng: 32.58 };
    const spreadScale = 1200; // Moderate spread for visibility

    const nodes = useMemo(() => {
        const seenPositions: Record<string, number> = {};

        return users.map((user, idx) => {
            const isMe = user.id === currentUserId;

            // If it's "Me", put at absolute center [0,0,0]
            if (isMe) {
                return {
                    id: user.id,
                    position: [0, 0, 0] as [number, number, number],
                    status: 'available' as const,
                    user,
                    orbColor: '#ffffff', // "Me" orb is always white/pure
                    isMe: true
                };
            }

            // Precise location with fallback for others
            let lat = user.location?.lat || center.lat;
            let lng = user.location?.lng || center.lng;

            // Handle overlaps
            const posKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
            if (seenPositions[posKey] !== undefined) {
                seenPositions[posKey]++;
                const angle = seenPositions[posKey] * Math.PI * 0.4;
                const radius = seenPositions[posKey] * 0.005;
                lat += Math.sin(angle) * radius;
                lng += Math.cos(angle) * radius;
            } else {
                seenPositions[posKey] = 0;
            }

            const x = (lng - center.lng) * spreadScale;
            const z = (lat - center.lat) * spreadScale;
            const y = 0;

            let status: 'available' | 'delivering' | 'offline' = 'available';
            const activeRequest = requests.find(r =>
                (r.supporterId === user.id || r.askerId === user.id) &&
                (r.status === 'accepted' || r.status === 'in_progress')
            );

            if (activeRequest) {
                status = 'delivering';
            } else if (user.totalConnections === 0 && !user.verified) {
                status = 'offline';
            }

            return {
                id: user.id || `u-${idx}`,
                position: [x, y, z] as [number, number, number],
                status,
                user,
                orbColor: ORB_COLORS[idx % ORB_COLORS.length],
                isMe: false
            };
        });
    }, [users, requests, currentUserId]);

    const selectedNode = useMemo(() =>
        nodes.find(n => n.id === selectedUserId),
        [nodes, selectedUserId]);

    const connections = useMemo(() => {
        const conns: any[] = [];
        requests.forEach(req => {
            const startNode = nodes.find(n => n.id === req.askerId);
            const endNode = nodes.find(n => n.id === req.supporterId);

            if (startNode && endNode) {
                const isMeConnection = startNode.id === currentUserId || endNode.id === currentUserId;
                conns.push({
                    id: req.id,
                    start: startNode.position,
                    end: endNode.position,
                    type: (req.status === 'accepted' || req.status === 'in-progress' || req.status === 'connected') ? 'active' : 'past',
                    isMeConnection
                });
            }
        });
        return conns;
    }, [requests, nodes]);

    const [zoomFactor, setZoomFactor] = useState(1);
    const [isResetting, setIsResetting] = useState(false);

    const handleZoomIn = () => setZoomFactor(prev => Math.max(0.2, prev - 0.2));
    const handleZoomOut = () => setZoomFactor(prev => Math.min(2, prev + 0.2));
    const handleResetZoom = () => {
        setZoomFactor(1);
        setIsResetting(true);
        onUserClose?.();
        setTimeout(() => setIsResetting(false), 1000);
    };

    return (
        <div className="w-full h-full min-h-[500px] bg-[#020208] relative rounded-[10px] overflow-hidden shadow-sm border border-white/5">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 40, 60]} fov={50} />
                <CameraHandler
                    targetPosition={selectedNode?.position || null}
                    zoomFactor={zoomFactor}
                    isResetting={isResetting}
                    onResetComplete={() => setIsResetting(false)}
                />

                <color attach="background" args={['#050510']} />
                <fog attach="fog" args={['#050510', 30, 100]} />

                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#4f46e5" />
                <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <Suspense fallback={null}>
                    <group>
                        {connections.map(conn => (
                            <ConnectionLine key={conn.id} {...conn} />
                        ))}

                        {nodes.map(node => (
                            <UserOrb
                                key={node.id}
                                position={node.position}
                                status={node.status}
                                user={node.user}
                                orbColor={node.orbColor}
                                onClick={onUserClick}
                                selected={selectedUserId === node.id}
                                isMe={node.isMe}
                                onClose={handleResetZoom}
                                history={{
                                    deliveries: Math.floor(Math.random() * 10) + (node.user.totalConnections || 5),
                                    trust: (Math.random() * 5 + 95).toFixed(1) + "%",
                                    lastRating: 5,
                                    lastReview: node.isMe ? "This is you!" : "Highly reliable supporter."
                                }}
                            />
                        ))}
                    </group>
                    <ContactShadows resolution={1024} scale={100} blur={2} opacity={0.3} far={20} color="#000000" />
                </Suspense>

                <EffectComposer>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1} radius={0.4} />
                </EffectComposer>
            </Canvas>

            {/* Bottom Left Version Tag */}
            <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
                <div className="bg-white/5 px-3 py-1.5 rounded-[10px] border border-white/5 text-white/30 text-[9px] font-bold tracking-widest uppercase">
                    Kampala Network v1.2
                </div>
            </div>

            {/* Right Side Zoom Controls */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 bg-[#1a1a2e] border border-white/10 rounded-[10px] flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95 shadow-lg"
                    title="Zoom In"
                >
                    <Plus size={20} />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 bg-[#1a1a2e] border border-white/10 rounded-[10px] flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95 shadow-lg"
                    title="Zoom Out"
                >
                    <Minus size={20} />
                </button>
                <button
                    onClick={handleResetZoom}
                    className="w-10 h-10 bg-[#1a1a2e] border border-white/10 rounded-[10px] flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95 shadow-lg mt-2"
                    title="Reset View"
                >
                    <Maximize size={18} />
                </button>
            </div>
        </div>
    );
}
