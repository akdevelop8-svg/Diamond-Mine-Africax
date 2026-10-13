import React, { useState } from 'react';
import { X, ArrowDownRight, Info, CheckCircle2, Landmark, ShieldAlert } from 'lucide-react';
import { useStore } from '../hooks/useStore.ts';
import { store } from '../services/store.ts';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHistory?: () => void;
  onOpenBankDetails: () => void;
}

const maskAccount = (value: string) => {
  const cleaned = value.replace(/\s+/g, '');
  if (cleaned.length <= 4) return '••••';
  return `${'•'.repeat(Math.min(8, cleaned.length - 4))}${cleaned.slice(-4)}`;
};

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  onOpenHistory,
  onOpenBankDetails,
}) => {
  const { currentUser } = useStore();
  const [amountStr, setAmountStr] = useState<string>('300');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !currentUser) return null;

  const details = currentUser.withdrawalDetails;
  const amount = Number(amountStr) || 0;
  const fee = Math.round(amount * 0.08 * 100) / 100;
  const netAmount = Math.max(0, Math.round((amount - fee) * 100) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!details) {
      setErrorMessage('Please save your withdrawal destination under My Account → My Bank Details first.');
      return;
    }
    if (!Number.isFinite(amount) || amount < 150) {
      setErrorMessage('Minimum withdrawal amount is 150 ETB.');
      return;
    }
    if (amount > currentUser.demoBalance) {
      setErrorMessage(`Insufficient demonstration balance. You currently have ${currentUser.demoBalance.toLocaleString()} ETB available.`);
      return;
    }

    setIsSubmitting(true);
    const res = store.submitWithdrawalRequest({
      userId: currentUser.id,
      amount,
      method: details.method,
      accountName: details.accountName,
      accountNumber: details.accountNumber,
    });
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
        onOpenHistory?.();
      }, 1400);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800"><ArrowDownRight className="w-4 h-4" /></span>
            <h3 className="font-display font-bold text-base text-slate-900">Demonstration Withdrawal</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close withdrawal" className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[11px]">Available Demo Balance</span>
              <span className="font-display font-black text-lg text-blue-700 tabular-nums">{currentUser.demoBalance.toLocaleString()} <span className="text-xs">ETB</span></span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">Min: 150 ETB</span>
          </div>

          <div>
            <label htmlFor="withdrawal-amount" className="block font-bold text-slate-700 mb-1">Withdrawal Amount (ETB) *</label>
            <div className="relative">
              <input id="withdrawal-amount" type="number" min="150" step="1" required value={amountStr} onChange={(e) => setAmountStr(e.target.value)} placeholder="150" className="w-full pl-3.5 pr-14 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 tabular-nums" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">ETB</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3.5">
            <div className="flex items-center gap-2 font-bold text-slate-800"><Landmark className="w-4 h-4 text-blue-600" /> Saved Withdrawal Destination</div>
            {details ? (
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between gap-3"><span className="text-slate-500">Method</span><strong className="text-slate-900">{details.method}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Account holder</span><strong className="text-right text-slate-900">{details.accountName}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Destination</span><strong className="font-mono text-slate-900">{maskAccount(details.accountNumber)}</strong></div>
                <button type="button" onClick={onOpenBankDetails} className="mt-2 text-blue-700 font-bold hover:underline">Update saved details</button>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-slate-600 leading-relaxed">You need to save a preferred bank or wallet before submitting a withdrawal request.</p>
                <button type="button" onClick={onOpenBankDetails} className="mt-3 w-full rounded-xl bg-blue-600 px-3 py-2.5 text-white font-bold hover:bg-blue-700">Set Up My Bank Details</button>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center"><span className="text-slate-600 font-medium">Requested Amount</span><span className="font-black text-slate-900 tabular-nums">{amount.toLocaleString()} ETB</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-600 font-medium">Illustrative Fee (8%)</span><span className="font-bold text-rose-600 tabular-nums">−{fee.toLocaleString()} ETB</span></div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-2"><span className="text-slate-800 font-bold">Illustrative Net Amount</span><span className="font-black text-emerald-700 text-base tabular-nums">{netAmount.toLocaleString()} ETB</span></div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span><strong>DEMO MODE:</strong> This creates a simulated pending request only. No real bank or mobile-wallet transfer is initiated. Balances and returns displayed by this prototype are not real funds or guaranteed income.</span>
          </div>

          {errorMessage && <div role="alert" className="p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">{errorMessage}</div>}
          {successMessage && <div role="status" className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>{successMessage}</span></div>}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={isSubmitting || amount < 150 || amount > currentUser.demoBalance || !details} className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-xs disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit Demo Request'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
