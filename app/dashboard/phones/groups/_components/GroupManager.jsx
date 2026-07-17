'use client';

import React, { useState, useTransition } from 'react';
import { Plus, X } from 'lucide-react';
import { createDeviceGroup, deleteDeviceGroup, updateDeviceGroup } from '@/actions/device-groups';
import { updateDeviceAttribute } from '@/actions/device-attributes';
import { Button } from '@/components/ui/button';
import GroupForm from './GroupForm';
import GroupList from './GroupList';
export default function GroupManager({ initialGroups, allAttributes = [] }) {
  const [groups, setGroups] = useState(initialGroups);
  const [sortOrder, setSortOrder] = useState('asc');
  const [newGroup, setNewGroup] = useState('');
  const [isPending, startTransition] = useTransition();
  const [editingGroup, setEditingGroup] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [managingGroup, setManagingGroup] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!newGroup.trim()) return;

    startTransition(async () => {
      const res = await createDeviceGroup(newGroup);
      if (res.success) {
        setGroups([...groups, newGroup.trim()].sort((a, b) => a.localeCompare(b)));
        setNewGroup('');
      } else {
        alert(res.error);
      }
    });
  };

  const confirmDeleteGroup = (groupToDelete) => {
    if (confirm(`Are you sure you want to delete "${groupToDelete}"? Any attributes assigned to this group will be moved to "General".`)) {
      startTransition(async () => {
        const res = await deleteDeviceGroup(groupToDelete);
        if (res.success) {
          setGroups(groups.filter(g => g !== groupToDelete));
        } else {
          alert(res.error);
        }
      });
    }
  };

  const handleSaveEdit = () => {
    if (!editValue.trim() || editValue.trim() === editingGroup) {
      setEditingGroup(null);
      return;
    }

    startTransition(async () => {
      const res = await updateDeviceGroup(editingGroup, editValue.trim());
      if (res.success) {
        const newGroups = groups.filter(g => g !== editingGroup);
        newGroups.push(editValue.trim());
        setGroups(newGroups.sort((a, b) => a.localeCompare(b)));
        setEditingGroup(null);
      } else {
        alert(res.error);
      }
    });
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleToggleAttribute = (attr, group, checked) => {
    startTransition(async () => {
      let newGroupIds = attr.groupIds ? [...attr.groupIds] : (attr.groupId ? [attr.groupId] : ['General']);
      if (checked) {
        if (!newGroupIds.includes(group)) newGroupIds.push(group);
      } else {
        newGroupIds = newGroupIds.filter(g => g !== group);
        if (newGroupIds.length === 0) newGroupIds = ['General'];
      }
      const res = await updateDeviceAttribute(attr.id, attr.name, newGroupIds, attr.slug);
      if (!res.success) {
        alert(res.error);
      }
    });
  };

  const sortedGroups = [...groups].sort((a, b) => {
    return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Groups</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add Group'}
        </Button>
      </div>

      {showAddForm && (
        <GroupForm 
          newGroup={newGroup}
          setNewGroup={setNewGroup}
          isPending={isPending}
          handleAddGroup={handleAddGroup}
        />
      )}

      <GroupList 
        sortedGroups={sortedGroups}
        allAttributes={allAttributes}
        editingGroup={editingGroup}
        setEditingGroup={setEditingGroup}
        editValue={editValue}
        setEditValue={setEditValue}
        isPending={isPending}
        managingGroup={managingGroup}
        setManagingGroup={setManagingGroup}
        toggleSort={toggleSort}
        handleSaveEdit={handleSaveEdit}
        confirmDeleteGroup={confirmDeleteGroup}
        handleToggleAttribute={handleToggleAttribute}
      />
    </div>
  );
}
