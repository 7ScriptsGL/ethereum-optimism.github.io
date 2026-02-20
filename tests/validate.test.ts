import path from 'path'

import fetch from 'node-fetch'

import { validate } from '../src/validate'

jest.mock('node-fetch', () => jest.fn())

const mockedFetch = fetch as unknown as jest.Mock

describe('validate fixtures mode', () => {
  afterEach(() => {
    mockedFetch.mockReset()
  })

  test('runs structural checks without network calls', async () => {
    const datadir = path.resolve(__dirname, 'data')
    const results = await validate(datadir, [], { mode: 'fixtures' })

    expect(mockedFetch).not.toHaveBeenCalled()
    expect(results.filter((result) => result.type === 'error')).toHaveLength(0)
  })

  test('auto mode falls back to fixtures when CoinGecko is unavailable', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('network unavailable'))

    const datadir = path.resolve(__dirname, 'data')
    const results = await validate(datadir, ['OP'], { mode: 'auto' })

    expect(
      results.some((result) =>
        result.message.includes('falling back to fixture validation mode')
      )
    ).toBe(true)
    expect(results.filter((result) => result.type === 'error')).toHaveLength(0)
  })
})
