import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MoreVertical, Paperclip, Smile, Send, PhoneCall, Video, Info } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "me" | "contact";
  time: string;
  status?: "sent" | "delivered" | "read";
}

export default function WhatsAppInbox() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Olá! Gostaria de saber mais sobre a plataforma ERP.", sender: "contact", time: "09:30" },
    { id: "2", text: "Olá Roberto, bom dia! Claro, como posso te ajudar?", sender: "me", time: "09:32", status: "read" },
    { id: "3", text: "Quero saber se consigo integrar minhas lojas da Shopee e Mercado Livre.", sender: "contact", time: "09:35" },
  ]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    toast.success("Mensagem enviada com sucesso!");

    // Simulate delivered and read status
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "delivered" } : m));
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "read" } : m));
      }, 1000);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden p-4">
      <div className="w-full max-w-6xl mx-auto flex rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        
        {/* Left Sidebar - Contacts List */}
        <div className="w-[350px] bg-[#121212] flex flex-col border-r border-white/5">
          <div className="p-4 flex items-center justify-between border-b border-white/5 bg-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-white/10">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
              <h2 className="font-semibold tracking-tight">Inbox Liberty</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <Input 
                placeholder="Pesquisar conversa..." 
                className="pl-9 bg-black/40 border-white/10 focus-visible:ring-lime-500/30 text-sm"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 p-3 bg-white/5 cursor-pointer border-l-2 border-lime-400">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="https://i.pravatar.cc/150?img=11" />
                  <AvatarFallback>RO</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-medium text-sm truncate">Roberto Carlos</h3>
                    <span className="text-[11px] text-lime-400 font-medium">Agora</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">Quero saber se consigo integrar...</p>
                </div>
              </div>

              {[
                { name: "Mariana Souza", msg: "Obrigada, entendi perfeitamente.", time: "Ontem", img: "47" },
                { name: "João Pedro (Lead)", msg: "Você pode me mandar a proposta?", time: "Ontem", img: "33" },
                { name: "Suporte Técnico", msg: "Chamado resolvido.", time: "Terça", img: "68" },
              ].map((contact, i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${contact.img}`} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                      <span className="text-[11px] text-zinc-500">{contact.time}</span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{contact.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Area - Chat Window */}
        <div className="flex-1 bg-[url('https://cdn.whatsapp.net/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')] bg-repeat flex flex-col relative" style={{ backgroundColor: '#0B141A' }}>
          
          {/* Chat Header */}
          <div className="px-4 py-3 bg-[#202C33] flex items-center justify-between border-b border-white/5 shadow-sm z-10">
            <div className="flex items-center gap-4 cursor-pointer">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://i.pravatar.cc/150?img=11" />
                <AvatarFallback>RO</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium text-[15px]">Roberto Carlos</h2>
                <p className="text-xs text-zinc-400">Visto por último hoje às 09:35</p>
              </div>
            </div>
            <div className="flex gap-4 text-zinc-400">
              <Video className="w-5 h-5 cursor-pointer hover:text-white transition" />
              <PhoneCall className="w-5 h-5 cursor-pointer hover:text-white transition" />
              <div className="w-px h-5 bg-white/10 mx-1"></div>
              <Search className="w-5 h-5 cursor-pointer hover:text-white transition" />
              <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white transition" />
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 scroll-smooth"
          >
            <div className="flex justify-center mb-4">
              <span className="bg-[#182229] px-3 py-1 rounded-lg text-xs text-zinc-400 font-medium uppercase tracking-wider shadow-sm">
                Hoje
              </span>
            </div>

            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[65%] ${msg.sender === 'me' ? 'self-end' : 'self-start'}`}
              >
                <div 
                  className={`px-3 py-2 rounded-lg text-[14.5px] leading-relaxed shadow-sm relative ${
                    msg.sender === 'me' 
                      ? 'bg-[#005C4B] text-[#E9EDEF] rounded-tr-none' 
                      : 'bg-[#202C33] text-[#E9EDEF] rounded-tl-none'
                  }`}
                >
                  <span className="break-words">{msg.text}</span>
                  <div className="flex items-center justify-end gap-1 mt-1 -mb-1">
                    <span className="text-[10px] text-zinc-400">{msg.time}</span>
                    {msg.sender === 'me' && (
                      <span className="text-[14px]">
                        {msg.status === 'sent' && <span className="text-zinc-400">✓</span>}
                        {msg.status === 'delivered' && <span className="text-zinc-400">✓✓</span>}
                        {msg.status === 'read' && <span className="text-sky-400">✓✓</span>}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="px-4 py-3 bg-[#202C33] flex items-end gap-3 z-10">
            <div className="flex gap-4 pb-2 text-zinc-400">
              <Smile className="w-6 h-6 cursor-pointer hover:text-white transition" />
              <Paperclip className="w-6 h-6 cursor-pointer hover:text-white transition" />
            </div>
            <form onSubmit={handleSendMessage} className="flex-1">
              <Input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite uma mensagem" 
                className="bg-[#2A3942] border-none text-white h-11 focus-visible:ring-0 text-[15px]"
              />
            </form>
            <div className="pb-1.5">
              <Button 
                type="button" 
                onClick={handleSendMessage}
                disabled={!inputText.trim()} 
                size="icon" 
                className="bg-[#00A884] hover:bg-[#00A884]/90 text-white rounded-full h-10 w-10 shrink-0 shadow-md transition-transform active:scale-95"
              >
                <Send className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
