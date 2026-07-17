'use client';

import React, { useState, useTransition } from 'react';
import { Plus, X } from 'lucide-react';
import {
  createDeviceAttribute,
  updateDeviceAttribute,
  deleteDeviceAttribute,
  addAttributeTerm,
  deleteAttributeTerm,
  reorderDeviceAttributes
} from '@/actions/device-attributes';
import { reorderDeviceGroups } from '@/actions/device-groups';
import { Button } from '@/components/ui/button';
import AttributeForm from './AttributeForm';
import AttributeSidebar from './AttributeSidebar';
import AttributeList from './AttributeList';

export default function AttributeManager({ initialAttributes, availableGroups = ['General'] }) {
  const [attributes, setAttributes] = useState(initialAttributes || []);
  const [newAttribute, setNewAttribute] = useState('');
  const [newAttributeSlug, setNewAttributeSlug] = useState('');
  const [newGroupIds, setNewGroupIds] = useState([availableGroups[0] || 'General']);
  const [isPending, startTransition] = useTransition();
  const [editingAttributeId, setEditingAttributeId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editGroupIds, setEditGroupIds] = useState([]);

  // Terms Management State
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [newTermValues, setNewTermValues] = useState({});

  // Layout State
  const [showAddForm, setShowAddForm] = useState(false);
  const [orderedGroups, setOrderedGroups] = useState(availableGroups);
  const orderedGroupsRef = React.useRef(availableGroups);
  const [activeGroupId, setActiveGroupId] = useState(availableGroups[0] || 'General');

  // DnD State
  const [draggedGroup, setDraggedGroup] = useState(null);
  const [draggedAttribute, setDraggedAttribute] = useState(null);

  // Sync orderedGroups if props change (e.g. from server action)
  React.useEffect(() => {
    setOrderedGroups(availableGroups);
    orderedGroupsRef.current = availableGroups;
  }, [availableGroups]);

  const handleDragStart = (e, group) => {
    setDraggedGroup(group);
    e.dataTransfer.effectAllowed = 'move';
    // Small timeout to make the original item look distinct or empty if desired, but not strictly needed
  };

  const handleDragOver = (e, group) => {
    e.preventDefault(); // Necessary to allow dropping
    if (!draggedGroup || draggedGroup === group) return;
    
    // Optimistic UI update
    setOrderedGroups(prev => {
      const newOrder = [...prev];
      const fromIndex = newOrder.indexOf(draggedGroup);
      const toIndex = newOrder.indexOf(group);
      
      newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, draggedGroup);
      orderedGroupsRef.current = newOrder;
      return newOrder;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedGroup) return;

    startTransition(async () => {
      const res = await reorderDeviceGroups(orderedGroupsRef.current);
      if (!res.success) {
        alert(res.error);
        setOrderedGroups(availableGroups); // Revert on failure
        orderedGroupsRef.current = availableGroups;
      }
    });
    setDraggedGroup(null);
  };


  const handleAddAttribute = (e) => {
    e.preventDefault();
    if (!newAttribute.trim()) return;

    startTransition(async () => {
      const res = await createDeviceAttribute(newAttribute, newGroupIds, newAttributeSlug);
      if (res.success) {
        setAttributes([...attributes, res.attribute].sort((a, b) => a.name.localeCompare(b.name)));
        setNewAttribute('');
        setNewAttributeSlug('');
      } else {
        alert(res.error);
      }
    });
  };

  const confirmDeleteAttribute = (attrId, attrName) => {
    if (confirm(`Are you sure you want to delete the attribute "${attrName}"?`)) {
      startTransition(async () => {
        const res = await deleteDeviceAttribute(attrId);
        if (res.success) {
          setAttributes(attributes.filter(a => a.id !== attrId));
          if (expandedRowId === attrId) setExpandedRowId(null);
        } else {
          alert(res.error);
        }
      });
    }
  };

  const handleSaveEdit = (attrId) => {
    if (!editValue.trim()) {
      setEditingAttributeId(null);
      return;
    }

    startTransition(async () => {
      const res = await updateDeviceAttribute(attrId, editValue.trim(), editGroupIds, editSlug);
      if (res.success) {
        setAttributes(attributes.map(a => {
          if (a.id === attrId) {
            return { 
              ...a, 
              name: editValue.trim(), 
              slug: editSlug.trim() || editValue.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''), 
              groupIds: editGroupIds 
            };
          }
          return a;
        }).sort((a, b) => a.name.localeCompare(b.name)));
        setEditingAttributeId(null);
      } else {
        alert(res.error);
      }
    });
  };

  const handleAddTerm = (attrId) => {
    const term = newTermValues[attrId];
    if (!term || !term.trim()) return;

    startTransition(async () => {
      const res = await addAttributeTerm(attrId, term);
      if (res.success) {
        setAttributes(attributes.map(a => {
          if (a.id === attrId) {
            return { ...a, terms: [...(a.terms || []), term.trim()] };
          }
          return a;
        }));
        setNewTermValues(prev => ({ ...prev, [attrId]: '' }));
      } else {
        alert(res.error);
      }
    });
  };

  const handleRemoveTerm = (attrId, term) => {
    startTransition(async () => {
      const res = await deleteAttributeTerm(attrId, term);
      if (res.success) {
        setAttributes(attributes.map(a => {
          if (a.id === attrId) {
            return { ...a, terms: a.terms.filter(t => t !== term) };
          }
          return a;
        }));
      } else {
        alert(res.error);
      }
    });
  };

  const toggleRow = (id) => {
    setExpandedRowId(prev => prev === id ? null : id);
  };

  const groupedAttributes = availableGroups.reduce((acc, group) => {
    acc[group] = attributes.filter(a => {
      if (a.groupIds && a.groupIds.length > 0) return a.groupIds.includes(group);
      return (a.groupId || 'General') === group;
    });
    return acc;
  }, {});

  const toggleGroup = (group) => {
    setActiveGroupId(group);
  };

  const handleAttributeDragStart = (e, attr) => {
    setDraggedAttribute(attr);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAttributeDragOver = (e, targetAttr) => {
    e.preventDefault();
  };

  const handleAttributeDrop = (e, targetAttr) => {
    e.preventDefault();
    if (!draggedAttribute || draggedAttribute.id === targetAttr.id) {
      setDraggedAttribute(null);
      return;
    }

    // Get current global attributes order
    const newAttributes = [...attributes];
    const draggedIndex = newAttributes.findIndex(a => a.id === draggedAttribute.id);
    const targetIndex = newAttributes.findIndex(a => a.id === targetAttr.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedAttribute(null);
      return;
    }

    // Reorder in local state
    const [removed] = newAttributes.splice(draggedIndex, 1);
    newAttributes.splice(targetIndex, 0, removed);
    
    // Update local state immediately for snappy UI
    setAttributes(newAttributes);
    setDraggedAttribute(null);

    // Save to backend
    startTransition(async () => {
      const res = await reorderDeviceAttributes(newAttributes.map(a => a.id));
      if (!res.success) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Attributes</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add Attribute'}
        </Button>
      </div>

      {showAddForm && (
        <AttributeForm 
          newAttribute={newAttribute}
          setNewAttribute={setNewAttribute}
          newAttributeSlug={newAttributeSlug}
          setNewAttributeSlug={setNewAttributeSlug}
          newGroupIds={newGroupIds}
          setNewGroupIds={setNewGroupIds}
          availableGroups={availableGroups}
          isPending={isPending}
          handleAddAttribute={handleAddAttribute}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <AttributeSidebar 
          orderedGroups={orderedGroups}
          groupedAttributes={groupedAttributes}
          activeGroupId={activeGroupId}
          setActiveGroupId={setActiveGroupId}
          draggedGroup={draggedGroup}
          setDraggedGroup={setDraggedGroup}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
        />

        <AttributeList 
          attributes={attributes}
          groupedAttributes={groupedAttributes}
          activeGroupId={activeGroupId}
          availableGroups={availableGroups}
          editingAttributeId={editingAttributeId}
          setEditingAttributeId={setEditingAttributeId}
          editValue={editValue}
          setEditValue={setEditValue}
          editSlug={editSlug}
          setEditSlug={setEditSlug}
          editGroupIds={editGroupIds}
          setEditGroupIds={setEditGroupIds}
          expandedRowId={expandedRowId}
          setExpandedRowId={setExpandedRowId}
          newTermValues={newTermValues}
          setNewTermValues={setNewTermValues}
          isPending={isPending}
          draggedAttribute={draggedAttribute}
          setDraggedAttribute={setDraggedAttribute}
          handleAttributeDragStart={handleAttributeDragStart}
          handleAttributeDragOver={handleAttributeDragOver}
          handleAttributeDrop={handleAttributeDrop}
          handleSaveEdit={handleSaveEdit}
          confirmDeleteAttribute={confirmDeleteAttribute}
          handleAddTerm={handleAddTerm}
          handleRemoveTerm={handleRemoveTerm}
          toggleRow={toggleRow}
          setShowAddForm={setShowAddForm}
        />
      </div>
    </div>
  );
}
