import { useState, useMemo } from 'react'
import {
  RefreshCw, LogOut, Copy, ExternalLink, Lock, ChevronRight,
  Kanban, Users, Briefcase, CheckSquare, BarChart2, UserCircle,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useLeads, useUpdateLeadStatus, useUpdateLead } from '@/hooks/useLeads'
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

function stageConfig(status: LeadStatus) {
  return STAGES.find((s) => s.value === status) ?? STAGES[0]
}

// ─── Sidebar nav config ───────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'pipeline',   label: 'Pipeline',   icon: Kanban,       active: true },
  { id: 'contatos',   label: 'Contatos',   icon: Users,        active: false },
  { id: 'negocios',   label: 'Negócios',   icon: Briefcase,    active: false },
  { id: 'atividades', label: 'Atividades', icon: CheckSquare,  active: false },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart2,    active: false },
]

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

function openWA(whatsapp: string) {
  window.open(`https://wa.me/55${whatsapp.replace(/\D/g, '')}`, '_blank')
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const [active, setActive] = useState('pipeline')

  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen bg-card border-r border-foreground/8 sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-foreground/8">
        <span className="font-orbitron font-bold text-lg tracking-tighter text-foreground">
          LIBERTY<span className="text-primary">.</span>
        </span>
        <p className="text-muted-foreground text-[10px] uppercase tracking-widest mt-0.5">CRM</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id
          const isAvailable = item.active
          return (
            <button
              key={item.id}
              onClick={() => isAvailable && setActive(item.id)}
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

      {/* Perfil + Sair */}
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
          {/* Contato */}
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

          {/* Negócio */}
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

          {/* Observações */}
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
            Criado em {new Date(lead.created_at).toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit',
              year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Lead Card ────────────────────────────────────────────────────────────────

function LeadCard({ lead, onOpen }: { lead: Lead; onOpen: (lead: Lead) => void }) {
  const updateStatus = useUpdateLeadStatus()
  const cfg = stageConfig(lead.status)

  return (
    <div className="bg-background/60 border border-foreground/8 hover:border-foreground/20 rounded-xl p-4 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <button
          onClick={() => onOpen(lead)}
          className="font-semibold text-sm text-foreground hover:text-primary transition-colors text-left leading-tight"
        >
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
        <button
          onClick={() => openWA(lead.whatsapp)}
          className="text-primary hover:text-primary/80 text-xs font-mono truncate max-w-[120px]"
        >
          {lead.whatsapp}
        </button>
        <button onClick={() => openWA(lead.whatsapp)} className="text-muted-foreground hover:text-primary shrink-0">
          <ExternalLink size={11} />
        </button>
        <button onClick={() => copyText(lead.whatsapp)} className="text-muted-foreground hover:text-primary shrink-0">
          <Copy size={11} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted-foreground">{timeAgo(lead.created_at)}</span>
        <Select
          value={lead.status}
          onValueChange={(v) => updateStatus.mutate({ id: lead.id, status: v as LeadStatus })}
        >
          <SelectTrigger className={`h-6 text-[10px] border px-2 w-auto max-w-[130px] ${cfg.badge}`}>
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

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const { data: leads = [], isLoading } = useLeads()
  const queryClient = useQueryClient()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const byStage = useMemo(() => {
    const map: Record<LeadStatus, Lead[]> = {
      novo: [], em_contato: [], qualificado: [], proposta_enviada: [], negociacao: [], ganho: [], perdido: [],
    }
    leads.forEach((l) => { map[l.status]?.push(l) })
    return map
  }, [leads])

  const ganhos = byStage.ganho.length
  const conversao = leads.length > 0 ? Math.round((ganhos / leads.length) * 100) : 0

  const handleOpen = (lead: Lead) => { setSelectedLead(lead); setSheetOpen(true) }
  const handleLogout = () => { localStorage.removeItem('liberty_admin'); window.location.reload() }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar onLogout={handleLogout} />

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

        {/* Kanban */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Carregando pipeline...
            </div>
          ) : (
            <div className="flex gap-3 min-w-max pb-4">
              {STAGES.map((stage) => (
                <KanbanColumn key={stage.value} stage={stage} leads={byStage[stage.value]} onOpen={handleOpen} />
              ))}
            </div>
          )}
        </div>
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
