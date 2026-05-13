import { useState, useEffect } from 'react';
import { drinksService } from '@/services/drinksService';
import { qrService } from '@/services/qrService';
import type { Drink, QrCode } from '@/types';

export function useAdminData() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [d, q] = await Promise.all([
        drinksService.getAll(),
        qrService.getAll(),
      ]);
      setDrinks(d);
      setQrCodes(q);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Errore caricamento dati');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { drinks, qrCodes, loading, error, refresh };
}
