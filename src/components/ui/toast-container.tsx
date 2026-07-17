import React from 'react';
import { useToast } from '../../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-[var(--z-toast)] p-4 md:p-6 flex flex-col gap-3 w-full sm:w-[400px] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[var(--radius-md)] border p-4 pr-6 shadow-[var(--shadow-e3)] transition-all bg-[var(--bg-surface-raised)] text-[var(--text-primary)]",
              toast.type === "success" && "border-[#10B9814D] bg-[#10B9811F]",
              toast.type === "error" && "border-[#EF44444D] bg-[#EF44441F]",
              toast.type === "warning" && "border-[#F59E0B4D] bg-[#F59E0B1F]",
              toast.type === "info" && "border-[#38BDF84D] bg-[#38BDF81F]"
            )}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && <CheckCircle className="h-5 w-5 text-[#10B981]" />}
              {toast.type === "error" && <AlertCircle className="h-5 w-5 text-[#EF4444]" />}
              {toast.type === "warning" && <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />}
              {toast.type === "info" && <Info className="h-5 w-5 text-[#38BDF8]" />}
              <p className="text-[var(--text-body-sm)] font-medium text-current">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
