import React from 'react';
import { Button } from '@/components/ui/button';

export default function BlogsConfirmModal({ modalConfig, setModalConfig, handleConfirm, isPending }) {
  if (!modalConfig.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{modalConfig.title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {modalConfig.message}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} disabled={isPending}>
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white" 
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
