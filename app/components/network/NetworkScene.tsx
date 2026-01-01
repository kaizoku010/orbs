import React, { useState, useMemo, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, ContactShadows } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Plus, Minus, Maximize, ArrowLeft, MessageCircle, PlusCircle, History, X, Check, MapPin, AlertCircle, ChevronRight, Sparkles, Search, Filter, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserOrb } from './UserOrb';
import { ConnectionLine } from './ConnectionLine';
import { NETWORK_CATEGORIES } from '~/constants/categories';

interface NetworkSceneProps {
    users: any[];
    requests: any[];
    onUserClick: (user: any) => void;
    selectedUserId?: string | null;
    currentUserId?: string | null;
    onUserClose?: () => void;
    onRespondToRequest?: (req: any) => void;
    onCancelRequest?: (reqId: string) => void;
    onPostRequest?: (data: any) => void;
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

export function NetworkScene({ users, requests, onUserClick, selectedUserId, currentUserId, onUserClose, onRespondToRequest, onCancelRequest, onPostRequest }: NetworkSceneProps) {
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

            const hasRequest = requests.some(r => r.askerId === user.id && (r.status === 'open' || r.status === 'pending' || r.status === 'active'));

            return {
                id: user.id || `u-${idx}`,
                position: [x, y, z] as [number, number, number],
                status,
                user,
                orbColor: ORB_COLORS[idx % ORB_COLORS.length],
                isMe: false,
                hasRequest
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

    const [activeModal, setActiveModal] = useState<'chat' | 'request' | 'history' | 'browse' | null>(null);
    const [requestStep, setRequestStep] = useState(1);
    const [requestData, setRequestData] = useState({
        categoryId: '',
        title: '',
        description: '',
        budget: '',
        urgent: false
    });

    // Browse Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [browseCategory, setBrowseCategory] = useState('all');
    const [maxBudget, setMaxBudget] = useState<number | ''>('');

    const [historyTab, setHistoryTab] = useState<'marketplace' | 'log'>('marketplace');
    const [historyFilter, setHistoryFilter] = useState<'all' | 'mine'>('all');

    // Chat State
    const [chatMessages, setChatMessages] = useState<{ sender: string, text: string, time: string }[]>([]);
    const [chatTargetUser, setChatTargetUser] = useState<any>(null);

    const categories = NETWORK_CATEGORIES;

    const handleZoomIn = () => setZoomFactor(prev => Math.max(0.2, prev - 0.2));
    const handleZoomOut = () => setZoomFactor(prev => Math.min(2, prev + 0.2));
    const handleResetZoom = () => {
        setZoomFactor(1);
        setIsResetting(true);
        onUserClose?.();
        setTimeout(() => setIsResetting(false), 1000);
    };

    const handlePostRequest = () => {
        onPostRequest?.(requestData);
        setActiveModal(null);
        setRequestStep(1);
        setRequestData({ categoryId: '', title: '', description: '', budget: '', urgent: false });
    };

    const handleInternalRespond = (req: any) => {
        const asker = users.find(u => u.id === req.askerId);
        if (!asker) return;

        // 1. Notify parent to update state/colors
        onRespondToRequest?.(req);

        // 2. Setup Chat
        setChatTargetUser(asker);
        const autoMsg = {
            sender: 'me',
            text: `Hi ${asker.name}, I saw your request for "${req.title}". I am ready to provide and deliver what you need!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages([autoMsg]);
        setActiveModal('chat');
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
                                hideLabels={!!selectedUserId || !!activeModal}
                                hideInfo={!!activeModal}
                                hasRequest={node.hasRequest}
                                activeRequests={requests.filter(r => r.askerId === node.id && (r.status === 'open' || r.status === 'pending' || r.status === 'active'))}
                                onRespondToRequest={handleInternalRespond}
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

            {/* Left Side Status Pane */}
            <div className="absolute top-28 left-6 z-20 w-72 max-w-[85vw] font-sans">
                <div className="bg-[#1a1a2e]/80 backdrop-blur-lg rounded-[12px] border border-white/10 shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-kizuna-green animate-pulse" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Live Activity</h3>
                        </div>
                        <span className="text-[9px] font-bold text-white/30 truncate">Kampala Grid</span>
                    </div>

                    <div className="p-3 space-y-2 max-h-[450px] overflow-y-auto custom-scrollbar">
                        {requests.filter(r => r.status === 'open' || r.status === 'connected' || r.status === 'in-progress' || r.status === 'active').length === 0 ? (
                            <div className="py-8 text-center px-4">
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider">No active grid events</p>
                            </div>
                        ) : (
                            requests
                                .filter(r => r.status === 'open' || r.status === 'connected' || r.status === 'in-progress' || r.status === 'active')
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map(req => {
                                    const asker = users.find(u => u.id === req.askerId);
                                    const supporter = users.find(u => u.id === req.supporterId);
                                    const cat = categories.find(c => c.id === req.categoryId);

                                    const diff = Date.now() - new Date(req.createdAt).getTime();
                                    const mins = Math.floor(diff / 60000);
                                    const secs = Math.floor((diff % 60000) / 1000);
                                    const timeStr = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

                                    return (
                                        <div key={req.id} className="p-2.5 bg-white/5 border border-white/5 rounded-[10px] hover:bg-white/10 transition-all cursor-pointer group" onClick={() => onUserClick(asker)}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-[8px] overflow-hidden border border-white/10 shrink-0">
                                                        <img src={asker?.avatar} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-white uppercase truncate max-w-[100px] leading-tight mb-0.5">{req.title}</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[7px] font-black px-1 rounded-[2px] bg-white/10 text-white/40 uppercase tracking-tighter">
                                                                {cat?.name || 'Help'}
                                                            </span>
                                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-tighter truncate max-w-[60px]">{asker?.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <p className="text-[9px] font-black text-kizuna-green mb-0.5 whitespace-nowrap">UGX {req.budget.toLocaleString()}</p>
                                                    <div className="flex items-center gap-1">
                                                        <div className={`w-1 h-1 rounded-full ${req.status === 'open' ? 'bg-kizuna-green' : 'bg-blue-400'} animate-pulse`} />
                                                        <p className={`text-[7px] font-black uppercase tracking-widest leading-none ${req.status === 'open' ? 'text-kizuna-green' : 'text-blue-400'}`}>{req.status}</p>
                                                    </div>
                                                    <p className="text-[7px] font-bold text-white/20 mt-1 uppercase tracking-widest">{timeStr}</p>
                                                </div>
                                            </div>

                                            {supporter && (
                                                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-4 h-4 rounded-full overflow-hidden border border-white/10">
                                                            <img src={supporter.avatar} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <span className="text-[6.5px] font-bold text-white/60 uppercase">Responder: {supporter.name}</span>
                                                    </div>
                                                    <ArrowUpRight size={8} className="text-white/20 group-hover:text-white transition-colors" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Left Version Tag */}
            <div className="absolute bottom-6 left-6 z-10 pointer-events-none font-sans">
                <div className="bg-white/5 px-3 py-1.5 rounded-[10px] border border-white/5 text-white/30 text-[9px] font-bold tracking-widest uppercase">
                    Kampala Network v1.2
                </div>
            </div>

            {/* Right Side Zoom Controls */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 font-sans">
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

            {/* Bottom Actions Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 font-sans">
                <div className="bg-[#1a1a2e]/90 backdrop-blur-md p-1.5 rounded-[12px] border border-white/10 shadow-2xl flex items-center gap-1.5">
                    <button
                        onClick={() => setActiveModal('chat')}
                        className={`p-3 rounded-[8px] transition-all flex items-center gap-2 ${activeModal === 'chat' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        <MessageCircle size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Chat</span>
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-1" />

                    <button
                        onClick={() => setActiveModal('browse')}
                        className={`p-3 px-4 rounded-[8px] transition-all flex items-center gap-2.5 ${activeModal === 'browse' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="relative">
                            <Search size={20} />
                            {requests.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-kizuna-green text-white text-[8px] px-1 rounded-full min-w-[14px] h-[14px] flex items-center justify-center font-black border border-[#1a1a2e]">
                                    {requests.length}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Browse</span>
                    </button>

                    <button
                        onClick={() => setActiveModal('request')}
                        className={`p-3 px-5 rounded-[8px] transition-all flex items-center gap-2 bg-kizuna-green text-white hover:bg-kizuna-green-light shadow-lg shadow-kizuna-green/20 ${activeModal === 'request' ? 'ring-2 ring-white/50' : ''}`}
                    >
                        <PlusCircle size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Post</span>
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <button
                        onClick={() => setActiveModal('history')}
                        className={`p-3 rounded-[8px] transition-all flex items-center gap-2 ${activeModal === 'history' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        <History size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">History</span>
                    </button>
                </div>
            </div>

            {/* Modals Overlay */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setActiveModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full ${activeModal === 'browse' ? 'max-w-[850px]' : 'max-w-[500px]'} bg-white sm:rounded-[12px] rounded-t-[20px] shadow-2xl overflow-hidden font-sans border border-slate-100 transition-all duration-300 max-h-[90vh] flex flex-col`}
                        >
                            {/* Modal Header */}
                            <div className="border-b border-slate-100 flex flex-col">
                                <div className="p-5 flex justify-between items-center">
                                    <h3 className="font-bold text-sm uppercase tracking-widest text-charcoal flex items-center gap-2">
                                        {activeModal === 'request' ? (
                                            <><PlusCircle size={16} className="text-kizuna-green" /> Post New Request</>
                                        ) : activeModal === 'chat' ? (
                                            <><MessageCircle size={16} className="text-blue-500" /> Node Chat</>
                                        ) : activeModal === 'browse' ? (
                                            <><Search size={16} className="text-slate-400" /> Browse Network Requests</>
                                        ) : (
                                            <><History size={16} className="text-indigo-500" /> Network History</>
                                        )}
                                    </h3>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-charcoal transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                {activeModal === 'history' && (
                                    <div className="flex px-5 gap-6 border-t border-slate-50">
                                        <button
                                            onClick={() => setHistoryTab('marketplace')}
                                            className={`py-3 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all ${historyTab === 'marketplace' ? 'border-kizuna-green text-charcoal' : 'border-transparent text-slate-400 hover:text-charcoal'}`}
                                        >
                                            My Marketplace
                                        </button>
                                        <button
                                            onClick={() => setHistoryTab('log')}
                                            className={`py-3 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all ${historyTab === 'log' ? 'border-kizuna-green text-charcoal' : 'border-transparent text-slate-400 hover:text-charcoal'}`}
                                        >
                                            Trust Log
                                        </button>
                                    </div>
                                )}
                                {activeModal === 'history' && historyTab === 'marketplace' && (
                                    <div className="flex px-5 gap-4 bg-slate-50/50 border-t border-slate-100 py-2">
                                        <button
                                            onClick={() => setHistoryFilter('all')}
                                            className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all ${historyFilter === 'all' ? 'bg-charcoal text-white shadow-sm' : 'bg-white text-slate-400 border border-slate-100'}`}
                                        >
                                            All Activity
                                        </button>
                                        <button
                                            onClick={() => setHistoryFilter('mine')}
                                            className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all ${historyFilter === 'mine' ? 'bg-kizuna-green text-white shadow-sm' : 'bg-white text-slate-400 border border-slate-100'}`}
                                        >
                                            My Posts Only
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {activeModal === 'request' && (
                                    <div className="space-y-6">
                                        {requestStep === 1 && (
                                            <div className="space-y-4">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Step 1: Choose Category</div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {categories.map(cat => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => { setRequestData({ ...requestData, categoryId: cat.id }); setRequestStep(2); }}
                                                            className={`p-3 rounded-[10px] border transition-all text-left flex flex-col gap-2 ${requestData.categoryId === cat.id ? 'border-kizuna-green bg-kizuna-green/5' : 'border-slate-100 hover:border-slate-200'}`}
                                                        >
                                                            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white shadow-sm" style={{ color: cat.color }}>
                                                                {cat.icon}
                                                            </div>
                                                            <span className="font-bold text-[10px] text-charcoal uppercase tracking-tight">{cat.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {requestStep === 2 && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Step 2: Task Details</div>
                                                <input
                                                    type="text"
                                                    placeholder="Short Title (e.g. Delivery to Kololo)"
                                                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-[10px] text-sm focus:ring-2 focus:ring-kizuna-green/20 outline-none"
                                                    value={requestData.title}
                                                    onChange={(e) => setRequestData({ ...requestData, title: e.target.value })}
                                                />
                                                <textarea
                                                    placeholder="Description of what you need..."
                                                    rows={3}
                                                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-[10px] text-sm focus:ring-2 focus:ring-kizuna-green/20 outline-none resize-none"
                                                    value={requestData.description}
                                                    onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Budget (UGX)"
                                                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-[10px] text-sm focus:ring-2 focus:ring-kizuna-green/20 outline-none"
                                                    value={requestData.budget}
                                                    onChange={(e) => setRequestData({ ...requestData, budget: e.target.value })}
                                                />
                                                <button
                                                    onClick={() => setRequestStep(3)}
                                                    className="w-full py-4 bg-charcoal text-white rounded-[10px] font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
                                                >
                                                    Next Step
                                                </button>
                                            </div>
                                        )}

                                        {requestStep === 3 && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Step 3: Review & Post</div>
                                                <div className="bg-slate-50 p-4 rounded-[10px] border border-slate-100 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                                                        <span className="text-xs font-bold text-charcoal">{categories.find(c => c.id === requestData.categoryId)?.name}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Title</span>
                                                        <span className="text-xs font-bold text-charcoal">{requestData.title}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Offer Amount</span>
                                                        <span className="text-sm font-black text-kizuna-green">UGX {Number(requestData.budget).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setRequestStep(2)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-[10px] font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Back</button>
                                                    <button onClick={handlePostRequest} className="flex-[2] py-4 bg-kizuna-green text-white rounded-[10px] font-bold text-xs uppercase tracking-widest hover:bg-kizuna-green-dark transition-all flex items-center justify-center gap-2">
                                                        <Check size={16} /> Confirm Post
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeModal === 'chat' && (
                                    <div className="flex flex-col h-[450px]">
                                        {/* Chat Target Info */}
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 border-b border-slate-100">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm">
                                                <img src={chatTargetUser?.avatar} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-charcoal uppercase tracking-tight">{chatTargetUser?.name || 'Community Member'}</p>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-kizuna-green animate-pulse" />
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Active Now</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Messages Area */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
                                            {chatMessages.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                                    <MessageCircle size={32} className="mb-2" />
                                                    <p className="text-[10px] font-bold uppercase tracking-widest">No messages yet</p>
                                                </div>
                                            ) : (
                                                chatMessages.map((msg, i) => (
                                                    <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] p-3 rounded-[12px] shadow-sm ${msg.sender === 'me' ? 'bg-kizuna-green text-white rounded-tr-none' : 'bg-white text-charcoal border border-slate-100 rounded-tl-none'}`}>
                                                            <p className="text-xs leading-relaxed">{msg.text}</p>
                                                            <p className={`text-[8px] mt-1 font-bold uppercase opacity-60 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                                                {msg.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Input Area */}
                                        <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Type your message..."
                                                className="flex-1 bg-slate-50 border border-slate-100 rounded-[10px] px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-kizuna-green/20"
                                            />
                                            <button className="bg-charcoal text-white p-3 rounded-[10px] hover:bg-black transition-all">
                                                <ArrowUpRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeModal === 'browse' && (
                                    <div className="space-y-6">
                                        {/* Filters Bar */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <div className="flex-1 relative">
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search requests..."
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] text-sm outline-none focus:ring-1 focus:ring-slate-200"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <select
                                                className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] text-sm outline-none focus:ring-1 focus:ring-slate-200"
                                                value={browseCategory}
                                                onChange={(e) => setBrowseCategory(e.target.value)}
                                            >
                                                <option value="all">All Categories</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                            <input
                                                type="number"
                                                placeholder="Max Budget"
                                                className="w-full sm:w-32 px-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] text-sm outline-none focus:ring-1 focus:ring-slate-200"
                                                value={maxBudget}
                                                onChange={(e) => setMaxBudget(e.target.value === '' ? '' : Number(e.target.value))}
                                            />
                                        </div>

                                        {/* Request List */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                            {requests
                                                .filter(r => {
                                                    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                        r.description.toLowerCase().includes(searchQuery.toLowerCase());
                                                    const matchesCat = browseCategory === 'all' || r.categoryId === browseCategory;
                                                    const matchesBudget = maxBudget === '' || r.budget <= maxBudget;
                                                    return matchesSearch && matchesCat && matchesBudget;
                                                })
                                                .map(req => {
                                                    const asker = users.find(u => u.id === req.askerId);
                                                    const cat = categories.find(c => c.id === req.categoryId);
                                                    return (
                                                        <div key={req.id} className="p-4 bg-slate-50 border border-slate-100 rounded-[10px] hover:border-slate-200 transition-all flex flex-col gap-3 group">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center" style={{ color: cat?.color }}>
                                                                        {cat?.icon || <Sparkles size={14} />}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-[11px] font-black uppercase tracking-tight text-charcoal leading-none mb-1">{req.title}</h4>
                                                                        <p className="text-[9px] text-slate-400 font-bold uppercase">{asker?.name || 'Unknown'}</p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs font-black text-kizuna-green">UGX {req.budget.toLocaleString()}</span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{req.description}</p>
                                                            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                                                                <div className="flex gap-1">
                                                                    {req.urgent && <span className="text-[8px] font-black bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase">Urgent</span>}
                                                                    <span className="text-[8px] font-black bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase">{cat?.name || 'Help'}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => { setActiveModal(null); onUserClick(asker); }}
                                                                    className="flex items-center gap-1 text-[9px] font-black text-charcoal uppercase group-hover:text-kizuna-green transition-colors"
                                                                >
                                                                    View Node <ArrowUpRight size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                )}

                                {activeModal === 'history' && (
                                    <div className="space-y-4">
                                        {historyTab === 'marketplace' ? (
                                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {requests.filter(r => {
                                                    const involvesMe = r.askerId === currentUserId || r.supporterId === currentUserId;
                                                    if (historyFilter === 'mine') return r.askerId === currentUserId;
                                                    return involvesMe;
                                                }).length === 0 ? (
                                                    <div className="py-12 text-center opacity-30">
                                                        <Search size={32} className="mx-auto mb-3" />
                                                        <p className="text-xs font-bold uppercase tracking-widest">No marketplace activity found</p>
                                                    </div>
                                                ) : (
                                                    requests
                                                        .filter(r => {
                                                            const involvesMe = r.askerId === currentUserId || r.supporterId === currentUserId;
                                                            if (historyFilter === 'mine') return r.askerId === currentUserId;
                                                            return involvesMe;
                                                        })
                                                        .map(req => {
                                                            const isMyPost = req.askerId === currentUserId;
                                                            const otherParty = users.find(u => u.id === (isMyPost ? req.supporterId : req.askerId));
                                                            const cat = categories.find(c => c.id === req.categoryId);

                                                            return (
                                                                <div key={req.id} className={`p-4 bg-slate-50 border rounded-[10px] flex flex-col gap-3 transition-all ${isMyPost ? 'border-kizuna-green/20' : 'border-slate-100'}`}>
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center" style={{ color: cat?.color }}>
                                                                                {cat?.icon}
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-black text-charcoal uppercase tracking-tight leading-tight mb-0.5">{req.title}</p>
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 uppercase tracking-tighter">
                                                                                        {cat?.name || 'Help'}
                                                                                    </span>
                                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{isMyPost ? 'You Posted' : 'You Responded'}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-xs font-black text-kizuna-green">UGX {req.budget.toLocaleString()}</p>
                                                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${req.status === 'fulfilled' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                                {req.status}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                                        {otherParty ? (
                                                                            <div className="flex items-center gap-2">
                                                                                <img src={otherParty.avatar} className="w-5 h-5 rounded-full object-cover" alt="" />
                                                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                                                                    {isMyPost ? 'Accepted by:' : 'Contract with:'} {otherParty.name}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-[9px] font-bold text-slate-300 uppercase italic">Awaiting Response...</p>
                                                                        )}

                                                                        {isMyPost && (req.status === 'open' || req.status === 'pending') && (
                                                                            <button
                                                                                onClick={() => onCancelRequest?.(req.id)}
                                                                                className="text-[8px] font-black text-red-500 hover:text-red-700 uppercase tracking-[0.2em] border border-red-100 px-2 py-1 rounded hover:bg-red-50 transition-all flex items-center gap-1"
                                                                            >
                                                                                <X size={10} /> Retract
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="p-4 bg-slate-50 rounded-[10px] border border-slate-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center text-kizuna-green shadow-sm">
                                                                <Check size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-charcoal">Delivery to Kampala Central</p>
                                                                <p className="text-[10px] text-slate-400">Completed • Dec 28, 2025</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-black text-kizuna-green">+5.0</p>
                                                            <p className="text-[8px] font-bold text-slate-300 uppercase">Trust Points</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
