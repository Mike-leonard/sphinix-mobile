import React, { useState } from 'react';
import { Mail, Trash2, Shield, User, CheckCircle2, XCircle, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = ['Admin', 'Moderator', 'ContentWriter', 'Normal'];

export default function UserRow({ user, submitRoleChange, handleSendLink, handleDelete }) {
  const [pendingRole, setPendingRole] = useState(null);

  const currentSelection = pendingRole || user.role;

  const onRoleChange = (e) => {
    setPendingRole(e.target.value);
  };

  const onSubmit = () => {
    if (pendingRole && pendingRole !== user.role) {
      submitRoleChange(user.id, pendingRole);
      setPendingRole(null);
    }
  };

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold uppercase shrink-0">
            {user.name.charAt(0)}
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>
        </div>
      </td>
      
      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
        {user.email}
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="relative inline-block">
            <select
              value={currentSelection}
              onChange={onRoleChange}
              className={`appearance-none pl-8 pr-8 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                currentSelection === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' :
                currentSelection === 'Moderator' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                currentSelection === 'ContentWriter' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800' :
                'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              {ROLE_OPTIONS.map(role => (
                <option key={role} value={role} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {role}
                </option>
              ))}
            </select>
            {currentSelection === 'Admin' ? <Shield className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-500" /> : <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50" />}
          </div>
          {pendingRole && pendingRole !== user.role && (
            <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
              onClick={onSubmit}
              className="p-1.5 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 transition-colors shadow-sm"
              title="Apply new role"
            >
              <Check className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}}  
            onClick={() => handleSendLink(user.id)}
            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Send Reset Password Link"
          >
            <Mail className="w-4 h-4" />
          </Button>
          <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}}  
            onClick={() => handleDelete(user.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>

      <td className="px-6 py-4 text-center">
        {user.emailVerified ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400 mx-auto" />
        )}
      </td>
      
      <td className="px-6 py-4 text-slate-500">
        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </td>
      
      <td className="px-6 py-4 text-slate-500">
        {new Date(user.modifiedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </td>

      <td className="px-6 py-4 text-xs font-mono text-slate-400">
        #{user.id}
      </td>
    </tr>
  );
}
