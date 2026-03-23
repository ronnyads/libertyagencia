import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, LogOut, Copy, ExternalLink, Lock } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useLeads, useUpdateLeadStatus } from '@/hooks/useLeads'
import type { Lead, LeadStatus } from '@/lib/supabase'

const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: 'Novo',
  em_contato: 'Em Contato',
  qualificado: 'Qualificado',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  novo: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  em_contato: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  qualificado: 'bg-green-500/20 text-green-300 border-green-500/30',
  fechado: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  perdido: 'bg-red-500/20 text-red-300 border-red-500/30',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function openWA(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, '')
  window.open(`https://wa.me/55${digits}`, '_blank')
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

function LeadRow({ lead }: { lead: Lead }) {
  const updateStatus = useUpdateLeadStatus()

  return (
    <TableRow className="border-foreground/8 hover:bg-foreground/3">
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {formatDate(lead.created_at)}
      </TableCell>
      <TableCell className="font-medium text-sm">{lead.nome}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <button
            onClick={() => openWA(lead.whatsapp)}
            className="text-primary hover:text-primary/80 text-xs font-mono transition-colors"
            title="Abrir no WhatsApp"
          >
            {lead.whatsapp}
          </button>
          <button onClick={() => openWA(lead.whatsapp)} className="text-muted-foreground hover:text-primary" title="Abrir WA">
            <ExternalLink size={12} />
          </button>
          <button onClick={() => copyToClipboard(lead.whatsapp)} className="text-muted-foreground hover:text-primary" title="Copiar">
            <Copy size={12} />
          </button>
        </div>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {lead.servico_interesse || '—'}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {lead.faturamento}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {lead.instagram ? (
          <a href={`https://instagram.com/${lead.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
            className="text-primary hover:underline">
            {lead.instagram.startsWith('@') ? lead.instagram : `@${lead.instagram}`}
          </a>
        ) : '—'}
      </TableCell>
      <TableCell>
        <Select
          value={lead.status}
          onValueChange={(v) => updateStatus.mutate({ id: lead.id, status: v as LeadStatus })}
        >
          <SelectTrigger className={`w-36 h-7 text-xs border px-2 ${STATUS_COLORS[lead.status]}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-foreground/15">
            {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
              <SelectItem key={s} value={s} className={`text-xs ${STATUS_COLORS[s]}`}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  )
}

function Dashboard() {
  const { data: leads = [], isLoading } = useLeads()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('todos')

  const filtered = useMemo(() => {
    if (activeTab === 'todos') return leads
    return leads.filter((l) => l.status === activeTab)
  }, [leads, activeTab])

  const counts = useMemo(() => {
    return leads.reduce((acc, l) => {
      acc['todos'] = (acc['todos'] || 0) + 1
      acc[l.status] = (acc[l.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [leads])

  const handleLogout = () => {
    localStorage.removeItem('liberty_admin')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-foreground/8 bg-card/50 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <span className="font-orbitron font-bold text-xl tracking-tighter">
              LIBERTY<span className="text-primary">.</span>
            </span>
            <span className="text-muted-foreground text-sm hidden md:block">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm hidden md:block">
              {counts['todos'] || 0} leads captados
            </span>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['leads'] })}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-foreground/15 hover:border-foreground/30"
            >
              <RefreshCw size={14} /> Atualizar
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg border border-foreground/15"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card/50 border border-foreground/10 mb-6">
            {[
              { value: 'todos', label: 'Todos' },
              { value: 'novo', label: 'Novos' },
              { value: 'em_contato', label: 'Em Contato' },
              { value: 'qualificado', label: 'Qualificado' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-sm"
              >
                {tab.label}
                {counts[tab.value] ? (
                  <Badge className="ml-2 bg-primary/20 text-primary border-primary/30 text-[10px] px-1.5 py-0">
                    {counts[tab.value]}
                  </Badge>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="text-center py-20 text-muted-foreground text-sm">Carregando leads...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground text-sm">Nenhum lead nesta categoria.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-foreground/10">
                <Table>
                  <TableHeader>
                    <TableRow className="border-foreground/10 hover:bg-transparent">
                      <TableHead className="text-muted-foreground text-xs">Data</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Nome</TableHead>
                      <TableHead className="text-muted-foreground text-xs">WhatsApp</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Serviço</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Faturamento</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Instagram</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((lead) => (
                      <LeadRow key={lead.id} lead={lead} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

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
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-neon p-10 rounded-2xl w-full max-w-sm text-center"
      >
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
          {erro && (
            <p className="text-destructive text-xs">Senha incorreta. Tente novamente.</p>
          )}
          <button type="submit" className="neon-button w-full py-3 font-bold">
            Entrar
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() =>
    localStorage.getItem('liberty_admin') === 'liberty2025'
  )

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />
  return <Dashboard />
}
