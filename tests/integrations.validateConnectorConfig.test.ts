import fs from 'fs'
import path from 'path'

import { validateConnectorConfig } from '../src/integrations/validateConnectorConfig'
import { IntegrationConnectorSpec } from '../src/integrations/types'

const loadFixture = (fixtureName: string): IntegrationConnectorSpec => {
  const fixturePath = path.join(
    __dirname,
    'fixtures',
    'connectors',
    fixtureName
  )

  return JSON.parse(fs.readFileSync(fixturePath, 'utf8'))
}

describe('validateConnectorConfig', () => {
  test('accepts valid connector config with provenance and ownership guarantees', () => {
    const fixture = loadFixture('pass.connector.json')
    const errors = validateConnectorConfig(fixture)

    expect(errors).toEqual([])
  })

  test('rejects connector config missing provenance/ownership guarantees', () => {
    const fixture = loadFixture('fail.connector.json')
    const errors = validateConnectorConfig(fixture)

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'connector must guarantee data provenance ownership'
        ),
        expect.stringContaining(
          'preservation invariant violated (I(ext)=1 ⇒ Pₑ preserved)'
        ),
      ])
    )
  })
})
