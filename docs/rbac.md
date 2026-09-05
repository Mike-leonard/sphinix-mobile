# Role-Based Access Control (RBAC) Architecture

*This document outlines the user roles, permission matrix, server-side enforcement guards, and UI navigation restrictions across Sphinix Mobile.*

---

## 1. User Roles

1. **`Admin`**: Full, unrestricted access to all dashboard management modules, global site settings, user role configuration, and database backup exports.
2. **`Moderator`**: Access to content management, review moderation, and device specification catalog updates.
3. **`ContentWriter`**: Restricted access focused on editorial content creation:
   - Allowed: Creating and editing blogs, managing categories, creating new phone models, adding specification attributes, and defining brand names.
   - Restricted: Cannot delete existing models permanently, cannot modify global system settings, cannot reorder or delete attributes/groups/filters, and cannot manage user roles.
4. **`User`**: Public visitor account capable of viewing articles, comparing smartphones, saving favorites, and submitting device reviews.

---

## 2. Comprehensive Permission Matrix

| Route / Module | Action | `Admin` / `Moderator` | `ContentWriter` | Server Enforcement File |
| :--- | :--- | :---: | :---: | :--- |
| **Brands** (`/dashboard/phones/brands`) | Create Brand | ✅ | ✅ | `actions/device-brands.js` -> `createDeviceBrand` |
| | Edit / Rename Brand | ✅ | ❌ | `actions/device-brands.js` -> `updateDeviceBrand` |
| | Delete Brand | ✅ | ❌ | `actions/device-brands.js` -> `deleteDeviceBrand` |
| **Groups** (`/dashboard/phones/groups`) | Create Group | ✅ | ✅ | `actions/device-groups.js` -> `createDeviceGroup` |
| | Rename Group | ✅ | ❌ | `actions/device-groups.js` -> `updateDeviceGroup` |
| | Delete Group | ✅ | ❌ | `actions/device-groups.js` -> `deleteDeviceGroup` |
| | Reorder Groups (DnD) | ✅ | ❌ | `actions/device-groups.js` -> `reorderDeviceGroups` |
| | Assign/Manage Group Attributes | ✅ | ❌ | `GroupList.jsx` / `actions/device-attributes.js` |
| **Attributes** (`/dashboard/phones/attributes`) | Create Attribute | ✅ | ✅ | `actions/device-attributes.js` -> `createDeviceAttribute` |
| | Add Term Option | ✅ | ✅ | `actions/device-attributes.js` -> `addAttributeTerm` |
| | Edit Attribute / Slug / Group | ✅ | ❌ | `actions/device-attributes.js` -> `updateDeviceAttribute` |
| | Delete Attribute | ✅ | ❌ | `actions/device-attributes.js` -> `deleteDeviceAttribute` |
| | Delete Term Option | ✅ | ❌ | `actions/device-attributes.js` -> `deleteAttributeTerm` |
| | Reorder Attributes / Groups (DnD) | ✅ | ❌ | `actions/device-attributes.js` -> `reorderDeviceAttributes` |
| **Filters** (`/dashboard/phones/filters`) | Create / Enable Filter | ✅ | ❌ | `actions/device-filters.js` -> `saveDeviceFilters` |
| | Delete / Reorder Filters | ✅ | ❌ | `actions/device-filters.js` -> `saveDeviceFilters` |
| **Rating Bars** (`/dashboard/phones/rating-bars`) | Create Rating Bar | ✅ | ❌ | `actions/rating-bars.js` -> `createRatingBar` |
| | Edit / Delete / Reorder Rating Bars | ✅ | ❌ | `actions/rating-bars.js` -> `updateRatingBar` |
| **Phones** (`/dashboard/phones`) | Create / Edit / Duplicate Device | ✅ | ✅ | `actions/devices.js` |
| | Export / Import Device JSON | ✅ | ✅ | `DeviceEditor.jsx` |
| | R2 Gallery Image Upload | ✅ | ✅ | `actions/media-actions.js` |
| | Permanent Delete Device | ✅ | ❌ | `actions/devices.js` -> `deleteDevice` |
| **Blogs** (`/dashboard/blogs`) | Create / Edit / Duplicate Blog | ✅ | ✅ | `actions/blogs.js` |
| | Permanent Delete Blog | ✅ | ❌ | `actions/blogs.js` -> `permanentlyDeleteBlog` |
| **Settings** (`/dashboard/settings/*`) | View & Update Settings | ✅ | ❌ | `actions/settings.js` & `SettingsNavList.jsx` |
| **Users** (`/dashboard/users`) | View & Change User Roles | ✅ | ❌ | `actions/users.js` & `UserRow.jsx` |
| **Backups** (`/dashboard/settings/backup`) | Download Database Backup | ✅ | ❌ | `actions/backup.js` |

---

## 3. Enforcement Mechanisms

### 1. Server-Side Action Guards
Every mutating server action validates session authorization via `verifySession()`. If the user is unauthenticated or lacks the required role, an unauthorized error response is returned:
```javascript
const user = await verifySession();
if (!user || (user.role !== 'Admin' && user.role !== 'Moderator')) {
  return { success: false, error: 'Unauthorized: Admin privileges required.' };
}
```

### 2. Client-Side Route & Navigation Guards
- `app/dashboard/_components/SidebarNav.jsx`: Conditionally renders dashboard sidebar links based on the authenticated user's role. Non-admin users do not see Settings or User Management links.
- `app/dashboard/settings/_components/SettingsNavList.jsx`: Verifies admin role before rendering settings sub-navigation.
- UI Action buttons (e.g. Delete, Edit attribute, Reorder drag handles) are hidden or rendered disabled for `ContentWriter` sessions.