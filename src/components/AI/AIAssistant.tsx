"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Bot,
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Brain,
  Zap,
  Eye,
  Shield,
  FileText,
  Camera,
  Languages,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Settings,
  HelpCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Lightbulb,
  Search,
  BarChart,
  Target
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  confidence?: number;
  suggestions?: string[];
  actions?: AIAction[];
}

interface AIAction {
  id: string;
  label: string;
  type: 'navigate' | 'execute' | 'info' | 'external';
  data?: any;
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'active' | 'learning' | 'offline';
  accuracy: number;
  usage: number;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [aiPersonality, setAiPersonality] = useState('helpful');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AI Capabilities
  const aiCapabilities: AICapability[] = [
    {
      id: 'document_verification',
      name: 'Document AI Verification',
      description: 'Intelligent document analysis and fraud detection',
      icon: FileText,
      status: 'active',
      accuracy: 98.5,
      usage: 847
    },
    {
      id: 'biometric_ai',
      name: 'AI Biometric Analysis',
      description: 'Advanced facial recognition and identity verification',
      icon: Eye,
      status: 'active',
      accuracy: 99.2,
      usage: 1240
    },
    {
      id: 'fraud_detection',
      name: 'AI Fraud Detection',
      description: 'Real-time suspicious activity monitoring',
      icon: Shield,
      status: 'active',
      accuracy: 96.8,
      usage: 523
    },
    {
      id: 'smart_recommendations',
      name: 'Smart Service Recommendations',
      description: 'Personalized government service suggestions',
      icon: Lightbulb,
      status: 'active',
      accuracy: 94.3,
      usage: 678
    },
    {
      id: 'predictive_analytics',
      name: 'Predictive Analytics',
      description: 'Service wait times and usage pattern prediction',
      icon: TrendingUp,
      status: 'active',
      accuracy: 92.7,
      usage: 356
    },
    {
      id: 'language_processing',
      name: 'Multi-Language AI',
      description: 'Real-time translation for English, Tok Pisin, Hiri Motu',
      icon: Languages,
      status: 'active',
      accuracy: 95.4,
      usage: 1189
    }
  ];

  // Predefined AI responses and knowledge base
  const aiKnowledgeBase = {
    greetings: [
      "Hello! I'm ARIA (AI Resident Intelligence Assistant) for PNG Digital ID. How can I help you today?",
      "Greetings! I'm here to assist you with your PNG government services. What would you like to know?",
      "Welcome to PNG Digital ID! I'm your AI assistant. How may I assist you?"
    ],
    services: {
      banking: "I can help you connect to BSP PNG, ANZ PNG, or Westpac PNG. Would you like me to guide you through account linking?",
      healthcare: "I can assist with booking medical appointments, accessing health records, or finding nearby healthcare providers.",
      identity: "I can help verify your identity, manage biometric settings, or explain the verification process.",
      documents: "I can assist with document verification, digital signatures, or accessing your secure document vault.",
      security: "I can help improve your security score, enable two-factor authentication, or explain our security features."
    },
    languages: {
      en: "English",
      tpi: "Tok Pisin",
      ho: "Hiri Motu"
    }
  };

  useEffect(() => {
    // Initialize AI assistant with welcome message
    const welcomeMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: aiKnowledgeBase.greetings[0],
      timestamp: new Date(),
      confidence: 100,
      suggestions: [
        "Help me verify my identity",
        "Connect to banking services",
        "Book a healthcare appointment",
        "Check my security status",
        "Translate to Tok Pisin"
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const processAIMessage = async (userInput: string) => {
    setIsProcessing(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    let aiResponse = generateAIResponse(userInput);
    let confidence = Math.floor(85 + Math.random() * 15); // 85-100% confidence

    const aiMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: aiResponse.content,
      timestamp: new Date(),
      confidence,
      suggestions: aiResponse.suggestions,
      actions: aiResponse.actions
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsProcessing(false);

    // Text-to-speech for AI responses
    if (isSpeaking) {
      speakText(aiResponse.content);
    }
  };

  const generateAIResponse = (input: string): { content: string; suggestions?: string[]; actions?: AIAction[] } => {
    const lowerInput = input.toLowerCase();

    // Banking queries
    if (lowerInput.includes('bank') || lowerInput.includes('account') || lowerInput.includes('money')) {
      return {
        content: "I can help you with banking services! PNG Digital ID integrates with BSP PNG, ANZ PNG, and Westpac PNG. Currently, you have K 2,450.75 in your BSP PNG account. Would you like me to help you connect additional banks or manage your existing accounts?",
        suggestions: [
          "Connect to ANZ PNG",
          "View transaction history",
          "Check account balance",
          "Set up digital payments"
        ],
        actions: [
          { id: 'navigate_banking', label: 'Go to Banking', type: 'navigate', data: { tab: 'banking' } },
          { id: 'connect_anz', label: 'Connect ANZ PNG', type: 'execute', data: { action: 'connect_bank', bank: 'anz' } }
        ]
      };
    }

    // Healthcare queries
    if (lowerInput.includes('health') || lowerInput.includes('doctor') || lowerInput.includes('hospital') || lowerInput.includes('appointment')) {
      return {
        content: "I can assist with healthcare services! You have 1 upcoming appointment at Port Moresby General Hospital. I can help you book new appointments, access medical records, or find healthcare providers near you. Your next vaccination is scheduled for tomorrow.",
        suggestions: [
          "Book new appointment",
          "View medical records",
          "Find nearby clinics",
          "Reschedule vaccination"
        ],
        actions: [
          { id: 'navigate_health', label: 'Go to Healthcare', type: 'navigate', data: { tab: 'health' } },
          { id: 'book_appointment', label: 'Book Appointment', type: 'execute', data: { action: 'book_appointment' } }
        ]
      };
    }

    // Identity/Security queries
    if (lowerInput.includes('identity') || lowerInput.includes('verify') || lowerInput.includes('security') || lowerInput.includes('biometric')) {
      return {
        content: "Your identity verification is Tier 3 verified with a 98% security score! I can help you enhance security with biometric authentication, manage your digital ID, or verify documents. Your account has excellent security with end-to-end encryption enabled.",
        suggestions: [
          "Enable biometric login",
          "Download digital ID",
          "View security log",
          "Update identity documents"
        ],
        actions: [
          { id: 'biometric_setup', label: 'Setup Biometrics', type: 'execute', data: { action: 'biometric_setup' } },
          { id: 'download_id', label: 'Download Digital ID', type: 'execute', data: { action: 'download_id' } }
        ]
      };
    }

    // Translation requests
    if (lowerInput.includes('translate') || lowerInput.includes('tok pisin') || lowerInput.includes('hiri motu')) {
      return {
        content: "I can translate between English, Tok Pisin, and Hiri Motu! PNG Digital ID supports all three official languages. Would you like me to switch the interface language or translate specific content?",
        suggestions: [
          "Switch to Tok Pisin",
          "Switch to Hiri Motu",
          "Translate this page",
          "Voice translation"
        ],
        actions: [
          { id: 'switch_tpi', label: 'Switch to Tok Pisin', type: 'execute', data: { action: 'change_language', lang: 'tpi' } },
          { id: 'switch_ho', label: 'Switch to Hiri Motu', type: 'execute', data: { action: 'change_language', lang: 'ho' } }
        ]
      };
    }

    // General help
    if (lowerInput.includes('help') || lowerInput.includes('how') || lowerInput.includes('what')) {
      return {
        content: "I'm ARIA, your AI assistant for PNG Digital ID! I can help you with:\n\n🏦 Banking & Financial Services\n🏥 Healthcare & Medical Records\n🆔 Identity Verification & Security\n📋 Government Services & Documents\n🌐 Multi-language Support\n📊 Analytics & Insights\n\nWhat would you like to explore?",
        suggestions: [
          "Show me my dashboard",
          "Check system status",
          "Security recommendations",
          "Available services"
        ]
      };
    }

    // Default response with AI personality
    return {
      content: `I understand you're asking about "${input}". While I'm continuously learning about PNG government services, I might need more context to provide the best assistance. Let me help you find what you're looking for!`,
      suggestions: [
        "Banking services",
        "Healthcare appointments",
        "Identity verification",
        "Document management",
        "Security settings"
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    await processAIMessage(inputMessage);
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("Help me check my banking status");
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  const handleActionClick = (action: AIAction) => {
    // Handle different action types
    switch (action.type) {
      case 'navigate':
        console.log('Navigate to:', action.data);
        break;
      case 'execute':
        console.log('Execute action:', action.data);
        break;
      default:
        console.log('Action:', action);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* AI Assistant Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <Bot className="h-8 w-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] p-0">
            <div className="flex h-[70vh]">
              {/* AI Capabilities Sidebar */}
              <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
                <DialogHeader className="mb-4">
                  <DialogTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Capabilities
                  </DialogTitle>
                  <DialogDescription>
                    Intelligent features powered by AI
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  {aiCapabilities.map((capability) => {
                    const IconComponent = capability.icon;
                    return (
                      <Card key={capability.id} className="p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${
                            capability.status === 'active' ? 'bg-green-100' :
                            capability.status === 'learning' ? 'bg-orange-100' : 'bg-gray-100'
                          }`}>
                            <IconComponent className={`h-4 w-4 ${
                              capability.status === 'active' ? 'text-green-600' :
                              capability.status === 'learning' ? 'text-orange-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{capability.name}</h4>
                            <Badge variant="outline" className={`text-xs ${
                              capability.status === 'active' ? 'border-green-500 text-green-700' :
                              capability.status === 'learning' ? 'border-orange-500 text-orange-700' :
                              'border-gray-300 text-gray-600'
                            }`}>
                              {capability.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{capability.description}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Accuracy</span>
                            <span>{capability.accuracy}%</span>
                          </div>
                          <Progress value={capability.accuracy} className="h-1" />
                          <div className="text-xs text-gray-500">
                            {capability.usage} operations today
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* AI Settings */}
                <Card className="mt-4 p-3">
                  <h4 className="font-medium text-sm mb-3">AI Assistant Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium">Language</label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full mt-1 p-1 text-xs border rounded"
                      >
                        <option value="en">English</option>
                        <option value="tpi">Tok Pisin</option>
                        <option value="ho">Hiri Motu</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium">AI Personality</label>
                      <select
                        value={aiPersonality}
                        onChange={(e) => setAiPersonality(e.target.value)}
                        className="w-full mt-1 p-1 text-xs border rounded"
                      >
                        <option value="helpful">Helpful</option>
                        <option value="formal">Formal</option>
                        <option value="friendly">Friendly</option>
                        <option value="concise">Concise</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Voice Responses</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSpeaking(!isSpeaking)}
                        className="h-6 px-2"
                      >
                        {isSpeaking ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Chat Interface */}
              <div className="flex-1 flex flex-col">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    ARIA - AI Assistant
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Online
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    Your intelligent assistant for PNG Digital ID services
                  </DialogDescription>
                </DialogHeader>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white ml-4'
                          : 'bg-gray-100 text-gray-900 mr-4'
                      }`}>
                        {message.type === 'ai' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-600">ARIA</span>
                            {message.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {message.confidence}% confident
                              </Badge>
                            )}
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="text-xs opacity-70 mt-2">
                          {formatTime(message.timestamp)}
                        </div>

                        {/* AI Suggestions */}
                        {message.suggestions && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium opacity-80">Suggestions:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-6 px-2"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI Actions */}
                        {message.actions && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium opacity-80">Quick Actions:</p>
                            <div className="space-y-1">
                              {message.actions.map((action) => (
                                <Button
                                  key={action.id}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-6 px-2 w-full justify-start"
                                  onClick={() => handleActionClick(action)}
                                >
                                  <Zap className="h-3 w-3 mr-1" />
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 mr-4 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-600">ARIA is thinking...</span>
                        </div>
                        <div className="flex space-x-1 mt-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask ARIA anything about PNG Digital ID..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-6 w-6 p-0"
                        onClick={handleVoiceInput}
                      >
                        {isListening ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isProcessing}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {isListening && (
                    <div className="mt-2 text-center">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                        <Mic className="h-3 w-3 mr-1" />
                        Listening... Speak now
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Status Indicator */}
      <div className="fixed bottom-6 left-6 z-40">
        <Card className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-xs font-medium text-purple-700">AI Assistant Active</p>
              <p className="text-xs text-purple-600">
                {aiCapabilities.filter(c => c.status === 'active').length} capabilities online
              </p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </Card>
      </div>
    </>
  );
}
