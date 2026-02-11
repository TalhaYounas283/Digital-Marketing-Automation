import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  User,
  Loader2,
  ChevronRight,
  Trash2,
  HelpCircle,
  LayoutDashboard,
  Layers,
  Calendar,
  FileText,
  Mail,
  Users,
  BarChart3,
  Settings,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  actions?: Action[];
  isError?: boolean;
}

interface Action {
  label: string;
  path?: string;
  action?: () => void;
  icon?: React.ReactNode;
}

const getContextualHelp = (pathname: string): string => {
  switch (pathname) {
    case "/":
      return "Welcome to your Dashboard! I can help you understand your metrics or guide you to create your first campaign.";
    case "/campaigns":
      return "You're in the Campaign Manager. I can help you create a new campaign, analyze existing ones, or optimize your campaign strategy.";
    case "/generate":
      return "Ready to create content! Tell me what you need - social media posts, blog content, email copy, or ad headlines.";
    case "/calendar":
      return "Viewing your Content Calendar. I can help you schedule posts, plan your content strategy, or optimize posting times.";
    case "/templates":
      return "Browsing Templates. I can suggest the best template for your specific marketing goal or help you customize one.";
    case "/email":
      return "In Email Campaigns. I can help you craft subject lines, improve open rates, or create engaging email content.";
    case "/leads":
      return "Managing your Leads. I can help you prioritize leads, improve scoring, or suggest follow-up strategies.";
    case "/analytics":
      return "Reviewing Analytics. I can explain your metrics, identify trends, or suggest improvements based on your data.";
    case "/settings":
      return "In Settings. I can help you configure your account, but I cannot access or display any passwords or sensitive credentials.";
    default:
      return "How can I help you today?";
  }
};

const getQuickActions = (pathname: string): Action[] => {
  switch (pathname) {
    case "/":
      return [
        { label: "Create Campaign", path: "/campaigns", icon: <Layers size={14} /> },
        { label: "Generate Content", path: "/generate", icon: <Sparkles size={14} /> },
        { label: "View Analytics", path: "/analytics", icon: <BarChart3 size={14} /> },
      ];
    case "/campaigns":
      return [
        { label: "New Campaign", path: "/campaigns", icon: <CheckCircle2 size={14} /> },
        { label: "View Templates", path: "/templates", icon: <FileText size={14} /> },
        { label: "Check Calendar", path: "/calendar", icon: <Calendar size={14} /> },
      ];
    case "/generate":
      return [
        { label: "Social Media Post", path: "/generate", icon: <Sparkles size={14} /> },
        { label: "Email Content", path: "/email", icon: <Mail size={14} /> },
        { label: "Browse Templates", path: "/templates", icon: <FileText size={14} /> },
      ];
    case "/leads":
      return [
        { label: "Import Leads", path: "/leads", icon: <Users size={14} /> },
        { label: "Create Campaign", path: "/campaigns", icon: <Layers size={14} /> },
        { label: "View Analytics", path: "/analytics", icon: <BarChart3 size={14} /> },
      ];
    case "/email":
      return [
        { label: "New Campaign", path: "/email", icon: <Mail size={14} /> },
        { label: "View Templates", path: "/templates", icon: <FileText size={14} /> },
        { label: "Check Calendar", path: "/calendar", icon: <Calendar size={14} /> },
      ];
    default:
      return [
        { label: "Dashboard", path: "/", icon: <LayoutDashboard size={14} /> },
        { label: "Campaigns", path: "/campaigns", icon: <Layers size={14} /> },
        { label: "Help", path: "#", icon: <HelpCircle size={14} /> },
      ];
  }
};

export const KimiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize with contextual greeting
  useEffect(() => {
    const contextualGreeting = getContextualHelp(location.pathname);
    const quickActions = getQuickActions(location.pathname);
    
    setMessages([{
      id: "welcome",
      text: `👋 Hi! I'm Kimi, your AI assistant.\n\n${contextualGreeting}`,
      sender: "bot",
      timestamp: new Date(),
      actions: quickActions
    }]);
  }, []);

  // Update context when route changes
  useEffect(() => {
    if (isOpen) {
      const contextualHelp = getContextualHelp(location.pathname);
      const quickActions = getQuickActions(location.pathname);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `📍 You're now on ${getPageName(location.pathname)}.\n\n${contextualHelp}`,
        sender: "bot",
        timestamp: new Date(),
        actions: quickActions
      }]);
    }
  }, [location.pathname]);

  const getPageName = (pathname: string): string => {
    const names: Record<string, string> = {
      "/": "Dashboard",
      "/campaigns": "Campaigns",
      "/generate": "AI Content",
      "/calendar": "Content Calendar",
      "/templates": "Template Library",
      "/email": "Email Campaigns",
      "/leads": "Lead Management",
      "/analytics": "Analytics",
      "/settings": "Settings",
      "/profile": "Profile"
    };
    return names[pathname] || "AutoMarketer";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkSecurity = (text: string): boolean => {
    const sensitiveTerms = [
      "password", "pass", "pwd", "credential", "login", "auth", "token", 
      "secret", "key", "api key", "private", "secure", "encrypt", "decrypt"
    ];
    return sensitiveTerms.some(term => text.toLowerCase().includes(term));
  };

  const generateResponse = (userText: string): { text: string; actions?: Action[] } => {
    const lowerText = userText.toLowerCase();
    const currentPath = location.pathname;

    // Security check
    if (checkSecurity(userText)) {
      return {
        text: "🔒 **Security Notice**\n\nI cannot discuss passwords, credentials, API keys, or any sensitive authentication information. This is for your security.\n\nIf you need help with account security, please contact your administrator or use the Settings page.",
        actions: [
          { label: "Go to Settings", path: "/settings", icon: <Settings size={14} /> },
          { label: "Contact Support", path: "#", icon: <HelpCircle size={14} /> }
        ]
      };
    }

    // Help / How to use
    if (lowerText.includes("help") || lowerText.includes("how to") || lowerText.includes("guide")) {
      return {
        text: "🎯 **How can I assist you?**\n\nI can help you with:\n• Navigating the platform\n• Creating campaigns & content\n• Understanding analytics\n• Managing leads\n• Optimizing your marketing\n\nWhat would you like to do?",
        actions: getQuickActions(currentPath)
      };
    }

    // Campaign creation
    if (lowerText.includes("campaign") || lowerText.includes("create campaign")) {
      return {
        text: "🚀 **Creating a Campaign**\n\nTo create a new campaign:\n1. Go to Campaigns page\n2. Click 'Create Campaign'\n3. Fill in campaign details\n4. Set your target audience\n5. Launch or schedule\n\nWould you like me to take you there?",
        actions: [
          { label: "Go to Campaigns", path: "/campaigns", icon: <Layers size={14} /> },
          { label: "View Templates", path: "/templates", icon: <FileText size={14} /> }
        ]
      };
    }

    // Content generation
    if (lowerText.includes("content") || lowerText.includes("generate") || lowerText.includes("post") || lowerText.includes("write")) {
      return {
        text: "✨ **Content Generation**\n\nI can help you create:\n• Social media posts\n• Email copy\n• Blog content\n• Ad headlines\n• Marketing copy\n\nNavigate to the AI Content section to get started.",
        actions: [
          { label: "Generate Content", path: "/generate", icon: <Sparkles size={14} /> },
          { label: "Browse Templates", path: "/templates", icon: <FileText size={14} /> }
        ]
      };
    }

    // Analytics
    if (lowerText.includes("analytics") || lowerText.includes("stats") || lowerText.includes("performance") || lowerText.includes("metrics")) {
      return {
        text: "📊 **Analytics Overview**\n\nView your:\n• Campaign performance\n• Engagement metrics\n• Lead conversion rates\n• Email open/click rates\n• ROI calculations\n\nCheck the Analytics page for detailed insights.",
        actions: [
          { label: "View Analytics", path: "/analytics", icon: <BarChart3 size={14} /> },
          { label: "Dashboard", path: "/", icon: <LayoutDashboard size={14} /> }
        ]
      };
    }

    // Leads
    if (lowerText.includes("lead") || lowerText.includes("contact") || lowerText.includes("customer")) {
      return {
        text: "👥 **Lead Management**\n\nManage your leads by:\n• Importing contact lists\n• Scoring lead quality\n• Tracking interactions\n• Setting follow-up reminders\n• Converting leads to customers",
        actions: [
          { label: "Manage Leads", path: "/leads", icon: <Users size={14} /> },
          { label: "Create Campaign", path: "/campaigns", icon: <Layers size={14} /> }
        ]
      };
    }

    // Email
    if (lowerText.includes("email") || lowerText.includes("newsletter") || lowerText.includes("mail")) {
      return {
        text: "📧 **Email Campaigns**\n\nCreate effective email campaigns:\n• Use templates for consistency\n• Personalize subject lines\n• Schedule optimal send times\n• Track open and click rates\n• A/B test different versions",
        actions: [
          { label: "Email Campaigns", path: "/email", icon: <Mail size={14} /> },
          { label: "View Templates", path: "/templates", icon: <FileText size={14} /> }
        ]
      };
    }

    // Calendar
    if (lowerText.includes("calendar") || lowerText.includes("schedule") || lowerText.includes("plan")) {
      return {
        text: "📅 **Content Calendar**\n\nPlan your content strategy:\n• Schedule posts in advance\n• View all campaigns visually\n• Coordinate across platforms\n• Set reminders for deadlines\n• Maintain consistent posting",
        actions: [
          { label: "View Calendar", path: "/calendar", icon: <Calendar size={14} /> },
          { label: "Templates", path: "/templates", icon: <FileText size={14} /> }
        ]
      };
    }

    // Templates
    if (lowerText.includes("template")) {
      return {
        text: "📚 **Template Library**\n\nBrowse 50+ proven templates:\n• Welcome emails\n• Product launches\n• Promotional campaigns\n• Newsletters\n• Social media posts\n\nAll templates are customizable!",
        actions: [
          { label: "Browse Templates", path: "/templates", icon: <FileText size={14} /> },
          { label: "Generate Content", path: "/generate", icon: <Sparkles size={14} /> }
        ]
      };
    }

    // Navigation
    if (lowerText.includes("go to") || lowerText.includes("navigate") || lowerText.includes("open")) {
      return {
        text: "🧭 **Navigation**\n\nWhere would you like to go?",
        actions: [
          { label: "Dashboard", path: "/", icon: <LayoutDashboard size={14} /> },
          { label: "Campaigns", path: "/campaigns", icon: <Layers size={14} /> },
          { label: "Content", path: "/generate", icon: <Sparkles size={14} /> },
          { label: "Calendar", path: "/calendar", icon: <Calendar size={14} /> },
          { label: "Templates", path: "/templates", icon: <FileText size={14} /> },
          { label: "Email", path: "/email", icon: <Mail size={14} /> },
          { label: "Leads", path: "/leads", icon: <Users size={14} /> },
          { label: "Analytics", path: "/analytics", icon: <BarChart3 size={14} /> },
        ]
      };
    }

    // Default response - keep it short and actionable
    return {
      text: "🤔 I'm here to help you with AutoMarketer.\n\nTry asking me to:\n• Create a campaign\n• Generate content\n• Show analytics\n• Navigate to a specific page\n\nOr select an action below:",
      actions: getQuickActions(currentPath)
    };
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));

    const response = generateResponse(userMessage.text);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: "bot",
      timestamp: new Date(),
      actions: response.actions
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleAction = (action: Action) => {
    if (action.path && action.path !== "#") {
      navigate(action.path);
      setIsOpen(false);
    }
    if (action.action) {
      action.action();
    }
  };

  const clearChat = () => {
    const contextualGreeting = getContextualHelp(location.pathname);
    const quickActions = getQuickActions(location.pathname);
    
    setMessages([{
      id: Date.now().toString(),
      text: `👋 Chat cleared!\n\n${contextualGreeting}`,
      sender: "bot",
      timestamp: new Date(),
      actions: quickActions
    }]);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white px-5 py-4 rounded-2xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 group"
          title="Ask Kimi AI Assistant"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-md"></span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-sm">Kimi AI</span>
            <span className="text-[10px] text-blue-100">Ask me anything</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 transition-all duration-300">
      {/* Chat Window */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header - Professional Blue Design */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                Kimi AI
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  Assistant
                </span>
              </h3>
              <p className="text-blue-100 text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Ready to help
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 min-h-[350px] max-h-[450px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${message.sender === "user" ? "flex justify-end" : "flex justify-start"}`}
            >
              <div className={`max-w-[90%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} flex items-end gap-2`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user" 
                    ? "bg-blue-600" 
                    : "bg-gradient-to-br from-indigo-600 to-blue-700"
                }`}>
                  {message.sender === "user" ? (
                    <User className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : message.isError
                    ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-md"
                    : "bg-white text-slate-700 rounded-bl-md shadow-sm border border-slate-200"
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  
                  {/* Action Buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-current border-opacity-20">
                      {message.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAction(action)}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                            message.sender === "user"
                              ? "bg-white/20 hover:bg-white/30 text-white"
                              : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {action.icon}
                          {action.label}
                          <ChevronRight size={12} />
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <span className={`text-[10px] mt-2 block opacity-60 ${
                    message.sender === "user" ? "text-blue-100" : "text-slate-400"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-200">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about AutoMarketer..."
              className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={clearChat}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear chat
            </button>
            <span className="text-[10px] text-slate-400 font-medium">
              🔒 Secure • Context-Aware
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
