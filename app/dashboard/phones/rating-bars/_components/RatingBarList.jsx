import React from 'react';
import { Edit2, Trash2, Check, X, Search, GripVertical } from 'lucide-react';

export default function RatingBarList({
  bars,
  editingId,
  editForm,
  setEditForm,
  isPending,
  draggedBar,
  handleDragStart,
  handleDragOver,
  handleDrop,
  setDraggedBar,
  startEdit,
  handleUpdate,
  handleDelete,
  setEditingId
}) {
  return (
    <div className="lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Existing Rating Bars</h3>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..."
            className="pl-8 pr-4 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium w-12 text-center"></th>
              <th className="px-4 py-3 font-medium w-1/3">Name</th>
              <th className="px-4 py-3 font-medium w-1/3">Slug</th>
              <th className="px-4 py-3 font-medium text-center">Default Value</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {bars.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No rating bars found. Create one to get started.
                </td>
              </tr>
            ) : (
              bars.map(bar => (
                <tr 
                  key={bar.id} 
                  draggable={!editingId}
                  onDragStart={(e) => handleDragStart(e, bar)}
                  onDragOver={(e) => handleDragOver(e, bar)}
                  onDrop={(e) => handleDrop(e, bar)}
                  onDragEnd={() => setDraggedBar(null)}
                  className={`transition-colors group cursor-grab active:cursor-grabbing ${
                    draggedBar?.id === bar.id 
                      ? 'opacity-50 border border-dashed border-brand-500 bg-brand-50/50 dark:bg-brand-900/20' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <td className="px-4 py-3 w-12 text-center">
                    <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-brand-500 mx-auto" />
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-700 dark:text-brand-400 w-1/3">
                    {editingId === bar.id ? (
                      <input 
                        type="text" 
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 rounded px-2 py-1"
                      />
                    ) : (
                      bar.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 w-1/3">
                    {editingId === bar.id ? (
                      <input 
                        type="text" 
                        value={editForm.slug}
                        onChange={(e) => setEditForm({...editForm, slug: e.target.value})}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 rounded px-2 py-1"
                      />
                    ) : (
                      bar.slug
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editingId === bar.id ? (
                      <input 
                        type="number" 
                        value={editForm.defaultValue}
                        onChange={(e) => setEditForm({...editForm, defaultValue: e.target.value})}
                        className="w-16 bg-white dark:bg-slate-950 border border-slate-300 rounded px-2 py-1 text-center"
                      />
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                        {bar.defaultValue || 3}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === bar.id ? (
                      <div className="flex justify-end gap-1">
                        <button onClick={handleUpdate} disabled={isPending} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} disabled={isPending} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(bar)} className="p-1.5 text-brand-600 hover:bg-brand-50 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(bar.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
