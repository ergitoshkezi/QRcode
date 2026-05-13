import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ToggleLeft, ToggleRight, Copy, Check, Download } from 'lucide-react';
import { QRCode as QRCodeSVG } from 'react-qr-code';
import { useAdminData } from '@/hooks/useAdminData';
import { qrService } from '@/services/qrService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';
import { generateQrCode } from '@/lib/utils';
import type { QrFormData } from '@/types';

function QrForm({ onSave, onCancel }: { onSave: (data: QrFormData) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<QrFormData>({
    qr_code: generateQrCode('QR'),
    table_name: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10 mb-6"
    >
      <h3 className="font-semibold text-white">Nuovo QR Code</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Codice QR *"
            value={form.qr_code}
            onChange={(e) => setForm((f) => ({ ...f, qr_code: e.target.value }))}
            required
          />
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, qr_code: generateQrCode('QR') }))}
            className="text-xs text-white/40 hover:text-white/70 mt-1.5 transition-colors"
          >
            ↺ Rigenera
          </button>
        </div>
        <Input
          label="Nome tavolo *"
          value={form.table_name}
          onChange={(e) => setForm((f) => ({ ...f, table_name: e.target.value }))}
          placeholder="Es. Tavolo 5"
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? 'Creazione...' : 'Crea QR'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Annulla</Button>
      </div>
    </motion.form>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/q/${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

function QrDownloadButton({ qrCode, tableName }: { qrCode: string; tableName: string }) {
  const svgRef = useRef<HTMLDivElement>(null);

  const download = () => {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size + 60;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tableName, size / 2, size + 38);
      const link = document.createElement('a');
      link.download = `qr-${qrCode}-${tableName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const menuUrl = `${window.location.origin}/q/${qrCode}`;

  return (
    <div>
      {/* Hidden SVG used for PNG export */}
      <div ref={svgRef} className="hidden">
        <QRCodeSVG value={menuUrl} size={512} />
      </div>
      <button
        onClick={download}
        title="Scarica QR PNG"
        className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
      >
        <Download size={14} />
      </button>
    </div>
  );
}

export function QrManager() {
  const { qrCodes, loading, refresh } = useAdminData();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (data: QrFormData) => {
    try {
      await qrService.create(data);
      toast('QR creato!');
      setShowForm(false);
      await refresh();
    } catch {
      toast('Codice già esistente o errore', 'error');
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await qrService.toggleActive(id, !active);
      await refresh();
    } catch {
      toast('Errore', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo QR?')) return;
    try {
      await qrService.delete(id);
      toast('QR eliminato');
      await refresh();
    } catch {
      toast('Errore durante eliminazione', 'error');
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">QR Codes</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {qrCodes.filter((q) => q.active).length} attivi su {qrCodes.length}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus size={14} className="mr-1.5" /> Crea QR
        </Button>
      </div>

      {showForm && <QrForm onSave={handleCreate} onCancel={() => setShowForm(false)} />}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : qrCodes.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-3xl mb-2">📱</p>
          <p>Nessun QR ancora</p>
        </div>
      ) : (
        <div className="space-y-2">
          {qrCodes.map((qr) => (
            <motion.div
              key={qr.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/8"
            >
              {/* QR preview */}
              <div className="bg-white p-2 rounded-xl shrink-0">
                <QRCodeSVG value={`${window.location.origin}/q/${qr.qr_code}`} size={64} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{qr.table_name}</p>
                <p className="text-xs font-mono text-white/40 mt-0.5">{qr.qr_code}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                qr.active
                  ? 'text-green-400 bg-green-500/10 border-green-500/20'
                  : 'text-white/30 bg-white/5 border-white/10'
              }`}>
                {qr.active ? 'Attivo' : 'Inattivo'}
              </span>
              <div className="flex items-center gap-1">
                <CopyButton text={qr.qr_code} />
                <QrDownloadButton qrCode={qr.qr_code} tableName={qr.table_name} />
                <button
                  onClick={() => handleToggle(qr.id, qr.active)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white"
                >
                  {qr.active ? <ToggleRight size={18} className="text-green-400" /> : <ToggleLeft size={18} />}
                </button>
                <button
                  onClick={() => handleDelete(qr.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
