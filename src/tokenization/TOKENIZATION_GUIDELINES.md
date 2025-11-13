# Tokenization Guidelines

This document outlines the ARKEM Design System's approach to tokenization and which hardcoded values are acceptable vs should be tokenized.

## Principles

1. **All visual values should use tokens** - Colors, spacing, typography, borders, shadows, etc. should reference tokens from `tokens.css` or `tokens-semantic.css`
2. **Component-specific dimensions may be hardcoded** - If a value is unique to a single component and not reused, it may be acceptable to hardcode
3. **Reusable values must be tokenized** - If a value appears in multiple components or contexts, it should be a token

## Acceptable Hardcoded Values

### Component-Specific Dimensions

These values are acceptable to hardcode because they are specific to individual components and not reused:

- **Button heights**: `32px` (sm), `40px` (md), `48px` (lg) - Component-specific sizing
- **Icon sizes**: `16px` (sm), `20px` (md), `24px` (lg) - Component-specific sizing
- **Modal dimensions**: `max-width: 1000px`, `height: 700px` - Component-specific layout
- **Table row heights**: `40px` (header), `48px` (body) - Component-specific sizing
- **Table column widths**: `68px`, `120px`, `280px`, `48px` - Component-specific layout

**Note**: If these values become standardized across multiple components, they should be moved to tokens (e.g., `--component-button-height-sm`, `--component-icon-size-md`).

### Token Source Files

Hardcoded values in token definition files are **required** and acceptable:
- `src/styles/tokens.css` - Raw token values (hex colors, pixel values, etc.)
- `src/styles/tokens-semantic.css` - Semantic token definitions (may reference raw tokens)

## Values That Must Be Tokenized

### Colors
- All colors must use semantic tokens (e.g., `var(--semantic-background-base)`, `var(--semantic-text-primary)`)
- Never use hex values directly in component CSS or stories

### Spacing
- All spacing values must use spacing tokens (e.g., `var(--spacing-style-spacing-4px-4-16px)`)
- Gap values in flex/grid layouts should use tokens
- Padding and margin should use tokens

### Typography
- Font sizes, line heights, and font weights must use typography tokens
- Never hardcode font sizes like `16px` or `14px` directly

### Borders
- Border colors, widths, and radii must use tokens
- Use semantic border tokens (e.g., `var(--semantic-border-subtle)`, `var(--border-width-thin)`, `var(--border-width-medium)`)

### Shadows
- All shadow values must use shadow tokens (e.g., `var(--shadow-xs)`, `var(--shadow-skeuomorphic)`)

### Focus Rings
- Focus ring colors and styles must use tokens (e.g., `var(--semantic-focus-ring)`)

### Z-Index
- All z-index values must use z-index tokens
- Use semantic z-index tokens (e.g., `var(--z-index-base)`, `var(--z-index-modal)`)
- Never hardcode z-index values like `1000` or `10` directly

### Animations & Transitions
- All transition durations and easing functions must use animation tokens
- Use transition tokens (e.g., `var(--transition-base)`, `var(--transition-fast)`, `var(--transition-slow)`)
- Never hardcode transition durations like `0.15s ease` or `0.3s cubic-bezier(...)` directly

### Letter Spacing
- All letter-spacing values must use typography tokens
- Use letter-spacing tokens (e.g., `var(--letter-spacing-tight)`, `var(--letter-spacing-normal)`)
- Never hardcode letter-spacing values like `0.2%` or `0.5px` directly

## Examples

### ✅ Good - Using Tokens

```css
.button {
  background: var(--semantic-brand-base);
  color: var(--semantic-text-inverse);
  padding: var(--spacing-8);
  border-radius: var(--radius-md);
  font-size: var(--fonts-semantic-md);
  box-shadow: var(--shadow-xs);
  transition: background-color var(--transition-base), color var(--transition-base);
  z-index: var(--z-index-base);
  letter-spacing: var(--letter-spacing-normal);
}
```

### ❌ Bad - Hardcoded Values

```css
.button {
  background: #e0dd5b;
  color: #080808;
  padding: 8px;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
```

### ✅ Acceptable - Component-Specific Dimensions

```css
.button[data-size="md"] {
  height: 40px; /* Component-specific, not reused elsewhere */
  padding: var(--spacing-8); /* Uses token */
}
```

### ❌ Should Be Tokenized - Reusable Values

```css
/* If this appears in multiple components, create a token */
.card {
  border-radius: 8px; /* Should be var(--radius-md) */
  padding: 16px; /* Should be var(--spacing-style-spacing-4px-4-16px) */
}
```

## Story Files

Story files should also use tokens for consistency:

### ✅ Good - Using Tokens in Stories

```tsx
// Standard container spacing
<div style={{ 
  display: "flex", 
  gap: "var(--spacing-style-spacing-4px-4-16px)",
  padding: "var(--spacing-12)"
}}>

// Navigation menu pattern (see Standard Component Patterns section)
<div style={{ 
  display: "flex", 
  flexDirection: "column",
  gap: "var(--spacing-style-spacing-4px-1-4px)" // 4px between items
}}>
  {items.map(item => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-12)", // 12px between icon and text
      padding: "var(--spacing-8) var(--spacing-12)", // 8px vertical, 12px horizontal
      borderRadius: "var(--radius-md)" // 8px rounded corners
    }}>
      {item.icon}
      {item.label}
    </div>
  ))}
</div>
```

### ❌ Bad - Hardcoded Values in Stories

```tsx
// ❌ Bad - Hardcoded spacing
<div style={{ 
  display: "flex", 
  gap: "16px",
  padding: "12px"
}}>

// ❌ Bad - Hardcoded navigation menu pattern
<div style={{ 
  display: "flex", 
  flexDirection: "column",
  gap: "4px" // Should use token
}}>
  {items.map(item => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px", // Should use token
      padding: "8px 12px", // Should use tokens
      borderRadius: "8px" // Should use token
    }}>
      {item.icon}
      {item.label}
    </div>
  ))}
</div>
```

## When to Create New Tokens

Create a new token when:
1. A value is used in 2+ components
2. A value represents a design system concept (e.g., "standard card padding")
3. A value might need to change globally (e.g., theme updates)

Do NOT create a token when:
1. A value is truly component-specific and unique
2. A value is a one-off layout adjustment
3. A value is in a token source file (tokens.css, tokens-semantic.css)

## Migration Checklist

When reviewing code for tokenization:

- [ ] All colors use semantic tokens
- [ ] All spacing uses spacing tokens
- [ ] All typography uses typography tokens
- [ ] All borders use border tokens
- [ ] All shadows use shadow tokens
- [ ] All z-index values use z-index tokens
- [ ] All animations/transitions use animation tokens
- [ ] All letter-spacing uses letter-spacing tokens
- [ ] Component-specific dimensions are documented
- [ ] Story files use tokens for layout values

## Available Token Categories

### Z-Index Tokens
- `--z-index-base`: Base z-index (1) - for focus rings, overlays within components
- `--z-index-sticky`: Sticky elements (10) - for sticky headers/footers
- `--z-index-dropdown`: Dropdown menus (100) - for dropdown overlays
- `--z-index-modal`: Modals and drawers (1000) - for modal overlays

### Animation Tokens
- `--transition-fast`: Fast transitions (0.1s ease) - for slider interactions
- `--transition-base`: Standard transitions (0.15s ease) - for most UI interactions
- `--transition-slow`: Slow transitions (0.3s cubic-bezier) - for drawer/modal animations
- `--easing-base`: Base easing function (ease)
- `--easing-smooth`: Smooth easing function (cubic-bezier(0.4, 0, 0.2, 1))

### Letter Spacing Tokens
- `--letter-spacing-tight`: Tight letter spacing (0.2%) - for table headers, uppercase text
- `--letter-spacing-normal`: Normal letter spacing (0.5px) - for labels, filters

## Standard Component Patterns

### Navigation Menu / List Item Pattern

For navigation menus, list items, and similar components with icons and text, use these standardized spacing patterns:

**Container Spacing:**
- **Gap between items**: `var(--spacing-style-spacing-4px-1-4px)` (4px) - Creates tight vertical rhythm between menu items

**Item Spacing:**
- **Gap between icon and text**: `var(--spacing-12)` (12px) - Standard spacing when expanded
- **Gap when collapsed**: `0` - No gap when showing icons only

**Item Padding:**
- **Vertical padding**: `var(--spacing-8)` (8px) - Top and bottom padding for clickable area
- **Horizontal padding**: `var(--spacing-12)` (12px) - Left and right padding for comfortable touch targets
- **Combined**: `var(--spacing-8) var(--spacing-12)` (8px vertical, 12px horizontal)

**Border Radius:**
- **Item border radius**: `var(--radius-md)` (8px) - Standard rounded corners for interactive items

**Example Usage:**

```css
/* Navigation menu container */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-style-spacing-4px-1-4px); /* 4px between items */
}

/* Navigation menu item */
.nav-menu__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-12); /* 12px between icon and text */
  padding: var(--spacing-8) var(--spacing-12); /* 8px vertical, 12px horizontal */
  border-radius: var(--radius-md); /* 8px rounded corners */
}

/* Collapsed state */
.nav-menu__item--collapsed {
  gap: 0; /* No gap when showing icons only */
}
```

**In Story Files:**

```tsx
// ✅ Good - Using tokens
<div style={{ 
  display: "flex", 
  flexDirection: "column",
  gap: "var(--spacing-style-spacing-4px-1-4px)" // 4px between items
}}>
  {items.map(item => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-12)", // 12px between icon and text
      padding: "var(--spacing-8) var(--spacing-12)", // 8px vertical, 12px horizontal
      borderRadius: "var(--radius-md)" // 8px rounded corners
    }}>
      {item.icon}
      {item.label}
    </div>
  ))}
</div>

// ❌ Bad - Hardcoded values
<div style={{ 
  display: "flex", 
  flexDirection: "column",
  gap: "4px" // Should use token
}}>
  {items.map(item => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px", // Should use token
      padding: "8px 12px", // Should use tokens
      borderRadius: "8px" // Should use token
    }}>
      {item.icon}
      {item.label}
    </div>
  ))}
</div>
```

**When to Use This Pattern:**
- Navigation menus (sidebar, top nav, etc.)
- List items with icons
- Menu items with icons and labels
- Any component displaying a vertical list of interactive items with icons

### Standard Font Size Patterns for Stories

For consistent typography in story files, use these standardized font size tokens:

**Headings:**
- **Section headings (h3)**: `var(--fonts-semantic-md)` (16px) - For main section titles in stories
- **Subsection headings**: `var(--fonts-semantic-sm)` (14px) - For subsections within stories

**Body Text:**
- **Body text**: `var(--fonts-semantic-sm)` (14px) - Standard body text in stories
- **Labels**: `var(--fonts-semantic-xs)` (12px) - Form labels, field labels
- **Metadata/Captions**: `var(--fonts-semantic-xs)` (12px) - Helper text, captions, metadata

**Component Titles:**
- **Card titles**: `var(--fonts-semantic-md)` (16px) - Titles within card components
- **Panel titles**: `var(--fonts-semantic-md)` (16px) - Titles within panel components

**Example Usage:**

```tsx
// ✅ Good - Using standardized smaller tokens
<h3 style={{ fontSize: "var(--fonts-semantic-md)", fontWeight: 600 }}>
  Section Title
</h3>

<p style={{ fontSize: "var(--fonts-semantic-sm)", color: "var(--semantic-text-secondary)" }}>
  Body text content
</p>

<label style={{ fontSize: "var(--fonts-semantic-xs)", color: "var(--semantic-text-muted)" }}>
  Form Label
</label>

// ❌ Bad - Using larger tokens or hardcoded values
<h3 style={{ fontSize: "var(--fonts-semantic-lg)" }}> // Too large, use md
<h3 style={{ fontSize: "18px" }}> // Hardcoded, use token
<p style={{ fontSize: "var(--fonts-semantic-md)" }}> // Too large for body, use sm
```

**Font Size Token Reference:**
- `--fonts-semantic-xs`: 12px - Labels, metadata, captions
- `--fonts-semantic-sm`: 14px - Body text, subsection headings
- `--fonts-semantic-md`: 16px - Section headings, card/panel titles
- `--fonts-semantic-lg`: 18px - Reserved for component content, not story UI
- `--fonts-semantic-xl`: 20px - Reserved for component content, not story UI

## Avoid Grey Backgrounds

**Never use grey/neutral backgrounds in components** (except buttons which have a grey tone option). Always use semantic background tokens instead of `--color-fill-neutral-*` tokens for component backgrounds.

### When to Use Semantic Background Tokens

- **Base backgrounds**: Use `--semantic-background-base` for default component backgrounds
- **Muted backgrounds**: Use `--semantic-background-muted` for secondary/subtle backgrounds
- **Interactive backgrounds**: Use `--semantic-background-interactive` for hover/active states
- **Raised surfaces**: Use `--semantic-background-raised` for elevated surfaces

### Anti-Patterns

```css
/* ❌ Bad - Using neutral color tokens for backgrounds */
.component {
  background: var(--color-fill-neutral-200);
  background: var(--color-fill-neutral-600);
  background: var(--color-fill-neutral-800);
}

/* ✅ Good - Using semantic background tokens */
.component {
  background: var(--semantic-background-muted);
  background: var(--semantic-background-interactive);
  background: var(--semantic-background-base);
}
```

### Exception

Buttons are an exception - they have a `tone="grey"` option which uses `--semantic-background-grey-*` tokens. This is acceptable as it's a design system feature.

## Component Variants and Specifications

This section documents all component variants, sizes, and specifications from the Storybook component library. Use this as a reference when implementing or updating components.

### Atoms

#### Button

**Hierarchies:**
- **Primary**: Large buttons (lg, 48px height) for primary actions
  - Typography: `var(--fonts-display-sm)` (14px) with `var(--font-weight-medium)` (500)
  - Sizes: `lg` only
  - Tones: `grey`, `black`, `color` (brand)
  - States: `default`, `hover`, `focused`, `disabled`
  
- **Secondary**: Medium buttons (sm: 32px, md: 40px height) for secondary actions
  - Typography: `var(--fonts-semantic-sm)` (12px) or `var(--fonts-semantic-md)` (16px) with `var(--font-weight-medium)` (500)
  - Sizes: `sm`, `md`
  - Tones: `grey`, `black`, `color` (brand)
  - States: `default`, `hover`, `focused`, `disabled`
  
- **Mode**: Specialized buttons for interface mode selection
  - Typography: Varies by size (sm: 12px, md: 16px, lg: 16px) with `var(--font-weight-medium)` (500)
  - Sizes: `sm`, `md`, `lg`
  - Tones: `black` only (enforced)
  - States: `default`, `hover`, `focused`, `disabled`

**Action Buttons (Icon-only):**
- **Function variants**: `feature`, `action`, `table-action`, `borderless`, `close`
- **Sizes**: `sm` (32px), `md` (40px), `lg` (48px)
- **Icon sizes**: 16px (sm), 20px (md), 24px (lg)
- **Group spacing**: 2px gap between grouped buttons
- **Close button**: Always uses "X" icon

**Component-Specific Dimensions:**
- Button heights: `32px` (sm), `40px` (md), `48px` (lg)
- Icon sizes: `16px` (sm), `20px` (md), `24px` (lg)

#### Input

**Sizes:**
- `sm`: 32px height, `var(--fonts-semantic-sm)` (12px)
- `md`: 40px height, `var(--fonts-semantic-md)` (16px)
- `lg`: 48px height, `var(--fonts-semantic-lg)` (18px)

**States:**
- `default`, `error`, `success`, `disabled`

**Features:**
- Leading and trailing icons
- Multiline support (textarea)
- Character count display
- Border radius: `var(--radius-xs)` (4px)

**Component-Specific Dimensions:**
- Input heights: `32px` (sm), `40px` (md), `48px` (lg)

#### Badge

**Variants:**
- `default`: Muted neutral background for admin roles
- `secondary`: Very subtle background with border for user roles

**Typography:**
- Font size: `var(--fonts-semantic-xs)` (12px)
- Font weight: `var(--font-weight-medium)` (500)

#### Avatar

**Features:**
- Circular container
- Supports AvatarFallback for initials
- Token-based sizing

#### Checkbox

**Size:**
- 16px × 16px checkbox
- Checkmark: 3px × 6px (proportional to 12px icon size)

**States:**
- `checked`, `unchecked`, `disabled`

**Typography:**
- Uses `var(--icon-size-xs)` (12px) as reference for checkmark dimensions

#### Radio

**States:**
- `checked`, `unchecked`, `disabled`

**Features:**
- Custom styled radio button
- Full keyboard accessibility
- Focus ring support

#### Switch

**Sizes:**
- `default`: Standard size
- `sm`: Small size

**States:**
- `checked`, `unchecked`, `disabled`

#### Label

**Typography:**
- Font size: `var(--fonts-semantic-sm)` (12px)
- Font weight: `var(--font-weight-medium)` (500)
- Text color: `var(--semantic-text-secondary)`

#### Link

**Variants:**
- `default`, `subtle`, `underline`

**Sizes:**
- `sm`, `md`, `lg`

**States:**
- `default`, `disabled`

#### Textarea

**Sizes:**
- `sm`, `md`, `lg`

**States:**
- `default`, `error`, `success`, `disabled`

**Features:**
- Resize control: `none`, `vertical`, `horizontal`, `both`
- Rows configuration

#### Divider

**Orientations:**
- `horizontal`, `vertical`

#### Tooltip

**Positions:**
- `top`, `bottom`, `left`, `right`

**Features:**
- Delay duration: 200ms (default)
- Hover-based display

#### Spinner

**Sizes:**
- `sm`, `md`, `lg`

**Features:**
- Smooth animation
- ARIA label support (defaults to "Loading")

#### Slider

**Features:**
- Range slider with two thumbs (min and max values)
- Customizable min, max, and step values
- Controlled and uncontrolled modes

**Component-Specific Dimensions:**
- Track height: `var(--spacing-8)` (8px)
- Thumb size: `var(--spacing-16)` (16px)
- Thumb border: `var(--border-width-medium)` (2px)

#### Scrollbar

**Sizes:**
- `thin`: 8px scrollbar
- `medium`: 12px scrollbar

**Orientations:**
- `horizontal`, `vertical`, `both`

**Interactive States:**
- Default: `var(--semantic-border-muted)`
- Hover: `var(--semantic-border-subtle)`
- Active/Drag: `var(--semantic-border-strong)`

### Molecules

#### Dropdown

**Sizes:**
- `sm`: 32px height, `var(--fonts-semantic-sm)` (12px)
- `md`: 40px height, `var(--fonts-semantic-md)` (16px)
- `lg`: 48px height, `var(--fonts-semantic-lg)` (18px)

**States:**
- `default`, `hover`, `focused`, `disabled`, `open`

**Features:**
- Selected option uses `var(--semantic-brand-base)` text color
- Border radius: `var(--radius-xs)` (4px)
- Keyboard navigation: Arrow keys, Enter, Escape

**Component-Specific Dimensions:**
- Dropdown heights: `32px` (sm), `40px` (md), `48px` (lg)

#### Card

**Composition:**
- `CardHeader`: Optional header section
- `CardBody`: Main content area
- `CardFooter`: Optional footer section

**Features:**
- Flexible composition
- Token-based styling
- Semantic structure

#### Panel

**Variants:**
- `default`: Standard panel without inner shadow
- `withInnerShadow`: Panel with brand-colored inner shadow effect

**Features:**
- Padding: `var(--spacing-12)` (12px)
- Border radius: `var(--radius-md)` (8px)
- Inner shadow: `var(--shadow-inner-panel)` when enabled

#### Tabs

**Features:**
- Active tab: `var(--semantic-brand-base)` text and border color
- Inactive tab: `var(--semantic-text-secondary)` text color
- Tab list border: `var(--semantic-border-subtle)`
- Typography: `var(--fonts-semantic-md)` (16px) with `var(--font-weight-medium)` (500)
- Keyboard navigation: Arrow keys, Home/End

#### NavMenu

**States:**
- `expanded`: Full menu with labels
- `collapsed`: Icons only

**Item Variants:**
- `default`: Standard menu item
- `support`: Support menu item
- `settings`: Settings menu item
- `user`: User menu item with avatar/initials and status

**User Variant Features:**
- Avatar support (image or initials)
- Status indicators: `online`, `offline`
- Email display

**Spacing:**
- Container gap: `var(--spacing-style-spacing-4px-1-4px)` (4px between items)
- Item gap: `var(--spacing-12)` (12px between icon and text, 0 when collapsed)
- Item padding: `var(--spacing-8) var(--spacing-12)` (8px vertical, 12px horizontal)
- Border radius: `var(--radius-md)` (8px)

#### FormField

**Features:**
- Composes Label + Input + Error message + Character count
- Error message display
- Help text support
- Character count display

#### SearchBox

**Sizes:**
- `sm`, `md`, `lg` (matches Input sizes)

**Features:**
- Search icon on the left
- Clear button appears when there's text
- Full accessibility support

#### AccordionPane

**Component-Specific Dimensions:**
- Section header height: 44px
- Metric row height: 42px
- Label width: 180px

**Threat Levels:**
- `critical`: Red (`var(--semantic-feedback-error-base)`)
- `high`: Orange (`var(--semantic-feedback-warning-base)`)
- `medium`: Yellow (`var(--semantic-brand-base)`)
- `low`: Grey (`var(--semantic-text-secondary)`)

**Typography:**
- Header: `var(--fonts-semantic-sm)` (14px)
- Section title: `var(--fonts-semantic-sm)` (14px)
- Section count: `var(--fonts-semantic-xs)` (12px)
- Metrics: `var(--fonts-semantic-xs)` (12px)

#### ListPanel

**Component-Specific Dimensions:**
- Entry height: 56px
- Entry padding: `var(--spacing-8)` vertical, `var(--spacing-style-spacing-4px-1-5-6px)` horizontal
- Entry gap: `var(--spacing-4)` between date and content

**Typography:**
- Header: `var(--fonts-semantic-sm)` (14px)
- Header secondary: `var(--fonts-semantic-xs)` (12px)
- Entry date: `var(--fonts-semantic-xxs)` (10px)
- Entry content: `var(--fonts-semantic-xs)` (12px)

#### TabPane

**Component-Specific Dimensions:**
- Tab height: 44px
- Metric row height: 42px
- Label width: 100px

**Typography:**
- Header: `var(--fonts-semantic-sm)` (14px)
- Tabs: `var(--fonts-semantic-xs)` (12px)
- Metrics: `var(--fonts-semantic-xs)` (12px)

**Features:**
- Error states for metrics
- Sticky header
- Horizontal tab navigation

### Organisms

#### Table

**Component-Specific Dimensions:**
- Header row height: 40px
- Body row height: 48px
- Column widths: Various (68px, 120px, 280px, 48px) - component-specific

**Row States:**
- `isEven`: Even row background (`var(--semantic-background-muted)`)
- `isOdd`: Odd row background (`var(--semantic-background-base)`)
- `isSelected`: Selected row background (`var(--semantic-background-interactive)`)
- `hover`: Hover state

**Features:**
- Sticky column support with `sticky` and `stickyOffset` props
- Sortable headers
- Selection support with checkboxes

**Typography:**
- Font size: `var(--fonts-semantic-md)` (16px)
- Font weight: `var(--font-weight-regular)` (400) for body, `var(--font-weight-medium)` (500) for headers

#### Modal

**Component-Specific Dimensions:**
- Width: 1000px maximum (responsive: max-width 100%)
- Height: Fixed 700px
- Padding: 12px internal padding around body content

**Layout Formats:**
- `single`: One full-height pane (default)
- `1+1-vertical`: Two equal-height panes stacked vertically (8px gap)
- `1+1-horizontal`: Two equal-width panes side-by-side (8px gap)
- `2+1`: Left side: two vertical panes, Right side: one full-height pane
- `1+2`: Left side: one full-height pane, Right side: two vertical panes

**Features:**
- Backdrop: `var(--semantic-background-backdrop)` (rgba(0, 0, 0, 0.5))
- Shadow: `var(--shadow-skeuomorphic)`
- Z-index: `var(--z-index-modal)` (1000)
- Focus trap
- ESC key closes modal
- Pane gap: `var(--spacing-8)` (8px)

**Typography:**
- Header: `var(--fonts-display-xs)` (24px)
- Body: `var(--fonts-semantic-md)` (16px)

#### Drawer

**Component-Specific Dimensions:**
- Width: Fixed 430px (not responsive)
- Full height: Extends from top to bottom of viewport

**Features:**
- Inner shadow: Always applied using `var(--shadow-inner-panel)`
- Sticky header and footer
- Tabbed interface: Modules, Geography, Limits, Privacy
- Slide animation from right

**Typography:**
- Header: `var(--fonts-display-xs)` (24px) via Header Secondary component
- Body: `var(--fonts-semantic-md)` (16px)

#### Header

**Hierarchies:**

- **Primary**: Compact navigation elements
  - Typography: `var(--fonts-semantic-sm)` (12px) with `var(--font-weight-medium)` (500)
  - Button size: Small (sm, 32px height)
  - Height: 48px total (32px button + 2×8px padding)
  - Padding: `var(--spacing-8)` (8px)
  - Ideal for: Secondary navigation, section headers, modal sub-headers

- **Secondary**: Prominent navigation elements
  - Typography: `var(--fonts-display-xs)` (24px) with `var(--font-weight-regular)` (400)
  - Button size: Medium (md, 40px height)
  - Height: 72px total (40px button + 2×16px padding)
  - Padding: `var(--spacing-16)` (16px)
  - Ideal for: Main page headers, modal headers, primary navigation

**Action Buttons:**
- `featureCount`: 0-2 feature buttons (brand-colored icons)
- `functionCount`: 0-2 function buttons (neutral icons)
- `close`: Single close button (always "X" icon)
- Maximum 5 buttons total (2 feature + 2 function + 1 close)
- Button spacing: 2px gap between grouped buttons

**Features:**
- Custom right slot support
- Border: `var(--semantic-border-subtle)` (bottom border)
- Background: `var(--semantic-background-base)`

### Templates & Pages

#### DataTable

**Features:**
- Composes Table organism with additional features
- Search and filter support
- Pagination support

#### UserManagementTable

**Features:**
- Composes Table organism
- User-specific columns and actions
- Integration with Drawer for user configuration

## Icon Usage Normalization

This section standardizes icon usage patterns across all components to ensure consistency.

### Icon Library

**ARKEM Design System uses Lucide React exclusively** for all iconography. Lucide provides over 1000+ consistent, beautiful icons.

### Icon Import Patterns

**✅ Preferred: Direct Named Imports**
```tsx
import { Search, X, Mail, Lock, Settings, ArrowRight } from "lucide-react";
```

**✅ Acceptable: Namespace Import (for dynamic resolution)**
```tsx
import * as Lucide from "lucide-react";
// Used in Button component for dynamic icon resolution
const IconComponent = Lucide[iconName] as React.ComponentType<{ strokeWidth?: number }>;
```

**❌ Avoid: Mixed patterns**
- Don't mix direct imports with namespace imports in the same file
- Don't use other icon libraries (Feather, Heroicons, etc.)

### Icon Sizing Standards

**Always use icon size tokens** - Never hardcode icon sizes in JSX or CSS.

**Icon Size Tokens:**
- `--icon-size-xs`: 12px - Extra small icons (rarely used)
- `--icon-size-sm`: 16px - Small icons (sm button/input size)
- `--icon-size-md`: 20px - Medium icons (md button/input size)
- `--icon-size-lg`: 24px - Large icons (lg button/input size)

**Component-Specific Icon Sizing:**

**Buttons:**
- `sm` buttons → `var(--icon-size-sm)` (16px)
- `md` buttons → `var(--icon-size-md)` (20px)
- `lg` buttons → `var(--icon-size-lg)` (24px)
- Handled automatically via CSS: `.arkem-btn[data-size="sm"] .arkem-btn__icon svg`

**Inputs:**
- `sm` inputs → `var(--icon-size-sm)` (16px)
- `md` inputs → `var(--icon-size-md)` (20px)
- `lg` inputs → `var(--icon-size-lg)` (24px)
- Handled automatically via CSS: `.arkem-input-wrapper[data-size="sm"] .arkem-input__icon svg`

**Standalone Icons in Stories/Components:**
- Use size tokens via CSS when possible
- If JSX size prop is needed, use token values: `size={16}`, `size={20}`, `size={24}`
- Never hardcode arbitrary sizes like `size={18}` or `size={22}`

**✅ Good - Using CSS Tokens (Preferred)**
```css
/* Component CSS handles sizing automatically */
.arkem-input-wrapper[data-size="md"] .arkem-input__icon svg {
  width: var(--icon-size-md);
  height: var(--icon-size-md);
}
```

**✅ Good - Using Token Values in JSX (When CSS can't handle it)**
```tsx
// In stories or components where CSS sizing isn't available
<Search size={16} />  // 16px = --icon-size-sm
<Settings size={20} />  // 20px = --icon-size-md
<ArrowRight size={24} />  // 24px = --icon-size-lg
```

**❌ Bad - Hardcoded Sizes**
```tsx
// ❌ Don't hardcode arbitrary sizes
<Search size={18} />
<Settings size={22} />
<ArrowRight size={28} />

// ❌ Don't use non-standard sizes
<Search size={15} />
<Settings size={21} />
```

### Icon Color Standards

**Always use semantic color tokens** - Never hardcode icon colors.

**Icon Color Tokens:**
- `var(--semantic-text-primary)` - Default icon color
- `var(--semantic-text-secondary)` - Secondary/muted icon color
- `var(--semantic-text-muted)` - Very muted icon color
- `var(--semantic-brand-base)` - Brand-colored icons (feature buttons, active states)
- `currentColor` - Inherits from parent (preferred when parent has semantic color)

**✅ Good - Using Semantic Tokens**
```tsx
// Via CSS (preferred)
.icon {
  color: var(--semantic-text-secondary);
}

// Via inline style (when needed)
<Search style={{ color: "var(--semantic-text-secondary)" }} />

// Using currentColor (inherits from parent)
<Search />  // Parent has color: var(--semantic-text-primary)
```

**✅ Good - Using currentColor**
```tsx
// Button icons inherit button text color automatically
<Button trailingIconName="Settings" />
// Icon color is handled by CSS: color: currentColor;
```

**❌ Bad - Hardcoded Colors**
```tsx
// ❌ Don't hardcode hex colors
<Search style={{ color: "#838383" }} />
<Settings color="#E5E5E5" />

// ❌ Don't use primitive color tokens directly
<Search style={{ color: "var(--color-text-secondary)" }} />
// Use semantic tokens instead: var(--semantic-text-secondary)
```

### Icon Prop Patterns

**Component-Specific Patterns:**

**Button Component:**
- **Icon Name Pattern** (Preferred for Button): `leadingIconName`, `trailingIconName` (string)
  ```tsx
  <Button leadingIconName="Search" trailingIconName="ArrowRight" />
  ```
- **ReactNode Pattern** (Fallback): `leadingIcon`, `trailingIcon` (ReactNode)
  ```tsx
  <Button leadingIcon={<Search />} trailingIcon={<ArrowRight />} />
  ```
- **Visibility Flags**: `iconLeading` (boolean), `iconTrailing` (boolean)

**Input Component:**
- **ReactNode Pattern**: `iconLeading`, `iconTrailing` (ReactNode)
  ```tsx
  <Input iconLeading={<Search />} iconTrailing={<X />} />
  ```

**NavMenu Component:**
- **ReactNode Pattern**: `icon` (ReactNode in NavMenuItem)
  ```tsx
  <NavMenu items={[{ id: "home", label: "Home", icon: <Home /> }]} />
  ```

**Standardization Rules:**
1. **Button**: Prefer `iconName` props (string) for consistency and type safety
2. **Input/FormField**: Use ReactNode props (more flexible for custom icons)
3. **Other Components**: Use ReactNode props for flexibility

### Icon Accessibility

**Always include accessibility attributes:**

**✅ Good - Decorative Icons**
```tsx
// Icons that are purely decorative (accompanying text)
<span className="icon-wrapper" aria-hidden="true">
  <Search />
</span>
```

**✅ Good - Icon-Only Buttons**
```tsx
// Icon-only buttons MUST have aria-label
<Button 
  trailingIconName="Settings" 
  showText={false}
  ariaLabel="Settings"
/>
```

**✅ Good - Interactive Icons**
```tsx
// Icons that are interactive
<button aria-label="Clear input">
  <X />
</button>
```

**❌ Bad - Missing Accessibility**
```tsx
// ❌ Icon-only button without aria-label
<Button trailingIconName="Settings" showText={false} />

// ❌ Decorative icon without aria-hidden
<span><Search /></span>
```

### Icon Usage in Stories

**Standard Patterns for Story Files:**

**✅ Good - Icons in Input Stories**
```tsx
<Input 
  iconLeading={<Search />}  // No size prop - CSS handles it
  placeholder="Search..."
/>
```

**✅ Good - Icons in Button Stories**
```tsx
// Use iconName props (preferred)
<Button trailingIconName="ArrowRight" />

// Or ReactNode with proper sizing
<Button trailingIcon={<ArrowRight />} />
```

**✅ Good - Standalone Icons in Stories**
```tsx
// When showing icons standalone, use token values
<div style={{ display: "flex", gap: "var(--spacing-12)" }}>
  <Search size={16} style={{ color: "var(--semantic-text-primary)" }} />
  <Settings size={20} style={{ color: "var(--semantic-text-secondary)" }} />
</div>
```

**❌ Bad - Inconsistent Sizing in Stories**
```tsx
// ❌ Don't mix hardcoded sizes
<Search size={18} />  // Non-standard size
<Settings size={20} />  // Standard size
```

### Icon Stroke Width

**Standard stroke width: 2** (Lucide default)

**✅ Good - Default Stroke Width**
```tsx
// Button component handles this automatically
<Button trailingIconName="Settings" />
// strokeWidth={2} is applied automatically
```

**✅ Good - Explicit Stroke Width (When Needed)**
```tsx
// For standalone icons, use default strokeWidth
<Search strokeWidth={2} />
```

**❌ Bad - Inconsistent Stroke Width**
```tsx
// ❌ Don't use non-standard stroke widths
<Search strokeWidth={1.5} />
<Settings strokeWidth={3} />
```

### Icon Spacing

**Icon-to-Text Spacing:**
- Standard gap: `var(--spacing-12)` (12px) - Used in buttons, nav menus, etc.
- Tight gap: `var(--spacing-8)` (8px) - Used in compact layouts
- No gap: `0` - Used in icon-only buttons or collapsed states

**✅ Good - Using Spacing Tokens**
```tsx
// Button component handles this automatically via CSS
<Button trailingIconName="ArrowRight">Label</Button>
// gap: var(--spacing-style-spacing-4px-2-8px) applied automatically

// In custom layouts
<div style={{ display: "flex", gap: "var(--spacing-12)", alignItems: "center" }}>
  <Search />
  <span>Search</span>
</div>
```

**❌ Bad - Hardcoded Spacing**
```tsx
// ❌ Don't hardcode spacing
<div style={{ display: "flex", gap: "12px" }}>
  <Search />
  <span>Search</span>
</div>
```

### Icon State Colors

**Interactive States:**
- **Default**: `var(--semantic-text-secondary)` or `var(--semantic-text-primary)`
- **Hover**: `var(--semantic-text-hover)` or `var(--semantic-text-primary)`
- **Active/Selected**: `var(--semantic-brand-base)`
- **Disabled**: Reduced opacity (handled by component CSS)
- **Error**: `var(--semantic-feedback-error-base)`
- **Success**: `var(--semantic-feedback-success-base)`

**✅ Good - State-Based Colors**
```css
/* Input icons change color based on state */
.arkem-input-wrapper[data-state="error"] .arkem-input__icon {
  color: var(--semantic-input-icon-error);
}

.arkem-input-wrapper[data-state="success"] .arkem-input__icon--trailing {
  color: var(--semantic-input-icon-success);
}
```

### Icon Normalization Checklist

When implementing or updating components with icons:

- [ ] Icons imported from `lucide-react` only
- [ ] Icon sizes use tokens (`--icon-size-sm/md/lg`) or token values (16/20/24px)
- [ ] Icon colors use semantic tokens (`--semantic-text-*`, `--semantic-brand-base`)
- [ ] No hardcoded icon sizes in JSX (unless using token values)
- [ ] No hardcoded icon colors (use semantic tokens)
- [ ] Accessibility attributes included (`aria-label` for interactive, `aria-hidden` for decorative)
- [ ] Icon spacing uses spacing tokens
- [ ] Stroke width is 2 (default) unless specifically required otherwise
- [ ] Icon props follow component-specific patterns (iconName for Button, ReactNode for Input)

## Questions?

If you're unsure whether a value should be tokenized:
1. Check if it appears in multiple components
2. Check if it represents a design system concept
3. When in doubt, tokenize it - it's easier to remove a token than to add one later



