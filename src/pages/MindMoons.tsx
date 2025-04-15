import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useUniverse } from "@/contexts/UniverseContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import GradientText from "@/components/ui/GradientText";
import GlowingCard from "@/components/ui/GlowingCard";
import GradientButton from "@/components/ui/GradientButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrainCircuit,
  Send,
  Sparkles,
  MessageCircle,
  Lightbulb,
  Smile,
  Frown,
  Meh,
  RefreshCw,
  FileUp,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MindMoons = () => {
  const { currentUser, mood, setMood, motivationalQuote, setMotivationalQuote } = useUniverse();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string, timestamp: Date}[]>([
    {
      role: 'assistant',
      content: "👋 Hi there! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);
  
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      role: 'user' as const,
      content: chatMessage,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage("");
    setIsLoading(true);
    
    try {
      console.log('Sending message to Chatbase:', chatMessage);
      const { data, error } = await supabase.functions.invoke('supabase-chat', {
        body: { prompt: chatMessage }
      });
      
      if (error) {
        console.error('Chatbase API error:', error);
        throw new Error(error.message);
      }
      
      console.log('Received response from Chatbase:', data);
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: data.generatedText || "Sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Error calling Chatbase AI:", error);
      toast({
        title: "AI Chat Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to chat
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, there was an error processing your request. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleMoodChange = (newMood: "Happy" | "Stressed" | "Tired" | null) => {
    setMood(newMood);
    toast({
      title: "Mood Updated",
      description: `Your mood has been set to ${newMood || "neutral"}.`,
    });
  };
  
  const handleRefreshQuote = () => {
    // Simulated quotes - in a real app, these would come from an API
    const quotes = [
      "Believe you can and you're halfway there.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Don't watch the clock; do what it does. Keep going.",
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "The only way to do great work is to love what you do.",
      "Your time is limited, don't waste it living someone else's life."
    ];
    
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMotivationalQuote(newQuote);
    
    toast({
      title: "New Quote Generated",
      description: "Your motivational quote has been refreshed.",
    });
  };
  
  return (
    <div className="space-y-8">
      <header className="mb-8">
        <GradientText gradient="purple-pink" element="h1" className="text-3xl md:text-4xl font-bold mb-2">
          Mind Moons
        </GradientText>
        <p className="text-gray-400">Your mental wellness companion</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GlowingCard gradient="blue-purple" className="h-[600px] flex flex-col">
            <div className="p-4 border-b border-universe-card">
              <div className="flex items-center">
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarImage src="/chatbase-ai.png" />
                  <AvatarFallback className="bg-universe-neonPurple">
                    <BrainCircuit className="w-5 h-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold flex items-center">
                    AI Assistant
                    <Sparkles className="w-4 h-4 ml-2 text-universe-neonBlue" />
                  </h3>
                  <p className="text-xs text-gray-400">Powered by Chatbase</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.role === "user"
                      ? "bg-universe-neonPurple bg-opacity-20 ml-auto"
                      : "bg-universe-card"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-right text-xs text-gray-400 mt-1">
                    {format(message.timestamp, "h:mm a")}
                  </p>
                </div>
              ))}
              
              {isLoading && (
                <div className="bg-universe-card max-w-[80%] rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-universe-neonPurple animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-universe-neonPurple animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-universe-neonPurple animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-universe-card">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-universe-dark border-universe-card"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || isLoading}
                  className={cn(
                    "bg-universe-neonPurple hover:bg-universe-neonPurple/80",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Powered by Chatbase. Your conversations are not stored permanently.
              </p>
            </div>
          </GlowingCard>
        </div>
        
        <div className="space-y-6">
          <GlowingCard gradient="pink">
            <div className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Lightbulb className="mr-2 text-universe-neonPink" />
                Daily Motivation
              </h3>
              
              <blockquote className="border-l-4 border-universe-neonPink pl-4 py-2 italic">
                {motivationalQuote}
              </blockquote>
              
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleRefreshQuote}
                  variant="outline"
                  className="border-universe-neonPink text-universe-neonPink hover:bg-universe-neonPink hover:bg-opacity-10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Quote
                </Button>
              </div>
            </div>
          </GlowingCard>
          
          <GlowingCard gradient="blue">
            <div className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <MessageCircle className="mr-2 text-universe-neonBlue" />
                Mood Tracker
              </h3>
              
              <p className="text-sm text-gray-400 mb-3">How are you feeling today?</p>
              
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => handleMoodChange("Happy")}
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center p-3 h-auto",
                    mood === "Happy" ? "bg-green-500 bg-opacity-20 border-green-500" : "border-universe-card"
                  )}
                >
                  <Smile className="w-6 h-6 mb-1 text-green-400" />
                  <span className="text-sm">Happy</span>
                </Button>
                
                <Button
                  onClick={() => handleMoodChange("Stressed")}
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center p-3 h-auto",
                    mood === "Stressed" ? "bg-yellow-500 bg-opacity-20 border-yellow-500" : "border-universe-card"
                  )}
                >
                  <Meh className="w-6 h-6 mb-1 text-yellow-400" />
                  <span className="text-sm">Stressed</span>
                </Button>
                
                <Button
                  onClick={() => handleMoodChange("Tired")}
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center p-3 h-auto",
                    mood === "Tired" ? "bg-red-500 bg-opacity-20 border-red-500" : "border-universe-card"
                  )}
                >
                  <Frown className="w-6 h-6 mb-1 text-red-400" />
                  <span className="text-sm">Tired</span>
                </Button>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-400">
                  Current mood: <span className="font-medium text-white">{mood || "Not set"}</span>
                </p>
              </div>
            </div>
          </GlowingCard>
          
          <GlowingCard gradient="purple">
            <div className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <FileUp className="mr-2 text-universe-neonPurple" />
                Journal Entry
              </h3>
              
              <p className="text-sm text-gray-400 mb-3">Record your thoughts for the day</p>
              
              <Button
                variant="outline"
                className="w-full border-universe-neonPurple text-universe-neonPurple hover:bg-universe-neonPurple hover:bg-opacity-10"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </div>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
};

export default MindMoons;
