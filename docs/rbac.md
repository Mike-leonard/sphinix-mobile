## Permission Rules Summary

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

---