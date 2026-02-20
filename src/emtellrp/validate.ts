import { EmtellRuntimeConfig } from './types'

const assertRequiredKeys = (
  objectValue: Record<string, unknown>,
  requiredKeys: string[],
  scope: string
): void => {
  for (const key of requiredKeys) {
    if (!(key in objectValue)) {
      throw new Error(`Missing required key '${key}' in ${scope}`)
    }
  }
}

export const validateEmtellSchema = (config: EmtellRuntimeConfig): void => {
  assertRequiredKeys(config as unknown as Record<string, unknown>, ['estates', 'financialPipeline'], 'root config')

  assertRequiredKeys(
    config.estates as unknown as Record<string, unknown>,
    ['chain', 'syntax', 'tracking', 'tokens'],
    'estates config'
  )

  assertRequiredKeys(
    config.estates.tracking as unknown as Record<string, unknown>,
    ['estate_primary', 'estate_secondary', 'resolver', 'runtime_guard'],
    'estates.tracking'
  )

  assertRequiredKeys(
    config.financialPipeline as unknown as Record<string, unknown>,
    ['chain', 'syntax', 'pipeline', 'verification'],
    'financial pipeline config'
  )

  assertRequiredKeys(
    config.financialPipeline.pipeline as unknown as Record<string, unknown>,
    ['estate_output', 'token_map', 'runtime_guard'],
    'financial pipeline formulas'
  )

  assertRequiredKeys(
    config.financialPipeline.verification as unknown as Record<string, unknown>,
    ['provider', 'deterministic_mode', 'expected_guard'],
    'financial pipeline verification'
  )

  if (config.estates.chain !== config.financialPipeline.chain) {
    throw new Error('Chain mismatch between estates and financial pipeline configs')
  }

  if (config.estates.syntax !== config.financialPipeline.syntax) {
    throw new Error('Syntax mismatch between estates and financial pipeline configs')
  }
}
