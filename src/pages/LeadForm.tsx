import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowLeft, Zap, Shield, Clock } from 'lucide-react'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useCreateLead } from '@/hooks/useCreateLead'

const faturamentoOptions = [
  'Ainda não faturei',
  'Até R$5k/mês',
  'R$5k a R$20k/mês',
  'R$20k a R$50k/mês',
  'Acima de R$50k/mês',
] as const

const schema = z.object({
  aceite_termo: z.literal(true, { errorMap: () => ({ message: 'Você precisa aceitar os termos para continuar' }) }),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  whatsapp: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato: (11) 99999-9999'),
  faturamento: z.enum(faturamentoOptions, { required_error: 'Selecione uma opção' }),
  email: z.string().email('E-mail invalido').min(1, 'E-mail obrigatorio'),
  instagram: z.string().optional(),
  servico_interesse: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center py-12 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
        className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6"
        style={{ boxShadow: '0 0 40px rgba(0,212,255,0.2)' }}
      >
        <CheckCircle className="text-primary" size={40} />
      </motion.div>
      <h2 className="font-orbitron font-bold text-2xl md:text-3xl mb-3 text-foreground">
        Solicitação recebida!
      </h2>
      <p className="text-muted-foreground text-base mb-2 max-w-sm">
        Nossa equipe vai analisar seu negócio e entrar em contato em até 24h.
      </p>
      <p className="text-muted-foreground text-sm mb-8 max-w-sm">
        Nossa equipe vai entrar em contato via WhatsApp em até 24h.
      </p>
      <Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors flex items-center gap-1">
        <ArrowLeft size={14} /> Voltar ao site
      </Link>
    </motion.div>
  )
}

export default function LeadForm() {
  const [searchParams] = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [termoOpen, setTermoOpen] = useState(false)
  const servicoParam = searchParams.get('servico') ?? ''
  const createLead = useCreateLead()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      aceite_termo: undefined,
      nome: '',
      whatsapp: '',
      email: '',
      faturamento: undefined,
      instagram: '',
      servico_interesse: servicoParam,
    },
  })

  useEffect(() => {
    if (servicoParam) form.setValue('servico_interesse', servicoParam)
  }, [servicoParam])

  const onSubmit = async (data: FormValues) => {
    await createLead.mutateAsync(data)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid-bg absolute inset-0 opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 neon-orb opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 neon-orb opacity-20" />
      </div>

      <div className="relative z-10 container px-4 py-8 md:py-16">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-10">
          <ArrowLeft size={16} /> Voltar ao site
        </Link>

        <AnimatePresence mode="wait">
          {submitted ? (
            <SuccessScreen key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl mx-auto"
            >
              {/* Left — Copy */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.55 }}
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Oferta Limitada — Projeto Piloto Gratuito
                </motion.span>

                <h1 className="font-orbitron font-black text-3xl md:text-4xl lg:text-5xl uppercase leading-tight mb-6"
                  style={{ letterSpacing: '-0.02em' }}>
                  Transformamos seu negócio com IA —
                  <span className="neon-text"> sem custo inicial</span>
                </h1>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  Criamos um projeto piloto de IA real para o seu negócio. Você vê o resultado antes de investir qualquer coisa.
                </p>

                <ul className="space-y-4 mb-8">
                  {[
                    { icon: Zap, text: 'Projeto piloto entregue em até 7 dias' },
                    { icon: Shield, text: 'Sem compromisso — você decide se quer continuar' },
                    { icon: Clock, text: 'Apenas 3 vagas disponíveis por semana' },
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <item.icon className="text-primary" size={16} />
                      </div>
                      <span className="text-foreground/90">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>✓ Sem cartão de crédito</span>
                  <span>✓ Resultado real, não apresentação</span>
                  <span>✓ Resposta em até 24h</span>
                </div>
              </motion.div>

              {/* Right — Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="glass-card-neon p-5 md:p-8 rounded-2xl"
              >
                <h2 className="font-orbitron font-bold text-xl mb-1 text-foreground">
                  Garanta seu Projeto Gratuito
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Preencha abaixo — nossa equipe responde em até 24h.
                </p>

                {servicoParam && (
                  <div className="mb-5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary">
                    Serviço selecionado: <strong>{decodeURIComponent(servicoParam)}</strong>
                  </div>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Checkbox de Termo — ANTES dos campos */}
                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                      <FormField
                        control={form.control}
                        name="aceite_termo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value === true}
                                onCheckedChange={field.onChange}
                                className="mt-0.5 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="text-sm text-foreground/80 font-normal leading-relaxed cursor-pointer">
                                Li e aceito o{' '}
                                <button
                                  type="button"
                                  onClick={() => setTermoOpen(true)}
                                  className="text-primary underline underline-offset-2 hover:text-primary/80"
                                >
                                  Termo de Visualização de Demo
                                </button>
                                {' '}— entendo que é apenas uma demo online, sem download de arquivos, e que a compra é opcional.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm">Nome completo *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Seu nome"
                              className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm">WhatsApp *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="(11) 99999-9999"
                              maxLength={15}
                              onChange={(e) => field.onChange(maskPhone(e.target.value))}
                              className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm">
                            E-mail *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="seu@email.com"
                              className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="faturamento"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm">Faturamento mensal *</FormLabel>
                          <Controller
                            control={form.control}
                            name="faturamento"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground">
                                    <SelectValue placeholder="Selecione uma opção" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-card border-foreground/15">
                                  {faturamentoOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt} className="text-foreground focus:bg-primary/10">
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm">
                            Instagram do negócio <span className="text-muted-foreground">(opcional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="@suanegocio"
                              className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!form.watch('aceite_termo') && (
                      <p className="text-center text-xs text-primary font-medium animate-pulse">
                        ↑ Aceite o termo acima para continuar
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={createLead.isPending || !form.watch('aceite_termo')}
                      className="neon-button w-full py-4 text-base font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {createLead.isPending ? 'Enviando...' : 'Garantir Minha Demo Gratuita →'}
                    </button>

                    <p className="text-center text-xs text-muted-foreground">
                      Ao enviar, você concorda em receber contato da Liberty Agência via WhatsApp.
                    </p>
                  </form>
                </Form>

                <Dialog open={termoOpen} onOpenChange={setTermoOpen}>
                  <DialogContent className="bg-card border-foreground/15 max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="font-orbitron text-lg">Termo de Visualização de Demo</DialogTitle>
                      <DialogDescription className="text-muted-foreground text-xs">
                        Liberty Company Ads Ltda — CNPJ: 60.355.549/0001-20
                      </DialogDescription>
                    </DialogHeader>
                    <div className="text-sm text-foreground/80 space-y-3 max-h-72 overflow-y-auto pr-2">
                      <p>1. Nossa equipe vai mostrar como sua ideia fica pronta, em uma apresentação online ao vivo.</p>
                      <p>2. A demo é visualizada online — nenhum arquivo é entregue ou transferido durante esta etapa.</p>
                      <p>3. Caso queira contratar após ver a demo, o investimento será informado na reunião.</p>
                      <p>4. Não gostar? Sem problema nenhum — zero compromisso financeiro.</p>
                      <p>5. O conteúdo apresentado na demo é propriedade da Liberty Agência e não pode ser reproduzido sem contratação.</p>
                      <p>6. Ao aceitar, você autoriza a Liberty Agência a entrar em contato via WhatsApp para agendamento.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue('aceite_termo', true)
                        setTermoOpen(false)
                      }}
                      className="neon-button w-full py-3 text-sm font-bold mt-2"
                    >
                      Entendi e Aceito ✓
                    </button>
                  </DialogContent>
                </Dialog>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
