import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, TRANSACTION_TYPES } from '../../constants/categories';

const EMPTY_FORM = {
  description: '',
  amount: '',
  category: 'Food & Drink',
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
  note: '',
};

export default function TransactionForm({ open, onClose, editData = null }) {
  const { handleAddTransaction, handleUpdateTransaction, handleDeleteTransaction } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editData);

  useEffect(() => {
    if (open) {
      setForm(editData ? { ...editData, amount: String(editData.amount) } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, editData]);

  if (!open) return null;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (isEditing) {
        await handleUpdateTransaction(editData.id, payload);
      } else {
        await handleAddTransaction(payload);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this transaction? This cannot be undone.')) return;
    setSaving(true);
    try {
      await handleDeleteTransaction(editData.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-background/40"
    >
      <div
        className="w-full max-w-md rounded-2xl animate-slide-up glass-card shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-border"
        >
          <div>
            <h2 className="text-base font-bold text-foreground">
              {isEditing ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isEditing ? 'Modify the details below' : 'Fill in the details below'}
            </p>
          </div>
          <button
            id="close-modal"
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all border border-transparent hover:border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Description *
            </label>
            <input
              id="txn-description"
              type="text"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="e.g. Grocery shopping"
              className={`glass-input w-full ${errors.description ? 'border-rose-500/50' : ''}`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount + Type row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Amount *
              </label>
              <input
                id="txn-amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                placeholder="0.00"
                className={`glass-input w-full ${errors.amount ? 'border-rose-500/50' : ''}`}
              />
              {errors.amount && (
                <p className="text-xs text-rose-400 mt-1">{errors.amount}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Type *
              </label>
              <select
                id="txn-type"
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
                className="glass-input w-full appearance-none cursor-pointer pr-8"
              >
                {TRANSACTION_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Category
              </label>
              <select
                id="txn-category"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="glass-input w-full appearance-none cursor-pointer pr-8"
              >
                {CATEGORIES.filter(c => c.id !== 'Income').map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Date *
              </label>
              <input
                id="txn-date"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className={`glass-input w-full ${errors.date ? 'border-rose-500/50' : ''}`}
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Note (optional)
            </label>
            <textarea
              id="txn-note"
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
              placeholder="Add a note..."
              rows={2}
              className="glass-input w-full resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {isEditing && (
              <button
                id="delete-form-txn"
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="h-10 px-4 rounded-xl flex items-center justify-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all disabled:opacity-50"
                title="Delete Transaction"
              >
                <Trash2 className="h-4 w-4" />
              </button>)
            }
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 justify-center border border-border py-2.5"
            >
              Cancel
            </button>

            <button
              id="submit-transaction"
              type="submit"
              disabled={saving}
              className="btn-primary flex-[2] justify-center py-2.5 disabled:opacity-60"
            >
              {saving ? (
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : isEditing ? (
                <><Save className="h-4 w-4" /> Save Changes</>
              ) : (
                <><Plus className="h-4 w-4" /> Add Transaction</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
