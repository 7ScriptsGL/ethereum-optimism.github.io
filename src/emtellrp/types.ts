export interface EmtellTokenDefinition {
  variant: string
  'E₁': string
  'E₂': string
  map: string
  guard: string
}

export interface EmtellEstatesConfig {
  chain: string
  syntax: string
  tracking: {
    estate_primary: string
    estate_secondary: string
    resolver: string
    runtime_guard: string
  }
  tokens: Record<string, EmtellTokenDefinition>
}

export interface EmtellFinancialPipelineConfig {
  chain: string
  syntax: string
  pipeline: {
    estate_output: string
    token_map: string
    runtime_guard: string
  }
  verification: {
    provider: string
    deterministic_mode: boolean
    expected_guard: number
  }
}

export interface EmtellRuntimeConfig {
  estates: EmtellEstatesConfig
  financialPipeline: EmtellFinancialPipelineConfig
}

export interface EmtellEstateOutput {
  token: string
  'E₁': string
  'E₂': string
  'τ': [string, string]
  'χ': number
}
