import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import type { WalletAccount } from '@mysten/dapp-kit';
import { GroupWallet } from '../types/remittance';

const PACKAGE_ID = process.env.REACT_APP_PACKAGE_ID!;
const MYUSD_TYPE = process.env.REACT_APP_MYUSD_TYPE!;
const SUI_NETWORK = process.env.REACT_APP_SUI_NETWORK! as 'mainnet' | 'testnet' | 'devnet' | 'localnet';

const client = new SuiClient({ url: getFullnodeUrl(SUI_NETWORK) });

export async function createGroupWallet(
  validator: string,
  beneficiary: string,
  wallet: WalletAccount
) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::remittance::create_group_wallet`,
    arguments: [tx.pure.string(validator), tx.pure.string(beneficiary)],
  });

  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: wallet,
    options: { showEffects: true },
  });
  return result;
}

export async function sendRemittance(
  walletId: string,
  amount: number,
  wallet: WalletAccount
) {
  const tx = new Transaction();
  // Mock MyUSD coin (replace with real coin ID in production)
  const [coin] = tx.splitCoins(tx.object('0xMOCK_COIN'), [tx.pure.u64(amount * 10**9)]);
  tx.moveCall({
    target: `${PACKAGE_ID}::remittance::send_remittance`,
    arguments: [tx.object(walletId), coin],
    typeArguments: [MYUSD_TYPE],
  });

  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: wallet,
    options: { showEffects: true },
  });
  return result;
}

export async function validateRemittance(
  walletId: string,
  wallet: WalletAccount
) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::remittance::validate_remittance`,
    arguments: [tx.object(walletId)],
  });

  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: wallet,
    options: { showEffects: true },
  });
  return result;
}

export async function claimRemittance(
  walletId: string,
  amount: number,
  wallet: WalletAccount
) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::remittance::claim_remittance`,
    arguments: [tx.object(walletId), tx.pure.u64(amount * 10**9)],
  });

  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: wallet,
    options: { showEffects: true, showEvents: true },
  });
  return result;
}

export async function getGroupWallet(walletId: string): Promise<GroupWallet> {
  const wallet = await client.getObject({
    id: walletId,
    options: { showContent: true },
  });
  const content = wallet.data?.content as any;
  return {
    id: walletId,
    balance: parseInt(content.fields.balance) / 10**9,
    validator: content.fields.validator,
    beneficiary: content.fields.beneficiary,
    validated: content.fields.validated,
  };
}