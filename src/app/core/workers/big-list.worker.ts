/// <reference lib="webworker" />

// Ce worker ne connaît PAS Angular ni le DOM.
// Il ne fait que produire des mises à jour : { id, value }

addEventListener('message', ({ data }) => {
  const { length, interval } = data as { length: number; interval: number };

  // Sécurité de base
  if (!length || length <= 0) {
    postMessage({ type: 'error', message: 'Liste vide dans worker.' });
    return;
  }

  // Simulation d'un flux rapide d'updates
  setInterval(() => {
    const randomId = Math.floor(Math.random() * length);
    const newValue = Math.random();

    // On envoie uniquement les infos nécessaires
    postMessage({
      type: 'update',
      id: randomId,
      value: newValue
    });
  }, interval ?? 50);
});
