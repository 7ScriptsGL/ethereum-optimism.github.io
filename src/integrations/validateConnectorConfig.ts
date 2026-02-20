import Ajv, { ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'

import integrationSchema from '../../tokenomics/integration-schema.json'
import { IntegrationConnectorSpec } from './types'

const PROVENANCE_OWNERSHIP_ERROR =
  'connector must guarantee data provenance ownership (dataProvenance.ownershipGuaranteed=true and ownership.proofUri must be set)'

const formatAjvError = (error: ErrorObject): string => {
  const instancePath = error.instancePath || '/'
  return `${instancePath} ${error.message}`.trim()
}

export const validateConnectorConfig = (
  connectorConfig: IntegrationConnectorSpec
): string[] => {
  const ajv = new Ajv({ allErrors: true })
  addFormats(ajv)

  const validate = ajv.compile(integrationSchema)
  const isValid = validate(connectorConfig)

  const errors = isValid
    ? []
    : (validate.errors || []).map((error) => formatAjvError(error))

  for (const connector of connectorConfig.connectors || []) {
    if (
      connector.dataProvenance?.ownershipGuaranteed !== true ||
      !connector.ownership?.proofUri
    ) {
      errors.push(`${connector.id}: ${PROVENANCE_OWNERSHIP_ERROR}`)
    }

    if (
      connector.preservation?.integrityExtension === 1 &&
      connector.preservation?.preserved !== true
    ) {
      errors.push(
        `${connector.id}: preservation invariant violated (I(ext)=1 ⇒ Pₑ preserved)`
      )
    }
  }

  return errors
}
