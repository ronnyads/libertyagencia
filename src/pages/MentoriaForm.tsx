import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { useCreateMentoriaLead } from '@/hooks/useCreateMentoriaLead'

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const STEPS = [
  {
    key: 'situacao',
    question: 'Qual é sua situação hoje?',
    options: [
      { label: 'Tenho emprego, quero migrar para tech', emoji: '💼' },
      { label: 'Sou freelancer / autônomo', emoji: '🧑‍💻' },
      { label: 'Tenho meu próprio negócio', emoji: '🏢' },
      { label: 'Estou estudando', emoji: '📚' },
    ],
  },
  {
    key: 'projeto',
    question: 'Você já tem um projeto ou ideia em mente?',
    options: [
      { label: 'Já tenho algo rodando', emoji: '🚀' },
      { label: 'Tenho uma ideia mas não comecei', emoji: '💡' },
      { label: 'Vou começar do zero', emoji: '🌱' },
    ],
  },
  {
    key: 'nivel_tech',
    question: 'Qual é seu nível com programação / tech?',
    options: [
      { label: 'Nunca programei', emoji: '👶' },
      { label: 'Sei o básico mas travei', emoji: '🧱' },
      { label: 'Sei programar, quero escalar com IA', emoji: '⚡' },
    ],
  },
  {
    key: 'objetivo',
    question: 'O que você quer alcançar nos próximos 3 meses?',
    options: [
      { label: 'Lançar meu primeiro SaaS', emoji: '🎯' },
      { label: 'Conseguir clientes como freelancer', emoji: '🤝' },
      { label: 'Automatizar meu negócio com IA', emoji: '🤖' },
      { label: 'Mudar de carreira para tech', emoji: '🔄' },
    ],
  },
  {
    key: 'horas_semana',
    question: 'Quantas horas por semana você consegue dedicar?',
    options: [
      { label: 'Menos de 5h', emoji: '🕐' },
      { label: '5 a 10h', emoji: '🕔' },
      { label: '10 a 20h', emoji: '🕙' },
      { label: 'Mais de 20h', emoji: '🔥' },
    ],
  },
  {
    key: 'tem_investimento',
    question: 'Se você for aceito na mentoria, você tem R$2.997 disponíveis para investir no seu crescimento?',
    options: [
      { label: 'Sim, tenho disponível agora', emoji: '✅' },
      { label: 'Consigo organizar em até 30 dias', emoji: '📅' },
      { label: 'Não tenho no momento', emoji: '❌' },
    ],
  },
]

const TOTAL_STEPS = STEPS.length + 1 // +1 para o step de dados de contato

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
}


export default function MentoriaForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [nomeError, setNomeError] = useState('')
  const [zapError, setZapError] = useState('')
  const [emailError, setEmailError] = useState('')
  const createLead = useCreateMentoriaLead()

  const isContactStep = step === STEPS.length
  const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100)

  const goNext = () => {
    setDirection(1)
    setStep((s) => s + 1)
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  const handleOption = (value: string) => {
    const key = STEPS[step].key
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setTimeout(goNext, 180)
  }

  const handleSubmit = async () => {
    let valid = true
    if (nome.trim().length < 2) {
      setNomeError('Digite seu nome completo')
      valid = false
    } else {
      setNomeError('')
    }
    const zapRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
    if (!zapRegex.test(whatsapp)) {
      setZapError('Formato: (11) 99999-9999')
      valid = false
    } else {
      setZapError('')
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Digite um e-mail valido')
      valid = false
    } else {
      setEmailError('')
    }
    if (!valid) return

    try {
      await createLead.mutateAsync({
        nome: nome.trim(),
        whatsapp,
        email,
        situacao: answers.situacao ?? '',
        projeto: answers.projeto ?? '',
        nivel_tech: answers.nivel_tech ?? '',
        objetivo: answers.objetivo ?? '',
        horas_semana: answers.horas_semana ?? '',
        tem_investimento: answers.tem_investimento ?? '',
        utm_source: searchParams.get('utm_source') || undefined,
        utm_medium: searchParams.get('utm_medium') || undefined,
        utm_campaign: searchParams.get('utm_campaign') || undefined,
      })
      navigate('/obrigado?tipo=mentoria')
    } catch (err: any) {
      if (err?.message === 'duplicate') {
        navigate('/obrigado?tipo=mentoria')
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid-bg absolute inset-0 opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 neon-orb opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 neon-orb opacity-20" />
      </div>

      <div className="relative z-10 container px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={step === 0 ? undefined : goBack}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors disabled:opacity-30"
            disabled={step === 0}
          >
            <ArrowLeft size={16} />
            {step === 0 ? <Link to="/">Voltar ao site</Link> : 'Voltar'}
          </button>
          <span className="text-xs text-muted-foreground font-mono">
            {step + 1} / {TOTAL_STEPS}
          </span>
        </div>

        {/* Progress bar */}
        <div className="max-w-xl mx-auto mb-10">
          <Progress value={progress} className="h-1.5 bg-foreground/10" />
        </div>

        {/* Step content */}
        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            {!isContactStep ? (
              <motion.div
                key={`step-${step}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Badge */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Mentoria 1:1
                </span>

                <h1 className="font-orbitron font-black text-2xl md:text-3xl uppercase leading-tight mb-8"
                  style={{ letterSpacing: '-0.01em' }}>
                  {STEPS[step].question}
                </h1>

                <div className="space-y-3">
                  {STEPS[step].options.map((opt, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => handleOption(opt.label)}
                      className="w-full text-left px-5 py-4 rounded-xl border border-foreground/10 bg-foreground/5 hover:border-primary/60 hover:bg-primary/10 transition-all duration-200 flex items-center gap-4 group"
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-foreground/80 group-hover:text-foreground text-sm font-medium transition-colors">
                        {opt.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="contact-step"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card-neon p-8 rounded-2xl"
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Última etapa
                </span>

                <h1 className="font-orbitron font-black text-2xl md:text-3xl uppercase leading-tight mb-2"
                  style={{ letterSpacing: '-0.01em' }}>
                  Quase lá!
                </h1>
                <p className="text-muted-foreground text-sm mb-8">
                  Deixe seus dados para nossa equipe entrar em contato.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="text-foreground/80 text-sm block mb-1.5">Nome completo *</label>
                    <Input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50"
                    />
                    {nomeError && <p className="text-red-400 text-xs mt-1">{nomeError}</p>}
                  </div>

                  <div>
                    <label className="text-foreground/80 text-sm block mb-1.5">WhatsApp *</label>
                    <Input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(maskPhone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                      className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50"
                    />
                    {zapError && <p className="text-red-400 text-xs mt-1">{zapError}</p>}
                  </div>

                  <div>
                    <label className="text-foreground/80 text-sm block mb-1.5">E-mail *</label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="seu@email.com"
                      className="bg-background/50 border-foreground/15 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50"
                    />
                    {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={createLead.isPending}
                    className="neon-button w-full py-4 text-base font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {createLead.isPending ? 'Enviando...' : 'Enviar candidatura →'}
                  </button>

                  <p className="text-center text-xs text-muted-foreground">
                    Ao enviar, você autoriza a Liberty Agência a entrar em contato via WhatsApp.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
