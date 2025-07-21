"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff,
  MessageCircle,
  Send,
  Calendar,
  Clock,
  User,
  Shield,
  FileText,
  Camera,
  Settings,
  Star,
  MapPin,
  Globe,
  CheckCircle,
  AlertTriangle,
  Users,
  Activity
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { videoConsultation, VideoSession, Officer, ChatMessage } from '@/lib/video/VideoConsultation';

interface VideoConsultationPortalProps {
  citizenId: string;
  onScheduled?: (sessionId: string) => void;
  onCallEnded?: (sessionId: string) => void;
}

export default function VideoConsultationPortal({
  citizenId,
  onScheduled,
  onCallEnded
}: VideoConsultationPortalProps) {
  const [activeTab, setActiveTab] = useState('schedule');
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [activeSessions, setActiveSessions] = useState<VideoSession[]>([]);
  const [currentSession, setCurrentSession] = useState<VideoSession | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [localVideo, setLocalVideo] = useState(true);
  const [localAudio, setLocalAudio] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();

  useEffect(() => {
    loadOfficers();
    loadActiveSessions();
  }, []);

  useEffect(() => {
    if (currentSession) {
      const messages = videoConsultation.getChatMessages(currentSession.id);
      setChatMessages(messages);
    }
  }, [currentSession]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadOfficers = () => {
    const availableOfficers = videoConsultation.getAvailableOfficers();
    setOfficers(availableOfficers);
  };

  const loadActiveSessions = () => {
    const sessions = videoConsultation.getActiveSessions(citizenId);
    setActiveSessions(sessions);
  };

  const scheduleConsultation = async (
    serviceType: string,
    preferredDate: string,
    preferredTime: string,
    officerId?: string
  ) => {
    try {
      const result = await videoConsultation.scheduleConsultation(
        citizenId,
        serviceType,
        preferredDate,
        preferredTime,
        officerId
      );

      if (result.success && result.sessionId) {
        onScheduled?.(result.sessionId);
        loadActiveSessions();
        setActiveTab('sessions');
      } else {
        alert(result.error || 'Failed to schedule consultation');
      }
    } catch (error) {
      alert('Failed to schedule consultation');
    }
  };

  const startCall = async (sessionId: string) => {
    try {
      const stream = await videoConsultation.startConsultation(sessionId, citizenId);
      if (stream && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        setIsInCall(true);

        const session = videoConsultation.getSession(sessionId);
        setCurrentSession(session || null);
        setActiveTab('call');

        // Simulate remote stream (in production, this would come from WebRTC)
        setTimeout(() => {
          if (remoteVideoRef.current) {
            // In production, this would be the actual remote stream
            remoteVideoRef.current.srcObject = stream;
          }
        }, 2000);
      }
    } catch (error) {
      alert('Failed to start video call');
    }
  };

  const endCall = async () => {
    if (currentSession) {
      const success = await videoConsultation.endConsultation(currentSession.id, citizenId);
      if (success) {
        setIsInCall(false);
        setCurrentSession(null);
        onCallEnded?.(currentSession.id);
        loadActiveSessions();
        setActiveTab('sessions');

        // Stop local video stream
        if (localVideoRef.current?.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          localVideoRef.current.srcObject = null;
        }
      }
    }
  };

  const toggleVideo = () => {
    setLocalVideo(!localVideo);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !localVideo;
      }
    }
  };

  const toggleAudio = () => {
    setLocalAudio(!localAudio);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !localAudio;
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!currentSession) return;

    try {
      if (isScreenSharing) {
        await videoConsultation.stopScreenShare(currentSession.id, citizenId);
        setIsScreenSharing(false);
      } else {
        const screenStream = await videoConsultation.startScreenShare(currentSession.id, citizenId);
        if (screenStream) {
          setIsScreenSharing(true);
        }
      }
    } catch (error) {
      alert('Screen sharing failed');
    }
  };

  const sendChatMessage = async () => {
    if (!currentSession || !newMessage.trim()) return;

    try {
      await videoConsultation.sendChatMessage(
        currentSession.id,
        citizenId,
        'citizen',
        newMessage
      );

      setNewMessage('');
      const messages = videoConsultation.getChatMessages(currentSession.id);
      setChatMessages(messages);
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getQualityBars = (quality: string) => {
    const levels = { excellent: 4, good: 3, fair: 2, poor: 1 };
    const level = levels[quality as keyof typeof levels] || 0;

    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 h-3 mx-0.5 rounded ${
          i < level ? getQualityColor(quality) : 'text-gray-300'
        } bg-current`}
      />
    ));
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Video Consultation
          </CardTitle>
          <CardDescription>
            Book a video call with a PNG Government officer for personalized assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Type Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Service Type</label>
            <select className="w-full p-3 border rounded-lg">
              <option value="">Select a service...</option>
              <option value="birth_certificate">Birth Certificate Assistance</option>
              <option value="passport_application">Passport Application Help</option>
              <option value="business_license">Business License Guidance</option>
              <option value="general_inquiry">General Government Services</option>
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Date</label>
              <Input type="date" min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Time</label>
              <select className="w-full p-3 border rounded-lg">
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
          </div>

          {/* Officer Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Choose Officer (Optional)</label>
            <div className="grid gap-3">
              {officers.map((officer) => (
                <div key={officer.id} className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{officer.name}</h4>
                        <p className="text-sm text-slate-600">{officer.title}</p>
                        <p className="text-xs text-slate-500">{officer.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm">{officer.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${officer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-xs text-slate-500">
                          {officer.isOnline ? 'Available' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {officer.specialties.slice(0, 3).map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => scheduleConsultation('birth_certificate', '2024-01-25', '10:00')}
          >
            <Video className="h-4 w-4 mr-2" />
            Schedule Consultation
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSessionsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Consultations</CardTitle>
          <CardDescription>Manage your scheduled and active video consultations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No consultations scheduled</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('schedule')}
                >
                  Schedule Consultation
                </Button>
              </div>
            ) : (
              activeSessions.map((session) => (
                <div key={session.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{session.officerName}</h4>
                        <p className="text-sm text-slate-600">{session.officerDepartment}</p>
                        <p className="text-sm text-slate-500">{session.serviceType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={session.status === 'scheduled' ? 'secondary' : 'default'}
                        className={
                          session.status === 'active' ? 'bg-green-100 text-green-800' :
                          session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {session.status}
                      </Badge>
                      {session.scheduledTime && (
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(session.scheduledTime).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {session.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => startCall(session.id)}
                        className="flex items-center gap-2"
                      >
                        <Video className="h-3 w-3" />
                        Join Call
                      </Button>
                    )}
                    {session.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentSession(session);
                          setActiveTab('call');
                        }}
                        className="flex items-center gap-2"
                      >
                        <Activity className="h-3 w-3" />
                        Resume Call
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Messages
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCallTab = () => {
    if (!isInCall || !currentSession) {
      return (
        <div className="text-center py-8">
          <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-slate-500">No active call</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Video Area */}
        <Card>
          <CardContent className="p-0">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              {/* Remote Video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-64 md:h-96 object-cover"
              />

              {/* Local Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Connection Quality */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center">
                  {getQualityBars(connectionQuality)}
                </div>
                <span className="text-sm capitalize">{connectionQuality}</span>
              </div>

              {/* Officer Info Overlay */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{currentSession.officerName}</span>
                </div>
                <p className="text-sm opacity-90">{currentSession.officerDepartment}</p>
              </div>
            </div>

            {/* Call Controls */}
            <div className="p-4 bg-gray-50 flex items-center justify-center gap-4">
              <Button
                variant={localAudio ? "default" : "destructive"}
                size="lg"
                onClick={toggleAudio}
                className="rounded-full w-12 h-12 p-0"
              >
                {localAudio ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={localVideo ? "default" : "destructive"}
                size="lg"
                onClick={toggleVideo}
                className="rounded-full w-12 h-12 p-0"
              >
                {localVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="lg"
                onClick={toggleScreenShare}
                className="rounded-full w-12 h-12 p-0"
              >
                {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
                className="rounded-full w-12 h-12 p-0"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages */}
              <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderType === 'citizen' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-3 py-2 ${
                        message.senderType === 'citizen'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <Button onClick={sendChatMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Video Consultation
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Connect with PNG Government officers via secure video calls
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="call">Active Call</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          {renderScheduleTab()}
        </TabsContent>

        <TabsContent value="sessions">
          {renderSessionsTab()}
        </TabsContent>

        <TabsContent value="call">
          {renderCallTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
