import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Check,
  ArrowUpDown,
  Pencil,
  ArrowLeft,
  Brain,
} from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../organisms/Table";
import { Badge } from "../../atoms/Badge";
import { Avatar, AvatarFallback } from "../../atoms/Avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../atoms/Tooltip";
import { Header } from "../../organisms/Header/Header";
import { SearchBox } from "../../molecules/SearchBox/SearchBox";
import { Dropdown } from "../../molecules/Dropdown/Dropdown";
import "./UserManagementTable.css";

export interface User {
  id: string;
  name: string;
  role: "admin" | "user";
  modules: string[];
  recordLimit: number;
  timeWindowDays: number;
  maskShodan: boolean;
  hashIdentifiers: boolean;
  aiAssistant: boolean;
}

export interface Module {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface UserManagementTableProps {
  /** Array of user data to display */
  users: User[];
  /** Array of available modules */
  modules: Module[];
  /** Callback function called when a user is edited */
  onUserEdit?: (user: User) => void;
  /** Callback function called for bulk updates */
  onBulkUpdate?: (userIds: string[]) => void;
  /** Callback function called for bulk activation */
  onBulkActivate?: (userIds: string[]) => void;
  /** Callback function called for bulk export */
  onBulkExport?: (userIds: string[]) => void;
  /** Callback function called when back button is clicked */
  onBack?: () => void;
  /** Callback function called when close button is clicked */
  onClose?: () => void;
  /** Header label text */
  headerLabel?: string;
  /** Callback function called when search query changes */
  onSearchChange?: (query: string) => void;
  /** Callback function called when role filter changes */
  onRoleFilterChange?: (role: string) => void;
  /** Number of items per page */
  pageSize?: number;
  /** Additional CSS class name */
  className?: string;
}

type SortColumn = "name" | "role" | null;
type SortDirection = "asc" | "desc";

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  modules,
  onUserEdit,
  onBulkUpdate,
  onBulkActivate,
  onBulkExport,
  onBack,
  onClose,
  headerLabel = "User Management",
  onSearchChange,
  onRoleFilterChange,
  pageSize = 10,
  className,
}) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Filtered users based on search and role filter
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(query)
      );
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    return filtered;
  }, [users, searchQuery, roleFilter]);

  // Sorted users
  const sortedUsers = useMemo(() => {
    if (!sortColumn) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (sortColumn === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortColumn === "role") {
        aValue = a.role;
        bValue = b.role;
      } else {
        return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortColumn, sortDirection]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedUsers.slice(startIndex, endIndex);
  }, [sortedUsers, currentPage, pageSize]);

  // Toggle sort
  const toggleSort = useCallback((column: "name" | "role") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }, [sortColumn, sortDirection]);


  // Check if user has module access
  const hasModule = useCallback((user: User, moduleId: string) => {
    return user.modules.includes(moduleId);
  }, []);

  // Total pages
  const totalPages = Math.ceil(sortedUsers.length / pageSize);

  // Reset to page 1 when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [sortedUsers.length, totalPages, currentPage]);

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
    onSearchChange?.(value);
  }, [onSearchChange]);

  // Handle role filter change
  const handleRoleFilterChange = useCallback((value: string) => {
    setRoleFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
    onRoleFilterChange?.(value);
  }, [onRoleFilterChange]);

  // Role filter options
  const roleFilterOptions = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  return (
    <div className={`arkem-user-table ${className || ""}`}>
      {/* Secondary Header */}
      <div className="arkem-user-table__header-wrapper">
        {onBack && (
          <div className="arkem-user-table__back-button">
            <Button
              size="md"
              hierarchy="secondary"
              tone="black"
              function="borderless"
              leadingIconName="ArrowLeft"
              showText={false}
              iconLeading={true}
              iconTrailing={false}
              onClick={onBack}
              ariaLabel="Back"
            />
          </div>
        )}
        <Header
          hierarchy="secondary"
          label={headerLabel}
          rightSlot={
            <div className="arkem-user-table__header-actions">
              <div className="arkem-user-table__header-search">
                <SearchBox
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search users..."
                  size="md"
                />
              </div>
              <div className="arkem-user-table__header-filter">
                <Dropdown
                  size="md"
                  options={roleFilterOptions}
                  value={roleFilter}
                  onChange={handleRoleFilterChange}
                  placeholder="All Roles"
                  ariaLabel="Filter by role"
                />
              </div>
              {onClose && (
                <Button
                  size="md"
                  hierarchy="secondary"
                  tone="black"
                  function="close"
                  iconTrailing={true}
                  trailingIconName="X"
                  showText={false}
                  iconLeading={false}
                  onClick={onClose}
                  ariaLabel="Close"
                />
              )}
            </div>
          }
        />
      </div>

      {/* Table */}
      <div className="arkem-user-table__container">
        <Table ariaLabel="User Management Table">
          <TableHeader>
            {/* Group Header Row */}
            <TableRow isEven={false}>
              <TableHead
                colSpan={2}
                className="arkem-table__head--group-header arkem-table__head--divider-subtle"
                style={{
                  textAlign: "center",
                  fontSize: "var(--fonts-semantic-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  letterSpacing: "var(--letter-spacing-tight)",
                  padding: "var(--spacing-12) var(--spacing-style-spacing-4px-4-16px)",
                  textTransform: "uppercase",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                USERS
              </TableHead>
              <TableHead
                colSpan={modules.length + 1}
                className="arkem-table__head--group-header arkem-table__head--divider-subtle"
                style={{
                  textAlign: "center",
                  fontSize: "var(--fonts-semantic-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  letterSpacing: "var(--letter-spacing-tight)",
                  padding: "var(--spacing-12) var(--spacing-style-spacing-4px-4-16px)",
                  textTransform: "uppercase",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                MODULE ACCESS
              </TableHead>
              <TableHead
                colSpan={4}
                className="arkem-table__head--group-header arkem-table__head--divider-subtle"
                style={{
                  textAlign: "center",
                  fontSize: "var(--fonts-semantic-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  letterSpacing: "var(--letter-spacing-tight)",
                  padding: "var(--spacing-12) var(--spacing-style-spacing-4px-4-16px)",
                  textTransform: "uppercase",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                DATA ACCESS
              </TableHead>
              <TableHead
                sticky
                stickyRight
                rowSpan={2}
                className="arkem-table__head--group-header"
                style={{
                  width: "64px",
                  textAlign: "center",
                  fontSize: "var(--fonts-semantic-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  letterSpacing: "var(--letter-spacing-tight)",
                  padding: "var(--spacing-12) var(--spacing-style-spacing-4px-4-16px)",
                  textTransform: "uppercase",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                ACTIONS
              </TableHead>
            </TableRow>
            <TableRow isEven={false}>
              <TableHead
                sortable
                onClick={() => toggleSort("name")}
                className="arkem-table__head--subheader arkem-table__head--divider-muted"
                style={{
                  width: "calc(var(--component-table-sticky-column-width) * 1.5)",
                  fontSize: "var(--fonts-semantic-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  letterSpacing: "var(--letter-spacing-tight)",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                <div className="arkem-user-table__sort-header">
                  User
                  <ArrowUpDown className="arkem-user-table__sort-icon" />
                </div>
              </TableHead>
              <TableHead
                sortable
                onClick={() => toggleSort("role")}
                className="arkem-table__head--subheader arkem-table__head--divider-subtle"
                style={{
                  width: "calc(var(--component-table-module-column-width) * 1.5)",
                  textAlign: "center",
                  fontSize: "var(--fonts-semantic-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  letterSpacing: "var(--letter-spacing-tight)",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                <div className="arkem-user-table__sort-header" style={{ justifyContent: "center" }}>
                  Role
                  <ArrowUpDown className="arkem-user-table__sort-icon" />
                </div>
              </TableHead>
              {modules.map((module, moduleIndex) => {
                const IconComponent = module.icon;
                return (
                  <TableHead
                    key={module.id}
                    className="arkem-table__head--subheader arkem-table__head--divider-muted"
                    style={{
                      textAlign: "center",
                      width: "var(--component-table-module-column-width)",
                      padding: "var(--spacing-style-spacing-4px-4-16px)",
                      color: "var(--semantic-text-secondary)",
                    }}
                  >
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <div className="arkem-user-table__module-icon">
                          <IconComponent className="arkem-user-table__module-icon-svg" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={4}>
                        {module.name}
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                );
              })}
              <TableHead
                className="arkem-table__head--subheader arkem-table__head--divider-subtle"
                style={{
                  textAlign: "center",
                  width: "var(--component-table-module-column-width)",
                  padding: "var(--spacing-style-spacing-4px-4-16px)",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <div className="arkem-user-table__module-icon">
                      <Brain className="arkem-user-table__module-icon-svg" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={4}>
                    Arkimedes
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead
                className="arkem-table__head--subheader arkem-table__head--divider-muted"
                style={{
                  textAlign: "center",
                  minWidth: "var(--component-table-data-column-width)",
                  padding: "var(--spacing-style-spacing-4px-4-16px)",
                  fontSize: "var(--fonts-semantic-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                Record Limit
              </TableHead>
              <TableHead
                className="arkem-table__head--subheader arkem-table__head--divider-muted"
                style={{
                  textAlign: "center",
                  minWidth: "var(--component-table-data-column-width)",
                  padding: "var(--spacing-style-spacing-4px-4-16px)",
                  fontSize: "var(--fonts-semantic-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                Time Window
              </TableHead>
              <TableHead
                className="arkem-table__head--subheader arkem-table__head--divider-muted"
                style={{
                  textAlign: "center",
                  minWidth: "var(--component-table-data-column-width)",
                  padding: "var(--spacing-style-spacing-4px-4-16px)",
                  fontSize: "var(--fonts-semantic-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                Mask Shodan
              </TableHead>
              <TableHead
                className="arkem-table__head--subheader arkem-table__head--divider-muted"
                style={{
                  textAlign: "center",
                  minWidth: "var(--component-table-data-column-width)",
                  padding: "var(--spacing-style-spacing-4px-4-16px)",
                  fontSize: "var(--fonts-semantic-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--semantic-text-secondary)",
                }}
              >
                Hash Identifiers
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user, index) => {
              const isEven = index % 2 === 0;
              return (
                <TableRow
                  key={user.id}
                  isEven={isEven}
                  style={{ height: "var(--component-table-body-row-height)" }}
                >
                  <TableCell
                    className="arkem-table__cell--divider-muted"
                    style={{
                      width: "calc(var(--component-table-sticky-column-width) * 1.5)",
                      fontSize: "var(--fonts-semantic-md)",
                      padding: "var(--spacing-12)",
                    }}
                  >
                    <div className="arkem-user-table__user-cell">
                      <Avatar>
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span style={{ color: "var(--semantic-text-primary)" }}>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell 
                    className="arkem-table__cell--divider-subtle arkem-user-table__role-cell" 
                    style={{ 
                      width: "calc(var(--component-table-module-column-width) * 1.5)",
                      textAlign: "center", 
                      fontSize: "var(--fonts-semantic-md)", 
                      padding: "var(--spacing-12)",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      style={{ 
                        fontWeight: "var(--font-weight-medium)",
                        maxWidth: "100%",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  {modules.map((module) => {
                    return (
                      <TableCell
                        key={module.id}
                        className="arkem-table__cell--divider-muted"
                        style={{
                          textAlign: "center",
                          padding: "var(--spacing-12)",
                        }}
                      >
                      {hasModule(user, module.id) ? (
                        <div className="arkem-user-table__check-icon">
                          <Check className="arkem-user-table__check-icon-svg" />
                        </div>
                      ) : (
                        <div className="arkem-user-table__check-icon">
                          <Check className="arkem-user-table__check-icon-svg--inactive" />
                        </div>
                      )}
                    </TableCell>
                  );
                  })}
                  <TableCell
                    className="arkem-table__cell--divider-subtle"
                    style={{
                      textAlign: "center",
                      padding: "var(--spacing-12)",
                    }}
                  >
                    {user.aiAssistant ? (
                      <div className="arkem-user-table__check-icon">
                        <Check className="arkem-user-table__check-icon-svg" />
                      </div>
                    ) : (
                      <div className="arkem-user-table__check-icon">
                        <Check className="arkem-user-table__check-icon-svg--inactive" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell
                    className="arkem-table__cell--divider-muted"
                    style={{
                      textAlign: "center",
                      fontSize: "var(--fonts-semantic-md)",
                      padding: "var(--spacing-12)",
                      color: "var(--semantic-text-subtle)",
                    }}
                  >
                    {user.recordLimit}
                  </TableCell>
                  <TableCell
                    className="arkem-table__cell--divider-muted"
                    style={{
                      textAlign: "center",
                      fontSize: "var(--fonts-semantic-md)",
                      padding: "var(--spacing-12)",
                      color: "var(--semantic-text-subtle)",
                    }}
                  >
                    {user.timeWindowDays}
                  </TableCell>
                  <TableCell className="arkem-table__cell--divider-muted" style={{ textAlign: "center", padding: "var(--spacing-12)" }}>
                    {user.maskShodan ? (
                      <div className="arkem-user-table__check-icon">
                        <Check className="arkem-user-table__check-icon-svg" />
                      </div>
                    ) : (
                      <div className="arkem-user-table__check-icon">
                        <Check className="arkem-user-table__check-icon-svg--inactive" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="arkem-table__cell--divider-muted" style={{ textAlign: "center", padding: "var(--spacing-12)" }}>
                    {user.hashIdentifiers ? (
                      <div className="arkem-user-table__check-icon">
                        <Check className="arkem-user-table__check-icon-svg" />
                      </div>
                    ) : (
                      <div className="arkem-user-table__check-icon">
                        <Check className="arkem-user-table__check-icon-svg--inactive" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell
                    sticky
                    stickyRight
                    style={{ textAlign: "center", padding: "var(--spacing-12)" }}
                  >
                    <Button
                      size="sm"
                      hierarchy="secondary"
                      tone="black"
                      function="borderless"
                      trailingIconName="Pencil"
                      showText={false}
                      iconTrailing={true}
                      iconLeading={false}
                      onClick={() => onUserEdit?.(user)}
                      ariaLabel={`Edit ${user.name}`}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="arkem-user-table__empty">
          No users found matching the current filters.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="arkem-user-table__pagination">
          <Button
            size="sm"
            hierarchy="secondary"
            tone="black"
            function="borderless"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            ariaLabel="Previous page"
          >
            Previous
          </Button>
          <span className="arkem-user-table__pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            hierarchy="secondary"
            tone="black"
            function="borderless"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            ariaLabel="Next page"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

