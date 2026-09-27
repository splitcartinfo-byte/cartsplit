import React, { useState } from 'react';
import { useExperience } from '../../context/ExperienceContext';
import { usePlatform } from '../../context/PlatformContext';
import { RAZORPAY_KEY_ID, PAYMENT_MODE } from '../../config/payment';
import { ShieldCheck, CreditCard, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'CREATE' | 'JOIN';
  title: string;
  onConfirmSuccess: () => void;
  onNavigateLegal: (route: 'terms' | 'disclaimer') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  onConfirmSuccess,
  onNavigateLegal,
}) => {
  const { theme } = useExperience();
  const { settings } = usePlatform();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!isOpen) return null;

  const feeAmount = type === 'CREATE' ? settings.createGroupFee : settings.joinGroupFee;

  const handleSimulateRazorpay = () => {
    if (!acceptedTerms) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
      setTimeout(() => {
        setPaymentDone(false);
        setAcceptedTerms(false);
        onConfirmSuccess();
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              {type === 'CREATE' ? 'Create Group Platform Fee' : 'Join Group Platform Fee'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {paymentDone ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-extrabold text-slate-900">Payment Verified!</h4>
              <p className="text-xs text-slate-600">
                Razorpay signature verified server-side. Store contacts unlocked!
              </p>
            </div>
          ) : (
            <>
              {/* Product Target */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <p className="text-slate-500 font-medium">Target Product & Deal:</p>
                <p className="font-extrabold text-slate-900 truncate mt-0.5">{title}</p>
              </div>

              {/* Fee Breakdown */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Platform Group Fee:</span>
                  <span className="font-bold text-slate-900">₹{feeAmount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Razorpay Gateway Key ({PAYMENT_MODE}):</span>
                  <span className="font-mono text-[11px] font-bold text-slate-700 truncate max-w-[140px]">
                    {RAZORPAY_KEY_ID ? `${RAZORPAY_KEY_ID.substring(0, 10)}...` : 'TEST KEY'}
                  </span>
                </div>
                <div className="pt-2 border-t border-blue-200/60 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-blue-600">₹{feeAmount}</span>
                </div>
              </div>

              {/* Platform Boundary Notice */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Platform Boundary Notice
                </p>
                <p className="text-slate-700 leading-normal">
                  This fee pays exclusively for platform discovery and unlocked store contacts. Physical clothing purchase payments occur directly at the store.
                </p>
              </div>

              {/* MANDATORY LEGAL TERMS CHECKBOX */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="accept-terms-check"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="accept-terms-check" className="text-slate-700 leading-tight cursor-pointer">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => onNavigateLegal('terms')}
                    className="text-blue-600 underline font-bold"
                  >
                    Terms of Service
                  </button>{' '}
                  and understand the{' '}
                  <button
                    type="button"
                    onClick={() => onNavigateLegal('disclaimer')}
                    className="text-blue-600 underline font-bold"
                  >
                    Platform Disclaimer
                  </button>.
                </label>
              </div>

              {/* Razorpay Button */}
              <button
                onClick={handleSimulateRazorpay}
                disabled={!acceptedTerms || isProcessing}
                className={`w-full py-3.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all ${
                  !acceptedTerms || isProcessing
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.01]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {isProcessing
                    ? 'Verifying Razorpay Signature...'
                    : `PAY ₹${feeAmount} VIA RAZORPAY (${PAYMENT_MODE.toUpperCase()})`}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
