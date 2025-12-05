/// <reference lib="webworker" />

// Ce worker simule un flux temps réel de "trades" ou "mesures".
// Il envoie plusieurs messages par seconde.

interface RealtimeConfig {
  interval: number; // ms entre messages
}

addEventListener('message', ({ data }) => {
  const config = data as RealtimeConfig | undefined;
  const interval = config?.interval ?? 200; // 5 msg/sec par défaut

  setInterval(() => {
    const trade = {
      symbol: 'BTCUSDT',
      price: (30000 + Math.random() * 5000).toFixed(2),
      quantity: (Math.random() * 0.5).toFixed(4),
      side: Math.random() > 0.5 ? 'BUY' : 'SELL',
      timestamp: Date.now()
    };

    postMessage(trade);
  }, interval);
});
