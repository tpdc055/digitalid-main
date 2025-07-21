"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  FileText,
  Phone,
  Clock,
  Globe,
  Shield,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
  attachments?: Attachment[];
}

interface QuickAction {
  label: string;
  action: string;
  icon?: React.ComponentType<any>;
}

interface Attachment {
  type: 'link' | 'document' | 'form';
  title: string;
  url: string;
  description?: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        quickActions: [
          { label: 'Apply for Birth Certificate', action: 'birth_certificate', icon: FileText },
          { label: 'Check Application Status', action: 'check_status', icon: Clock },
          { label: 'Contact Support', action: 'contact_support', icon: Phone },
          { label: 'Service Information', action: 'service_info', icon: Globe }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [language]);

  const getWelcomeMessage = () => {
    switch (language) {
      case 'tpi':
        return "Apinun! Mi PNG Gavman AI Assistant. Mi ken helpim yu wantaim ol gavman senis, aplikesen, na sampela askim. Olsem wanem mi ken helpim yu tude?";
      case 'ho':
        return "Boina! Au PNG Gavamani AI Assistant. Au abi helpim oiabu government hanua, application, ma sibosiboa aduaibe. Hevarai au abi helpim oiabu?";
      default:
        return "Hello! I'm the PNG Government AI Assistant. I can help you with government services, applications, and answer questions about Digital Government services. How can I assist you today?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      if (!isOpen || isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    const messageId = Date.now().toString();

    // Birth Certificate queries
    if (input.includes('birth certificate') || input.includes('bon setifiket') || input.includes('boina certificate')) {
      return {
        id: messageId,
        type: 'bot',
        content: language === 'tpi'
          ? "Bon setifiket askim i isi! Yu mas bringim:\n• Mama na papa ID\n• Buk bilong bon (hospital record)\n• K50 pe\n\nProcessing taim: 5-7 de. Yu laik mi helpim yu statim aplikesen?"
          : language === 'ho'
          ? "Boina certificate adua easy! Oiabu must bring:\n• Parent ID\n• Birth book (hospital record)\n• K50 fee\n\nProcessing time: 5-7 siga. Oiabu like au help start application?"
          : "Applying for a birth certificate is easy! You'll need:\n• Parent identification\n• Birth record from hospital\n• K50 processing fee\n\nProcessing time: 5-7 days. Would you like me to help you start the application?",
        timestamp: new Date(),
        quickActions: [
          { label: 'Start Application', action: 'start_birth_cert', icon: FileText },
          { label: 'Required Documents', action: 'birth_cert_docs', icon: FileText },
          { label: 'Check Fees', action: 'birth_cert_fees', icon: FileText }
        ],
        attachments: [
          {
            type: 'form',
            title: 'Birth Certificate Application Form',
            url: '/forms/birth-certificate',
            description: 'Complete online application form'
          }
        ]
      };
    }

    // Passport queries
    if (input.includes('passport') || input.includes('paspo')) {
      return {
        id: messageId,
        type: 'bot',
        content: language === 'tpi'
          ? "Paspo aplikesen i need:\n• Birth certificate\n• 2 photo (passport size)\n• K380 pe\n• Police clearance\n\nProcessing taim: 14-21 de. Emergency processing (7 de) cost K800."
          : language === 'ho'
          ? "Passport application need:\n• Birth certificate\n• 2 photo (passport size)\n• K380 fee\n• Police clearance\n\nProcessing time: 14-21 siga. Emergency processing (7 siga) cost K800."
          : "For passport applications you need:\n• Birth certificate\n• 2 passport-sized photos\n• K380 processing fee\n• Police clearance certificate\n\nProcessing time: 14-21 days. Express service (7 days) costs K800.",
        timestamp: new Date(),
        quickActions: [
          { label: 'Apply for Passport', action: 'start_passport', icon: FileText },
          { label: 'Photo Requirements', action: 'passport_photos', icon: FileText },
          { label: 'Nearest Office', action: 'passport_office', icon: Globe }
        ]
      };
    }

    // Status check queries
    if (input.includes('status') || input.includes('check') || input.includes('sekim') || input.includes('lukluk')) {
      return {
        id: messageId,
        type: 'bot',
        content: language === 'tpi'
          ? "Yu ken sekim aplikesen status long website. Yu need aplikesen ID namba. Taip aplikesen namba (example: APP-2024-001) na mi ken sekim long yu."
          : language === 'ho'
          ? "Oiabu abi check application status website. Oiabu need application ID number. Type application number (example: APP-2024-001) ma au abi check oiabu."
          : "You can check your application status online. You'll need your application ID number. Please provide your application ID (format: APP-2024-001) and I'll check it for you.",
        timestamp: new Date(),
        quickActions: [
          { label: 'Check Status', action: 'check_status', icon: Clock },
          { label: 'Track Application', action: 'track_app', icon: Globe }
        ]
      };
    }

    // Payment queries
    if (input.includes('payment') || input.includes('pay') || input.includes('pe') || input.includes('money')) {
      return {
        id: messageId,
        type: 'bot',
        content: language === 'tpi'
          ? "PNG Gavman pe sistem:\n• Online banking\n• Credit/debit card\n• Mobile money (FlexiPay, etc.)\n• Bank deposit\n• Cash long government office\n\nOl pe i save na secure. Yu gat receipt namba?"
          : language === 'ho'
          ? "PNG Government payment methods:\n• Online banking\n• Credit/debit card\n• Mobile money (FlexiPay, etc.)\n• Bank deposit\n• Cash government office\n\nPayments safe ma secure. Oiabu gat receipt number?"
          : "PNG Government accepts these payment methods:\n• Online banking transfer\n• Credit/debit cards\n• Mobile money (FlexiPay, etc.)\n• Bank deposit\n• Cash at government offices\n\nAll payments are secure and encrypted. Do you have a receipt number to verify?",
        timestamp: new Date(),
        quickActions: [
          { label: 'Make Payment', action: 'make_payment', icon: FileText },
          { label: 'Payment Methods', action: 'payment_methods', icon: FileText },
          { label: 'Receipt Verification', action: 'verify_receipt', icon: CheckCircle }
        ]
      };
    }

    // Emergency/urgent queries
    if (input.includes('urgent') || input.includes('emergency') || input.includes('kwik') || input.includes('hariap')) {
      return {
        id: messageId,
        type: 'bot',
        content: language === 'tpi'
          ? "Emergency senis i gat:\n• Passport express (7 de) - K800\n• Birth certificate urgent (2 de) - K150\n• Emergency contact: +675 320 0000\n\nYu mas bringim proof bilong emergency (medical, travel, etc.)"
          : language === 'ho'
          ? "Emergency service gat:\n• Passport express (7 siga) - K800\n• Birth certificate urgent (2 siga) - K150\n• Emergency contact: +675 320 0000\n\nOiabu must bring emergency proof (medical, travel, etc.)"
          : "Emergency services available:\n• Express passport processing (7 days) - K800\n• Urgent birth certificate (2 days) - K150\n• Emergency hotline: +675 320 0000\n\nYou must provide proof of emergency (medical, travel documentation, etc.)",
        timestamp: new Date(),
        quickActions: [
          { label: 'Emergency Contact', action: 'emergency_contact', icon: Phone },
          { label: 'Express Services', action: 'express_services', icon: Clock },
          { label: 'Required Proof', action: 'emergency_proof', icon: AlertCircle }
        ]
      };
    }

    // Operating hours queries
    if (input.includes('hours') || input.includes('open') || input.includes('time') || input.includes('taim') || input.includes('aua')) {
      return {
        id: messageId,
        type: 'bot',
        content: language === 'tpi'
          ? "Gavman office aua:\n• Monday-Friday: 8:00am - 4:30pm\n• Saturday: 8:00am - 12:00pm\n• Sunday: Pas\n\nOnline senis 24/7. Emergency hotline tu 24/7. Public holiday ol office i pas."
          : language === 'ho'
          ? "Government office hours:\n• Monday-Friday: 8:00am - 4:30pm\n• Saturday: 8:00am - 12:00pm\n• Sunday: Close\n\nOnline service 24/7. Emergency hotline tu 24/7. Public holiday office close."
          : "Government office hours:\n• Monday-Friday: 8:00am - 4:30pm\n• Saturday: 8:00am - 12:00pm\n• Sunday: Closed\n\nOnline services are available 24/7. Emergency hotline is also 24/7. Offices are closed on public holidays.",
        timestamp: new Date(),
        quickActions: [
          { label: 'Find Office', action: 'find_office', icon: Globe },
          { label: 'Public Holidays', action: 'public_holidays', icon: Clock },
          { label: 'Online Services', action: 'online_services', icon: Globe }
        ]
      };
    }

    // Default response with common topics
    return {
      id: messageId,
      type: 'bot',
      content: language === 'tpi'
        ? "Sori, mi no save gut long dispela askim. Tasol mi ken helpim yu wantaim:\n• Gavman senis aplikesen\n• Sekim aplikesen status\n• Pe na fees\n• Office aua na adres\n• Emergency contact\n\nYu laik mi helpim yu long wanem?"
        : language === 'ho'
        ? "Sorry, au no save gud dispela question. But au abi helpim oiabu:\n• Government service application\n• Check application status\n• Payment ma fees\n• Office hours ma address\n• Emergency contact\n\nOiabu like au help oiabu hevarai?"
        : "I'm sorry, I didn't quite understand that. But I can help you with:\n• Government service applications\n• Checking application status\n• Payment information and fees\n• Office hours and locations\n• Emergency contacts\n\nWhat would you like assistance with?",
      timestamp: new Date(),
      quickActions: [
        { label: 'Common Services', action: 'common_services', icon: FileText },
        { label: 'Contact Human Agent', action: 'human_agent', icon: User },
        { label: 'Service Directory', action: 'service_directory', icon: Globe }
      ]
    };
  };

  const handleQuickAction = (action: string) => {
    let responseContent = '';

    switch (action) {
      case 'birth_certificate':
        setInputValue('I need help with birth certificate application');
        break;
      case 'check_status':
        setInputValue('How can I check my application status?');
        break;
      case 'contact_support':
        setInputValue('I need to contact human support');
        break;
      case 'service_info':
        setInputValue('What government services are available?');
        break;
      default:
        setInputValue(action);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-500 text-white text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 shadow-xl transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/20 rounded-full">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm">PNG Gov AI Assistant</CardTitle>
              <p className="text-xs opacity-90">24/7 Citizen Support</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {message.quickActions && message.quickActions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {message.quickActions.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction(action.action)}
                          className="mr-2 mb-1 h-7 text-xs"
                        >
                          {action.icon && <action.icon className="h-3 w-3 mr-1" />}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-white dark:bg-gray-600 rounded border text-gray-900 dark:text-gray-100"
                        >
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-xs font-medium">{attachment.title}</p>
                            {attachment.description && (
                              <p className="text-xs opacity-70">{attachment.description}</p>
                            )}
                          </div>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'tpi' ? 'Raitim message...' : language === 'ho' ? 'Write message...' : 'Type your message...'}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              🤖 AI Assistant • Powered by Enhanced Security Framework
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
