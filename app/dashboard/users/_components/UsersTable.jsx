'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { deleteUser, updateUserRole, sendForgetPassword } from '@/actions/users';

import UsersTableToolbar from './UsersTableToolbar';
import UserRow from './UserRow';
import UsersTablePagination from './UsersTablePagination';

const USERS_PER_PAGE = 20;

export default function UsersTable({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
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

  const submitRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (!res?.success) showMessage(res?.message || 'Error updating role', 'error');
      else showMessage(res.message);
    });
  };

  const handleDelete = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    setUsers(users.filter(u => u.id !== userId));

    startTransition(async () => {
      const res = await deleteUser(userId);
      if (!res?.success) showMessage(res?.message || 'Error deleting user', 'error');
      else showMessage(res.message);
    });
  };

  const handleSendLink = (userId) => {
    startTransition(async () => {
      const res = await sendForgetPassword(userId);
      if (!res?.success) showMessage(res?.message || 'Error sending link', 'error');
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
      <UsersTableToolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isPending={isPending}
      />

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
                  <UserRow 
                    key={user.id} 
                    user={user} 
                    submitRoleChange={submitRoleChange}
                    handleSendLink={handleSendLink}
                    handleDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <UsersTablePagination 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalItems={sortedUsers.length}
          itemsPerPage={USERS_PER_PAGE}
        />
      </div>
    </div>
  );
}
