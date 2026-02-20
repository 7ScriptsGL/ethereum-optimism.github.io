export type AuthModel = 'apiKey' | 'oauth2' | 'sigv4' | 'none'

export interface ConnectorAuth {
  model: AuthModel
  credentialsRef: string
  scopes?: string[]
}

export interface ConnectorDataProvenance {
  sourceSystem: string
  collectedAt: string
  attestationHash: string
  ownershipGuaranteed: boolean
}

export interface ConnectorOwnership {
  owner: string
  proofType: 'signature' | 'contract' | 'registry'
  proofUri: string
}

export interface ConnectorPreservation {
  integrityExtension: 0 | 1
  rule: 'I(ext)=1 ⇒ Pₑ preserved'
  preserved: boolean
}

export interface IntegrationConnector {
  id: string
  name: string
  type: 'api' | 'indexer' | 'bridge' | 'oracle' | 'custom'
  auth: ConnectorAuth
  dataProvenance: ConnectorDataProvenance
  ownership: ConnectorOwnership
  preservation: ConnectorPreservation
}

export interface IntegrationConnectorSpec {
  version: string
  connectors: IntegrationConnector[]
}
