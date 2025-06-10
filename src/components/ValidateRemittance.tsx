import { useWallets } from '@mysten/dapp-kit';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, message } from 'antd';
import { validateRemittance } from '../utils/sui';

export function ValidateRemittance() {
  const wallets = useWallets();
  const [form] = Form.useForm();

  const mutation = useMutation({
    mutationFn: async ({ walletId }: { walletId: string }) => {
      return await validateRemittance(walletId, wallets[0]!);
    },
    onSuccess: () => {
      message.success('Remittance validated successfully!');
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(`Failed to validate remittance: ${error.message}`);
    },
  });

  if (!wallets[0]) return <p>Please connect your wallet.</p>;

  const onFinish = (values: { walletId: string }) => {
    mutation.mutate({ walletId: values.walletId });
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Group Wallet ID"
        name="walletId"
        rules={[{ required: true, message: 'Enter wallet ID' }]}
      >
        <Input placeholder="0x..." />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          Validate Remittance
        </Button>
      </Form.Item>
    </Form>
  );
}