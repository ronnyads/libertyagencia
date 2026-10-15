import { describe, expect, it } from 'vitest'
import {
  initialSdrApplication,
  isValidProfessionalUrl,
  normalizeProfessionalUrl,
  validateSdrStep,
} from '@/lib/sdr-application'

describe('SDR application validation', () => {
  it('normalizes professional links without protocol', () => {
    expect(normalizeProfessionalUrl('linkedin.com/in/candidato')).toBe('https://linkedin.com/in/candidato')
    expect(isValidProfessionalUrl('linkedin.com/in/candidato')).toBe(true)
  })

  it('requires the candidate motivation to be descriptive', () => {
    const data = { ...initialSdrApplication, consentimento: true, motivoCandidatura: 'Quero a vaga.' }
    expect(validateSdrStep(3, data)).toHaveProperty('motivoCandidatura')
  })

  it('accepts a complete final step', () => {
    const data = {
      ...initialSdrApplication,
      consentimento: true,
      motivoCandidatura: 'Quero construir uma carreira comercial consistente e acredito que minha disciplina e comunicação podem contribuir com as metas da Liberty.',
    }
    expect(validateSdrStep(3, data)).toEqual({})
  })
})
