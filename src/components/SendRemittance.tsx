import { useWallets } from '@mysten/dapp-kit';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, message } from 'antd';
import { sendRemittance } from '../utils/sui';

export function SendRemittance() {
    const wallets = useWallets();
    const [form] = Form.useForm();

    const mutation = useMutation({
      mutationFn: ({ walletId, amount }: { walletId: string; amount: number }) =>
        sendRemittance(walletId, amount, wallets[0]!),
      onSuccess: () => {
          message.success('Remittance sent successfully!');
          form.resetFields();
        },
      onError: (error: any) => message.error(`Failed to send remittance: ${error.message}`),
    });

    if (!wallets[0]) return <p>Please connect your wallet.</p>;

    return (
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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Send transaction Remittance
          </Button>
        </Form.Item>
      </Form>
    );
}

export default SendRemittance;