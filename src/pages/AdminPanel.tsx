import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  RefreshCw, LogOut, Copy, ExternalLink, Lock, ChevronRight,
  Kanban, Users, Briefcase, CheckSquare, BarChart2, UserCircle,
  Search, Filter, Download, Plus, X, PhoneCall,
  Phone, MessageCircle, Mail, Circle, Check, Trash2, AlertTriangle, Calendar, Clock,
  Zap, Link2, Database, Bot, Send, Pause, Play, Inbox,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLeads, useUpdateLeadStatus, useUpdateLead, useDeleteLead } from '@/hooks/useLeads'
import { useCreateLead } from '@/hooks/useCreateLead'
import { useAtividades, useCreateAtividade, useConcluirAtividade, useReabrirAtividade, useDeleteAtividade } from '@/hooks/useAtividades'
import { supabase } from '@/lib/supabase'
import type { Lead, LeadStatus, Atividade, AtividadeTipo, Conversa, Mensagem } from '@/lib/supabase'
import { useConversas, useMensagens, useCreateConversa, useUpdateConversa, useEnviarMensagem, useGerarRespostaIA } from '@/hooks/useConversas'

// ─── Pipeline config ──────────────────────────────────────────────────────────

const STAGES: { value: LeadStatus; label: string; color: string; border: string; badge: string }[] = [
  { value: 'novo',              label: 'Novo Lead',        color: 'text-blue-300',    border: 'border-t-blue-500',    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'em_contato',       label: 'Em Contato',       color: 'text-yellow-300',  border: 'border-t-yellow-500',  badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { value: 'qualificado',      label: 'Qualificado',      color: 'text-purple-300',  border: 'border-t-purple-500',  badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { value: 'proposta_enviada', label: 'Proposta Enviada', color: 'text-orange-300',  border: 'border-t-orange-500',  badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { value: 'negociacao',       label: 'Em Negociação',    color: 'text-cyan-300',    border: 'border-t-cyan-500',    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { value: 'ganho',            label: 'Ganho ✓',          color: 'text-emerald-300', border: 'border-t-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { value: 'perdido',          label: 'Perdido ✗',        color: 'text-red-300',     border: 'border-t-red-500',     badge: 'bg-red-500/20 text-red-300 border-red-500/30' },
]

const faturamentoOptions = [
  'Ainda não faturei',
  'Até R$5k/mês',
  'R$5k a R$20k/mês',
  'R$20k a R$50k/mês',
  'Acima de R$50k/mês',
] as const

function stageConfig(status: LeadStatus) {
  return STAGES.find((s) => s.value === status) ?? STAGES[0]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (d > 0) return `há ${d}d`
  if (h > 0) return `há ${h}h`
  return `há ${m}min`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function openWA(whatsapp: string) {
  window.open(`https://wa.me/55${whatsapp.replace(/\D/g, '')}`, '_blank')
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function exportCSV(leads: Lead[]) {
  const headers = ['Nome', 'WhatsApp', 'Faturamento', 'Serviço', 'Status', 'Valor Estimado', 'Instagram', 'Observações', 'Criado em']
  const rows = leads.map((l) => [
    l.nome,
    l.whatsapp,
    l.faturamento,
    l.servico_interesse ?? '',
    stageConfig(l.status).label,
    l.valor_estimado ? `R$ ${l.valor_estimado}` : '',
    l.instagram ?? '',
    l.observacoes ?? '',
    formatDate(l.created_at),
  ])
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'pipeline',    label: 'Pipeline',    icon: Kanban,       active: true },
  { id: 'inbox',       label: 'Inbox IA',    icon: Inbox,        active: true },
  { id: 'contatos',    label: 'Contatos',    icon: Users,        active: true },
  { id: 'negocios',    label: 'Negócios',    icon: Briefcase,    active: true },
  { id: 'atividades',  label: 'Atividades',  icon: CheckSquare,  active: true },
  { id: 'relatorios',  label: 'Relatórios',  icon: BarChart2,    active: false },
  { id: 'integracoes', label: 'Integrações', icon: Zap,          active: true },
]

function Sidebar({ active, onNavigate, onLogout }: {
  active: string
  onNavigate: (id: string) => void
  onLogout: () => void
}) {
  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen bg-card border-r border-foreground/8 sticky top-0">
      <div className="px-5 py-5 border-b border-foreground/8">
        <span className="font-orbitron font-bold text-lg tracking-tighter text-foreground">
          LIBERTY<span className="text-primary">.</span>
        </span>
        <p className="text-muted-foreground text-[10px] uppercase tracking-widest mt-0.5">CRM</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id
          const isAvailable = item.active
          return (
            <button
              key={item.id}
              onClick={() => isAvailable && onNavigate(item.id)}
              disabled={!isAvailable}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left
                ${isActive && isAvailable
                  ? 'bg-primary/10 text-primary font-medium'
                  : isAvailable
                    ? 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                    : 'text-muted-foreground/30 cursor-not-allowed'
                }`}
            >
              <item.icon size={16} className="shrink-0" />
              <span>{item.label}</span>
              {!isAvailable && (
                <span className="ml-auto text-[9px] uppercase tracking-wider text-muted-foreground/30">Em breve</span>
              )}
            </button>
          )
        })}
      </nav>

      <Separator className="bg-foreground/8" />

      <div className="px-3 py-3 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors">
          <UserCircle size={16} className="shrink-0" />
          <span>Meu Perfil</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}

// ─── Lead Sheet ───────────────────────────────────────────────────────────────

function LeadSheet({ lead, open, onClose }: { lead: Lead | null; open: boolean; onClose: () => void }) {
  const updateLead = useUpdateLead()
  const [obs, setObs] = useState(lead?.observacoes ?? '')
  const [valor, setValor] = useState(lead?.valor_estimado?.toString() ?? '')
  const [status, setStatus] = useState<LeadStatus>(lead?.status ?? 'novo')

  if (!lead) return null

  const handleSave = () => {
    updateLead.mutate({
      id: lead.id,
      observacoes: obs || null,
      valor_estimado: valor ? parseFloat(valor.replace(',', '.')) : null,
      status,
    })
    onClose()
  }

  const cfg = stageConfig(status)

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[420px] max-w-full bg-card border-foreground/10 overflow-y-auto p-0">
        <SheetHeader className="px-6 py-5 border-b border-foreground/10">
          <SheetTitle className="font-orbitron text-lg text-foreground">{lead.nome}</SheetTitle>
          <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border w-fit ${cfg.badge}`}>
            {cfg.label}
          </span>
        </SheetHeader>

        <div className="px-6 py-5 space-y-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Contato</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground font-mono">{lead.whatsapp}</span>
                <button onClick={() => openWA(lead.whatsapp)} className="text-muted-foreground hover:text-primary" title="Abrir WA">
                  <ExternalLink size={13} />
                </button>
                <button onClick={() => copyText(lead.whatsapp)} className="text-muted-foreground hover:text-primary" title="Copiar">
                  <Copy size={13} />
                </button>
              </div>
              {lead.instagram && (
                <a
                  href={`https://instagram.com/${lead.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline block"
                >
                  {lead.instagram.startsWith('@') ? lead.instagram : `@${lead.instagram}`}
                </a>
              )}
            </div>
          </div>

          <Separator className="bg-foreground/10" />

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Negócio</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Serviço</p>
                  <p className="text-foreground">{lead.servico_interesse || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Faturamento</p>
                  <p className="text-foreground">{lead.faturamento}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs mb-1">Valor Estimado</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <Input
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                    className="pl-8 bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground"
                  />
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs mb-1">Etapa do Pipeline</p>
                <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
                  <SelectTrigger className={`border ${cfg.badge}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-foreground/15">
                    {STAGES.map((s) => (
                      <SelectItem key={s.value} value={s.value} className={`text-xs ${s.badge}`}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="bg-foreground/10" />

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Observações</p>
            <Textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Notas sobre este lead..."
              rows={4}
              className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground text-sm resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={updateLead.isPending}
            className="neon-button w-full py-3 font-bold disabled:opacity-50"
          >
            {updateLead.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Criado em {formatDate(lead.created_at)}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Add Contact Modal ────────────────────────────────────────────────────────

function AddContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createLead = useCreateLead()
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [faturamento, setFaturamento] = useState('')
  const [instagram, setInstagram] = useState('')
  const [servico, setServico] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (nome.trim().length < 2) errs.nome = 'Nome obrigatório'
    if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(whatsapp)) errs.whatsapp = 'Formato: (11) 99999-9999'
    if (!faturamento) errs.faturamento = 'Selecione o faturamento'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    await createLead.mutateAsync({
      nome: nome.trim(),
      whatsapp,
      faturamento: faturamento as typeof faturamentoOptions[number],
      instagram: instagram || undefined,
      servico_interesse: servico || undefined,
    })
    setNome(''); setWhatsapp(''); setFaturamento(''); setInstagram(''); setServico('')
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-foreground/15 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-lg">Novo Contato</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nome completo *</label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome"
              className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground" />
            {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome}</p>}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">WhatsApp *</label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(maskPhone(e.target.value))}
              placeholder="(11) 99999-9999" maxLength={15}
              className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground" />
            {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Faturamento mensal *</label>
            <Select value={faturamento} onValueChange={setFaturamento}>
              <SelectTrigger className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent className="bg-card border-foreground/15">
                {faturamentoOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-foreground focus:bg-primary/10">{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.faturamento && <p className="text-red-400 text-xs mt-1">{errors.faturamento}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Instagram</label>
              <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@negocio"
                className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Serviço</label>
              <Input value={servico} onChange={(e) => setServico(e.target.value)} placeholder="Ex: Automação"
                className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground" />
            </div>
          </div>
          <button onClick={handleSubmit} disabled={createLead.isPending}
            className="neon-button w-full py-3 font-bold disabled:opacity-60">
            {createLead.isPending ? 'Salvando...' : 'Adicionar Contato'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Lead Card ────────────────────────────────────────────────────────────────

function LeadCard({ lead, onOpen, onDragStart }: { lead: Lead; onOpen: (lead: Lead) => void; onDragStart: (lead: Lead) => void }) {
  const updateStatus = useUpdateLeadStatus()
  const cfg = stageConfig(lead.status)

  return (
    <div
      draggable
      onDragStart={() => onDragStart(lead)}
      className="bg-background/60 border border-foreground/8 hover:border-foreground/20 rounded-xl p-4 transition-colors cursor-grab active:cursor-grabbing active:opacity-60 active:scale-95"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <button onClick={() => onOpen(lead)} className="font-semibold text-sm text-foreground hover:text-primary transition-colors text-left leading-tight">
          {lead.nome}
        </button>
        <button onClick={() => onOpen(lead)} className="text-muted-foreground hover:text-primary shrink-0 mt-0.5">
          <ChevronRight size={14} />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
        {lead.servico_interesse || 'Sem serviço'} · {lead.faturamento}
      </p>
      {lead.valor_estimado && (
        <p className="text-xs text-emerald-400 font-medium mb-2">
          R$ {lead.valor_estimado.toLocaleString('pt-BR')}
        </p>
      )}
      <div className="flex items-center gap-1.5 mb-3">
        <button onClick={() => openWA(lead.whatsapp)} className="text-primary hover:text-primary/80 text-xs font-mono truncate max-w-[120px]">
          {lead.whatsapp}
        </button>
        <button onClick={() => openWA(lead.whatsapp)} className="text-muted-foreground hover:text-primary shrink-0"><ExternalLink size={11} /></button>
        <button onClick={() => copyText(lead.whatsapp)} className="text-muted-foreground hover:text-primary shrink-0"><Copy size={11} /></button>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted-foreground">{timeAgo(lead.created_at)}</span>
        <Select value={lead.status} onValueChange={(v) => updateStatus.mutate({ id: lead.id, status: v as LeadStatus })}>
          <SelectTrigger className={`h-6 text-[10px] border px-2 w-auto max-w-[130px] ${cfg.badge}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-foreground/15">
            {STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value} className={`text-xs ${s.badge}`}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({ stage, leads, onOpen, onDragStart, onDrop }: {
  stage: typeof STAGES[number]
  leads: Lead[]
  onOpen: (lead: Lead) => void
  onDragStart: (lead: Lead) => void
  onDrop: (status: LeadStatus) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div
      className={`min-w-[260px] w-[260px] flex flex-col rounded-xl border border-t-2 ${stage.border} bg-card/20 transition-colors ${
        isDragOver ? 'border-primary/60 bg-primary/5' : 'border-foreground/8'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => { setIsDragOver(false); onDrop(stage.value) }}
    >
      <div className="px-4 py-3 flex items-center justify-between border-b border-foreground/8">
        <span className={`text-xs font-bold uppercase tracking-wider ${stage.color}`}>{stage.label}</span>
        <Badge className={`text-[10px] px-1.5 py-0 border ${stage.badge}`}>{leads.length}</Badge>
      </div>
      <div className={`flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-160px)] min-h-[80px] transition-colors ${isDragOver ? 'bg-primary/5 rounded-b-xl' : ''}`}>
        {leads.length === 0 ? (
          <p className={`text-center text-xs py-8 transition-colors ${isDragOver ? 'text-primary/60' : 'text-muted-foreground/40'}`}>
            {isDragOver ? 'Soltar aqui' : 'Nenhum lead'}
          </p>
        ) : (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} onOpen={onOpen} onDragStart={onDragStart} />)
        )}
        {isDragOver && leads.length > 0 && (
          <div className="border-2 border-dashed border-primary/40 rounded-xl h-16 flex items-center justify-center">
            <span className="text-primary/60 text-xs">Soltar aqui</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Pipeline View ────────────────────────────────────────────────────────────

function PipelineView({ leads, isLoading, onOpen }: {
  leads: Lead[]
  isLoading: boolean
  onOpen: (lead: Lead) => void
}) {
  const [dragging, setDragging] = useState<Lead | null>(null)
  const updateStatus = useUpdateLeadStatus()

  const byStage = useMemo(() => {
    const map: Record<LeadStatus, Lead[]> = {
      novo: [], em_contato: [], qualificado: [], proposta_enviada: [], negociacao: [], ganho: [], perdido: [],
    }
    leads.forEach((l) => { map[l.status]?.push(l) })
    return map
  }, [leads])

  const handleDrop = (status: LeadStatus) => {
    if (!dragging || dragging.status === status) return
    updateStatus.mutate({ id: dragging.id, status })
    setDragging(null)
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Carregando pipeline...</div>
      ) : (
        <div className="flex gap-3 min-w-max pb-4">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage.value}
              stage={stage}
              leads={byStage[stage.value]}
              onOpen={onOpen}
              onDragStart={setDragging}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Contatos View ────────────────────────────────────────────────────────────

function ContatosView({ leads, isLoading, onOpen }: {
  leads: Lead[]
  isLoading: boolean
  onOpen: (lead: Lead) => void
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [faturamentoFilter, setFaturamentoFilter] = useState<string>('todos')
  const [addOpen, setAddOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const deleteLead = useDeleteLead()

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase()
      const matchSearch = !q || l.nome.toLowerCase().includes(q) || l.whatsapp.includes(q) || (l.instagram ?? '').toLowerCase().includes(q)
      const matchStatus = statusFilter === 'todos' || l.status === statusFilter
      const matchFat = faturamentoFilter === 'todos' || l.faturamento === faturamentoFilter
      return matchSearch && matchStatus && matchFat
    })
  }, [leads, search, statusFilter, faturamentoFilter])

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('todos')
    setFaturamentoFilter('todos')
  }

  const hasFilters = search || statusFilter !== 'todos' || faturamentoFilter !== 'todos'

  return (
    <div className="flex-1 overflow-auto flex flex-col">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-foreground/8 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nome ou WhatsApp..."
            className="pl-8 h-9 bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs bg-background/50 border-foreground/15 w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-foreground/15">
              <SelectItem value="todos" className="text-xs text-foreground">Todos os status</SelectItem>
              {STAGES.map((s) => (
                <SelectItem key={s.value} value={s.value} className={`text-xs ${s.badge}`}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Faturamento filter */}
        <Select value={faturamentoFilter} onValueChange={setFaturamentoFilter}>
          <SelectTrigger className="h-9 text-xs bg-background/50 border-foreground/15 w-[160px]">
            <SelectValue placeholder="Faturamento" />
          </SelectTrigger>
          <SelectContent className="bg-card border-foreground/15">
            <SelectItem value="todos" className="text-xs text-foreground">Todo faturamento</SelectItem>
            {faturamentoOptions.map((opt) => (
              <SelectItem key={opt} value={opt} className="text-xs text-foreground">{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <button onClick={clearFilters} className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground border border-foreground/15 rounded-md flex items-center gap-1.5 transition-colors">
            <X size={12} /> Limpar
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => exportCSV(filtered)}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground border border-foreground/15 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} /> Exportar CSV
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="neon-button h-9 px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus size={13} /> Novo Contato
          </button>
        </div>
      </div>

      {/* Result count */}
      <div className="px-6 py-2.5 border-b border-foreground/8 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {filtered.length} contato{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          {hasFilters && ` (de ${leads.length} total)`}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Carregando contatos...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
            <Users size={32} className="opacity-20" />
            {hasFilters ? 'Nenhum contato encontrado com esses filtros.' : 'Nenhum lead cadastrado ainda.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card/90 backdrop-blur-sm border-b border-foreground/8 z-10">
              <tr>
                {['Nome', 'WhatsApp', 'E-mail', 'Faturamento', 'Serviço', 'Status', 'Origem', 'Valor', 'Criado em', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] text-muted-foreground uppercase tracking-wider font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const cfg = stageConfig(lead.status)
                return (
                  <tr
                    key={lead.id}
                    onClick={() => onOpen(lead)}
                    className={`border-b border-foreground/5 hover:bg-foreground/5 cursor-pointer transition-colors ${i % 2 === 0 ? '' : 'bg-foreground/[0.02]'}`}
                  >
                    {/* Nome */}
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {lead.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{lead.nome}</p>
                          {lead.instagram && (
                            <p className="text-[11px] text-muted-foreground">{lead.instagram.startsWith('@') ? lead.instagram : `@${lead.instagram}`}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* WhatsApp */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-primary">{lead.whatsapp}</span>
                        <button onClick={() => openWA(lead.whatsapp)} className="text-muted-foreground hover:text-primary" title="Abrir WhatsApp">
                          <PhoneCall size={12} />
                        </button>
                        <button onClick={() => copyText(lead.whatsapp)} className="text-muted-foreground hover:text-primary" title="Copiar">
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>

                    {/* E-mail */}
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px] truncate">
                      {lead.email
                        ? <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="hover:text-primary transition-colors">{lead.email}</a>
                        : <span className="text-muted-foreground/30">—</span>
                      }
                    </td>

                    {/* Faturamento */}
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{lead.faturamento}</td>

                    {/* Serviço */}
                    <td className="px-4 py-3 text-xs text-foreground/70 max-w-[140px] truncate">
                      {lead.servico_interesse || <span className="text-muted-foreground/40">—</span>}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border whitespace-nowrap ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </td>

                    {/* Origem */}
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {lead.utm_source
                        ? <span className="capitalize text-primary/80 font-medium">{lead.utm_source}</span>
                        : <span className="text-muted-foreground/40">—</span>
                      }
                    </td>

                    {/* Valor */}
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {lead.valor_estimado
                        ? <span className="text-emerald-400 font-medium">R$ {lead.valor_estimado.toLocaleString('pt-BR')}</span>
                        : <span className="text-muted-foreground/40">—</span>
                      }
                    </td>

                    {/* Criado em */}
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{timeAgo(lead.created_at)}</td>

                    {/* Action */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <ChevronRight size={14} className="text-muted-foreground/40" />
                        {confirmDeleteId === lead.id ? (
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              onClick={() => {
                                deleteLead.mutate(lead.id)
                                setConfirmDeleteId(null)
                              }}
                              className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-[10px] px-2 py-0.5 rounded bg-foreground/5 text-muted-foreground border border-foreground/10 hover:bg-foreground/10 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(lead.id)}
                            className="ml-1 text-muted-foreground/30 hover:text-red-400 transition-colors"
                            title="Excluir lead"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <AddContactModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}

// ─── Negócios View ───────────────────────────────────────────────────────────

const STAGE_BAR_COLORS: Record<LeadStatus, string> = {
  novo: 'bg-blue-500',
  em_contato: 'bg-yellow-500',
  qualificado: 'bg-purple-500',
  proposta_enviada: 'bg-orange-500',
  negociacao: 'bg-cyan-500',
  ganho: 'bg-emerald-500',
  perdido: 'bg-red-500',
}

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function NegociosView({ leads, isLoading, onOpen }: {
  leads: Lead[]
  isLoading: boolean
  onOpen: (lead: Lead) => void
}) {
  const stats = useMemo(() => {
    const comValor = leads.filter((l) => l.valor_estimado != null)
    const ganhos = comValor.filter((l) => l.status === 'ganho')
    const emAndamento = comValor.filter((l) => l.status !== 'ganho' && l.status !== 'perdido')
    const total = comValor.reduce((s, l) => s + (l.valor_estimado ?? 0), 0)
    const totalGanho = ganhos.reduce((s, l) => s + (l.valor_estimado ?? 0), 0)
    const totalAndamento = emAndamento.reduce((s, l) => s + (l.valor_estimado ?? 0), 0)
    const ticket = comValor.length > 0 ? total / comValor.length : 0
    return { total, totalGanho, totalAndamento, ticket, comValor: comValor.length, ganhos: ganhos.length, emAndamento: emAndamento.length }
  }, [leads])

  const stageData = useMemo(() => {
    return STAGES.map((stage) => {
      const stageLeads = leads.filter((l) => l.status === stage.value && l.valor_estimado != null)
      const valor = stageLeads.reduce((s, l) => s + (l.valor_estimado ?? 0), 0)
      return { ...stage, valor, count: stageLeads.length }
    })
  }, [leads])

  const maxValor = Math.max(...stageData.map((s) => s.valor), 1)

  const dealsComValor = useMemo(() =>
    leads.filter((l) => l.valor_estimado != null).sort((a, b) => (b.valor_estimado ?? 0) - (a.valor_estimado ?? 0)),
    [leads]
  )
  const dealsSemValor = useMemo(() =>
    leads.filter((l) => l.valor_estimado == null),
    [leads]
  )

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Carregando negócios...</div>
  }

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Pipeline Total',
            value: `R$ ${fmt(stats.total)}`,
            sub: `${stats.comValor} deal${stats.comValor !== 1 ? 's' : ''} com valor`,
            icon: Briefcase,
            color: 'text-primary',
            border: 'border-primary/20',
            bg: 'bg-primary/5',
          },
          {
            label: 'Ganho',
            value: `R$ ${fmt(stats.totalGanho)}`,
            sub: `${stats.ganhos} fechado${stats.ganhos !== 1 ? 's' : ''}`,
            icon: BarChart2,
            color: 'text-emerald-400',
            border: 'border-emerald-500/20',
            bg: 'bg-emerald-500/5',
          },
          {
            label: 'Em Andamento',
            value: `R$ ${fmt(stats.totalAndamento)}`,
            sub: `${stats.emAndamento} oportunidade${stats.emAndamento !== 1 ? 's' : ''}`,
            icon: RefreshCw,
            color: 'text-cyan-400',
            border: 'border-cyan-500/20',
            bg: 'bg-cyan-500/5',
          },
          {
            label: 'Ticket Médio',
            value: `R$ ${fmt(stats.ticket)}`,
            sub: 'por deal com valor',
            icon: ChevronRight,
            color: 'text-orange-400',
            border: 'border-orange-500/20',
            bg: 'bg-orange-500/5',
          },
        ].map((card) => (
          <div key={card.label} className={`rounded-xl border ${card.border} ${card.bg} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{card.label}</span>
              <card.icon size={16} className={card.color} />
            </div>
            <p className={`font-orbitron font-bold text-xl ${card.color} mb-1`}>{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Valor por Etapa */}
      <div className="rounded-xl border border-foreground/8 bg-card/20 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-5 uppercase tracking-wider">Valor por Etapa</h3>
        <div className="space-y-3">
          {stageData.filter((s) => s.value !== 'perdido').map((stage) => (
            <div key={stage.value} className="flex items-center gap-4">
              <span className={`text-xs font-medium w-36 shrink-0 ${stage.color}`}>{stage.label}</span>
              <div className="flex-1 h-2 bg-foreground/8 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${STAGE_BAR_COLORS[stage.value]}`}
                  style={{ width: stage.valor > 0 ? `${(stage.valor / maxValor) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex items-center gap-3 shrink-0 w-40 justify-end">
                <span className="text-xs text-foreground font-medium">
                  {stage.valor > 0 ? `R$ ${fmt(stage.valor)}` : <span className="text-muted-foreground/40">—</span>}
                </span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full border ${stage.badge}`}>
                  {stage.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de Deals com Valor */}
      <div className="rounded-xl border border-foreground/8 bg-card/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-foreground/8 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Deals com Valor Definido
          </h3>
          <span className="text-xs text-muted-foreground">{dealsComValor.length} deals</span>
        </div>
        {dealsComValor.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm gap-2">
            <Briefcase size={32} className="opacity-20" />
            <p>Nenhum deal com valor definido.</p>
            <p className="text-xs">Abra um contato e adicione o valor estimado.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-foreground/8 bg-card/40">
              <tr>
                {['Nome', 'Etapa', 'Valor', 'Faturamento', 'Serviço', 'Criado'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dealsComValor.map((lead, i) => {
                const cfg = stageConfig(lead.status)
                return (
                  <tr
                    key={lead.id}
                    onClick={() => onOpen(lead)}
                    className={`border-b border-foreground/5 hover:bg-foreground/5 cursor-pointer transition-colors ${i % 2 === 0 ? '' : 'bg-foreground/[0.02]'}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {lead.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-foreground">{lead.nome}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border whitespace-nowrap ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-emerald-400 font-bold text-sm">R$ {fmt(lead.valor_estimado ?? 0)}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">{lead.faturamento}</td>
                    <td className="px-5 py-3 text-xs text-foreground/70 max-w-[140px] truncate">
                      {lead.servico_interesse || <span className="text-muted-foreground/40">—</span>}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">{timeAgo(lead.created_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Deals sem valor */}
      {dealsSemValor.length > 0 && (
        <div className="rounded-xl border border-foreground/8 bg-foreground/[0.02] overflow-hidden">
          <div className="px-6 py-4 border-b border-foreground/8 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Sem Valor Definido
            </h3>
            <span className="text-xs text-muted-foreground">{dealsSemValor.length} contatos</span>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {dealsSemValor.map((lead, i) => {
                const cfg = stageConfig(lead.status)
                return (
                  <tr
                    key={lead.id}
                    onClick={() => onOpen(lead)}
                    className={`border-b border-foreground/5 hover:bg-foreground/5 cursor-pointer transition-colors ${i % 2 === 0 ? '' : 'bg-foreground/[0.02]'}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-muted-foreground text-xs font-bold shrink-0">
                          {lead.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-foreground/70">{lead.nome}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border whitespace-nowrap ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">{lead.faturamento}</td>
                    <td className="px-5 py-3 text-xs text-foreground/60 max-w-[140px] truncate">
                      {lead.servico_interesse || <span className="text-muted-foreground/40">—</span>}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">{timeAgo(lead.created_at)}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpen(lead) }}
                        className="text-[11px] text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/60 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Plus size={10} /> Adicionar valor
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Atividades ───────────────────────────────────────────────────────────────

const TIPO_CONFIG: Record<AtividadeTipo, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  ligacao:  { icon: Phone,         label: 'Ligação',  color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20'   },
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20'  },
  email:    { icon: Mail,          label: 'E-mail',   color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  reuniao:  { icon: Users,         label: 'Reunião',  color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  outro:    { icon: Circle,        label: 'Outro',    color: 'text-gray-400',   bg: 'bg-gray-500/10 border-gray-500/20'   },
}

function formatPrazo(prazo: string | null): string {
  if (!prazo) return 'Sem prazo'
  const d = new Date(prazo)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffMs < 0) {
    const atrasoH = Math.abs(diffH)
    const atrasoD = Math.abs(diffD)
    if (atrasoD > 0) return `${atrasoD}d atrasada`
    return `${atrasoH}h atrasada`
  }
  if (diffD === 0) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (diffD === 1) return 'Amanhã ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (diffD < 7) return `Em ${diffD} dias`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function grupoAtividade(prazo: string | null): 'atrasada' | 'hoje' | 'proximos' | 'sem_prazo' {
  if (!prazo) return 'sem_prazo'
  const d = new Date(prazo)
  const agora = new Date()
  const inicioHoje = new Date(agora); inicioHoje.setHours(0, 0, 0, 0)
  const fimHoje = new Date(agora); fimHoje.setHours(23, 59, 59, 999)
  if (d < inicioHoje) return 'atrasada'
  if (d <= fimHoje) return 'hoje'
  return 'proximos'
}

function NovaAtividadeModal({ open, onClose, leads }: {
  open: boolean
  onClose: () => void
  leads: Lead[]
}) {
  const create = useCreateAtividade()
  const [leadId, setLeadId] = useState('')
  const [leadSearch, setLeadSearch] = useState('')
  const [tipo, setTipo] = useState<AtividadeTipo>('whatsapp')
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prazo, setPrazo] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const leadsFiltered = useMemo(() =>
    leads.filter((l) => l.nome.toLowerCase().includes(leadSearch.toLowerCase())).slice(0, 6),
    [leads, leadSearch]
  )

  const selectedLead = leads.find((l) => l.id === leadId)

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!leadId) errs.lead = 'Selecione um lead'
    if (!titulo.trim()) errs.titulo = 'Título obrigatório'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    await create.mutateAsync({ lead_id: leadId, tipo, titulo: titulo.trim(), descricao, prazo: prazo ? new Date(prazo).toISOString() : undefined })
    setLeadId(''); setLeadSearch(''); setTipo('whatsapp'); setTitulo(''); setDescricao(''); setPrazo(''); setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-foreground/15 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-lg">Nova Atividade</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Lead selector */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Lead *</label>
            {selectedLead ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-primary/5">
                <span className="text-sm text-foreground font-medium flex-1">{selectedLead.nome}</span>
                <button onClick={() => { setLeadId(''); setLeadSearch('') }} className="text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Buscar lead..."
                  className="pl-8 bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground"
                />
                {leadSearch && leadsFiltered.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-card border border-foreground/15 rounded-lg shadow-lg z-50 overflow-hidden">
                    {leadsFiltered.map((l) => (
                      <button key={l.id} onClick={() => { setLeadId(l.id); setLeadSearch('') }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors">
                        {l.nome} <span className="text-muted-foreground text-xs ml-1">{l.whatsapp}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {errors.lead && <p className="text-red-400 text-xs mt-1">{errors.lead}</p>}
          </div>

          {/* Tipo */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Tipo</label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(TIPO_CONFIG) as AtividadeTipo[]).map((t) => {
                const cfg = TIPO_CONFIG[t]
                const Icon = cfg.icon
                return (
                  <button key={t} onClick={() => setTipo(t)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs transition-all ${
                      tipo === t ? `${cfg.bg} ${cfg.color} border-current` : 'border-foreground/15 text-muted-foreground hover:border-foreground/30'
                    }`}>
                    <Icon size={16} />
                    <span className="text-[10px]">{cfg.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Título *</label>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Follow-up sobre proposta"
              className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground" />
            {errors.titulo && <p className="text-red-400 text-xs mt-1">{errors.titulo}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Descrição <span className="text-muted-foreground/50">(opcional)</span></label>
            <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes adicionais..." rows={2}
              className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground text-sm resize-none" />
          </div>

          {/* Prazo */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Prazo <span className="text-muted-foreground/50">(opcional)</span></label>
            <input type="datetime-local" value={prazo} onChange={(e) => setPrazo(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-foreground/15 bg-background/50 text-foreground text-sm focus:outline-none focus:border-primary/60 [color-scheme:dark]" />
          </div>

          <button onClick={handleSubmit} disabled={create.isPending}
            className="neon-button w-full py-3 font-bold disabled:opacity-60">
            {create.isPending ? 'Criando...' : 'Criar Atividade'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AtividadeCard({ ativ, onConcluir, onReabrir, onDelete }: {
  ativ: Atividade
  onConcluir: (id: string) => void
  onReabrir: (id: string) => void
  onDelete: (id: string) => void
}) {
  const cfg = TIPO_CONFIG[ativ.tipo]
  const Icon = cfg.icon
  const grupo = grupoAtividade(ativ.prazo)
  const atrasada = grupo === 'atrasada'

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
      ativ.concluida
        ? 'border-foreground/5 bg-foreground/[0.02] opacity-60'
        : atrasada
          ? 'border-red-500/20 bg-red-500/5'
          : 'border-foreground/8 bg-card/20 hover:border-foreground/20'
    }`}>
      {/* Tipo icon */}
      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${cfg.bg}`}>
        <Icon size={15} className={cfg.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium leading-tight ${ativ.concluida ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {ativ.titulo}
          </p>
          {atrasada && !ativ.concluida && (
            <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
          )}
        </div>
        <p className="text-xs text-primary mt-0.5">{ativ.lead_nome}</p>
        {ativ.descricao && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ativ.descricao}</p>}
        <div className="flex items-center gap-3 mt-2">
          {ativ.prazo && (
            <span className={`flex items-center gap-1 text-[11px] ${atrasada && !ativ.concluida ? 'text-red-400' : 'text-muted-foreground'}`}>
              <Clock size={10} /> {formatPrazo(ativ.prazo)}
            </span>
          )}
          {ativ.concluida && ativ.concluida_em && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <Check size={10} /> {new Date(ativ.concluida_em).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!ativ.concluida ? (
          <button onClick={() => onConcluir(ativ.id)}
            className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 px-2 py-1 rounded-md transition-colors">
            <Check size={11} /> Concluir
          </button>
        ) : (
          <button onClick={() => onReabrir(ativ.id)}
            className="text-[11px] text-muted-foreground hover:text-foreground border border-foreground/15 hover:border-foreground/30 px-2 py-1 rounded-md transition-colors">
            Reabrir
          </button>
        )}
        <button onClick={() => onDelete(ativ.id)}
          className="p-1.5 text-muted-foreground/40 hover:text-red-400 transition-colors rounded-md hover:bg-red-500/10">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

function AtividadesView({ leads, isLoadingLeads }: { leads: Lead[]; isLoadingLeads: boolean }) {
  const { data: atividades = [], isLoading } = useAtividades()
  const concluir = useConcluirAtividade()
  const reabrir = useReabrirAtividade()
  const deletar = useDeleteAtividade()
  const [tab, setTab] = useState<'pendentes' | 'concluidas'>('pendentes')
  const [novaOpen, setNovaOpen] = useState(false)

  const pendentes = useMemo(() => atividades.filter((a) => !a.concluida), [atividades])
  const concluidas = useMemo(() => atividades.filter((a) => a.concluida).sort((a, b) =>
    new Date(b.concluida_em ?? 0).getTime() - new Date(a.concluida_em ?? 0).getTime()
  ), [atividades])

  const agora = new Date()
  const fimHoje = new Date(agora); fimHoje.setHours(23, 59, 59, 999)
  const fimSemana = new Date(agora); fimSemana.setDate(fimSemana.getDate() + 7)

  const atrasadas = pendentes.filter((a) => a.prazo && new Date(a.prazo) < new Date(new Date().setHours(0, 0, 0, 0)))
  const hoje = pendentes.filter((a) => {
    if (!a.prazo) return false
    const d = new Date(a.prazo)
    return d >= new Date(new Date().setHours(0, 0, 0, 0)) && d <= fimHoje
  })
  const proximos7 = pendentes.filter((a) => {
    if (!a.prazo) return false
    const d = new Date(a.prazo)
    return d > fimHoje && d <= fimSemana
  })

  // Groups for pending tab
  const grupos = [
    { id: 'atrasada', label: 'Atrasadas', icon: AlertTriangle, color: 'text-red-400', items: atrasadas },
    { id: 'hoje', label: 'Hoje', icon: Clock, color: 'text-yellow-400', items: hoje },
    { id: 'proximos', label: 'Próximos dias', icon: Calendar, color: 'text-blue-400', items: pendentes.filter((a) => grupoAtividade(a.prazo) === 'proximos') },
    { id: 'sem_prazo', label: 'Sem prazo', icon: Circle, color: 'text-muted-foreground', items: pendentes.filter((a) => !a.prazo) },
  ]

  const concluidasMes = concluidas.filter((a) => {
    if (!a.concluida_em) return false
    const d = new Date(a.concluida_em)
    return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear()
  })

  return (
    <div className="flex-1 overflow-auto flex flex-col">
      {/* KPI Cards */}
      <div className="px-6 py-4 border-b border-foreground/8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Atrasadas', value: atrasadas.length, sub: 'urgente agora', icon: AlertTriangle, color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5' },
            { label: 'Hoje', value: hoje.length, sub: 'pendentes', icon: Clock, color: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5' },
            { label: 'Próx. 7 dias', value: proximos7.length, sub: 'agendadas', icon: Calendar, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
            { label: 'Concluídas', value: concluidasMes.length, sub: 'este mês', icon: Check, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
          ].map((card) => (
            <div key={card.label} className={`rounded-xl border ${card.border} ${card.bg} px-4 py-3 flex items-center gap-3`}>
              <card.icon size={20} className={card.color} />
              <div>
                <p className={`font-orbitron font-bold text-xl ${card.color}`}>{card.value}</p>
                <p className="text-[11px] text-muted-foreground">{card.label} · {card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-foreground/8 flex items-center justify-between">
        <div className="flex gap-1 bg-foreground/5 rounded-lg p-0.5">
          {(['pendentes', 'concluidas'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}>
              {t === 'pendentes' ? `Pendentes (${pendentes.length})` : `Concluídas (${concluidas.length})`}
            </button>
          ))}
        </div>
        <button onClick={() => setNovaOpen(true)}
          className="neon-button h-9 px-4 text-xs font-bold flex items-center gap-1.5">
          <Plus size={13} /> Nova Atividade
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Carregando atividades...</div>
        ) : tab === 'pendentes' ? (
          pendentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
              <CheckSquare size={32} className="opacity-20" />
              <p>Nenhuma atividade pendente. Tudo em dia!</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl">
              {grupos.map((grupo) => grupo.items.length > 0 && (
                <div key={grupo.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <grupo.icon size={14} className={grupo.color} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${grupo.color}`}>
                      {grupo.label} ({grupo.items.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {grupo.items.map((a) => (
                      <AtividadeCard key={a.id} ativ={a}
                        onConcluir={(id) => concluir.mutate(id)}
                        onReabrir={(id) => reabrir.mutate(id)}
                        onDelete={(id) => deletar.mutate(id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          concluidas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
              <Check size={32} className="opacity-20" />
              <p>Nenhuma atividade concluída ainda.</p>
            </div>
          ) : (
            <div className="space-y-2 max-w-2xl">
              {concluidas.map((a) => (
                <AtividadeCard key={a.id} ativ={a}
                  onConcluir={(id) => concluir.mutate(id)}
                  onReabrir={(id) => reabrir.mutate(id)}
                  onDelete={(id) => deletar.mutate(id)}
                />
              ))}
            </div>
          )
        )}
      </div>

      <NovaAtividadeModal open={novaOpen} onClose={() => setNovaOpen(false)} leads={leads} />
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const { data: leads = [], isLoading } = useLeads()
  const queryClient = useQueryClient()
  const [view, setView] = useState(() => sessionStorage.getItem('crm_view') ?? 'pipeline')

  const handleNavigate = (id: string) => {
    sessionStorage.setItem('crm_view', id)
    setView(id)
  }
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const ganhos = leads.filter((l) => l.status === 'ganho').length
  const conversao = leads.length > 0 ? Math.round((ganhos / leads.length) * 100) : 0

  const handleOpen = (lead: Lead) => { setSelectedLead(lead); setSheetOpen(true) }
  const handleLogout = () => supabase.auth.signOut()

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar active={view} onNavigate={handleNavigate} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="border-b border-foreground/8 bg-card/30 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Total </span>
              <span className="font-bold text-foreground">{leads.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Ganhos </span>
              <span className="font-bold text-emerald-400">{ganhos}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Conversão </span>
              <span className="font-bold text-primary">{conversao}%</span>
            </div>
          </div>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['leads'] })}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-foreground/15 hover:border-foreground/30"
          >
            <RefreshCw size={13} /> Atualizar
          </button>
        </div>

        {/* View content */}
        {view === 'pipeline' && (
          <PipelineView leads={leads} isLoading={isLoading} onOpen={handleOpen} />
        )}
        {view === 'contatos' && (
          <ContatosView leads={leads} isLoading={isLoading} onOpen={handleOpen} />
        )}
        {view === 'negocios' && (
          <NegociosView leads={leads} isLoading={isLoading} onOpen={handleOpen} />
        )}
        {view === 'atividades' && (
          <AtividadesView leads={leads} isLoadingLeads={isLoading} />
        )}
        {view === 'inbox' && <InboxView />}
        {view === 'integracoes' && <IntegracoesView />}
      </div>

      <LeadSheet lead={selectedLead} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}

// ─── Inbox IA ─────────────────────────────────────────────────────────────────

function timeAgoMsg(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (d > 0) return `${d}d`
  if (h > 0) return `${h}h`
  if (m > 0) return `${m}m`
  return 'agora'
}

function InboxView() {
  const { data: conversas = [], isLoading } = useConversas()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const createConversa = useCreateConversa()
  const updateConversa = useUpdateConversa()
  const enviarMensagem = useEnviarMensagem()
  const gerarResposta = useGerarRespostaIA()
  const { data: mensagens = [] } = useMensagens(selectedId)
  const [texto, setTexto] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: leads = [] } = useConversas() // re-use for leads list via useLeads below
  const { data: allLeads = [] } = { data: [] as Lead[] } // placeholder — we'll use real hook

  const selectedConversa = conversas.find((c) => c.id === selectedId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const handleEnviar = async () => {
    if (!texto.trim() || !selectedId) return
    await enviarMensagem.mutateAsync({ conversa_id: selectedId, conteudo: texto.trim(), remetente: 'humano' })
    setTexto('')
  }

  const handleGerarIA = async () => {
    if (!selectedConversa) return
    await gerarResposta.mutateAsync({
      lead_id: selectedConversa.lead_id,
      conversa_id: selectedConversa.id,
    })
  }

  const handleToggleIA = async () => {
    if (!selectedConversa) return
    await updateConversa.mutateAsync({ id: selectedConversa.id, ia_ativa: !selectedConversa.ia_ativa })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Carregando inbox...
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* ── Lista de conversas ── */}
      <div className="w-72 shrink-0 border-r border-foreground/8 flex flex-col">
        <div className="px-4 py-4 border-b border-foreground/8">
          <h2 className="font-orbitron font-bold text-sm text-foreground">Inbox IA</h2>
          <p className="text-muted-foreground text-xs mt-0.5">{conversas.length} conversas</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
              <Bot size={32} className="text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-xs">Nenhuma conversa ainda.</p>
              <p className="text-muted-foreground/60 text-xs mt-1">As conversas aparecem aqui quando leads respondem.</p>
            </div>
          ) : (
            conversas.map((c) => {
              const lead = c.lead as any
              const isSelected = selectedId === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-foreground/5 hover:bg-foreground/5 transition-colors ${isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-xs">
                        {lead?.nome?.slice(0, 2).toUpperCase() ?? '??'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-sm text-foreground truncate">{lead?.nome ?? 'Lead'}</span>
                        <span className="text-muted-foreground text-[10px] shrink-0 ml-1">{timeAgoMsg(c.updated_at)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.ia_ativa ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                        <span className="text-muted-foreground text-xs truncate">
                          {c.ia_ativa ? 'IA ativa' : 'Humano'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* ── Painel de chat ── */}
      {selectedConversa ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-6 py-4 border-b border-foreground/8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">
                  {((selectedConversa.lead as any)?.nome ?? '??').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{(selectedConversa.lead as any)?.nome ?? 'Lead'}</p>
                <p className="text-muted-foreground text-xs">{(selectedConversa.lead as any)?.whatsapp}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Toggle IA */}
              <button
                onClick={handleToggleIA}
                disabled={updateConversa.isPending}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selectedConversa.ia_ativa
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                }`}
              >
                {selectedConversa.ia_ativa ? <><Pause size={12} /> Pausar IA</> : <><Play size={12} /> Reativar IA</>}
              </button>
              {/* Contexto do lead */}
              <div className="text-xs text-muted-foreground border border-foreground/10 rounded-lg px-3 py-1.5 hidden lg:flex items-center gap-2">
                <span className="text-foreground/60">Fat:</span>
                <span>{(selectedConversa.lead as any)?.faturamento ?? '—'}</span>
                {(selectedConversa.lead as any)?.utm_source && (
                  <><span className="text-foreground/30">|</span><span>{(selectedConversa.lead as any).utm_source}</span></>
                )}
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {mensagens.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot size={32} className="text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">Nenhuma mensagem ainda.</p>
                <p className="text-muted-foreground/60 text-xs mt-1">Use "Gerar resposta IA" para iniciar a conversa.</p>
              </div>
            )}
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.remetente === 'lead' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.remetente === 'lead'
                    ? 'bg-foreground/8 text-foreground rounded-tl-sm'
                    : msg.remetente === 'ia'
                    ? 'bg-primary/15 border border-primary/20 text-foreground rounded-tr-sm'
                    : 'bg-emerald-500/15 border border-emerald-500/20 text-foreground rounded-tr-sm'
                }`}>
                  {msg.remetente !== 'lead' && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                        msg.remetente === 'ia' ? 'text-primary' : 'text-emerald-400'
                      }`}>
                        {msg.remetente === 'ia' ? '🤖 IA' : '👤 Você'}
                      </span>
                      {!msg.enviada && <span className="text-[10px] text-yellow-400 ml-1">• não enviado</span>}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.conteudo}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">{timeAgoMsg(msg.created_at)}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-foreground/8 shrink-0">
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleGerarIA}
                disabled={gerarResposta.isPending}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                <Bot size={14} />
                {gerarResposta.isPending ? 'Gerando...' : 'Gerar resposta IA'}
              </button>
            </div>
            <div className="flex gap-2">
              <Textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Digite uma mensagem manual..."
                className="flex-1 resize-none text-sm bg-background/50 border-foreground/15 focus:border-primary/60 min-h-[60px] max-h-[120px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleEnviar()
                  }
                }}
              />
              <button
                onClick={handleEnviar}
                disabled={!texto.trim() || enviarMensagem.isPending}
                className="px-4 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <Bot size={40} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Selecione uma conversa</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Integrações ──────────────────────────────────────────────────────────────

const INTEGRATION_CONFIGS = [
  {
    configKey: 'resend_from_email',
    name: 'Resend',
    icon: Mail,
    description: 'Envia e-mails automáticos de confirmação para leads do /form e /mentoria-form.',
    placeholder: 'E-mail remetente (ex: contato@adsliberty.com)',
    href: 'https://resend.com/overview',
    linkLabel: 'Ver painel',
  },
  {
    configKey: 'supabase_project_ref',
    name: 'Supabase',
    icon: Database,
    description: 'Banco de dados, autenticação e Edge Functions do painel.',
    placeholder: 'Project Ref (ex: abcdefghijklmnopqrst)',
    href: 'https://supabase.com/dashboard',
    linkLabel: 'Ver painel',
  },
  {
    configKey: 'meta_pixel_id',
    name: 'Meta Pixel',
    icon: Link2,
    description: 'Rastreia conversões do formulário para otimizar campanhas de anúncios no Meta Ads.',
    placeholder: 'Pixel ID (ex: 1234567890)',
    href: 'https://business.facebook.com/events_manager',
    linkLabel: 'Events Manager',
  },
  {
    configKey: 'whatsapp_token',
    name: 'WhatsApp Token',
    icon: MessageCircle,
    description: 'Bearer token da WhatsApp Business API para envio automático de mensagens.',
    placeholder: 'EAAxxxxxxxxxxxxxxxx...',
    href: 'https://developers.facebook.com/apps',
    linkLabel: 'Meta Developers',
  },
  {
    configKey: 'whatsapp_phone_id',
    name: 'WhatsApp Phone ID',
    icon: Phone,
    description: 'Phone Number ID do seu número no Meta Business (encontrado no painel do app).',
    placeholder: '1234567890123456',
    href: 'https://developers.facebook.com/apps',
    linkLabel: 'Meta Developers',
  },
  {
    configKey: 'openai_api_key',
    name: 'OpenAI API Key',
    icon: Bot,
    description: 'Chave da OpenAI para a IA gerar respostas personalizadas no Inbox.',
    placeholder: 'sk-proj-xxxxxxxxxxxxxxxx',
    href: 'https://platform.openai.com/api-keys',
    linkLabel: 'Gerar chave',
  },
  {
    configKey: 'ia_nome',
    name: 'Nome da IA',
    icon: UserCircle,
    description: 'Nome que a IA usa para se apresentar nas mensagens (ex: Ana, Alex).',
    placeholder: 'Ana',
    href: '#',
    linkLabel: '',
  },
  {
    configKey: 'ia_auto_envio',
    name: 'Envio Automático',
    icon: Zap,
    description: 'Se "true", a IA envia direto pelo WhatsApp. Se "false", você aprova primeiro no Inbox.',
    placeholder: 'true ou false',
    href: '#',
    linkLabel: '',
  },
]

function EditableIntegrationCard({ configKey, name, icon: Icon, description, placeholder, href, linkLabel }: {
  configKey: string
  name: string
  icon: React.ElementType
  description: string
  placeholder: string
  href: string
  linkLabel: string
}) {
  const [valor, setValor] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('configuracoes').select('valor').eq('id', configKey).single()
      .then(({ data }) => { if (data?.valor) setValor(data.valor) })
  }, [configKey])

  const handleSave = async () => {
    setLoading(true)
    await supabase.from('configuracoes').upsert({ id: configKey, valor: valor.trim() })
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const isConnected = valor.trim().length > 0

  return (
    <div className="bg-card border border-foreground/10 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon size={18} className="text-primary" />
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          isConnected
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          {isConnected ? 'Conectado' : 'Não configurado'}
        </span>
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm mb-1">{name}</p>
        <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
      </div>
      <div className="flex gap-2">
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-xs bg-background/50 border border-foreground/15 rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="text-xs px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 shrink-0"
        >
          {saved ? <Check size={14} /> : loading ? '...' : 'Salvar'}
        </button>
      </div>
      <div className="pt-1 border-t border-foreground/8">
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          {linkLabel} <ExternalLink size={11} />
        </a>
      </div>
    </div>
  )
}

function IntegracoesView() {
  const [prompt, setPrompt] = useState('')
  const [promptSaved, setPromptSaved] = useState(false)
  const [promptLoading, setPromptLoading] = useState(false)

  useEffect(() => {
    supabase.from('configuracoes').select('valor').eq('id', 'ia_prompt_sistema').single()
      .then(({ data }) => { if (data?.valor) setPrompt(data.valor) })
  }, [])

  const handleSavePrompt = async () => {
    setPromptLoading(true)
    await supabase.from('configuracoes').upsert({ id: 'ia_prompt_sistema', valor: prompt })
    setPromptLoading(false)
    setPromptSaved(true)
    setTimeout(() => setPromptSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-5xl space-y-10">
      <div>
        <h2 className="font-orbitron font-bold text-xl text-foreground mb-1">Integrações</h2>
        <p className="text-muted-foreground text-sm">Ferramentas conectadas ao seu painel Liberty.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATION_CONFIGS.map((cfg) => (
          <EditableIntegrationCard key={cfg.configKey} {...cfg} />
        ))}
      </div>

      {/* System Prompt da IA */}
      <div className="border border-foreground/10 rounded-xl p-6 bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Bot size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Script da IA (System Prompt)</p>
            <p className="text-muted-foreground text-xs">Define como a IA se comporta, vende e responde leads. Use {'{ia_nome}'} para o nome configurado.</p>
          </div>
        </div>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Você é {ia_nome}, assistente de vendas da Liberty Agência..."
          className="min-h-[200px] text-sm bg-background/50 border-foreground/15 focus:border-primary/60 resize-y font-mono"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleSavePrompt}
            disabled={promptLoading}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            {promptSaved ? <><Check size={14} /> Salvo!</> : promptLoading ? 'Salvando...' : 'Salvar script'}
          </button>
        </div>
      </div>
    </div>
  )
}


// ─── Login ────────────────────────────────────────────────────────────────────

function LoginScreen() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      setErro('E-mail ou senha incorretos.')
      setSenha('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass-card-neon p-10 rounded-2xl w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <Lock className="text-primary" size={24} />
        </div>
        <h1 className="font-orbitron font-bold text-xl mb-1">
          LIBERTY<span className="text-primary">.</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-8">Painel Administrativo</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErro('') }}
            placeholder="E-mail"
            className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground"
            autoFocus
          />
          <Input
            type="password"
            value={senha}
            onChange={(e) => { setSenha(e.target.value); setErro('') }}
            placeholder="Senha"
            className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground"
          />
          {erro && <p className="text-destructive text-xs">{erro}</p>}
          <button type="submit" disabled={loading} className="neon-button w-full py-3 font-bold disabled:opacity-60">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return null
  if (!session) return <LoginScreen />
  return <Dashboard />
}
