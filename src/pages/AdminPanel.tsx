import { useState, useMemo } from 'react'
import {
  RefreshCw, LogOut, Copy, ExternalLink, Lock, ChevronRight,
  Kanban, Users, Briefcase, CheckSquare, BarChart2, UserCircle,
  Search, Filter, Download, Plus, X, PhoneCall,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLeads, useUpdateLeadStatus, useUpdateLead } from '@/hooks/useLeads'
import { useCreateLead } from '@/hooks/useCreateLead'
import type { Lead, LeadStatus } from '@/lib/supabase'

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
  { id: 'pipeline',   label: 'Pipeline',   icon: Kanban,       active: true },
  { id: 'contatos',   label: 'Contatos',   icon: Users,        active: true },
  { id: 'negocios',   label: 'Negócios',   icon: Briefcase,    active: true },
  { id: 'atividades', label: 'Atividades', icon: CheckSquare,  active: false },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart2,    active: false },
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

function LeadCard({ lead, onOpen }: { lead: Lead; onOpen: (lead: Lead) => void }) {
  const updateStatus = useUpdateLeadStatus()
  const cfg = stageConfig(lead.status)

  return (
    <div className="bg-background/60 border border-foreground/8 hover:border-foreground/20 rounded-xl p-4 transition-colors">
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

function KanbanColumn({ stage, leads, onOpen }: {
  stage: typeof STAGES[number]
  leads: Lead[]
  onOpen: (lead: Lead) => void
}) {
  return (
    <div className={`min-w-[260px] w-[260px] flex flex-col rounded-xl border border-foreground/8 border-t-2 ${stage.border} bg-card/20`}>
      <div className="px-4 py-3 flex items-center justify-between border-b border-foreground/8">
        <span className={`text-xs font-bold uppercase tracking-wider ${stage.color}`}>{stage.label}</span>
        <Badge className={`text-[10px] px-1.5 py-0 border ${stage.badge}`}>{leads.length}</Badge>
      </div>
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-160px)]">
        {leads.length === 0 ? (
          <p className="text-center text-muted-foreground/40 text-xs py-8">Nenhum lead</p>
        ) : (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} onOpen={onOpen} />)
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
  const byStage = useMemo(() => {
    const map: Record<LeadStatus, Lead[]> = {
      novo: [], em_contato: [], qualificado: [], proposta_enviada: [], negociacao: [], ganho: [], perdido: [],
    }
    leads.forEach((l) => { map[l.status]?.push(l) })
    return map
  }, [leads])

  return (
    <div className="flex-1 overflow-auto p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Carregando pipeline...</div>
      ) : (
        <div className="flex gap-3 min-w-max pb-4">
          {STAGES.map((stage) => (
            <KanbanColumn key={stage.value} stage={stage} leads={byStage[stage.value]} onOpen={onOpen} />
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
                {['Nome', 'WhatsApp', 'Faturamento', 'Serviço', 'Status', 'Valor', 'Criado em', ''].map((h) => (
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
                    <td className="px-4 py-3">
                      <ChevronRight size={14} className="text-muted-foreground/40" />
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

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const { data: leads = [], isLoading } = useLeads()
  const queryClient = useQueryClient()
  const [view, setView] = useState('pipeline')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const ganhos = leads.filter((l) => l.status === 'ganho').length
  const conversao = leads.length > 0 ? Math.round((ganhos / leads.length) * 100) : 0

  const handleOpen = (lead: Lead) => { setSelectedLead(lead); setSheetOpen(true) }
  const handleLogout = () => { localStorage.removeItem('liberty_admin'); window.location.reload() }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar active={view} onNavigate={setView} onLogout={handleLogout} />

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
      </div>

      <LeadSheet lead={selectedLead} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (senha === 'liberty2025') {
      localStorage.setItem('liberty_admin', 'liberty2025')
      onLogin()
    } else {
      setErro(true)
      setSenha('')
    }
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
            type="password"
            value={senha}
            onChange={(e) => { setSenha(e.target.value); setErro(false) }}
            placeholder="Senha de acesso"
            className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground"
            autoFocus
          />
          {erro && <p className="text-destructive text-xs">Senha incorreta. Tente novamente.</p>}
          <button type="submit" className="neon-button w-full py-3 font-bold">Entrar</button>
        </form>
      </div>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() =>
    localStorage.getItem('liberty_admin') === 'liberty2025'
  )
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />
  return <Dashboard />
}
