import { useState } from 'react';
import { ArrowLeft, Send, Paperclip, Search, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';

interface ChatSupportPageProps {
  onNavigate: (page: string) => void;
}

export function ChatSupportPage({ onNavigate }: ChatSupportPageProps) {
  const [selectedChat, setSelectedChat] = useState('support');
  const [message, setMessage] = useState('');

  const chatList = [
    {
      id: 'support',
      name: 'Tastepedia Support',
      avatar: 'TS',
      lastMessage: 'How can we help you today?',
      time: '2:30 PM',
      unread: 0,
      online: true,
      type: 'support'
    },
    {
      id: 'driver1',
      name: 'David Chen (Driver)',
      avatar: 'DC',
      lastMessage: 'Im 5 minutes away!',
      time: '2:25 PM',
      unread: 1,
      online: true,
      type: 'driver'
    },
    {
      id: 'driver2',
      name: 'Sarah Parker (Driver)',
      avatar: 'SP',
      lastMessage: 'Delivered successfully',
      time: 'Yesterday',
      unread: 0,
      online: false,
      type: 'driver'
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'support',
      text: 'Hello! Welcome to Tastepedia Support. How can we assist you today?',
      time: '2:28 PM',
      isUser: false
    },
    {
      id: 2,
      sender: 'user',
      text: 'Hi! I have a question about my recent order.',
      time: '2:29 PM',
      isUser: true
    },
    {
      id: 3,
      sender: 'support',
      text: 'Of course! I\'d be happy to help. Can you please provide your order number?',
      time: '2:30 PM',
      isUser: false
    },
    {
      id: 4,
      sender: 'user',
      text: 'Sure, it\'s TP-2024-0142',
      time: '2:30 PM',
      isUser: true
    },
    {
      id: 5,
      sender: 'support',
      text: 'Thank you! Let me check that for you.',
      time: '2:30 PM',
      isUser: false,
      typing: false
    },
  ];

  const quickReplies = [
    'Track my order',
    'Cancel order',
    'Change address',
    'Payment issue'
  ];

  const currentChat = chatList.find(chat => chat.id === selectedChat);

  return (
    <div className="h-screen bg-background flex">
      {/* Chat List Sidebar */}
      <div className="w-full md:w-80 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="md:hidden p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Messages</h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 rounded-full"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {chatList.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-3 rounded-xl flex items-start gap-3 hover:bg-muted transition-colors mb-1 ${
                  selectedChat === chat.id ? 'bg-muted' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <div className={`${
                      chat.type === 'support' ? 'bg-primary' : 'bg-secondary'
                    } text-white flex items-center justify-center h-full w-full text-sm font-medium`}>
                      {chat.avatar}
                    </div>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-card rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {chat.name}
                    </h4>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <Badge className="ml-2 bg-primary text-white min-w-[20px] h-5 flex items-center justify-center px-1.5">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Thread */}
      <div className="hidden md:flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <div className={`${
                currentChat?.type === 'support' ? 'bg-primary' : 'bg-secondary'
              } text-white flex items-center justify-center h-full w-full text-sm font-medium`}>
                {currentChat?.avatar}
              </div>
            </Avatar>
            <div>
              <h3 className="font-semibold">{currentChat?.name}</h3>
              <p className="text-xs text-muted-foreground">
                {currentChat?.online ? 'Active now' : 'Offline'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="rounded-full">
              <Phone className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Video className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.isUser ? 'order-2' : 'order-1'}`}>
                  <div className={`p-3 rounded-2xl ${
                    msg.isUser
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${
                    msg.isUser ? 'text-right' : 'text-left'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Quick Replies */}
        <div className="p-3 border-t border-border bg-card">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickReplies.map((reply, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="rounded-full whitespace-nowrap hover:bg-primary hover:text-white hover:border-primary"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-end gap-2">
            <Button size="icon" variant="ghost" className="rounded-full flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[44px] max-h-32 resize-none rounded-2xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  // Handle send
                }
              }}
            />
            
            <Button
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90 flex-shrink-0"
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile: Show chat thread when chat is selected */}
      <div className="md:hidden flex-1 flex-col hidden">
        {/* This would be shown on mobile when a chat is selected */}
      </div>
    </div>
  );
}
