export interface GroupWallet {
  id: string;
  balance: number;
  validator: string;
  beneficiary: string;
  validated: boolean;
}

export interface OffRampEvent {
  beneficiary: string;
  amount: number;
  kes_amount: number;
  mpesa_tx_id: string;
}