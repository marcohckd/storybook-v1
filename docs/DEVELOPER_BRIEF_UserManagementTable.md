# Developer Brief: UserManagementTable Component

## Overview

The `UserManagementTable` is a specialized page-level component for managing users with role-based access control (RBAC), module access permissions, and data access controls. It provides a comprehensive interface for viewing, filtering, sorting, and editing user configurations within the ARKEM Design System.

## Component Location

```
src/components/pages/UserManagementTable/
  ├── UserManagementTable.tsx      # Main component implementation
  ├── UserManagementTable.css      # Component styles
  ├── UserManagementTable.stories.tsx  # Storybook stories
  └── index.ts                     # Exports
```

## Purpose & Context

The UserManagementTable serves as the primary interface for administrators to:
- View all users in the system
- Filter users by role (admin/user)
- Search users by name
- View module access permissions for each user
- View data access controls (record limits, time windows, privacy settings)
- Edit individual user configurations via the Drawer component
- Perform bulk operations on selected users

## Technical Requirements

### 1. Core Functionality

#### Data Display
- **User Information**: Display user name with avatar, role badge
- **Module Access**: Show enabled/disabled status for each module with icons and tooltips
- **Data Access Controls**: Display record limits, time windows, and privacy settings
- **Actions Column**: Sticky right-side column with edit button

#### Table Structure
- **Group Headers**: Three main groups (USERS, MODULE ACCESS, DATA ACCESS)
- **Sticky Actions Column**: Remains visible during horizontal scroll
- **Horizontal Scrolling**: When module columns exceed viewport width
- **Custom Scrollbar**: Styled using design system tokens

#### Sorting
- Sortable columns: `name`, `role`
- Toggle between ascending/descending
- Visual indicator (ArrowUpDown icon)

#### Filtering & Search
- **Search**: Filter users by name (case-insensitive)
- **Role Filter**: Dropdown to filter by "All Roles", "Admin", or "User"
- Filters reset pagination to page 1

#### Pagination
- Configurable `pageSize` (default: 10)
- Previous/Next navigation
- Page counter display
- Auto-reset when filters change

### 2. Integration Points

#### Drawer Component
- Clicking edit button (pencil icon) opens `Drawer` component
- Passes user data to drawer for editing
- Drawer handles module access, geography, limits, and privacy configuration

#### Header Component
- Uses `Header` component with `hierarchy="secondary"`
- Includes back button (optional) and close button (optional)
- Search box and role filter in header right slot

### 3. Data Models

#### User Interface
```typescript
export interface User {
  id: string;
  name: string;
  role: "admin" | "user";
  modules: string[];              // Array of module IDs user has access to
  recordLimit: number;            // Maximum records user can access
  timeWindowDays: number;         // Time window for data access
  maskShodan: boolean;            // Privacy setting
  hashIdentifiers: boolean;       // Privacy setting
  aiAssistant: boolean;           // Arkimedes AI assistant access
}
```

#### Module Interface
```typescript
export interface Module {
  id: string;                     // Module identifier (e.g., "settings", "database")
  name: string;                   // Display name (e.g., "Connections", "Tracer")
  icon: React.ComponentType<{ className?: string }>;  // Lucide React icon component
}
```

### 4. Props Interface

```typescript
export interface UserManagementTableProps {
  users: User[];                  // Required: Array of user data
  modules: Module[];              // Required: Array of available modules
  onUserEdit?: (user: User) => void;
  onBulkUpdate?: (userIds: string[]) => void;
  onBulkActivate?: (userIds: string[]) => void;
  onBulkExport?: (userIds: string[]) => void;
  onBack?: () => void;
  onClose?: () => void;
  headerLabel?: string;           // Default: "User Management"
  onSearchChange?: (query: string) => void;
  onRoleFilterChange?: (role: string) => void;
  pageSize?: number;              // Default: 10
  className?: string;
}
```

## Design System Compliance

### Token Usage (CRITICAL)

**All visual values must use tokens. No hardcoded values allowed.**

#### Typography
- Group headers: `var(--fonts-semantic-sm)` (12px)
- Column headers: `var(--fonts-semantic-md)` (16px)
- Cell content: `var(--fonts-semantic-md)` (16px)
- Pagination info: `var(--fonts-semantic-sm)` (14px)
- Font weights: `var(--font-weight-semibold)`, `var(--font-weight-medium)`
- Letter spacing: `var(--letter-spacing-tight)`

#### Spacing
- Container padding: `var(--spacing-16)`
- Cell padding: `var(--spacing-12)`
- Header actions gap: `var(--spacing-12)`
- Pagination gap: `var(--spacing-16)`
- Icon-text gap: `var(--spacing-12)`

#### Colors
- Text primary: `var(--semantic-text-primary)`
- Text secondary: `var(--semantic-text-secondary)`
- Text muted: `var(--semantic-text-muted)`
- Background base: `var(--semantic-background-base)`
- Table borders: `var(--semantic-table-border)`
- Table row even: `var(--semantic-table-row-even)`

#### Borders & Radius
- Border width: `var(--border-width-thin)`
- Border radius: `var(--radius-md)`
- Table border: `var(--border-widths-mode-1-border-width-hairline)`

#### Component-Specific Dimensions (Acceptable Hardcoded)
- Icon sizes: `16px` (module icons, check icons)
- Sort icon: `12px`
- Actions column width: `64px`
- Table row height: `var(--component-table-body-row-height)`
- Column widths: Use CSS variables from Table component

### Component Dependencies

#### Atoms
- `Button` - Edit actions, pagination, header buttons
- `Badge` - Role display
- `Avatar` - User avatar with initials
- `Tooltip` - Module name tooltips

#### Molecules
- `SearchBox` - User search functionality
- `Dropdown` - Role filter

#### Organisms
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` - Table structure
- `Header` - Secondary header with label and actions
- `Drawer` - User configuration editing (external integration)

## Implementation Details

### State Management

```typescript
const [sortColumn, setSortColumn] = useState<SortColumn>(null);
const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
const [currentPage, setCurrentPage] = useState(1);
const [searchQuery, setSearchQuery] = useState("");
const [roleFilter, setRoleFilter] = useState<string>("all");
```

### Data Processing Flow

1. **Filtering**: Apply search query and role filter
2. **Sorting**: Sort filtered results by selected column
3. **Pagination**: Slice sorted results based on current page and page size

### Key Functions

#### Module Access Check
```typescript
const hasModule = useCallback((user: User, moduleId: string) => {
  return user.modules.includes(moduleId);
}, []);
```

#### Sort Toggle
```typescript
const toggleSort = useCallback((column: "name" | "role") => {
  if (sortColumn === column) {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  } else {
    setSortColumn(column);
    setSortDirection("asc");
  }
}, [sortColumn, sortDirection]);
```

### Table Structure

#### Header Rows
1. **Group Header Row**: Three group headers (USERS, MODULE ACCESS, DATA ACCESS) + ACTIONS
2. **Column Header Row**: Individual column headers with sort indicators

#### Column Layout
- **USERS Group**:
  - User (sortable, sticky column width × 1.5)
  - Role (sortable, module column width × 1.5)
- **MODULE ACCESS Group**:
  - One column per module (icon with tooltip)
  - Arkimedes column (Brain icon)
- **DATA ACCESS Group**:
  - Record Limit
  - Time Window
  - Mask Shodan (checkbox icon)
  - Hash Identifiers (checkbox icon)
- **ACTIONS Group**:
  - Actions (sticky right, 64px width, rowSpan={2})

### Styling Patterns

#### Module Icon Display
- Icon size: `16px`
- Centered alignment
- Tooltip on hover showing module name
- Uses Lucide React icons

#### Check Icon Display
- Active: `var(--semantic-brand-base)` color
- Inactive: `var(--semantic-text-muted)` color
- Size: `16px`

#### User Cell
- Avatar + Name layout
- Flexbox with `gap: var(--spacing-12)`
- Avatar shows user initials

#### Role Cell
- Centered Badge component
- Word-wrap enabled for long role names

### Accessibility Requirements

- **ARIA Labels**: All interactive elements have `ariaLabel` props
- **Keyboard Navigation**: Full keyboard support for sorting, pagination
- **Focus Management**: Focus-visible styles on all interactive elements
- **Screen Reader Support**: Proper semantic HTML structure
- **Table Labels**: `ariaLabel="User Management Table"` on Table component

## Storybook Requirements

### Story Structure

#### Default Story
- Shows table with 3 modules
- Demonstrates basic functionality
- Includes Drawer integration
- Shows header with back/close buttons

#### Pagination Story
- Demonstrates pagination with `pageSize={5}`
- Shows 12 users across multiple pages

### Story Documentation
- Component description with features list
- Usage examples
- Responsive behavior notes
- Integration examples

## Testing Considerations

### Unit Tests
- Filtering logic (search, role filter)
- Sorting logic (name, role, ascending/descending)
- Pagination calculations
- Module access checking

### Integration Tests
- Drawer opening/closing
- Callback prop invocations
- State updates on filter changes

### Visual Tests
- Table layout with varying module counts
- Horizontal scrolling behavior
- Sticky actions column
- Empty state display

## Performance Considerations

- Use `useMemo` for filtered, sorted, and paginated data
- Use `useCallback` for event handlers
- Avoid unnecessary re-renders with proper dependency arrays
- Consider virtualization for large user lists (future enhancement)

## Future Enhancements

### Planned Features
- **Batch Selection**: Checkbox column for selecting multiple users
- **Batch Actions Toolbar**: Appears when users are selected
- **Bulk Operations**: Update, activate/deactivate, export selected users
- **Column Visibility Toggle**: Show/hide module columns
- **Export Functionality**: Export filtered/sorted data
- **Advanced Filters**: Filter by module access, data access settings

### Implementation Notes for Batch Selection

When implementing batch selection:
1. Add checkbox column as first column (sticky)
2. Add `selectedUsers` state: `useState<string[]>([])`
3. Add batch actions toolbar above table (similar to DataTable pattern)
4. Toolbar shows selected count and action buttons
5. Use existing `onBulkUpdate`, `onBulkActivate`, `onBulkExport` callbacks

## Common Patterns

### Empty State
```tsx
{filteredUsers.length === 0 && (
  <div className="arkem-user-table__empty">
    No users found matching the current filters.
  </div>
)}
```

### Pagination
```tsx
{totalPages > 1 && (
  <div className="arkem-user-table__pagination">
    <Button disabled={currentPage === 1} onClick={previousPage}>
      Previous
    </Button>
    <span>Page {currentPage} of {totalPages}</span>
    <Button disabled={currentPage === totalPages} onClick={nextPage}>
      Next
    </Button>
  </div>
)}
```

### Module Column Rendering
```tsx
{modules.map((module) => {
  const IconComponent = module.icon;
  return (
    <TableHead key={module.id}>
      <Tooltip>
        <TooltipTrigger>
          <IconComponent />
        </TooltipTrigger>
        <TooltipContent>{module.name}</TooltipContent>
      </Tooltip>
    </TableHead>
  );
})}
```

## Acceptance Criteria

- [ ] All visual values use design system tokens (no hardcoded values)
- [ ] Typography follows semantic token scale
- [ ] Spacing uses spacing tokens
- [ ] Colors use semantic color tokens
- [ ] Table structure matches design specifications
- [ ] Sorting works for name and role columns
- [ ] Filtering works for search and role
- [ ] Pagination functions correctly
- [ ] Sticky actions column remains visible during scroll
- [ ] Horizontal scrolling works with custom scrollbar
- [ ] Module icons display with tooltips
- [ ] Check icons show correct active/inactive states
- [ ] Drawer integration works correctly
- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works
- [ ] Focus-visible styles applied
- [ ] Empty state displays when no users match filters
- [ ] Storybook stories demonstrate all features
- [ ] Component is fully typed with TypeScript
- [ ] No console errors or warnings

## Related Documentation

- [Tokenization Guidelines](../../src/tokenization/TOKENIZATION_GUIDELINES.md)
- [Table Component](../../src/components/organisms/Table/)
- [Drawer Component](../../src/components/organisms/Drawer/)
- [Design System Standards](../../.cursorrules)

## Notes

- The component is currently missing batch selection functionality (mentioned in stories but not implemented)
- CSS includes styles for batch toolbar that are not yet used
- Consider extracting module column rendering into a separate component if complexity grows
- The "Arkimedes" module column is hardcoded - consider making it configurable

