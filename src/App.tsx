import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from '@mysten/sui/client';
import { Layout, Menu, Button } from 'antd';
import { useState } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { SendRemittance } from './components/SendRemittance';
import { ValidateRemittance } from './components/ValidateRemittance';
import { ClaimRemittance } from './components/ClaimRemittance';
import './App.css';

const { Header, Content } = Layout;
const queryClient = new QueryClient();

function App() {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [view, setView] = useState<'send' | 'validate' | 'claim'>('send');

  const translations = {
    en: {
      title: 'Sui Remittance MVP',
      send: 'Send Remittance',
      validate: 'Validate Remittance',
      claim: 'Claim Remittance',
      switchLang: 'Switch to Swahili',
    },
    sw: {
      title: 'Sui Remittance MVP',
      send: 'Tuma Pesa',
      validate: 'Thibitisha Pesa',
      claim: 'Dai Pesa',
      switchLang: 'Badilisha kwa Kiingereza',
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={{ devnet: { url: getFullnodeUrl('devnet') } }} defaultNetwork="devnet">
        <WalletProvider>
          <Layout>
            <Header>
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[view]}
                items={[
                  { key: 'send', label: translations[language].send },
                  { key: 'validate', label: translations[language].validate },
                  { key: 'claim', label: translations[language].claim },
                ]}
                onClick={(e) => setView(e.key as any)}
              />
              <Button
                style={{ float: 'right', marginTop: '16px' }}
                onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
              >
                {translations[language].switchLang}
              </Button>
            </Header>
            <Content style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
              <h1>{translations[language].title}</h1>
              <WalletConnect />
              {view === 'send' && <SendRemittance />}
              {view === 'validate' && <ValidateRemittance />}
              {view === 'claim' && <ClaimRemittance />}
            </Content>
          </Layout>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;