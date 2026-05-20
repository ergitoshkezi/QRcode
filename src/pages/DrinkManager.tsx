import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Upload } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { drinksService } from '@/services/drinksService';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import type { Drink, DrinkCategory, DrinkFormData } from '@/types';

const CATEGORIES: DrinkCategory[] = ['Soft Drinks', 'Birre', 'Cocktail', 'Acqua', 'Energy Drink'];

const EMPTY_FORM: DrinkFormData = {
  name: '',
  description: '',
  price: 0,
  image_url: '',
  category: 'Soft Drinks',
  available: true,
  size: '33 cl',
};

interface DrinkFormProps {
  initial?: Drink;
  onSave: (data: DrinkFormData) => Promise<void>;
  onCancel: () => void;
}

function DrinkForm({ initial, onSave, onCancel }: DrinkFormProps) {
  const [form, setForm] = useState<DrinkFormData>(initial ?? EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof DrinkFormData, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await drinksService.uploadImage(file);
      set('image_url', url);
      toast('Immagine caricata');
    } catch {
      toast('Errore upload immagine', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10"
    >
      <h3 className="font-semibold text-white">{initial ? 'Modifica bibita' : 'Nuova bibita'}</h3>

      <Input
        label="Nome *"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        placeholder="Es. Coca Cola"
        required
      />
      <Input
        label="Dimensione / Formato"
        value={form.size ?? ''}
        onChange={(e) => set('size', e.target.value)}
        placeholder="Es. 33 cl, 50 cl, 1 L"
      />
      <Textarea
        label="Descrizione"
        value={form.description ?? ''}
        onChange={(e) => set('description', e.target.value)}
        placeholder="Descrizione breve..."
        rows={2}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prezzo (€) *"
          type="number"
          step="0.10"
          min="0"
          value={form.price}
          onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">Categoria</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-zinc-900">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Image upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/70">Immagine</label>
        <div className="flex gap-2 items-center">
          <label className="flex-1 flex items-center gap-2 cursor-pointer rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white/50 hover:bg-white/8 transition-colors">
            <Upload size={14} />
            {uploading ? 'Caricamento...' : 'Scegli file'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
            />
          </label>
          {form.image_url && (
            <img src={form.image_url} className="w-10 h-10 rounded-lg object-cover" />
          )}
        </div>
      </div>

      {/* Available toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <button
          type="button"
          onClick={() => set('available', !form.available)}
          className="text-white/60"
        >
          {form.available ? (
            <ToggleRight size={28} className="text-green-400" />
          ) : (
            <ToggleLeft size={28} />
          )}
        </button>
        <span className="text-sm text-white/70">
          {form.available ? 'Disponibile' : 'Non disponibile'}
        </span>
      </label>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={saving || uploading} className="flex-1">
          {saving ? 'Salvataggio...' : 'Salva'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annulla
        </Button>
      </div>
    </motion.form>
  );
}

export function DrinkManager() {
  const { drinks, loading, refresh } = useAdminData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Drink | null>(null);

  const handleCreate = async (data: DrinkFormData) => {
    try {
      await drinksService.create(data);
      toast('Bibita aggiunta!');
      setShowForm(false);
      await refresh();
    } catch {
      toast('Errore durante il salvataggio', 'error');
    }
  };

  const handleUpdate = async (data: DrinkFormData) => {
    if (!editing) return;
    try {
      await drinksService.update(editing.id, data);
      toast('Bibita aggiornata!');
      setEditing(null);
      await refresh();
    } catch {
      toast('Errore durante l\'aggiornamento', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa bibita?')) return;
    try {
      await drinksService.delete(id);
      toast('Bibita eliminata');
      await refresh();
    } catch {
      toast('Errore durante l\'eliminazione', 'error');
    }
  };

  const handleToggle = async (drink: Drink) => {
    try {
      await drinksService.update(drink.id, { available: !drink.available });
      await refresh();
    } catch {
      toast('Errore', 'error');
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bibite</h1>
          <p className="text-white/40 text-sm mt-0.5">{drinks.length} nel menu</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); }} size="sm">
          <Plus size={14} className="mr-1.5" /> Aggiungi
        </Button>
      </div>

      {(showForm || editing) && (
        <div className="mb-6">
          <DrinkForm
            initial={editing ?? undefined}
            onSave={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : drinks.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-3xl mb-2">🍹</p>
          <p>Nessuna bibita ancora</p>
        </div>
      ) : (
        <div className="space-y-2">
          {drinks.map((drink) => (
            <motion.div
              key={drink.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors"
            >
              {drink.image_url ? (
                <img src={drink.image_url} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-2xl">
                  🍶
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">{drink.name}</p>
                <p className="text-xs text-white/40 mt-0.5">
                  {drink.category} · {formatPrice(drink.price)}{drink.size ? ` · ${drink.size}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handleToggle(drink)} className="p-1.5 rounded-lg hover:bg-white/10">
                  {drink.available ? (
                    <ToggleRight size={18} className="text-green-400" />
                  ) : (
                    <ToggleLeft size={18} className="text-white/30" />
                  )}
                </button>
                <button
                  onClick={() => { setEditing(drink); setShowForm(false); }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(drink.id)}
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
