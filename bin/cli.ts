import fs from 'fs'

import { Command } from 'commander'

import { generate } from '../src/generate'
import { runEmtellRuntime } from '../src/emtellrp'
import { validate } from '../src/validate'
import { ValidationMode, validate } from '../src/validate'
import { version } from '../package.json'

const program = new Command()

const VALIDATION_MODES: ValidationMode[] = ['live', 'fixtures', 'auto']

program
  .name('optl')
  .description('CLI for generating and validating tokenlists')
  .version(version)

program
  .command('validate')
  .description('Validate tokenlist data files')
  .requiredOption('--datadir <datadir>', 'Directory containing data files')
  .option(
    '--tokens <tokens>',
    'Comma-separated list of token symbols to validate',
    ''
  )
  .option(
    '--mode <mode>',
    'Validation mode: live, fixtures, or auto',
    'live'
  )
  .action(async (options) => {
    const selectedTokens = options.tokens
      ? options.tokens.split(',').filter((token: string) => token.length > 0)
      : []

    if (!VALIDATION_MODES.includes(options.mode)) {
      throw new Error(
        `Invalid --mode ${options.mode}. Expected one of: ${VALIDATION_MODES.join(', ')}`
      )
    }

    const results = await validate(options.datadir, selectedTokens, {
      mode: options.mode as ValidationMode,
    })

    const validationResultsFilePath = 'validation_results.txt'
    const errs = results.filter((r) => r.type === 'error')
    const warns = results.filter((r) => r.type === 'warning')

    if (errs.length > 0 || warns.length > 0) {
      fs.writeFileSync(
        validationResultsFilePath,
        `Below are the results from running validation for the token changes. To ` +
          `re-run the validation locally run: ` +
          `pnpm validate --datadir ./data --tokens ${options.tokens || '<token>'} --mode ${options.mode}\n\n`
      )
    }

    if (errs.length > 0) {
      fs.appendFileSync(
        validationResultsFilePath,
        `These errors caused the validation to fail:\n${errs
          .map((err) => err.message)
          .join('\r\n')}\n\n`
      )
      for (const err of errs) {
        if (err.message.startsWith('final token list is invalid')) {
          // Message generated here is super long and doesn't really give more information than the
          // rest of the errors, so just print a short version of it instead.
          console.error(`error: final token list is invalid`)
        } else {
          console.error(`error: ${err.message}`)
        }
      }
    }

    if (warns.length > 0) {
      fs.appendFileSync(
        validationResultsFilePath,
        `These warnings were found during validation, but did not cause validation to fail:\n${warns
          .map((warn) => warn.message)
          .join('\r\n')}\n`
      )
      for (const warn of warns) {
        console.log(`warning: ${warn.message}`)
      }
    }

    if (errs.length > 0) {
      // Exit with error code so CI fails
      process.exit(1)
    }
  })

program
  .command('emtellrp-run')
  .description('Run the EmtellRP runtime module')
  .option(
    '--estates <estates>',
    'Path to emtellrp-estates.json',
    './tokenomics/emtellrp-estates.json'
  )
  .option(
    '--pipeline <pipeline>',
    'Path to emtellrp-financial-pipeline.json',
    './tokenomics/emtellrp-financial-pipeline.json'
  )
  .option('--outfile <outfile>', 'Optional output file path')
  .action(async (options) => {
    const outputs = runEmtellRuntime(options.estates, options.pipeline)
    const serialized = JSON.stringify(outputs, null, 2)

    if (options.outfile) {
      fs.writeFileSync(options.outfile, serialized)
      return
    }

    console.log(serialized)
  })

program
  .command('generate')
  .description('Generates a tokenlist data file')
  .requiredOption('--datadir <datadir>', 'Directory containing data files')
  .requiredOption('--outfile <outfile>', 'Output file to write')
  .action(async (options) => {
    const list = generate(options.datadir)
    fs.writeFileSync(options.outfile, JSON.stringify(list, null, 2))
  })

program.parse()
