import React from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';

export default function CategoryList({
  categories,
  isPending,
  editingCategory,
  editValue,
  setEditingCategory,
  setEditValue,
  handleSaveEdit,
  openDeleteModal
}) {
  return (
    <div className="space-y-3">
      {categories.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No categories found.</p>
      ) : (
        categories.map((category, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 group">
            {editingCategory === category ? (
              <div className="flex items-center gap-3 w-full">
                <input 
                  type="text" 
                  value={editValue} 
                  onChange={e => setEditValue(e.target.value)} 
                  className="flex-1 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                  autoFocus
                />
                <div className="flex items-center gap-1">
                  <button disabled={isPending} onClick={handleSaveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                  <button disabled={isPending} onClick={() => setEditingCategory(null)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {category} {category.toLowerCase() === 'uncategorized' && <span className="text-xs font-normal text-slate-400 ml-2">(Default Fallback)</span>}
                </span>
                {category.toLowerCase() !== 'uncategorized' && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        setEditingCategory(category);
                        setEditValue(category);
                      }}
                      className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => openDeleteModal(category)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
