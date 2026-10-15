import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Laptop,
  Target,
} from 'lucide-react'
import { sendLeadToCrm } from '@/lib/crm-leads'
import {
  initialSdrApplication,
  maskSdrPhone,
  normalizeProfessionalUrl,
  SdrApplicationData,
  validateSdrStep,
} from '@/lib/sdr-application'

const STEP_LABELS = ['Contato', 'Experiência', 'Disponibilidade', 'Motivação']
const SITUATIONS = ['Empregado(a)', 'Autônomo(a) / freelancer', 'Em transição de carreira', 'Estudando', 'Buscando recolocação']
const EXPERIENCES = ['Ainda não atuei com vendas B2B', 'Menos de 1 ano', 'Entre 1 e 2 anos', 'Mais de 2 anos']
const CHANNELS = ['Telefone', 'WhatsApp', 'E-mail', 'LinkedIn', 'Ainda não utilizei esses canais']
const AVAILABILITY = ['Até 4 horas por dia', 'De 4 a 6 horas por dia', '8 horas por dia', 'Disponibilidade flexível']
const TARGET_COMFORT = ['Sim, gosto de trabalhar com metas', 'Sim, desde que as metas estejam claras', 'Tenho pouca experiência, mas quero aprender']

const inputClass = 'h-12 w-full rounded-xl border border-foreground/10 bg-background/55 px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary/70 focus:ring-4 focus:ring-primary/10'
const textAreaClass = 'w-full resize-none rounded-xl border border-foreground/10 bg-background/55 px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary/70 focus:ring-4 focus:ring-primary/10'

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1.5 text-xs text-red-300" role="alert">{message}</p> : null
}

export default function SdrJobApplication() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<SdrApplicationData>(initialSdrApplication)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const campaign = useMemo(() => ({
    source: searchParams.get('utm_source') || 'pagina-vaga-sdr',
    medium: searchParams.get('utm_medium') || 'organic',
    name: searchParams.get('utm_campaign') || 'recrutamento-sdr',
  }), [searchParams])

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Vaga SDR | Liberty Company'
    return () => { document.title = previousTitle }
  }, [])

  const update = <K extends keyof SdrApplicationData>(key: K, value: SdrApplicationData[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const toggleChannel = (channel: string) => {
    if (channel === 'Ainda não utilizei esses canais') {
      update('canais', form.canais.includes(channel) ? [] : [channel])
      return
    }
    const withoutNone = form.canais.filter((item) => item !== 'Ainda não utilizei esses canais')
    update('canais', withoutNone.includes(channel)
      ? withoutNone.filter((item) => item !== channel)
      : [...withoutNone, channel])
  }

  const nextStep = () => {
    const nextErrors = validateSdrStep(step, form)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setErrors({})
    setStep((current) => Math.min(current + 1, STEP_LABELS.length - 1))
    document.getElementById('candidatura')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const previousStep = () => {
    setErrors({})
    setStep((current) => Math.max(current - 1, 0))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step < STEP_LABELS.length - 1) {
      nextStep()
      return
    }

    const finalErrors = validateSdrStep(step, form)
    if (Object.keys(finalErrors).length) {
      setErrors(finalErrors)
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')
      await sendLeadToCrm({
        form_type: 'recrutamento_sdr',
        nome: form.nome.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp,
        servico_interesse: 'Vaga SDR — Liberty Company',
        cidade_estado: form.cidadeEstado.trim(),
        perfil_profissional_url: normalizeProfessionalUrl(form.perfilUrl),
        situacao_profissional: form.situacaoProfissional,
        experiencia_b2b: form.experienciaB2b,
        canais_prospeccao: form.canais.join(', '),
        ferramentas_crm: form.ferramentasCrm.trim(),
        disponibilidade: form.disponibilidade,
        conforto_metas: form.confortoMetas,
        resultado_comercial: form.resultadoComercial.trim() || undefined,
        motivo_candidatura: form.motivoCandidatura.trim(),
        consentimento: form.consentimento,
        utm_source: campaign.source,
        utm_medium: campaign.medium,
        utm_campaign: campaign.name,
      })
      setSubmitted(true)
    } catch {
      setSubmitError('Não foi possível enviar sua candidatura agora. Revise sua conexão e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background font-inter text-foreground selection:bg-primary selection:text-primary-foreground">
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none">
        <div className="grid-bg absolute inset-0 opacity-25" />
        <div className="neon-orb absolute -left-24 top-10 h-[32rem] w-[32rem] opacity-60" />
        <div className="absolute -right-32 top-[44rem] h-[30rem] w-[30rem] rounded-full bg-violet-600/[.08] blur-[120px]" />
      </div>

      <header className="relative z-20 border-b border-foreground/10 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Voltar ao site da Liberty Company">
            <span className="font-orbitron text-xl font-bold tracking-tighter">LIBERTY<span className="text-primary">.</span></span>
          </Link>
          <a href="#candidatura" className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[.12em] text-primary transition hover:bg-primary hover:text-primary-foreground md:px-5">
            Candidatar-se
          </a>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.12fr_.88fr] lg:py-24">
        <div>
          <p className="mb-7 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] text-primary">
            Processo seletivo aberto
          </p>
          <h1 className="max-w-4xl font-orbitron text-5xl font-black uppercase leading-[.92] tracking-[-.055em] sm:text-6xl lg:text-[5.6rem]">
            Estamos<br />contratando
          </h1>
          <div className="mt-7 inline-flex rounded-lg border border-primary/35 bg-primary/10 px-6 py-3 font-orbitron text-xl font-black uppercase tracking-tight text-primary shadow-[0_0_28px_-12px_rgba(0,212,255,.75)] sm:text-2xl">
            Vaga: SDR
          </div>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/62 md:text-xl">
            Procuramos uma pessoa comunicativa, disciplinada e orientada a metas para abrir novas conversas com empresas e gerar oportunidades comerciais para a Liberty.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {['100% remoto', 'Prospecção B2B', 'Comissão por performance'].map((item) => (
              <span key={item} className="rounded-full border border-white/15 bg-white/[.035] px-4 py-2 text-xs font-bold uppercase tracking-[.08em] text-white/80">{item}</span>
            ))}
          </div>
          <a href="#candidatura" className="neon-button mt-10 inline-flex min-h-12 items-center gap-3 px-6 py-3 text-sm font-bold uppercase tracking-[.08em] focus:outline-none focus:ring-4 focus:ring-primary/25">
            Quero participar <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div aria-hidden="true" className="absolute -inset-8 bg-primary/10 blur-[70px]" />
          <div className="glass-card-neon relative overflow-hidden p-6 md:p-9">
            <div className="absolute right-0 top-0 h-40 w-40 bg-primary/10 blur-3xl" />
            <p className="text-xs font-black uppercase tracking-[.2em] text-primary">Sua missão</p>
            <h2 className="mt-4 font-orbitron text-3xl font-black uppercase leading-tight tracking-[-.04em]">Transformar contatos em conversas que geram negócio.</h2>
            <div className="mt-9 space-y-5">
              {[
                [Target, 'Prospectar empresas com perfil para as soluções da Liberty.'],
                [Headphones, 'Iniciar contatos por telefone, WhatsApp, e-mail e LinkedIn.'],
                [BriefcaseBusiness, 'Qualificar necessidades e agendar oportunidades para o time comercial.'],
                [Laptop, 'Registrar atividades e manter o CRM organizado.'],
              ].map(([Icon, text]) => (
                <div key={text as string} className="flex gap-4 border-t border-white/10 pt-5 first:border-0 first:pt-0">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={19} aria-hidden="true" /></div>
                  <p className="pt-1 text-sm leading-relaxed text-white/68">{text as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 bg-white/[.025]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-primary">Quem pode se candidatar</p>
            <h2 className="mt-4 font-orbitron text-3xl font-black uppercase leading-tight tracking-[-.035em] md:text-5xl">Experiência ajuda.<br />Atitude decide.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Comunicação clara e objetiva', 'Disciplina para rotina remota', 'Organização e constância', 'Interesse real por vendas B2B', 'Abertura para feedback', 'Vontade de aprender e evoluir'].map((item) => (
              <div key={item} className="flex min-h-20 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm font-semibold text-white/75">
                <Check className="shrink-0 text-primary" size={17} aria-hidden="true" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="candidatura" className="relative z-10 scroll-mt-6 px-5 py-20 md:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[.2em] text-primary">Candidatura</p>
            <h2 className="mt-4 font-orbitron text-3xl font-black uppercase tracking-[-.04em] md:text-5xl">Conte por que você deve fazer parte do time.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55">Preencha com atenção. Nosso time usará suas respostas para a primeira etapa da seleção.</p>
          </div>

          {submitted ? (
            <div className="glass-card-neon p-8 text-center md:p-14" role="status">
              <CheckCircle2 className="mx-auto text-primary" size={52} strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-6 font-orbitron text-2xl font-black uppercase md:text-4xl">Candidatura recebida</h3>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/60">Se o seu perfil avançar para a próxima etapa, nosso time entrará em contato pelo WhatsApp ou e-mail informado.</p>
              <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">Voltar ao site <ChevronRight size={16} /></Link>
            </div>
          ) : (
            <div className="glass-card-neon overflow-hidden">
              <div className="border-b border-white/10 px-5 py-5 md:px-8">
                <div className="mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-[.1em]">
                  <span className="text-white/45">Etapa {step + 1} de {STEP_LABELS.length}</span>
                  <span className="text-primary">{STEP_LABELS[step]}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-primary shadow-[0_0_16px_rgba(0,212,255,.65)] transition-all duration-300" style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }} /></div>
              </div>

              <form onSubmit={submit} noValidate className="p-5 md:p-8 lg:p-10">
                {step === 0 && (
                  <div className="grid gap-5 md:grid-cols-2">
                    <label><span className="mb-2 block text-sm font-bold">Nome completo *</span><input className={inputClass} value={form.nome} onChange={(e) => update('nome', e.target.value.slice(0, 160))} autoComplete="name" placeholder="Seu nome" /><FieldError message={errors.nome} /></label>
                    <label><span className="mb-2 block text-sm font-bold">E-mail *</span><input className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value.slice(0, 254))} type="email" autoComplete="email" placeholder="voce@email.com" /><FieldError message={errors.email} /></label>
                    <label><span className="mb-2 block text-sm font-bold">WhatsApp *</span><input className={inputClass} value={form.whatsapp} onChange={(e) => update('whatsapp', maskSdrPhone(e.target.value))} inputMode="tel" autoComplete="tel" placeholder="(11) 99999-9999" /><FieldError message={errors.whatsapp} /></label>
                    <label><span className="mb-2 block text-sm font-bold">Cidade e estado *</span><input className={inputClass} value={form.cidadeEstado} onChange={(e) => update('cidadeEstado', e.target.value.slice(0, 160))} autoComplete="address-level2" placeholder="São Paulo, SP" /><FieldError message={errors.cidadeEstado} /></label>
                    <label className="md:col-span-2"><span className="mb-2 block text-sm font-bold">LinkedIn ou link do currículo *</span><input className={inputClass} value={form.perfilUrl} onChange={(e) => update('perfilUrl', e.target.value.slice(0, 500))} inputMode="url" placeholder="linkedin.com/in/seu-perfil" /><FieldError message={errors.perfilUrl} /></label>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div className="grid gap-5 md:grid-cols-2">
                      <label><span className="mb-2 block text-sm font-bold">Situação profissional atual *</span><select className={inputClass} value={form.situacaoProfissional} onChange={(e) => update('situacaoProfissional', e.target.value)}><option value="" className="bg-card">Selecione</option>{SITUATIONS.map((item) => <option key={item} className="bg-card">{item}</option>)}</select><FieldError message={errors.situacaoProfissional} /></label>
                      <label><span className="mb-2 block text-sm font-bold">Experiência com vendas B2B *</span><select className={inputClass} value={form.experienciaB2b} onChange={(e) => update('experienciaB2b', e.target.value)}><option value="" className="bg-card">Selecione</option>{EXPERIENCES.map((item) => <option key={item} className="bg-card">{item}</option>)}</select><FieldError message={errors.experienciaB2b} /></label>
                    </div>
                    <fieldset><legend className="mb-3 text-sm font-bold">Quais canais de prospecção você já utilizou? *</legend><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{CHANNELS.map((channel) => { const active = form.canais.includes(channel); return <button type="button" key={channel} aria-pressed={active} onClick={() => toggleChannel(channel)} className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm transition ${active ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 bg-white/[.035] text-white/55 hover:border-white/25'}`}><span className="flex items-center gap-2">{active && <Check size={15} aria-hidden="true" />}{channel}</span></button> })}</div><FieldError message={errors.canais} /></fieldset>
                    <label><span className="mb-2 block text-sm font-bold">Quais ferramentas ou CRMs você conhece? *</span><input className={inputClass} value={form.ferramentasCrm} onChange={(e) => update('ferramentasCrm', e.target.value.slice(0, 500))} placeholder="Ex.: HubSpot, Pipedrive, RD Station ou nenhuma" /><FieldError message={errors.ferramentasCrm} /></label>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid gap-5 md:grid-cols-2">
                      <label><span className="mb-2 block text-sm font-bold">Disponibilidade diária *</span><select className={inputClass} value={form.disponibilidade} onChange={(e) => update('disponibilidade', e.target.value)}><option value="" className="bg-card">Selecione</option>{AVAILABILITY.map((item) => <option key={item} className="bg-card">{item}</option>)}</select><FieldError message={errors.disponibilidade} /></label>
                      <label><span className="mb-2 block text-sm font-bold">Como você se sente trabalhando com metas e comissão? *</span><select className={inputClass} value={form.confortoMetas} onChange={(e) => update('confortoMetas', e.target.value)}><option value="" className="bg-card">Selecione</option>{TARGET_COMFORT.map((item) => <option key={item} className="bg-card">{item}</option>)}</select><FieldError message={errors.confortoMetas} /></label>
                    </div>
                    <label><span className="mb-2 block text-sm font-bold">Qual foi seu principal resultado comercial? <span className="font-normal text-white/35">(opcional)</span></span><textarea className={textAreaClass} rows={5} value={form.resultadoComercial} onChange={(e) => update('resultadoComercial', e.target.value.slice(0, 1500))} placeholder="Se ainda não trabalhou com vendas, conte uma situação em que precisou convencer, negociar ou atingir uma meta." /></label>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <label><span className="mb-2 block text-sm font-bold">Por que você está concorrendo a esta vaga? *</span><textarea className={textAreaClass} rows={8} value={form.motivoCandidatura} onChange={(e) => update('motivoCandidatura', e.target.value.slice(0, 1500))} placeholder="Conte por que a vaga faz sentido para você, o que deseja construir na área comercial e como pode contribuir com a Liberty." /><div className="mt-2 flex justify-between gap-3"><FieldError message={errors.motivoCandidatura} /><span className="ml-auto text-xs text-white/30">{form.motivoCandidatura.length}/1500</span></div></label>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[.03] p-4"><input type="checkbox" checked={form.consentimento} onChange={(e) => update('consentimento', e.target.checked)} className="mt-1 h-4 w-4 accent-cyan-400" /><span className="text-xs leading-relaxed text-white/55">Autorizo a Liberty Company a utilizar os dados informados para conduzir este processo seletivo e entrar em contato comigo. Li e concordo com a <Link to="/privacidade" target="_blank" className="font-bold text-primary hover:underline">Política de Privacidade</Link>.</span></label>
                    <FieldError message={errors.consentimento} />
                    {submitError && <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200" role="alert">{submitError}</p>}
                  </div>
                )}

                <div className="mt-9 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  {step > 0 ? <button type="button" onClick={previousStep} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-bold text-white/70 transition hover:border-white/30 hover:text-white"><ArrowLeft size={17} /> Voltar</button> : <span />}
                  <button type="submit" disabled={isSubmitting} className="neon-button inline-flex min-h-12 items-center justify-center gap-2 px-6 text-sm font-black uppercase tracking-[.06em] disabled:cursor-wait disabled:opacity-60">{step === STEP_LABELS.length - 1 ? (isSubmitting ? 'Enviando...' : 'Enviar candidatura') : 'Continuar'} {!isSubmitting && <ArrowRight size={17} />}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10 px-5 py-16 md:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-black uppercase tracking-[.2em] text-primary">Como funciona</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {['Candidatura', 'Triagem', 'Entrevista', 'Decisão'].map((item, index) => <div key={item} className="glass-card p-5"><span className="text-xs font-black text-primary">0{index + 1}</span><p className="mt-3 font-orbitron font-black uppercase tracking-tight">{item}</p></div>)}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-white/35">O envio da candidatura não garante avanço no processo. Entraremos em contato apenas com os perfis selecionados para a próxima etapa.</p>
        </div>
      </section>
    </main>
  )
}
