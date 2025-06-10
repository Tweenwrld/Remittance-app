import { useState } from 'react';
import { useWallets } from '@mysten/dapp-kit';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, message, Card } from 'antd';
import { claimRemittance, getGroupWallet } from '../utils/sui';
import { OffRampEvent } from '../types/remittance';

export function ClaimRemittance() {
  const wallets = useWallets();
  const accounts = wallets.length > 0 ? wallets[0].accounts : [];
  const [form]  = Form.useForm();
  const [offRampEvent, setOffRampEvent] = useState<OffRampEvent | null>(null);

  const walletId = Form.useWatch('walletId', form);

  const { data: wallet } = useQuery({
    queryKey: ['wallet', walletId],
    queryFn: () => getGroupWallet(walletId),
    enabled: !!walletId,
  });

  const mutation = useMutation({
    mutationFn: ({ walletId, amount }: { walletId: string; amount: number }) =>
      claimRemittance(walletId, amount, accounts[0]!),
    onSuccess: (result) => {
      const event = result.events?.find(
        (e: { type: string }) => e.type === `${process.env.REACT_APP_PACKAGE_ID}::remittance::OffRampEvent`
      )?.parsedJson as OffRampEvent;
      if (event) setOffRampEvent(event);
      message.success('Remittance claimed successfully!');
      form.resetFields();
    },
    onError: (error: any) => message.error(`Failed to claim: ${error.message}`),
  });

  if (!accounts[0]) return <p>Please connect your wallet.</p>;

  return (
    <div>
      <Form form={form} onFinish={mutation.mutate} layout="vertical">
        <Form.Item
          label="Group Wallet ID"
          name="walletId"
          rules={[{ required: true, message: 'Enter wallet ID' }]}
        >
          <Input placeholder="0x..." />
        </Form.Item>
        <Form.Item
          label="Amount (MyUSD)"
          name="amount"
          rules={[{ required: true, message: 'Enter amount' }]}
        >
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>
        {wallet && (
          <p>
            Wallet Status: {wallet.validated ? 'Validated' : 'Pending Validation'}
            <br />
            Available Balance: {wallet.balance} MyUSD
          </p>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Claim Remittance
          </Button>
        </Form.Item>
      </Form>
      {offRampEvent && (
        <Card title="M-Pesa Payout (Mocked)">
          <p>Beneficiary: {offRampEvent.beneficiary}</p>
          <p>Amount: {offRampEvent.amount} MyUSD</p>
          <p>KES Amount: {offRampEvent.kes_amount} KES</p>
          <p>M-Pesa Transaction ID: {offRampEvent.mpesa_tx_id}</p>
        </Card>
      )}
    </div>
  );
}