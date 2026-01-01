import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { MapPin, Calendar, ArrowLeft, Send, CheckCircle, Clock, AlertCircle, MessageSquare, Share2 } from "lucide-react";
import { fetchRequestById, type RequestResponse } from "~/mocks/services/requestService";
import { fetchUserById, fetchCurrentUser } from "~/mocks/services/userService";
import type { Request, User } from "~/mocks/store";
import Avatar from "~/components/ui/Avatar";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import Loader from "~/components/ui/Loader";
import { useToastActions } from "~/components/ui/Toast";

export default function RequestDetail() {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const toast = useToastActions();

    const [request, setRequest] = useState<Request | null>(null);
    const [asker, setAsker] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            if (!requestId) return;

            try {
                setLoading(true);

                // Check authentication first
                const currentUserRes = await fetchCurrentUser();
                if (!currentUserRes.success || !currentUserRes.user) {
                    navigate('/auth/login');
                    return;
                }

                // Store current user
                setCurrentUser(currentUserRes.user);

                const reqResponse = await fetchRequestById(requestId);

                if (reqResponse.success && reqResponse.request) {
                    setRequest(reqResponse.request);

                    // Fetch asker details
                    const userResponse = await fetchUserById(reqResponse.request.askerId);
                    if (userResponse.success && userResponse.user) {
                        setAsker(userResponse.user);
                    }
                } else {
                    setError(reqResponse.error || "Request not found");
                }
            } catch (err) {
                setError("Failed to load request details");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [requestId, navigate]);

    const handleOfferHelp = () => {
        if (!request || !asker || !currentUser) return;
        
        // Store the offer data in sessionStorage to pass to the network route
        const offerData = {
            requestId: request.id,
            requestTitle: request.title,
            askerId: asker.id,
            askerName: asker.name,
            supporterId: currentUser.id,
            supporterName: currentUser.name,
            autoMessage: `Hi ${asker.name}, I saw your request for "${request.title}". I am ready to provide and deliver what you need!`
        };
        
        sessionStorage.setItem('pendingOffer', JSON.stringify(offerData));
        
        // Navigate to network where the chat modal will open
        navigate('/network');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader size="lg" />
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Request Not Found</h2>
                <p className="text-gray-500 mb-6">{error || "The request you are looking for does not exist."}</p>
                <Button onClick={() => navigate("/requests")}>Back to Requests</Button>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-kizuna-green text-white';
            case 'in-progress': return 'bg-blue-500 text-white';
            case 'completed': return 'bg-gray-500 text-white';
            default: return 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 pb-20 max-w-5xl">
            <Button
                variant="ghost"
                className="mb-4 pl-0 hover:bg-transparent hover:text-kizuna-green"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN - Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(request.status)}`}>
                                    {request.status}
                                </span>
                                <span className="text-gray-400 text-sm">Posted {new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{request.title}</h1>

                            <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-kizuna-green" />
                                    <span>{request.location?.address || "Remote / Unknown"}</span>
                                </div>
                                {request.scheduledFor && (
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 mr-2 text-kizuna-green" />
                                        <span>{new Date(request.scheduledFor).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">Budget</p>
                                    <p className="text-2xl font-bold text-kizuna-green">
                                        {request.currency} {request.budget.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={handleCopyLink} title="Share">
                                        <Share2 className="w-5 h-5 text-gray-600" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity" style={{ backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=Lagos&zoom=13&size=600x300&maptype=roadmap&key=YOUR_API_KEY')" }}></div>
                        {/* Note: This is a fake static map URL pattern for visual reference, will not work without key. Using generic background pattern instead in real app or actual library */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-10">
                            <MapPin className="w-12 h-12 text-kizuna-green mb-2 animate-bounce" />
                            <p className="text-gray-600 font-medium">Map View Location</p>
                            <p className="text-xs text-gray-500">(Map integration pending)</p>
                        </div>
                    </div>

                    {/* Description */}
                    <Card className="p-6 md:p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Request Details</h3>
                        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                            {request.description}
                        </div>

                        {request.images && request.images.length > 0 && (
                            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {request.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Request attachment ${idx + 1}`}
                                        className="rounded-lg object-cover w-full h-32 border border-gray-200"
                                    />
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* RIGHT COLUMN - Sidebar */}
                <div className="space-y-6">

                    {/* Action Card - Only show if not the request author */}
                    {currentUser && currentUser.id !== request.askerId ? (
                        <Card className="p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Can you help?</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Connect with this member to offer your support. Remember, Kizuna is about building bonds.
                            </p>

                            <div className="space-y-3">
                                <Button className="w-full justify-center text-lg py-6" onClick={handleOfferHelp}>
                                    Offer Support
                                </Button>
                                <Button variant="outline" className="w-full justify-center">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <p className="text-xs text-gray-500">
                                        Payments are held in escrow until the request is fulfilled. Your safety is our priority.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-6 sticky top-6 bg-slate-50 border-slate-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Request</h3>
                            <p className="text-gray-600 mb-4 text-sm">
                                This is your request. You'll be notified when someone offers to help.
                            </p>
                            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-blue-900">
                                    Waiting for responses from the community. We'll notify you when someone offers support.
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Asker Profile Card */}
                    {asker && (
                        <Card className="p-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Requested By</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar src={asker.avatar} alt={asker.name} size="lg" />
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">{asker.name}</h4>
                                    <div className="flex items-center text-kizuna-green text-sm">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        {asker.verified ? "Verified Member" : "Member"}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center mb-6">
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <span className="block text-xl font-bold text-gray-800">4.9</span>
                                    <span className="text-xs text-gray-500">Rating</span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <span className="block text-xl font-bold text-gray-800">12</span>
                                    <span className="text-xs text-gray-500">Connections</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {asker.badges.slice(0, 3).map((badge) => (
                                    <span key={badge} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-200">
                                        🏆 Badge
                                    </span>
                                ))}
                            </div>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
}
