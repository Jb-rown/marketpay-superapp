
export default function manifest() {
  return {
    name: 'MarketPay Super App',
    short_name: 'MarketPay',
    description: 'AI-powered fintech & marketplace for African food security',
    start_url: '/',
    display: 'standalone',
    theme_color: '#1B3A6B',
    background_color: '#FAFAF9',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}