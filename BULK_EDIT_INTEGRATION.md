# BulkEditModal Integration Guide

## Component Location
`/Users/sachi/Desktop/crna-club-rebuild/src/components/features/admin/access/BulkEditModal.jsx`

## How to Integrate into AccessControlPage

### 1. Import the component

Add to the imports section in `/Users/sachi/Desktop/crna-club-rebuild/src/pages/admin/AccessControlPage.jsx`:

```javascript
import { BulkEditModal } from '@/components/features/admin/access/BulkEditModal';
import { useEntitlements } from '@/hooks/useEntitlements';
```

### 2. Add state for bulk edit modal

Add to the local state section (around line 67):

```javascript
const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false);
```

### 3. Fetch entitlements

Add the hook call (around line 50):

```javascript
const { entitlements } = useEntitlements();
```

### 4. Update handleBulkEdit function

Replace the existing TODO placeholder (around line 144):

```javascript
const handleBulkEdit = async () => {
  setBulkEditModalOpen(true);
};
```

### 5. Add bulk save handler

Add this new function after handleBulkEdit:

```javascript
const handleBulkSave = async (updates) => {
  const result = await bulkUpdateAccess(updates);

  if (!result.error) {
    refetch();
    setBulkEditModalOpen(false);
    setSelectedIds([]); // Clear selection after successful update
  }
};
```

### 6. Get selected resources for the modal

Add this derived value (around line 100):

```javascript
const selectedResources = useMemo(() => {
  return resources.filter(r => selectedIds.includes(r.id));
}, [resources, selectedIds]);
```

### 7. Render the BulkEditModal

Add the modal component right after the AccessEditModal (around line 319):

```javascript
{/* Bulk Edit Modal */}
<BulkEditModal
  open={bulkEditModalOpen}
  onOpenChange={setBulkEditModalOpen}
  selectedItems={selectedResources}
  entitlements={entitlements}
  onSave={handleBulkSave}
/>
```

## Complete Example

Here's what the updated AccessControlPage would look like with all changes:

```javascript
// ... existing imports ...
import { BulkEditModal } from '@/components/features/admin/access/BulkEditModal';
import { useEntitlements } from '@/hooks/useEntitlements';

export function AccessControlPage() {
  const {
    resources,
    stats,
    warnings,
    isLoading,
    error,
    refetch,
    updateResourceAccess,
    bulkUpdateAccess
  } = useAccessControl();

  // Get entitlements for bulk edit
  const { entitlements } = useEntitlements();

  // Local state
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false); // NEW
  const [dismissedWarnings, setDismissedWarnings] = useState([]);

  // ... existing useMemo for filteredResources ...

  // Get selected resources for bulk edit
  const selectedResources = useMemo(() => {
    return resources.filter(r => selectedIds.includes(r.id));
  }, [resources, selectedIds]);

  // ... existing handlers ...

  const handleBulkEdit = () => {
    setBulkEditModalOpen(true);
  };

  const handleBulkSave = async (updates) => {
    const result = await bulkUpdateAccess(updates);

    if (!result.error) {
      refetch();
      setBulkEditModalOpen(false);
      setSelectedIds([]); // Clear selection after successful update
    }
  };

  // ... rest of component ...

  return (
    <PageWrapper ...>
      {/* ... existing content ... */}

      {/* Edit Modal */}
      <AccessEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        resource={editingResource}
        onSave={handleSaveAccess}
      />

      {/* Bulk Edit Modal */}
      <BulkEditModal
        open={bulkEditModalOpen}
        onOpenChange={setBulkEditModalOpen}
        selectedItems={selectedResources}
        entitlements={entitlements}
        onSave={handleBulkSave}
      />
    </PageWrapper>
  );
}
```

## Features

The BulkEditModal provides:

1. **Two Update Modes:**
   - **Replace All**: Removes existing entitlements and sets new ones
   - **Add to Existing**: Keeps existing entitlements and adds new ones (no duplicates)

2. **Clear Preview:**
   - Shows count of selected resources by type
   - Displays what the result will be
   - Shows warnings if resources will become public

3. **Validation:**
   - Disables save button when in "Add" mode with no entitlements selected
   - Shows warning when replacing with empty list (makes resources public)

4. **User-Friendly:**
   - Lists affected resources when 5 or fewer are selected
   - Shows before/after entitlement counts
   - Provides clear descriptions and help text

## Props Documentation

### BulkEditModal Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | boolean | Yes | Controls modal visibility |
| `onOpenChange` | function | Yes | Callback when modal should open/close |
| `selectedItems` | array | Yes | Array of resource objects to edit |
| `entitlements` | array | Yes | Array of available entitlements from useEntitlements |
| `onSave` | function | Yes | Callback with updates array when user saves |

### selectedItems Structure

Each item in the array should have:
```javascript
{
  id: string,              // Resource ID
  type: 'module' | 'lesson' | 'download',
  name: string,            // Display name
  display_name: string,    // Alternative display name
  accessible_via: string[], // Current entitlements
}
```

### onSave Updates Structure

The `onSave` callback receives an array of updates:
```javascript
[
  {
    resourceId: string,
    resourceType: 'module' | 'lesson' | 'download',
    data: {
      entitlements: string[],
      isPublic: boolean
    }
  },
  // ... more updates
]
```

This matches the signature expected by `bulkUpdateAccess` from the `useAccessControl` hook.
