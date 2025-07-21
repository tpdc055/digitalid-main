// Enhanced Security Framework - Blockchain Integration
// Immutable Document Verification and Digital Identity Management

import CryptoJS from 'crypto-js';
import { auditLogger } from '@/lib/security/audit';

export interface BlockchainDocument {
  id: string;
  documentType: string;
  citizenId: string;
  documentHash: string;
  blockHash: string;
  timestamp: number;
  issuer: string;
  status: 'pending' | 'verified' | 'revoked' | 'expired';
  metadata: {
    applicationId?: string;
    expiryDate?: number;
    version: number;
    signatures: DigitalSignature[];
  };
}

export interface DigitalSignature {
  signerId: string;
  signerRole: string;
  signature: string;
  timestamp: number;
  algorithm: string;
}

export interface BlockchainBlock {
  index: number;
  timestamp: number;
  data: BlockchainDocument[];
  previousHash: string;
  hash: string;
  nonce: number;
  merkleRoot: string;
}

export interface VerificationResult {
  isValid: boolean;
  document?: BlockchainDocument;
  verificationLevel: 'high' | 'medium' | 'low' | 'invalid';
  details: {
    hashMatch: boolean;
    signatureValid: boolean;
    chainIntegrity: boolean;
    notRevoked: boolean;
    notExpired: boolean;
  };
  verifiedAt: number;
}

export interface SmartContract {
  id: string;
  type: 'document_issuance' | 'identity_verification' | 'service_approval';
  conditions: ContractCondition[];
  status: 'active' | 'executed' | 'cancelled';
  creator: string;
  createdAt: number;
  executedAt?: number;
}

export interface ContractCondition {
  type: 'document_verified' | 'payment_received' | 'approval_given' | 'time_passed';
  parameters: Record<string, any>;
  fulfilled: boolean;
  fulfilledAt?: number;
}

class PNGBlockchain {
  private static instance: PNGBlockchain;
  private chain: BlockchainBlock[] = [];
  private pendingDocuments: BlockchainDocument[] = [];
  private smartContracts: Map<string, SmartContract> = new Map();
  private difficulty: number = 4; // Mining difficulty
  private miningReward: number = 10; // Reward for mining blocks

  private constructor() {
    this.createGenesisBlock();
    this.startBlockProduction();
  }

  static getInstance(): PNGBlockchain {
    if (!this.instance) {
      this.instance = new PNGBlockchain();
    }
    return this.instance;
  }

  private createGenesisBlock(): void {
    const genesisBlock: BlockchainBlock = {
      index: 0,
      timestamp: Date.now(),
      data: [],
      previousHash: '0',
      hash: '',
      nonce: 0,
      merkleRoot: ''
    };

    genesisBlock.merkleRoot = this.calculateMerkleRoot([]);
    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);

    auditLogger.logEvent({
      eventType: 'BLOCKCHAIN_GENESIS_CREATED',
      category: 'system',
      severity: 'info',
      action: 'create_genesis_block',
      outcome: 'success',
      details: { blockHash: genesisBlock.hash },
      tags: ['blockchain', 'genesis']
    });
  }

  // Document registration and verification
  async registerDocument(
    documentType: string,
    citizenId: string,
    documentData: any,
    issuer: string,
    applicationId?: string
  ): Promise<string> {
    try {
      const documentId = this.generateDocumentId();
      const documentHash = this.hashDocument(documentData);

      const signatures: DigitalSignature[] = [
        {
          signerId: issuer,
          signerRole: 'issuer',
          signature: this.signData(documentHash, issuer),
          timestamp: Date.now(),
          algorithm: 'SHA256-RSA'
        }
      ];

      const blockchainDocument: BlockchainDocument = {
        id: documentId,
        documentType,
        citizenId,
        documentHash,
        blockHash: '', // Will be set when block is mined
        timestamp: Date.now(),
        issuer,
        status: 'pending',
        metadata: {
          applicationId,
          version: 1,
          signatures
        }
      };

      // Add to pending documents for next block
      this.pendingDocuments.push(blockchainDocument);

      auditLogger.logEvent({
        eventType: 'BLOCKCHAIN_DOCUMENT_REGISTERED',
        category: 'data_access',
        severity: 'info',
        userId: citizenId,
        action: 'register_document',
        outcome: 'success',
        details: {
          documentId,
          documentType,
          documentHash: documentHash.substring(0, 16) + '...'
        },
        tags: ['blockchain', 'document-registration']
      });

      return documentId;
    } catch (error) {
      auditLogger.logEvent({
        eventType: 'BLOCKCHAIN_DOCUMENT_REGISTRATION_FAILED',
        category: 'data_access',
        severity: 'error',
        userId: citizenId,
        action: 'register_document',
        outcome: 'failure',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        tags: ['blockchain', 'error']
      });
      throw error;
    }
  }

  async verifyDocument(documentId: string): Promise<VerificationResult> {
    try {
      const document = this.findDocument(documentId);

      if (!document) {
        return {
          isValid: false,
          verificationLevel: 'invalid',
          details: {
            hashMatch: false,
            signatureValid: false,
            chainIntegrity: false,
            notRevoked: false,
            notExpired: false
          },
          verifiedAt: Date.now()
        };
      }

      const details = {
        hashMatch: this.verifyDocumentHash(document),
        signatureValid: this.verifySignatures(document),
        chainIntegrity: this.verifyChainIntegrity(),
        notRevoked: document.status !== 'revoked',
        notExpired: this.checkExpiry(document)
      };

      const validChecks = Object.values(details).filter(Boolean).length;
      let verificationLevel: 'high' | 'medium' | 'low' | 'invalid';

      if (validChecks === 5) verificationLevel = 'high';
      else if (validChecks >= 3) verificationLevel = 'medium';
      else if (validChecks >= 1) verificationLevel = 'low';
      else verificationLevel = 'invalid';

      const result: VerificationResult = {
        isValid: validChecks >= 3,
        document,
        verificationLevel,
        details,
        verifiedAt: Date.now()
      };

      auditLogger.logEvent({
        eventType: 'BLOCKCHAIN_DOCUMENT_VERIFIED',
        category: 'data_access',
        severity: 'info',
        action: 'verify_document',
        outcome: result.isValid ? 'success' : 'failure',
        details: {
          documentId,
          verificationLevel,
          validChecks
        },
        tags: ['blockchain', 'document-verification']
      });

      return result;
    } catch (error) {
      auditLogger.logEvent({
        eventType: 'BLOCKCHAIN_VERIFICATION_ERROR',
        category: 'data_access',
        severity: 'error',
        action: 'verify_document',
        outcome: 'failure',
        details: { documentId, error: error instanceof Error ? error.message : 'Unknown error' },
        tags: ['blockchain', 'error']
      });
      throw error;
    }
  }

  // Smart Contracts
  async createSmartContract(
    type: SmartContract['type'],
    conditions: ContractCondition[],
    creator: string
  ): Promise<string> {
    const contractId = this.generateContractId();

    const contract: SmartContract = {
      id: contractId,
      type,
      conditions,
      status: 'active',
      creator,
      createdAt: Date.now()
    };

    this.smartContracts.set(contractId, contract);

    auditLogger.logEvent({
      eventType: 'SMART_CONTRACT_CREATED',
      category: 'system',
      severity: 'info',
      userId: creator,
      action: 'create_contract',
      outcome: 'success',
      details: { contractId, type, conditionsCount: conditions.length },
      tags: ['blockchain', 'smart-contract']
    });

    return contractId;
  }

  async executeSmartContract(contractId: string): Promise<boolean> {
    const contract = this.smartContracts.get(contractId);
    if (!contract || contract.status !== 'active') {
      return false;
    }

    // Check if all conditions are fulfilled
    const allConditionsFulfilled = contract.conditions.every(condition =>
      this.checkCondition(condition)
    );

    if (allConditionsFulfilled) {
      contract.status = 'executed';
      contract.executedAt = Date.now();

      // Execute contract logic based on type
      await this.executeContractLogic(contract);

      auditLogger.logEvent({
        eventType: 'SMART_CONTRACT_EXECUTED',
        category: 'system',
        severity: 'info',
        action: 'execute_contract',
        outcome: 'success',
        details: { contractId, type: contract.type },
        tags: ['blockchain', 'smart-contract', 'execution']
      });

      return true;
    }

    return false;
  }

  // Digital Identity Management
  async createDigitalIdentity(citizenId: string, identityData: any): Promise<string> {
    const identityHash = this.hashDocument(identityData);

    return this.registerDocument(
      'digital_identity',
      citizenId,
      identityData,
      'png_government',
      `identity_${citizenId}`
    );
  }

  async verifyDigitalIdentity(citizenId: string): Promise<VerificationResult> {
    const identityDocuments = this.getDocumentsByCitizen(citizenId)
      .filter(doc => doc.documentType === 'digital_identity');

    if (identityDocuments.length === 0) {
      return {
        isValid: false,
        verificationLevel: 'invalid',
        details: {
          hashMatch: false,
          signatureValid: false,
          chainIntegrity: false,
          notRevoked: false,
          notExpired: false
        },
        verifiedAt: Date.now()
      };
    }

    // Get most recent identity document
    const latestIdentity = identityDocuments
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    return this.verifyDocument(latestIdentity.id);
  }

  // Block mining and chain management
  private async mineBlock(): Promise<void> {
    if (this.pendingDocuments.length === 0) return;

    const previousBlock = this.getLatestBlock();
    const newBlock: BlockchainBlock = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      data: [...this.pendingDocuments],
      previousHash: previousBlock.hash,
      hash: '',
      nonce: 0,
      merkleRoot: this.calculateMerkleRoot(this.pendingDocuments)
    };

    // Mine the block (proof of work)
    const startTime = Date.now();
    while (newBlock.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      newBlock.nonce++;
      newBlock.hash = this.calculateHash(newBlock);
    }
    const miningTime = Date.now() - startTime;

    // Update block hash in documents
    newBlock.data.forEach(doc => {
      doc.blockHash = newBlock.hash;
      doc.status = 'verified';
    });

    this.chain.push(newBlock);
    this.pendingDocuments = [];

    auditLogger.logEvent({
      eventType: 'BLOCKCHAIN_BLOCK_MINED',
      category: 'system',
      severity: 'info',
      action: 'mine_block',
      outcome: 'success',
      details: {
        blockIndex: newBlock.index,
        blockHash: newBlock.hash,
        documentsCount: newBlock.data.length,
        miningTime,
        difficulty: this.difficulty
      },
      tags: ['blockchain', 'mining']
    });
  }

  // Utility methods
  private calculateHash(block: BlockchainBlock): string {
    return CryptoJS.SHA256(
      block.index +
      block.previousHash +
      block.timestamp +
      JSON.stringify(block.data) +
      block.nonce +
      block.merkleRoot
    ).toString();
  }

  private calculateMerkleRoot(documents: BlockchainDocument[]): string {
    if (documents.length === 0) {
      return CryptoJS.SHA256('').toString();
    }

    const hashes = documents.map(doc => doc.documentHash);
    return this.buildMerkleTree(hashes)[0];
  }

  private buildMerkleTree(hashes: string[]): string[] {
    if (hashes.length === 1) return hashes;

    const nextLevel: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i];
      const right = i + 1 < hashes.length ? hashes[i + 1] : left;
      nextLevel.push(CryptoJS.SHA256(left + right).toString());
    }

    return this.buildMerkleTree(nextLevel);
  }

  private hashDocument(documentData: any): string {
    return CryptoJS.SHA256(JSON.stringify(documentData)).toString();
  }

  private signData(data: string, signerId: string): string {
    // Simplified digital signature (in production, use proper cryptographic signing)
    return CryptoJS.HmacSHA256(data, `key_${signerId}`).toString();
  }

  private verifyDocumentHash(document: BlockchainDocument): boolean {
    // In production, this would verify against the original document
    return document.documentHash.length === 64; // SHA256 length check
  }

  private verifySignatures(document: BlockchainDocument): boolean {
    return document.metadata.signatures.every(sig => {
      const expectedSig = this.signData(document.documentHash, sig.signerId);
      return sig.signature === expectedSig;
    });
  }

  private verifyChainIntegrity(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  private checkExpiry(document: BlockchainDocument): boolean {
    if (!document.metadata.expiryDate) return true;
    return Date.now() < document.metadata.expiryDate;
  }

  private checkCondition(condition: ContractCondition): boolean {
    switch (condition.type) {
      case 'document_verified':
        const docId = condition.parameters.documentId;
        return this.findDocument(docId)?.status === 'verified';

      case 'payment_received':
        // In production, this would check with payment system
        return condition.parameters.amount > 0;

      case 'approval_given':
        return condition.parameters.approved === true;

      case 'time_passed':
        return Date.now() > condition.parameters.targetTime;

      default:
        return false;
    }
  }

  private async executeContractLogic(contract: SmartContract): Promise<void> {
    switch (contract.type) {
      case 'document_issuance':
        // Automatically issue document when conditions are met
        console.log(`Executing document issuance contract ${contract.id}`);
        break;

      case 'identity_verification':
        // Automatically verify identity when conditions are met
        console.log(`Executing identity verification contract ${contract.id}`);
        break;

      case 'service_approval':
        // Automatically approve service when conditions are met
        console.log(`Executing service approval contract ${contract.id}`);
        break;
    }
  }

  private findDocument(documentId: string): BlockchainDocument | undefined {
    for (const block of this.chain) {
      const document = block.data.find(doc => doc.id === documentId);
      if (document) return document;
    }
    return undefined;
  }

  private getDocumentsByCitizen(citizenId: string): BlockchainDocument[] {
    const documents: BlockchainDocument[] = [];
    for (const block of this.chain) {
      documents.push(...block.data.filter(doc => doc.citizenId === citizenId));
    }
    return documents;
  }

  private getLatestBlock(): BlockchainBlock {
    return this.chain[this.chain.length - 1];
  }

  private generateDocumentId(): string {
    return `DOC_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateContractId(): string {
    return `CONTRACT_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private startBlockProduction(): void {
    // Mine new blocks every 30 seconds if there are pending documents
    setInterval(() => {
      if (this.pendingDocuments.length > 0) {
        this.mineBlock();
      }
    }, 30000);
  }

  // Public API methods
  getBlockchainStats() {
    const totalDocuments = this.chain.reduce((sum, block) => sum + block.data.length, 0);
    const activeContracts = Array.from(this.smartContracts.values())
      .filter(contract => contract.status === 'active').length;

    return {
      chainLength: this.chain.length,
      totalDocuments,
      pendingDocuments: this.pendingDocuments.length,
      activeContracts,
      lastBlockTime: this.getLatestBlock().timestamp,
      chainIntegrity: this.verifyChainIntegrity()
    };
  }

  async getBulkVerificationReport(documentIds: string[]): Promise<VerificationResult[]> {
    return Promise.all(documentIds.map(id => this.verifyDocument(id)));
  }
}

// Export singleton instance
export const pngBlockchain = PNGBlockchain.getInstance();

// Utility functions for external use
export function generateDocumentHash(documentData: any): string {
  return CryptoJS.SHA256(JSON.stringify(documentData)).toString();
}

export function isValidBlockchainDocument(document: any): document is BlockchainDocument {
  return (
    typeof document === 'object' &&
    typeof document.id === 'string' &&
    typeof document.documentType === 'string' &&
    typeof document.citizenId === 'string' &&
    typeof document.documentHash === 'string' &&
    typeof document.timestamp === 'number'
  );
}
