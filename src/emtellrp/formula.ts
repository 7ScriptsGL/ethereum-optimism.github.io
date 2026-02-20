import { EmtellTokenDefinition } from './types'

const mapPattern = /^τ\(([^)]+)\)=⟨(E₁),(E₂)⟩$/u
const guardPattern = /^χ\((E₁),(E₂)\)=(0|1)$/u

export const parseTokenMapFormula = (formula: string): string => {
  const parsed = formula.match(mapPattern)
  if (!parsed) {
    throw new Error(`Invalid τ map formula: ${formula}`)
  }

  return parsed[1]
}

export const resolveTokenMapping = (
  symbol: string,
  token: EmtellTokenDefinition
): [string, string] => {
  const mappedSymbol = parseTokenMapFormula(token.map)
  if (mappedSymbol !== symbol) {
    throw new Error(
      `Token map symbol mismatch for ${symbol}: found ${mappedSymbol} in formula`
    )
  }

  return [token['E₁'], token['E₂']]
}

export const evaluateGuard = (formula: string, expectedGuard: number): number => {
  const parsed = formula.match(guardPattern)
  if (!parsed) {
    throw new Error(`Invalid χ guard formula: ${formula}`)
  }

  const resolved = Number(parsed[3])
  if (resolved !== expectedGuard) {
    throw new Error(
      `Guard value ${resolved} does not match expected guard ${expectedGuard}`
    )
  }

  return resolved
}
