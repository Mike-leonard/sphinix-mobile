'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Search, Mail, Trash2, Shield, User, CheckCircle2, XCircle, ArrowUpDown, Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { deleteUser, updateUserRole, sendForgetPassword } from '@/actions/users';
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = ['Admin', 'Moderator', 'ContentWriter', 'Normal'];
const USERS_PER_PAGE = 20;

export default function UsersTable({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingRoles, setPendingRoles] = useState({});
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState(null);

  // Reset page to 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortConfig]);

  // Sorting Logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtering & Sorting Execution
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    if (sortConfig.key === 'createdAt') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // Actions
  const showMessage = (msg, type = 'success') => {
    setActionMessage({ text: msg, type });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleRoleChange = (userId, newRole) => {
    setPendingRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  const submitRoleChange = (userId) => {
    const newRole = pendingRoles[userId];
    if (!newRole) return;

    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setPendingRoles(prev => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });
    
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (!res.success) showMessage(res.message, 'error');
      else showMessage(res.message);
    });
  };

  const handleDelete = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    setUsers(users.filter(u => u.id !== userId));

    startTransition(async () => {
      const res = await deleteUser(userId);
      if (!res.success) showMessage(res.message, 'error');
      else showMessage(res.message);
    });
  };

  const handleSendLink = (userId) => {
    startTransition(async () => {
      const res = await sendForgetPassword(userId);
      if (!res.success) showMessage(res.message, 'error');
      else showMessage(res.message);
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Message */}
      {actionMessage && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-50 animate-in slide-in-from-bottom-5 ${
          actionMessage.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {actionMessage.text}
        </div>
      )}

      {/* Top Bar: Search & Loading */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow text-slate-900 dark:text-white"
          />
        </div>
        
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">
                    User <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
                <th className="px-6 py-4 font-semibold text-center">Verified</th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-2">
                    Created At <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold">Modified At</th>
                <th className="px-6 py-4 font-semibold">User ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
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
                            value={pendingRoles[user.id] || user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className={`appearance-none pl-8 pr-8 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                              (pendingRoles[user.id] || user.role) === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' :
                              (pendingRoles[user.id] || user.role) === 'Moderator' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                              (pendingRoles[user.id] || user.role) === 'ContentWriter' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800' :
                              'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {ROLE_OPTIONS.map(role => (
                              <option key={role} value={role} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                {role}
                              </option>
                            ))}
                          </select>
                          {(pendingRoles[user.id] || user.role) === 'Admin' ? <Shield className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-500" /> : <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50" />}
                        </div>
                        {pendingRoles[user.id] && pendingRoles[user.id] !== user.role && (
                          <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
                            onClick={() => submitRoleChange(user.id)}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <span className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-700 dark:text-slate-300">{(currentPage - 1) * USERS_PER_PAGE + 1}</span> to <span className="font-medium text-slate-700 dark:text-slate-300">{Math.min(currentPage * USERS_PER_PAGE, sortedUsers.length)}</span> of <span className="font-medium text-slate-700 dark:text-slate-300">{sortedUsers.length}</span> users
            </span>
            <div className="flex items-center gap-2">
              <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-brand-500 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}} 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
