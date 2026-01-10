import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  MessageSquare,
  Plus,
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreHorizontal,
  Users,
  Hash,
  Settings,
  Circle,
  Minus,
  X,
  Edit,
  Trash2,
  Reply,
  Forward,
  Star,
  Pin,
  Archive,
  Bell,
  BellOff,
  UserPlus,
  Crown,
  Shield,
  Clock,
  CheckCheck,
  Check,
  AlertCircle,
  FileText,
  Image,
  Mic,
  Camera,
  Calendar,
  Link,
  Zap
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  members: number;
  unread: number;
  description?: string;
  lastActivity?: string;
  isArchived?: boolean;
  isMuted?: boolean;
}

interface Message {
  id: number;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  channel: string;
  type: 'text' | 'file' | 'image' | 'system';
  reactions?: { emoji: string; count: number; users: string[] }[];
  isEdited?: boolean;
  isPinned?: boolean;
  replyTo?: number;
  attachments?: { name: string; type: string; url: string }[];
}

interface DirectMessage {
  id: string;
  name: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  unread: number;
  lastSeen?: string;
  role?: string;
}

const Chat = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced sample data
  const channels: Channel[] = [
    { 
      id: "general", 
      name: "General", 
      type: "public", 
      members: 12, 
      unread: 3,
      description: "General team discussions",
      lastActivity: "2 minutes ago"
    },
    { 
      id: "sales-team", 
      name: "Sales Team", 
      type: "private", 
      members: 5, 
      unread: 0,
      description: "Sales strategy and updates",
      lastActivity: "15 minutes ago"
    },
    { 
      id: "project-alpha", 
      name: "Project Alpha", 
      type: "private", 
      members: 8, 
      unread: 1,
      description: "Alpha project coordination",
      lastActivity: "1 hour ago"
    },
    { 
      id: "announcements", 
      name: "Announcements", 
      type: "public", 
      members: 12, 
      unread: 0,
      description: "Company-wide announcements",
      lastActivity: "3 hours ago"
    },
    { 
      id: "random", 
      name: "Random", 
      type: "public", 
      members: 10, 
      unread: 2,
      description: "Off-topic conversations",
      lastActivity: "30 minutes ago"
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "SJ",
      message: "Good morning team! Ready for today's client meetings? 🌟",
      timestamp: "09:15 AM",
      channel: "general",
      type: "text",
      reactions: [
        { emoji: "👍", count: 3, users: ["Mike Chen", "Emma Davis", "Lisa Wang"] },
        { emoji: "☕", count: 2, users: ["Alex Thompson", "John Doe"] }
      ]
    },
    {
      id: 2,
      user: "Mike Chen",
      avatar: "MC",
      message: "Yes! EcoTech meeting at 10 AM is confirmed. I've prepared all the materials.",
      timestamp: "09:16 AM",
      channel: "general",
      type: "text",
      replyTo: 1
    },
    {
      id: 3,
      user: "Emma Davis",
      avatar: "ED",
      message: "I've prepared the presentation materials for Solar Dynamics. Everything looks great! 📊",
      timestamp: "09:18 AM",
      channel: "general",
      type: "text",
      attachments: [
        { name: "Solar_Dynamics_Presentation.pdf", type: "pdf", url: "#" }
      ]
    },
    {
      id: 4,
      user: "Lisa Wang",
      avatar: "LW",
      message: "Payment from Green Energy Alliance just came through! 🎉💰",
      timestamp: "09:20 AM",
      channel: "sales-team",
      type: "text",
      isPinned: true,
      reactions: [
        { emoji: "🎉", count: 5, users: ["Sarah Johnson", "Mike Chen", "Emma Davis", "Alex Thompson", "John Doe"] }
      ]
    },
    {
      id: 5,
      user: "Alex Thompson",
      avatar: "AT",
      message: "Great news! That's a big win for Q1. Let's celebrate! 🥳",
      timestamp: "09:21 AM",
      channel: "sales-team",
      type: "text",
      replyTo: 4
    },
    {
      id: 6,
      user: "System",
      avatar: "SY",
      message: "John Doe joined the channel",
      timestamp: "09:22 AM",
      channel: "general",
      type: "system"
    },
    {
      id: 7,
      user: "John Doe",
      avatar: "JD",
      message: "Thanks for the warm welcome everyone! Excited to be part of the team! 👋",
      timestamp: "09:23 AM",
      channel: "general",
      type: "text"
    }
  ];

  const directMessages: DirectMessage[] = [
    { 
      id: "sarah", 
      name: "Sarah Johnson", 
      status: "online", 
      unread: 2, 
      role: "Sales Manager",
      lastSeen: "now"
    },
    { 
      id: "mike", 
      name: "Mike Chen", 
      status: "away", 
      unread: 0, 
      role: "Account Executive",
      lastSeen: "5 minutes ago"
    },
    { 
      id: "emma", 
      name: "Emma Davis", 
      status: "online", 
      unread: 1, 
      role: "Marketing Specialist",
      lastSeen: "now"
    },
    { 
      id: "lisa", 
      name: "Lisa Wang", 
      status: "busy", 
      unread: 0, 
      role: "Business Development",
      lastSeen: "2 hours ago"
    },
    { 
      id: "alex", 
      name: "Alex Thompson", 
      status: "offline", 
      unread: 0, 
      role: "Project Manager",
      lastSeen: "yesterday"
    }
  ];

  const emojis = ["😀", "😂", "❤️", "👍", "👎", "😮", "😢", "😡", "🎉", "🔥", "💯", "👏"];

  useEffect(() => {
    scrollToBottom();
  }, [selectedChannel]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOnlineUsers(["Sarah Johnson", "Emma Davis", "Mike Chen"]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        user: "You",
        avatar: "YO",
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: selectedChannel,
        type: "text",
        replyTo: replyingTo?.id
      };

      // In a real app, this would be sent to Supabase
      toast({
        title: "Message Sent",
        description: `Message sent to #${channels.find(c => c.id === selectedChannel)?.name}`,
      });

      setMessage("");
      setReplyingTo(null);
      scrollToBottom();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Upload",
        description: `${file.name} uploaded successfully`,
      });
    }
  };

  const handleStartCall = () => {
    toast({
      title: "Voice Call Started",
      description: "Voice call feature will be available soon.",
    });
  };

  const handleStartVideo = () => {
    toast({
      title: "Video Call Started",
      description: "Video call feature will be available soon.",
    });
  };

  const handleReaction = (messageId: number, emoji: string) => {
    toast({
      title: "Reaction Added",
      description: `Added ${emoji} reaction to message`,
    });
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handlePinMessage = (messageId: number) => {
    toast({
      title: "Message Pinned",
      description: "Message has been pinned to the channel",
    });
  };

  const getStatusColor = (status: DirectMessage['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'public': return <Hash className="w-4 h-4" />;
      case 'private': return <Shield className="w-4 h-4" />;
      case 'direct': return <MessageSquare className="w-4 h-4" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.channel === selectedChannel &&
    (searchQuery === "" || 
     msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
     msg.user.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentChannel = channels.find(c => c.id === selectedChannel);
  const onlineCount = directMessages.filter(dm => dm.status === 'online').length;
  const awayCount = directMessages.filter(dm => dm.status === 'away' || dm.status === 'busy').length;
  const offlineCount = directMessages.filter(dm => dm.status === 'offline').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            Internal Chat
          </h1>
          <p className="text-gray-600 mt-2">
            Team communication and collaboration hub
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleStartCall}>
            <Phone className="w-4 h-4 mr-2" />
            Voice Call
          </Button>
          <Button variant="outline" onClick={handleStartVideo}>
            <Video className="w-4 h-4 mr-2" />
            Video Call
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Channels & Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Channels */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    CHANNELS
                  </h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1">
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedChannel === channel.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedChannel(channel.id)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getChannelIcon(channel.type)}
                        <span className="font-medium truncate">{channel.name}</span>
                        {channel.isMuted && <BellOff className="w-3 h-3 text-gray-400" />}
                      </div>
                      <div className="flex items-center gap-2">
                        {channel.unread > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                            {channel.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Direct Messages */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    DIRECT MESSAGES
                  </h3>
                  <Button variant="ghost" size="sm">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1">
                  {directMessages.map((dm) => (
                    <div
                      key={dm.id}
                      className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {dm.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(dm.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{dm.name}</div>
                          <div className="text-xs text-gray-500 truncate">{dm.role}</div>
                        </div>
                      </div>
                      {dm.unread > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                          {dm.unread}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getChannelIcon(currentChannel?.type || 'public')}
                <div>
                  <h3 className="font-semibold">
                    {currentChannel?.name || "General"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {currentChannel?.members || 0} members • {currentChannel?.lastActivity}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Pin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[580px]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="group">
                    {msg.replyTo && (
                      <div className="ml-12 mb-1 text-xs text-gray-500 flex items-center gap-1">
                        <Reply className="w-3 h-3" />
                        Replying to {messages.find(m => m.id === msg.replyTo)?.user}
                      </div>
                    )}
                    
                    <div className={`flex gap-3 ${msg.type === 'system' ? 'justify-center' : ''}`}>
                      {msg.type !== 'system' && (
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="text-sm">
                            {msg.avatar}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`flex-1 ${msg.type === 'system' ? 'text-center' : ''}`}>
                        {msg.type !== 'system' && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{msg.user}</span>
                            <span className="text-xs text-gray-500">{msg.timestamp}</span>
                            {msg.isEdited && (
                              <Badge variant="outline" className="text-xs">edited</Badge>
                            )}
                            {msg.isPinned && (
                              <Pin className="w-3 h-3 text-yellow-600" />
                            )}
                          </div>
                        )}
                        
                        <div className={`${msg.type === 'system' ? 'text-sm text-gray-500 italic' : ''}`}>
                          {msg.message}
                        </div>

                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {msg.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">{attachment.name}</span>
                                <Button variant="ghost" size="sm">
                                  <Link className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reactions */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            {msg.reactions.map((reaction, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleReaction(msg.id, reaction.emoji)}
                              >
                                {reaction.emoji} {reaction.count}
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Message Actions */}
                        {msg.type !== 'system' && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleReaction(msg.id, "👍")}>
                                <Smile className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleReply(msg)}>
                                <Reply className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handlePinMessage(msg.id)}>
                                <Pin className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="px-4 py-2 bg-gray-50 border-t border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Reply className="w-4 h-4" />
                    <span>Replying to <strong>{replyingTo.user}</strong></span>
                    <span className="text-gray-500 truncate max-w-xs">
                      {replyingTo.message}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder={`Message #${currentChannel?.name || "general"}`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handleFileUpload}>
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-4 bg-white border rounded-lg shadow-lg p-3 z-10">
                  <div className="grid grid-cols-6 gap-2">
                    {emojis.map((emoji) => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <ScrollArea className="h-[650px]">
              {/* Team Status */}
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3">Team Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Online</span>
                    </div>
                    <span className="text-sm font-medium">{onlineCount} members</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Away</span>
                    </div>
                    <span className="text-sm font-medium">{awayCount} members</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-sm">Offline</span>
                    </div>
                    <span className="text-sm font-medium">{offlineCount} members</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-green-600" />
                    <span>Sarah joined #project-alpha</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Mike shared a file in #sales-team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span>Emma started a video call</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pin className="w-4 h-4 text-yellow-600" />
                    <span>Lisa pinned a message</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Channel
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Members
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Archive className="w-4 h-4 mr-2" />
                    View Archives
                  </Button>
                </div>
              </div>

              {/* Channel Info */}
              {currentChannel && (
                <div className="p-4 border-t">
                  <h3 className="font-semibold mb-3">Channel Info</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-gray-600 mt-1">{currentChannel.description}</p>
                    </div>
                    <div>
                      <span className="font-medium">Members:</span>
                      <p className="text-gray-600">{currentChannel.members} total</p>
                    </div>
                    <div>
                      <span className="font-medium">Last Activity:</span>
                      <p className="text-gray-600">{currentChannel.lastActivity}</p>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;