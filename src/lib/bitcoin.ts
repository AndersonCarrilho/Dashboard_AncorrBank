import "../polyfills";
import * as bitcoin from "bitcoinjs-lib";
import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import { ECPairFactory } from "ecpair";
import * as ecc from "@bitcoinerlab/secp256k1";

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

// Initialize networks
const network = bitcoin.networks.bitcoin;

// Helper function to fetch UTXO value
export async function fetchPrevTxOutputValue(
  prevTxId: string,
  vout: number,
  derivedAddress?: string,
) {
  // Try mempool.space first
  if (derivedAddress) {
    try {
      const response = await fetch(
        `https://mempool.space/api/address/${derivedAddress}/utxo`,
      );
      if (response.ok) {
        const utxos = await response.json();
        const utxo = utxos.find(
          (o: any) => o.txid === prevTxId && o.vout === vout,
        );
        if (utxo && typeof utxo.value === "number") {
          return utxo.value;
        }
      }
    } catch (e) {
      /* Try next option */
    }
  }

  // Try mempool.space tx endpoint
  try {
    const response = await fetch(`https://mempool.space/api/tx/${prevTxId}`);
    if (response.ok) {
      const txData = await response.json();
      const output = txData.vout.find((o: any) => o.n === vout);
      if (output && typeof output.value === "number") {
        return output.value < 1 ? Math.round(output.value * 1e8) : output.value;
      }
    }
  } catch (e) {
    /* Try next option */
  }

  // Try blockchain.info as fallback
  try {
    const response = await fetch(
      `https://blockchain.info/rawtx/${prevTxId}?format=json`,
    );
    if (response.ok) {
      const txData = await response.json();
      const output = txData.out.find((o: any) => o.n === vout);
      if (output && typeof output.value === "number") {
        return output.value;
      }
    }
  } catch (e) {
    throw new Error(
      `Error fetching UTXO: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  throw new Error(`Output ${vout} not found in TX ${prevTxId}`);
}

// Helper function to fetch raw transaction
export async function fetchRawTxFromTxid(txid: string) {
  try {
    const response = await fetch(`https://blockstream.info/api/tx/${txid}/hex`);
    if (!response.ok) throw new Error(response.statusText);
    return (await response.text()).trim();
  } catch (e) {
    throw new Error(
      `Error fetching raw TX: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
}

// Create a Bitcoin transaction
export async function createTransaction({
  wif,
  destAddress,
  amount,
  fee,
}: {
  wif: string;
  destAddress: string;
  amount: number;
  fee: number;
}) {
  const keyPair = ECPair.fromWIF(wif, bitcoin.networks.bitcoin);
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

  // Fetch UTXOs
  const response = await fetch(
    `https://mempool.space/api/address/${address}/utxo`,
  );
  if (!response.ok) throw new Error("Failed to fetch UTXOs");
  const utxos = await response.json();

  const targetAmount = amount + fee;
  let selectedUTXOs = [];
  let totalSelected = 0;

  // Select UTXOs
  for (const utxo of utxos) {
    selectedUTXOs.push(utxo);
    totalSelected += utxo.value;
    if (totalSelected >= targetAmount) break;
  }

  if (totalSelected < targetAmount) {
    throw new Error(
      `Insufficient balance. Have: ${totalSelected}, Need: ${targetAmount}`,
    );
  }

  // Build transaction
  const txb = new bitcoin.TransactionBuilder(bitcoin.networks.bitcoin);
  selectedUTXOs.forEach((utxo) => txb.addInput(utxo.txid, utxo.vout));

  txb.addOutput(destAddress, amount);
  const change = totalSelected - targetAmount;
  if (change > 0) {
    txb.addOutput(address, change);
  }

  // Sign inputs
  selectedUTXOs.forEach((_, i) => txb.sign(i, keyPair));

  return {
    hex: txb.build().toHex(),
    fee,
    change,
    selectedUTXOs,
  };
}

// Decode a Bitcoin transaction
export function decodeTransaction(rawTxOrTxid: string) {
  let tx: bitcoin.Transaction;

  try {
    tx = bitcoin.Transaction.fromHex(rawTxOrTxid);
  } catch (e) {
    throw new Error("Invalid transaction hex");
  }

  return {
    txid: tx.getId(),
    version: tx.version,
    locktime: tx.locktime,
    size: rawTxOrTxid.length / 2,
    inputs: tx.ins.map((input) => ({
      txid: Buffer.from(input.hash).reverse().toString("hex"),
      vout: input.index,
      scriptSig: input.script.toString("hex"),
      sequence: input.sequence,
    })),
    outputs: tx.outs.map((output) => ({
      value: output.value,
      scriptPubKey: output.script.toString("hex"),
      address: tryGetAddress(output.script),
    })),
  };
}

// Helper to try extracting address from scriptPubKey
function tryGetAddress(script: Buffer) {
  try {
    const p2pkh = bitcoin.payments.p2pkh({ output: script });
    if (p2pkh.address) return p2pkh.address;

    const p2wpkh = bitcoin.payments.p2wpkh({ output: script });
    if (p2wpkh.address) return p2wpkh.address;

    const p2sh = bitcoin.payments.p2sh({ output: script });
    if (p2sh.address) return p2sh.address;

    return null;
  } catch {
    return null;
  }
}

export interface BitcoinWallet {
  mnemonic: string;
  bech32Address: string;
  p2pkhAddress: string;
  p2shAddress: string;
  privateKeyWIF: string;
  privateKeyWIFCompressed: string;
  privateKeyHex: string;
  publicKeyHex: string;
  publicKeyCompressed: string;
  xprv: string;
  xpub: string;
}

export const generateBitcoinWallet = (): BitcoinWallet => {
  if (!bip32 || !ECPair) {
    throw new Error("Bitcoin libraries not properly initialized");
  }
  // Generate mnemonic
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // Generate master node
  const root = bip32.fromSeed(seed);
  const path = "m/44'/0'/0'/0/0";
  const child = root.derivePath(path);

  // Generate keypair
  const keyPair = ECPair.fromPrivateKey(child.privateKey!);
  const { address: bech32Address } = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
  });
  const { address: p2pkhAddress } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
  });
  const { address: p2shAddress } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }),
  });

  return {
    mnemonic,
    bech32Address: bech32Address!,
    p2pkhAddress: p2pkhAddress!,
    p2shAddress: p2shAddress!,
    privateKeyWIF: keyPair.toWIF(),
    privateKeyWIFCompressed: ECPair.fromPrivateKey(child.privateKey!, {
      compressed: true,
    }).toWIF(),
    privateKeyHex: child.privateKey!.toString("hex"),
    publicKeyHex: child.publicKey.toString("hex"),
    publicKeyCompressed: child.publicKey.toString("hex"),
    xprv: root.toBase58(),
    xpub: root.neutered().toBase58(),
  };
};

export const getAddressBalance = async (address: string): Promise<number> => {
  try {
    const response = await fetch(
      `https://blockchain.info/balance?active=${address}`,
    );
    const data = await response.json();
    return data[address].final_balance / 100000000; // Convert satoshis to BTC
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
};

export const getAddressTransactions = async (address: string) => {
  try {
    const response = await fetch(`https://blockchain.info/rawaddr/${address}`);
    const data = await response.json();
    return data.txs.map((tx: any) => ({
      hash: tx.hash,
      time: new Date(tx.time * 1000).toISOString(),
      amount: tx.result / 100000000,
      fee: tx.fee / 100000000,
      inputs: tx.inputs,
      out: tx.out,
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};
