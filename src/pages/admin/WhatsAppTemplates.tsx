import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, CheckCircle2, Clock, MessageSquare, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  category: string;
  language: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  lastUpdated: string;
}

export default function WhatsAppTemplates() {
  const [templates, setTemplates] = useState<Template[]>([
    { id: "1", name: "boas_vindas_erp", category: "MARKETING", language: "pt_BR", status: "APPROVED", lastUpdated: "Hoje, 10:45" },
    { id: "2", name: "cobranca_fatura", category: "UTILITY", language: "pt_BR", status: "APPROVED", lastUpdated: "Ontem, 15:20" },
    { id: "3", name: "atualizacao_pedido_shopee", category: "UTILITY", language: "pt_BR", status: "PENDING", lastUpdated: "Hoje, 11:10" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", category: "MARKETING", body: "" });

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.body) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const created: Template = {
      id: Date.now().toString(),
      name: newTemplate.name.toLowerCase().replace(/\s+/g, '_'),
      category: newTemplate.category,
      language: "pt_BR",
      status: "PENDING",
      lastUpdated: "Agora mesmo"
    };

    setTemplates([created, ...templates]);
    setIsModalOpen(false);
    setNewTemplate({ name: "", category: "MARKETING", body: "" });
    toast.success("Modelo enviado para aprovação da Meta!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" /> Aprovado</span>;
      case "PENDING":
        return <span className="flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full"><Clock className="w-3.5 h-3.5" /> Em Análise</span>;
      default:
        return <span className="flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full">Rejeitado</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <LayoutTemplate className="w-8 h-8 text-lime-400" />
              Modelos de Mensagem
            </h1>
            <p className="text-zinc-400 mt-1">Gerencie seus templates do WhatsApp Business API aprovados pela Meta.</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lime-500 hover:bg-lime-600 text-black font-semibold shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo Modelo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] border-white/10 text-white sm:max-w-[500px]">
              <form onSubmit={handleCreateTemplate}>
                <DialogHeader>
                  <DialogTitle>Criar Novo Modelo (Template)</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Modelos precisam ser aprovados pela Meta antes de serem enviados aos clientes.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-5 py-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-300">Nome do Modelo</Label>
                    <Input 
                      id="name" 
                      placeholder="ex: promocao_black_friday" 
                      value={newTemplate.name}
                      onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
                      className="bg-black/50 border-white/10 focus-visible:ring-lime-500/50"
                    />
                    <p className="text-[11px] text-zinc-500">Apenas letras minúsculas e underlines.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Categoria</Label>
                    <Select value={newTemplate.category} onValueChange={v => setNewTemplate({...newTemplate, category: v})}>
                      <SelectTrigger className="bg-black/50 border-white/10">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                        <SelectItem value="MARKETING">Marketing (Ofertas, Novidades)</SelectItem>
                        <SelectItem value="UTILITY">Utilidade (Atualização de Pedido, Boleto)</SelectItem>
                        <SelectItem value="AUTHENTICATION">Autenticação (OTP, Códigos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body" className="text-zinc-300">Corpo da Mensagem</Label>
                    <Textarea 
                      id="body" 
                      placeholder="Olá {{1}}, tudo bem? Seu pedido da Shopee foi atualizado."
                      value={newTemplate.body}
                      onChange={e => setNewTemplate({...newTemplate, body: e.target.value})}
                      className="bg-black/50 border-white/10 min-h-[120px] focus-visible:ring-lime-500/50 resize-none"
                    />
                    <p className="text-[11px] text-zinc-500">Use {'{{1}}'}, {'{{2}}'} para variáveis dinâmicas.</p>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="hover:bg-white/5">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-lime-500 hover:bg-lime-600 text-black font-semibold">
                    Enviar para Análise
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and List */}
        <Card className="bg-[#121212] border-white/5 shadow-xl">
          <CardHeader className="pb-4 border-b border-white/5">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Meus Modelos</CardTitle>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                <Input 
                  placeholder="Buscar modelo..." 
                  className="pl-9 bg-black/40 border-white/10 focus-visible:ring-lime-500/30 text-sm h-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-black/20 hover:bg-black/20">
                <TableRow className="border-white/5">
                  <TableHead className="text-zinc-400 font-medium">Nome</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Categoria</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Idioma</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Status</TableHead>
                  <TableHead className="text-zinc-400 font-medium text-right">Última Atualização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((tpl) => (
                  <TableRow key={tpl.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                    <TableCell className="font-medium text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-zinc-500" />
                      {tpl.name}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-white/5 px-2 py-1 rounded text-zinc-300">
                        {tpl.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">{tpl.language}</TableCell>
                    <TableCell>
                      {getStatusBadge(tpl.status)}
                    </TableCell>
                    <TableCell className="text-right text-zinc-400 text-sm">
                      {tpl.lastUpdated}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
