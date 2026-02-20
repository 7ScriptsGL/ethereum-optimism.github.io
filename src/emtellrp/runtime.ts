import fs from 'fs'

import {
  EmtellEstateOutput,
  EmtellEstatesConfig,
  EmtellFinancialPipelineConfig,
  EmtellRuntimeConfig,
} from './types'
import { evaluateGuard, resolveTokenMapping } from './formula'
import { validateEmtellSchema } from './validate'

export const loadEmtellConfig = (
  estatesPath: string,
  financialPipelinePath: string
): EmtellRuntimeConfig => {
  const estates = JSON.parse(
    fs.readFileSync(estatesPath, 'utf-8')
  ) as EmtellEstatesConfig
  const financialPipeline = JSON.parse(
    fs.readFileSync(financialPipelinePath, 'utf-8') as string
  ) as EmtellFinancialPipelineConfig

  const config = {
    estates,
    financialPipeline,
  }

  validateEmtellSchema(config)

  return config
}

export const computeEstateOutputs = (
  config: EmtellRuntimeConfig
): EmtellEstateOutput[] => {
  const expectedGuard = config.financialPipeline.verification.expected_guard

  return Object.entries(config.estates.tokens).map(([symbol, token]) => {
    const tau = resolveTokenMapping(symbol, token)
    const chi = evaluateGuard(token.guard, expectedGuard)

    return {
      token: symbol,
      'E₁': token['E₁'],
      'E₂': token['E₂'],
      'τ': tau,
      'χ': chi,
    }
  })
}

export const runEmtellRuntime = (
  estatesPath: string,
  financialPipelinePath: string
): EmtellEstateOutput[] => {
  const config = loadEmtellConfig(estatesPath, financialPipelinePath)
  return computeEstateOutputs(config)
}
