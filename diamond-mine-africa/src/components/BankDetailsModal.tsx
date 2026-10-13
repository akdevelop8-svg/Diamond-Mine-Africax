import React, { useEffect, useState } from 'react';
import { CheckCircle2, Landmark, ShieldAlert, X } from 'lucide-react';
import { useStore } from '../hooks/useStore.ts';
import { store } from '../services/store.ts';
import { WithdrawalMethod } from '../types.ts';

interface BankDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const METHODS: WithdrawalMethod[] = ['CBE', 'Telebirr', 'Awash Bank', 'Bank of Abyssinia'];

export const BankDetailsModal: React.FC<BankDetailsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useStore();
  const [method, setMethod] = useState<WithdrawalMethod>('CBE');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    setMethod(currentUser.withdrawalDetails?.method ?? 'CBE');
    setAccountName(currentUser.withdrawalDetails?.accountName ?? currentUser.name);
    setAccountNumber(currentUser.withdrawalDetails?.accountNumber ?? '');
    setError('');
    setSuccess('');
  }, [isOpen, currentUser?.id]);

  if (!isOpen || !currentUser) return null;

  const isTelebirr = method === 'Telebirr';
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    const result = store.saveWithdrawalDetails({
      userId: currentUser.id,
      method,
      accountName,
      accountNumber,
    });
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  const mask = (value: string) => value.length <= 4 ? '••••' : `${'•'.repeat(Math.min(8, value.length - 4))}${value.slice(-4)}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="bank-details-title">
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700"><Landmark className="w-5 h-5" /></span>
            <div>
              <h2 id="bank-details-title" className="font-bold text-base text-slate-900">My Bank Details</h2>
              <p className="text-[11px] text-slate-500">Save once for demonstration withdrawals</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close bank details" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {currentUser.withdrawalDetails && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <p className="font-bold text-emerald-800">Saved destination</p>
              <p className="mt-1 text-emerald-700">{currentUser.withdrawalDetails.method} · {mask(currentUser.withdrawalDetails.accountNumber)}</p>
              <p className="mt-1 text-[10px] text-emerald-700">Saving a new destination replaces the one currently saved for future demo requests.</p>
            </div>
          )}

          <div>
            <label htmlFor="withdrawal-method" className="block mb-1.5 font-bold text-slate-700">Withdrawal Method *</label>
            <select id="withdrawal-method" value={method} onChange={(e) => setMethod(e.target.value as WithdrawalMethod)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600">
              {METHODS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="withdrawal-account-name" className="block mb-1.5 font-bold text-slate-700">Account Holder / Wallet Owner *</label>
            <input id="withdrawal-account-name" autoComplete="name" required minLength={2} maxLength={100} value={accountName} onChange={(e) => setAccountName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600" placeholder="Full name as registered" />
          </div>

          <div>
            <label htmlFor="withdrawal-account-number" className="block mb-1.5 font-bold text-slate-700">{isTelebirr ? 'Telebirr Registered Phone Number *' : 'Bank Account Number *'}</label>
            <input id="withdrawal-account-number" required autoComplete="off" inputMode={isTelebirr ? 'tel' : 'numeric'} maxLength={34} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-3 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600" placeholder={isTelebirr ? '09XXXXXXXX or +2519XXXXXXXX' : 'Enter your bank account number'} />
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <p><strong>Demo privacy notice:</strong> These details are saved in this browser's localStorage for testing only. This storage is not secure enough for real banking data. Do not enter sensitive real account information into a public demo.</p>
          </div>

          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">{error}</div>}
          {success && <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800"><CheckCircle2 className="w-4 h-4 shrink-0" /><span>{success}</span></div>}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-300 bg-white py-3 font-bold text-slate-700 hover:bg-slate-50">{success ? 'Done' : 'Cancel'}</button>
            <button type="submit" className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700">Save Details</button>
          </div>
        </form>
      </div>
    </div>
  );
};
