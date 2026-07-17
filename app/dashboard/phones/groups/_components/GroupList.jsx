import React from 'react';
import { Tag, Edit2, Trash2, Check, X, ArrowUpDown } from 'lucide-react';

export default function GroupList({
  sortedGroups,
  allAttributes,
  editingGroup,
  setEditingGroup,
  editValue,
  setEditValue,
  isPending,
  managingGroup,
  setManagingGroup,
  toggleSort,
  handleSaveEdit,
  confirmDeleteGroup,
  handleToggleAttribute,
}) {
  return (
    <div className="w-full">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th 
                  className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400 text-sm">Attributes</th>
                <th className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400 text-sm w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedGroups.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-slate-500">No groups found.</td>
                </tr>
              ) : (
                sortedGroups.map(group => {
                  const isProtected = group === 'General';
                  const groupAttributes = allAttributes.filter(attr => attr.groupIds?.includes(group) || attr.groupId === group);
                  return (
                    <React.Fragment key={group}>
                      <tr className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors group-row">
                      <td className="py-3 px-6">
                        {editingGroup === group ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 bg-white dark:bg-slate-950 border border-brand-500 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') setEditingGroup(null);
                              }}
                            />
                            <button onClick={handleSaveEdit} disabled={isPending} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingGroup(null)} disabled={isPending} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-medium text-brand-600 dark:text-brand-400 flex items-center gap-2">
                            {group}
                            {isProtected && (
                              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                Default
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        {groupAttributes.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {groupAttributes.map((a) => (
                              <span key={a.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {a.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-sm">No attributes</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setManagingGroup(managingGroup === group ? null : group)}
                            className={`p-1.5 rounded-md transition-colors ${managingGroup === group ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'text-slate-400 hover:text-brand-600'}`}
                            title="Manage Attributes"
                          >
                            <Tag className="w-4 h-4" />
                          </button>
                          {!isProtected && editingGroup !== group && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingGroup(group);
                                  setEditValue(group);
                                }}
                                disabled={isPending}
                                className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => confirmDeleteGroup(group)}
                                disabled={isPending}
                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {managingGroup === group && (
                      <tr className="bg-slate-50/50 dark:bg-slate-800/10 border-b border-slate-100 dark:border-slate-800">
                        <td colSpan="3" className="p-6">
                          <div className="max-w-4xl">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Manage Attributes for {group}</h4>
                            <p className="text-xs text-slate-500 mb-4">Select attributes to add to this group. Attributes can belong to multiple groups.</p>
                            
                            <div className="flex flex-wrap gap-2">
                              {allAttributes.map(attr => {
                                const inGroup = attr.groupIds?.includes(group) || attr.groupId === group;
                                const otherGroups = attr.groupIds?.filter(g => g !== group) || [];
                                
                                return (
                                  <label 
                                    key={attr.id} 
                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${
                                      inGroup 
                                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-brand-300'
                                    }`}
                                  >
                                    <input 
                                      type="checkbox" 
                                      checked={inGroup}
                                      onChange={(e) => handleToggleAttribute(attr, group, e.target.checked)}
                                      disabled={isPending}
                                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
                                    />
                                    <span>
                                      {attr.name}
                                      {otherGroups.length > 0 && !inGroup && (
                                        <span className="text-[10px] text-slate-400 ml-1.5">(in {otherGroups.join(', ')})</span>
                                      )}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
