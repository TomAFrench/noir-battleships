import { compile } from '@noir-lang/noir_wasm';
import {
  setup_generic_prover_and_verifier,
  create_proof,
  verify_proof,
  StandardExampleProver,
  StandardExampleVerifier,
} from '@noir-lang/barretenberg/dest/client_proofs';
import { resolve } from 'path';
import { expect } from 'chai';

type ProofInput = {
  guess: number;
  ship: number;
  report_hit: number;
};

describe('Tests using typescript wrapper', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let acir: any;
  let prover: StandardExampleProver;
  let verifier: StandardExampleVerifier;

  before(async () => {
    const compiled_program = compile(resolve(__dirname, '../circuits/src/main.nr'));
    acir = compiled_program.circuit;
    [prover, verifier] = await setup_generic_prover_and_verifier(acir);
  });

  async function createAndVerifyProof(abi: ProofInput): Promise<boolean> {
    const proof = await create_proof(prover, acir, abi);

    return verify_proof(verifier, proof);
  }

  function itAcceptsTheProof(abi: ProofInput) {
    it('accepts the proof', async () => {
      const verified = await createAndVerifyProof(abi);

      expect(verified).to.be.true;
    });
  }

  function itRejectsTheProof(abi: ProofInput) {
    it('rejects the proof', async () => {
      const verified = await createAndVerifyProof(abi);

      expect(verified).to.be.false;
    });
  }

  context('when ship is hit', () => {
    context('if hit is reported', () => {
      itAcceptsTheProof({ guess: 1, report_hit: 1, ship: 1 });
    });

    context('if miss is reported', () => {
      itRejectsTheProof({ guess: 1, report_hit: 0, ship: 1  });
    });
  });

  context('when ship is missed', () => {
    context('if hit is reported', () => {
      itRejectsTheProof({ guess: 2, report_hit: 1, ship: 1 });
    });

    context('if miss is reported', () => {
      itAcceptsTheProof({ guess: 2, report_hit: 0, ship: 1 });
    });
  });

  context('invalid hit report', () => {
    itRejectsTheProof({ guess: 2, ship: 1, report_hit: 2 });
  });

});
