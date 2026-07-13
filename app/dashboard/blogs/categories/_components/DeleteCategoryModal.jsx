import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DeleteCategoryModal({ isOpen, onClose, onConfirm, categoryName, isPending }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Delete Category
          </h3>
          <button onClick={onClose} disabled={isPending} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            Are you sure you want to delete the category <strong className="text-slate-900 dark:text-white">"{categoryName}"</strong>? 
          </p>
          <p className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl border border-red-100 dark:border-red-500/20">
            All blogs using this category will be reassigned to "Uncategorized". This action cannot be undone.
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white gap-2 rounded-xl">
            {isPending ? 'Deleting...' : (
              <>
                <Trash2 className="w-4 h-4" /> Delete Category
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
