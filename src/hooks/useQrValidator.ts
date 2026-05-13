import { useState, useEffect } from 'react';
import { qrService } from '@/services/qrService';
import type { QrCode } from '@/types';

export function useQrValidator(qrId: string | undefined) {
  const [qr, setQr] = useState<QrCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!qrId) {
      setInvalid(true);
      setLoading(false);
      return;
    }
    qrService
      .getByCode(qrId)
      .then((data) => {
        if (!data || !data.active) {
          setInvalid(true);
        } else {
          setQr(data);
        }
      })
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false));
  }, [qrId]);

  return { qr, loading, invalid };
}
