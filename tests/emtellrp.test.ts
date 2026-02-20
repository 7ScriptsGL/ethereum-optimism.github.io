import path from 'path'

import {
  computeEstateOutputs,
  evaluateGuard,
  loadEmtellConfig,
  parseTokenMapFormula,
  resolveTokenMapping,
  runEmtellRuntime,
} from '../src/emtellrp'

describe('EmtellRP runtime module', () => {
  const fixtureDir = path.resolve(__dirname, 'fixtures/emtellrp')
  const estatesPath = path.resolve(fixtureDir, 'estates.json')
  const pipelinePath = path.resolve(fixtureDir, 'financial-pipeline.json')

  test('parses τ formula for deterministic fixture', () => {
    expect(parseTokenMapFormula('τ(KMT2)=⟨E₁,E₂⟩')).toBe('KMT2')
  })

  test('resolves token mapping for deterministic fixture token', () => {
    const mapping = resolveTokenMapping('KMT2', {
      variant: 'θ=π',
      'E₁': '0x2222222222222222222222222222222222222222',
      'E₂': '0x3333333333333333333333333333333333333333',
      map: 'τ(KMT2)=⟨E₁,E₂⟩',
      guard: 'χ(E₁,E₂)=1',
    })

    expect(mapping).toEqual([
      '0x2222222222222222222222222222222222222222',
      '0x3333333333333333333333333333333333333333',
    ])
  })

  test('evaluates χ guard against expected deterministic verification value', () => {
    expect(evaluateGuard('χ(E₁,E₂)=1', 1)).toBe(1)
  })

  test('loads, validates, and computes estate outputs E₁/E₂/τ/χ', () => {
    const config = loadEmtellConfig(estatesPath, pipelinePath)
    const outputs = computeEstateOutputs(config)

    expect(outputs).toEqual([
      {
        token: 'KMT2',
        'E₁': '0x2222222222222222222222222222222222222222',
        'E₂': '0x3333333333333333333333333333333333333333',
        'τ': [
          '0x2222222222222222222222222222222222222222',
          '0x3333333333333333333333333333333333333333',
        ],
        'χ': 1,
      },
    ])
  })

  test('supports runtime API entrypoint for execution', () => {
    const outputs = runEmtellRuntime(estatesPath, pipelinePath)

    expect(outputs).toHaveLength(1)
    expect(outputs[0].token).toBe('KMT2')
    expect(outputs[0]['χ']).toBe(1)
  })
})
