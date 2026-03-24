import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowLeft } from 'lucide-react'

export default function Obrigado() {
  const [searchParams] = useSearchParams()
  const isMentoria = searchParams.get('tipo') === 'mentoria'

  useEffect(() => {
    const fire = () => {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Lead')
      }
    }
    // Tenta imediatamente e depois com delay caso o pixel ainda esteja carregando
    fire()
    const t = setTimeout(fire, 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid-bg absolute inset-0 opacity-10" />
        <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 neon-orb opacity-30" />
        <div className="hidden md:block absolute bottom-1/4 right-1/4 w-64 h-64 neon-orb opacity-20" />
      </div>

      <div className="relative z-10 container px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-10">
          <ArrowLeft size={16} /> Voltar ao site
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-lg mx-auto"
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

          <h2 className="font-orbitron font-bold text-2xl md:text-3xl mb-4 text-foreground">
            {isMentoria ? 'Candidatura recebida!' : 'Solicitação recebida!'}
          </h2>

          <p className="text-muted-foreground text-base mb-8 max-w-sm">
            {isMentoria
              ? 'Nossa equipe vai analisar seu perfil e entrar em contato em até 24h via WhatsApp.'
              : 'Nossa equipe vai analisar seu negócio e entrar em contato em até 24h via WhatsApp.'
            }
          </p>

          <Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Voltar ao site
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
