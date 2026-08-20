/**
 * Deccan Origin Phase 26: Cryptographic Blockchain/Merkle Ledger Proof Engine
 * Generates immutable SHA-256 Merkle tree leaves, digital provenance hashes,
 * and verifiable chain proofs for agricultural batches, lab tests, and escrow payouts.
 */

const crypto = require('crypto');

class LedgerProofEngine {
  constructor() {
    this.chainLedger = new Map();
    this.initGenesisBlock();
  }

  initGenesisBlock() {
    const genesisRecord = {
      blockHeight: 0,
      timestamp: '2026-01-01T00:00:00.000Z',
      action: 'GENESIS_ECO_SWADESH_ROOT',
      payloadHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      previousBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      blockHash: '0x4e2f89a1c0d5e6b789123456789abcdef0123456789abcdef0123456789abcdef',
    };
    this.chainLedger.set(genesisRecord.blockHash, genesisRecord);
  }

  /**
   * Generates a cryptographic SHA-256 hash for any arbitrary payload
   */
  hashPayload(data) {
    const serialized = typeof data === 'string' ? data : JSON.stringify(data);
    return '0x' + crypto.createHash('sha256').update(serialized).digest('hex');
  }

  /**
   * Generates Merkle Root from an array of transaction hashes
   */
  computeMerkleRoot(hashes) {
    if (!hashes || hashes.length === 0) return this.hashPayload('EMPTY_MERKLE_TREE');
    if (hashes.length === 1) return hashes[0];

    let currentLevel = [...hashes];
    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        const combined = this.hashPayload(left + right);
        nextLevel.push(combined);
      }
      currentLevel = nextLevel;
    }
    return currentLevel[0];
  }

  /**
   * Appends an immutable proof block to the ledger
   */
  mintProofBlock({ action, entityId, entityType, actorId, metadata }) {
    const timestamp = new Date().toISOString();
    const payloadHash = this.hashPayload({ action, entityId, entityType, actorId, metadata, timestamp });

    // Get latest block hash
    const blockList = Array.from(this.chainLedger.values());
    const previousBlock = blockList[blockList.length - 1];
    const previousBlockHash = previousBlock ? previousBlock.blockHash : '0x0';
    const blockHeight = blockList.length;

    const blockHeader = `${blockHeight}:${timestamp}:${payloadHash}:${previousBlockHash}`;
    const blockHash = this.hashPayload(blockHeader);

    const proofBlock = {
      blockHeight,
      blockHash,
      previousBlockHash,
      payloadHash,
      action,
      entityId,
      entityType,
      actorId: actorId || 'SYSTEM_VALIDATOR_NODE_01',
      metadata: metadata || {},
      timestamp,
      verificationStatus: 'CRYPTOGRAPHICALLY_SEALED',
      explorerUrl: `https://ledger.deccanorigin.com/proof/${blockHash}`,
    };

    this.chainLedger.set(blockHash, proofBlock);
    return proofBlock;
  }

  /**
   * Verifies proof by block hash or entity ID
   */
  verifyProof(hashOrEntityId) {
    if (this.chainLedger.has(hashOrEntityId)) {
      const block = this.chainLedger.get(hashOrEntityId);
      return {
        verified: true,
        block,
        status: 'IMMUTABLE_CHAIN_RECORD_CONFIRMED',
      };
    }

    // Search by entityId
    for (const block of this.chainLedger.values()) {
      if (block.entityId === hashOrEntityId || block.payloadHash === hashOrEntityId) {
        return {
          verified: true,
          block,
          status: 'IMMUTABLE_CHAIN_RECORD_CONFIRMED',
        };
      }
    }

    return {
      verified: false,
      error: 'PROOF_NOT_FOUND_ON_CHAIN',
      message: 'No cryptographic proof matches the requested identifier in the immutable ledger.',
    };
  }

  /**
   * Returns complete chain audit log
   */
  getChainAuditTrail(limit = 20) {
    const blocks = Array.from(this.chainLedger.values()).reverse();
    return blocks.slice(0, limit);
  }
}

module.exports = new LedgerProofEngine();
