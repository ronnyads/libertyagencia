export interface SdrApplicationData {
  nome: string
  email: string
  whatsapp: string
  cidadeEstado: string
  perfilUrl: string
  situacaoProfissional: string
  experienciaB2b: string
  canais: string[]
  ferramentasCrm: string
  disponibilidade: string
  confortoMetas: string
  resultadoComercial: string
  motivoCandidatura: string
  consentimento: boolean
}

export const initialSdrApplication: SdrApplicationData = {
  nome: '',
  email: '',
  whatsapp: '',
  cidadeEstado: '',
  perfilUrl: '',
  situacaoProfissional: '',
  experienciaB2b: '',
  canais: [],
  ferramentasCrm: '',
  disponibilidade: '',
  confortoMetas: '',
  resultadoComercial: '',
  motivoCandidatura: '',
  consentimento: false,
}

export function normalizeProfessionalUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function isValidProfessionalUrl(value: string) {
  try {
    const parsed = new URL(normalizeProfessionalUrl(value))
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateSdrStep(step: number, data: SdrApplicationData) {
  const errors: Record<string, string> = {}

  if (step === 0) {
    if (data.nome.trim().length < 3) errors.nome = 'Informe seu nome completo.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Informe um e-mail válido.'
    const phoneDigits = data.whatsapp.replace(/\D/g, '')
    if (phoneDigits.length < 10 || phoneDigits.length > 11) errors.whatsapp = 'Informe um WhatsApp válido.'
    if (data.cidadeEstado.trim().length < 4) errors.cidadeEstado = 'Informe sua cidade e estado.'
    if (!isValidProfessionalUrl(data.perfilUrl)) errors.perfilUrl = 'Informe um link válido do LinkedIn ou currículo.'
  }

  if (step === 1) {
    if (!data.situacaoProfissional) errors.situacaoProfissional = 'Selecione sua situação atual.'
    if (!data.experienciaB2b) errors.experienciaB2b = 'Selecione seu nível de experiência.'
    if (data.canais.length === 0) errors.canais = 'Selecione pelo menos uma opção.'
    if (data.ferramentasCrm.trim().length < 2) errors.ferramentasCrm = 'Conte quais ferramentas conhece ou informe “Nenhuma”.'
  }

  if (step === 2) {
    if (!data.disponibilidade) errors.disponibilidade = 'Selecione sua disponibilidade.'
    if (!data.confortoMetas) errors.confortoMetas = 'Selecione uma opção.'
  }

  if (step === 3) {
    if (data.motivoCandidatura.trim().length < 80) errors.motivoCandidatura = 'Escreva pelo menos 80 caracteres para nos ajudar a conhecer você.'
    if (!data.consentimento) errors.consentimento = 'Você precisa aceitar os termos para enviar a candidatura.'
  }

  return errors
}

export function maskSdrPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}
