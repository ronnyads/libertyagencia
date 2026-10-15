import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Box,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
  Store,
  Target,
  TrendingUp,
} from 'lucide-react'
import { sendLeadToCrm } from '@/lib/crm-leads'

const phoneMask = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const steps = [
  ['L', 'Localizar', 'Encontre uma oportunidade possível com sinais de demanda.'],
  ['I', 'Iniciar', 'Prepare conta, regras, logística e a rotina mínima.'],
  ['B', 'Basear', 'Construa anúncio, preço, margem, fotos e mensagem.'],
  ['E', 'Executar', 'Publique, atenda, envie e conclua a operação.'],
  ['R', 'Refinar', 'Leia os sinais e ajuste sem depender de achismo.'],
  ['T', 'Trazer tração', 'Movimente sua oferta sem queimar caixa.'],
  ['E', 'Escalar', 'Transforme a primeira venda em consistência.'],
  ['C', 'Construir caixa', 'Opere com controle, reinvista e ganhe autonomia.'],
] as const

const modules = [
  ['01', 'Localizar oportunidade', 'Saia do achismo com um produto possível e validado.', Search],
  ['02', 'Iniciar estrutura', 'Deixe conta, regras, envio e rotina mínima prontos.', Store],
  ['03', 'Basear a oferta', 'Crie anúncio, preço, margem, fotos e descrição.', Target],
  ['04', 'Executar a venda', 'Aprenda a acompanhar, atender, enviar e proteger sua reputação.', PackageCheck],
  ['05', 'Refinar com dados', 'Entenda visitas, conversão e quando ajustar ou trocar.', BarChart3],
  ['06', 'Trazer tráfego e tração', 'Use orgânico, promoção e mídia com controle.', TrendingUp],
  ['07', 'Escalar canais e construir caixa', 'Transforme a primeira venda em rotina e prepare a expansão.', CircleDollarSign],
] as const

const faqs = [
  ['Preciso já vender no Mercado Livre?', 'Não. O treinamento foi desenhado para quem está começando do zero ou já tentou vender sem um processo claro.'],
  ['O curso promete faturamento ou venda em prazo fixo?', 'Não. O LIBERTE-C ensina processo, análise e execução. O resultado depende da realidade e da aplicação de cada aluno.'],
  ['Quando o treinamento será lançado?', 'A lista de espera é o canal oficial para receber as novidades, a abertura das vagas e as condições de lançamento em primeira mão.'],
  ['O que acontece depois da inscrição?', 'Seu cadastro vai para o time Liberty. Quando houver uma novidade relevante sobre o treinamento, entraremos em contato pelos dados informados.'],
] as const

function scrollToForm() {
  document.getElementById('lista-de-espera')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function LiberteCMercadoLivre() {
  const [searchParams] = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [situacao, setSituacao] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [consent, setConsent] = useState(false)

  const campaign = useMemo(() => ({
    source: searchParams.get('utm_source') || 'landing-page',
    medium: searchParams.get('utm_medium') || 'organic',
    name: searchParams.get('utm_campaign') || 'liberte-c-mercado-livre',
  }), [searchParams])

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'LIBERTE-C Mercado Livre | Lista de espera'
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = description?.content
    if (description) description.content = 'Entre na lista de espera do LIBERTE-C Mercado Livre e aprenda a construir sua primeira operação real com processo.'
    return () => {
      document.title = previousTitle
      if (description && previousDescription) description.content = previousDescription
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const digits = whatsapp.replace(/\D/g, '')
    if (nome.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email) || digits.length < 10 || !situacao || !consent) {
      setError('Confira os campos obrigatórios e tente novamente.')
      return
    }

    try {
      setIsSubmitting(true)
      await sendLeadToCrm({
        form_type: 'lead',
        nome: nome.trim(),
        email: email.trim(),
        whatsapp,
        servico_interesse: 'LIBERTE-C Mercado Livre — Lista de espera',
        situacao,
        objetivo: objetivo.trim() || undefined,
        consentimento: consent,
        utm_source: campaign.source,
        utm_medium: campaign.medium,
        utm_campaign: campaign.name,
      })
      setSubmitted(true)
    } catch {
      setError('Não foi possível concluir agora. Tente novamente em instantes.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdf5] font-inter text-[#252525] selection:bg-[#FFE600] selection:text-[#252525]">
      <header className="relative z-30 border-b border-black/10 bg-[#FFE600]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Voltar ao site da Liberty">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#252525] text-sm font-black text-[#FFE600] shadow-[4px_4px_0_#3483FA]">L</span>
            <span className="font-orbitron text-sm font-black tracking-tight md:text-base">LIBERTY <span className="text-[#2968c8]">UNIVERSIDADE</span></span>
          </Link>
          <button onClick={scrollToForm} className="rounded-xl bg-[#3483FA] px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_0_#1f5aae] transition hover:-translate-y-0.5 hover:bg-[#2968c8] md:px-6">
            Entrar na lista
          </button>
        </div>
      </header>

      <section className="relative bg-[#FFE600] pb-20 pt-10 md:pb-28 md:pt-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.13]" style={{ backgroundImage: 'radial-gradient(#252525 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-black/15 bg-white/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] backdrop-blur">
              Lista de espera aberta
            </div>
            <div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[.14em] text-black/50">
              <span>Treinamento para</span>
              <img
                src="/mercado-livre-wordmark.svg"
                alt="Mercado Livre"
                className="h-7 w-auto"
                width="102"
                height="40"
              />
            </div>
            <p className="mb-3 font-orbitron text-sm font-extrabold uppercase tracking-[0.22em] text-[#2968c8]">Método LIBERTE-C</p>
            <h1 className="max-w-4xl font-orbitron text-[2.65rem] font-black leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-[5rem]">
              Do zero à sua primeira operação real no Mercado Livre.
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-black/70 md:text-xl">
              Pare de procurar fórmula para vender. Aprenda a escolher produto, montar uma oferta e operar com um processo que você consegue executar.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={scrollToForm} className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#3483FA] px-7 text-base font-extrabold text-white shadow-[0_6px_0_#1f5aae] transition hover:-translate-y-1 hover:bg-[#2968c8]">
                Quero entrar na lista <ArrowRight className="transition group-hover:translate-x-1" size={20} />
              </button>
              <a href="#metodo" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-black/20 bg-white/65 px-7 font-bold transition hover:bg-white">
                Conhecer o método <ChevronDown size={18} />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-black/65">
              <span className="flex items-center gap-2"><Check className="text-[#00a650]" size={18} /> Feito para iniciantes</span>
              <span className="flex items-center gap-2"><Check className="text-[#00a650]" size={18} /> Aulas diretas e práticas</span>
              <span className="flex items-center gap-2"><Check className="text-[#00a650]" size={18} /> Sem promessa milagrosa</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rotate-3 rounded-[2.5rem] bg-[#3483FA]" />
            <div className="relative -rotate-1 rounded-[2rem] border-2 border-black/10 bg-white p-6 shadow-[0_28px_80px_rgba(0,0,0,.18)] sm:p-9">
              <div className="flex items-center justify-between border-b border-black/10 pb-5">
                <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#3483FA]">Sua rota de execução</p><p className="mt-1 text-xl font-black">Produto → Oferta → Venda</p></div>
                <ShoppingCart className="text-[#3483FA]" size={34} />
              </div>
              <div className="space-y-4 py-6">
                {[
                  [Search, 'Produto validado', 'Demanda, margem e operação possível'],
                  [ClipboardCheck, 'Estrutura pronta', 'Conta, logística e rotina mínima'],
                  [Box, 'Oferta publicada', 'Preço, fotos e anúncio com clareza'],
                  [TrendingUp, 'Operação em movimento', 'Dados para ajustar e evoluir'],
                ].map(([Icon, title, copy], index) => {
                  const CardIcon = Icon as typeof Search
                  return <div key={String(title)} className="flex items-center gap-4 rounded-2xl bg-[#f5f5f5] p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#FFE600] font-black">{index + 1}</span>
                    <div className="min-w-0"><p className="font-extrabold">{String(title)}</p><p className="text-sm text-black/55">{String(copy)}</p></div>
                    <CardIcon className="ml-auto hidden shrink-0 text-[#3483FA] sm:block" size={22} />
                  </div>
                })}
              </div>
              <p className="rounded-2xl bg-[#e7f2ff] p-4 text-center text-sm font-bold text-[#2968c8]">“Venda não é sorte. É processo.”</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#252525] py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#FFE600]">Estudo de caso dentro do treinamento</p>
              <p className="mt-5 font-orbitron text-[4.3rem] font-black leading-none tracking-[-.06em] text-[#FFE600] sm:text-8xl">R$ 310 mil</p>
              <p className="mt-3 font-orbitron text-2xl font-black md:text-4xl">em 25 dias de operação</p>
              <p className="mt-6 text-lg font-semibold leading-relaxed text-white/75">Você vai ver como a operação foi construída, quais decisões foram tomadas e o que aconteceu nos bastidores.</p>
            </div>
            <figure className="overflow-hidden rounded-2xl border border-white/15 bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,.32)]">
              <img src="/liberte-c-case-310k.png" alt="Resumo da operação: R$ 310.415 em vendas brutas, 9.008 unidades vendidas, 8.551 vendas e taxa de conversão de 5,8%" className="h-auto w-full rounded-xl" width="1016" height="329" />
              <figcaption className="px-3 pb-2 pt-3 text-xs leading-relaxed text-black/50">Dados reais da operação apresentada no treinamento. Resultado específico, sem promessa ou garantia de desempenho individual.</figcaption>
            </figure>
          </div>
          <div className="pt-14 text-center">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#FFE600]">O jogo real</p>
            <h2 className="mx-auto mt-4 max-w-4xl font-orbitron text-3xl font-black leading-tight md:text-5xl">Você não precisa de mais um truque. Precisa aprender a operar.</h2>
          </div>
          <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
            {[
              ['01', 'Escolher sem achismo', 'Analise demanda, concorrência, margem e se o produto cabe na sua operação.'],
              ['02', 'Fazer a conta antes', 'Entenda custos, tarifas, logística e quanto realmente pode sobrar por venda.'],
              ['03', 'Ajustar com dados', 'Leia visitas, conversão e sinais reais antes de trocar tudo ou desistir.'],
            ].map(([number, title, copy]) => <article key={number} className="rounded-2xl border border-white/10 bg-white/[.045] p-6">
              <span className="text-sm font-black text-[#FFE600]">{number}</span>
              <h3 className="mt-5 font-orbitron text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-relaxed text-white/60">{copy}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="metodo" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[.18em] text-[#3483FA]">Um método para sair do lugar</p>
            <h2 className="mt-4 font-orbitron text-3xl font-black leading-tight md:text-5xl">LIBERTE-C do achismo. Entre no marketplace com processo.</h2>
            <p className="mt-5 text-lg leading-relaxed text-black/60">Comércio, conhecimento, canais e caixa organizados em uma jornada que leva o iniciante da oportunidade até uma operação com controle.</p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([letter, title, copy], index) => <article key={`${letter}-${title}`} className="group rounded-2xl border border-black/10 bg-[#fffdf5] p-5 transition hover:-translate-y-1 hover:border-[#3483FA]/50 hover:shadow-xl">
              <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFE600] font-orbitron text-lg font-black">{letter}</span><span className="text-xs font-bold text-black/30">0{index + 1}</span></div>
              <h3 className="mt-5 font-orbitron text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/55">{copy}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#f2f4f5] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-[#3483FA]">O que você vai percorrer</p><h2 className="mt-4 font-orbitron text-3xl font-black md:text-5xl">7 módulos. Uma operação construída passo a passo.</h2></div>
            <button onClick={scrollToForm} className="inline-flex items-center gap-2 self-start font-extrabold text-[#2968c8]">Reservar meu lugar <ArrowRight size={18} /></button>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {modules.map(([number, title, copy, Icon]) => <article key={number} className="flex gap-5 rounded-2xl border border-black/10 bg-white p-5 transition hover:border-[#3483FA]/40 hover:shadow-lg md:p-6">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e7f2ff] text-[#3483FA]"><Icon size={23} /></div>
              <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#3483FA]">Módulo {number}</p><h3 className="mt-2 font-orbitron text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-black/55">{copy}</p></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#3483FA] py-16 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div><p className="text-sm font-bold uppercase tracking-[.18em] text-[#FFE600]">Para colocar em prática</p><h2 className="mt-4 font-orbitron text-3xl font-black leading-tight md:text-5xl">Menos teoria solta. Mais decisão e execução.</h2><p className="mt-5 text-lg leading-relaxed text-white/75">Cada etapa termina com uma tarefa concreta, para transformar conhecimento em uma operação que existe fora da tela.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {['Checklist de validação de produto', 'Planilha simples de margem', 'Checklist pré-anúncio', 'Checklist da primeira venda e envio', 'Glossário para iniciantes', 'Ordem exata de execução'].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl bg-white/10 p-4 font-semibold backdrop-blur"><Check className="shrink-0 text-[#FFE600]" size={20} /> {item}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <figure className="relative mx-auto w-full max-w-xl">
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[2rem] bg-[#FFE600]" />
            <picture>
              <source media="(max-width: 639px)" srcSet="/ronny-liberte-c-close.webp" />
              <img src="/ronny-liberte-c-wide.webp" alt="Ronny Oliveira, criador do Método LIBERTE-C" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover object-center shadow-[0_24px_60px_rgba(0,0,0,.16)]" width="1254" height="1254" />
            </picture>
            <figcaption className="absolute bottom-5 left-5 right-5 rounded-2xl bg-[#252525]/90 px-5 py-4 text-white backdrop-blur">
              <p className="font-orbitron text-lg font-black">Ronny Oliveira</p>
              <p className="mt-1 text-sm text-white/60">Criador do Método LIBERTE-C</p>
            </figcaption>
          </figure>
          <div className="lg:pl-8">
            <p className="text-sm font-extrabold uppercase tracking-[.18em] text-[#3483FA]">Operador falando com futuro operador</p>
            <h2 className="mt-4 font-orbitron text-3xl font-black leading-tight md:text-5xl">Eu ensino o processo que uso na operação real.</h2>
            <p className="mt-6 text-lg leading-relaxed text-black/60">O LIBERTE-C nasceu para mostrar o que eu faria se precisasse começar de novo: como analisar uma oportunidade, preparar a estrutura, publicar a oferta e tomar decisões com base no que os dados mostram.</p>
            <div className="mt-8 border-y border-black/10 py-6">
              <p className="font-orbitron text-4xl font-black tracking-[-.04em] text-[#3483FA] md:text-5xl">Em 2025, liderei operações de dropshipping</p>
              <p className="mt-2 text-base font-bold text-black/75">que movimentaram milhões de reais.</p>
              <p className="mt-2 text-xs text-black/40">Histórico da operação do Ronny Oliveira. Resultado específico, sem garantia de desempenho individual.</p>
            </div>
            <blockquote className="mt-8 border-l-4 border-[#FFE600] pl-6 text-xl font-bold leading-relaxed text-black/80">“Eu não quero te ensinar truque de marketplace. Quero te ensinar a operar, tomar decisão e construir uma venda que você consegue repetir.”</blockquote>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Caso real destrinchado', 'Bastidores da operação', 'Aplicação prática'].map((item) => <span key={item} className="rounded-full border border-black/10 bg-[#f5f5f5] px-4 py-2 text-sm font-bold">{item}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section id="lista-de-espera" className="scroll-mt-0 bg-[#FFE600] py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-8 lg:grid-cols-[.88fr_1.12fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <div className="inline-flex items-center rounded-full bg-[#252525] px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-[#FFE600]">Lista de espera</div>
            <h2 className="mt-6 font-orbitron text-4xl font-black leading-[1.05] tracking-tight md:text-5xl">Seja avisado quando as vagas abrirem.</h2>
            <p className="mt-5 text-lg leading-relaxed text-black/65">Cadastre-se para receber as novidades e as condições de lançamento do LIBERTE-C Mercado Livre em primeira mão.</p>
            <div className="mt-8 space-y-4">
              {['Informações oficiais do lançamento', 'Prioridade na comunicação de abertura', 'Conteúdos e bastidores do treinamento'].map((item) => <p key={item} className="flex items-center gap-3 font-semibold"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#00a650] text-white"><Check size={16} /></span>{item}</p>)}
            </div>
          </div>

          <div className="rounded-[2rem] border-2 border-black/10 bg-white p-6 shadow-[10px_10px_0_rgba(52,131,250,.28)] md:p-9">
            {submitted ? (
              <div role="status" className="flex min-h-[430px] flex-col items-center justify-center text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-[#e6f7ef] text-[#00a650]"><Check size={40} strokeWidth={3} /></span>
                <p className="mt-7 text-sm font-black uppercase tracking-[.18em] text-[#00a650]">Inscrição confirmada</p>
                <h3 className="mt-3 font-orbitron text-3xl font-black">Você está na lista.</h3>
                <p className="mt-4 max-w-md leading-relaxed text-black/55">Quando tivermos novidades sobre a abertura do LIBERTE-C Mercado Livre, o time Liberty falará com você.</p>
                <Link to="/" className="mt-8 font-bold text-[#2968c8] hover:underline">Conhecer a Liberty →</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <p className="text-sm font-black uppercase tracking-[.16em] text-[#3483FA]">Preencha em menos de 1 minuto</p>
                <h3 className="mt-2 font-orbitron text-2xl font-black">Entre para a lista de espera</h3>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Nome completo *</span><input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" required className="h-12 w-full rounded-xl border border-black/15 bg-[#fafafa] px-4 outline-none transition focus:border-[#3483FA] focus:ring-4 focus:ring-[#3483FA]/10" placeholder="Como podemos chamar você?" /></label>
                  <label><span className="mb-2 block text-sm font-bold">WhatsApp *</span><input value={whatsapp} onChange={(e) => setWhatsapp(phoneMask(e.target.value))} inputMode="tel" autoComplete="tel" required className="h-12 w-full rounded-xl border border-black/15 bg-[#fafafa] px-4 outline-none transition focus:border-[#3483FA] focus:ring-4 focus:ring-[#3483FA]/10" placeholder="(11) 99999-9999" /></label>
                  <label><span className="mb-2 block text-sm font-bold">E-mail *</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required className="h-12 w-full rounded-xl border border-black/15 bg-[#fafafa] px-4 outline-none transition focus:border-[#3483FA] focus:ring-4 focus:ring-[#3483FA]/10" placeholder="voce@email.com" /></label>
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Qual é sua situação hoje? *</span><select value={situacao} onChange={(e) => setSituacao(e.target.value)} required className="h-12 w-full rounded-xl border border-black/15 bg-[#fafafa] px-4 outline-none transition focus:border-[#3483FA] focus:ring-4 focus:ring-[#3483FA]/10"><option value="">Selecione uma opção</option><option>Nunca vendi no Mercado Livre</option><option>Já tentei, mas ainda não vendi</option><option>Já fiz algumas vendas</option><option>Já vendo e quero melhorar minha operação</option></select></label>
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Qual é seu principal objetivo? <span className="font-normal text-black/40">(opcional)</span></span><textarea value={objetivo} onChange={(e) => setObjetivo(e.target.value.slice(0, 800))} rows={3} className="w-full resize-none rounded-xl border border-black/15 bg-[#fafafa] px-4 py-3 outline-none transition focus:border-[#3483FA] focus:ring-4 focus:ring-[#3483FA]/10" placeholder="Conte brevemente o que você quer conquistar no marketplace" /></label>
                </div>
                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-[#f5f5f5] p-4 text-sm leading-relaxed text-black/60"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#3483FA]" /><span>Autorizo a Liberty a entrar em contato sobre o treinamento. Li a <Link to="/privacidade" target="_blank" className="font-bold text-[#2968c8] underline">Política de Privacidade</Link>.</span></label>
                {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
                <button disabled={isSubmitting} type="submit" className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#3483FA] px-6 text-base font-extrabold text-white shadow-[0_5px_0_#1f5aae] transition hover:-translate-y-0.5 hover:bg-[#2968c8] disabled:cursor-wait disabled:opacity-60">
                  {isSubmitting ? 'Enviando inscrição...' : <>Quero entrar na lista <ArrowRight size={20} /></>}
                </button>
                <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-black/45"><ShieldCheck size={15} /> Seus dados serão usados somente para esta comunicação.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="text-center"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-[#3483FA]">Dúvidas frequentes</p><h2 className="mt-4 font-orbitron text-3xl font-black md:text-4xl">Antes de entrar na lista</h2></div>
          <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
            {faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold"><span>{question}</span><ChevronDown className="shrink-0 text-[#3483FA] transition group-open:rotate-180" size={20} /></summary><p className="max-w-3xl pt-3 leading-relaxed text-black/55">{answer}</p></details>)}
          </div>
        </div>
      </section>

      <footer className="bg-[#252525] px-5 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm md:flex-row md:items-start md:justify-between">
          <div><p className="font-orbitron font-black">LIBERTY <span className="text-[#FFE600]">UNIVERSIDADE</span></p><p className="mt-2 text-white/45">Comércio. Conhecimento. Canais. Caixa.</p></div>
          <div className="max-w-xl md:text-right">
            <div className="flex gap-5 text-white/55 md:justify-end"><Link to="/privacidade" className="hover:text-white">Privacidade</Link><Link to="/seguranca" className="hover:text-white">Segurança</Link><Link to="/" className="hover:text-white">Liberty Agência</Link></div>
            <p className="mt-4 text-xs leading-relaxed text-white/35">Treinamento independente. Mercado Livre é marca de seu respectivo titular. Esta página não indica parceria, patrocínio ou endosso da plataforma.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
