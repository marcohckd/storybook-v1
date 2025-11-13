import React, { useState, useMemo, useEffect } from "react";

import { Label } from "../../../atoms/Label/Label";
import { MultiSelect } from "../../../molecules/MultiSelect/MultiSelect";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../Table";
import { Button } from "../../../atoms/Button/Button";

export type GeographyRow = {
  id: string;
  country: string;
  region: string;
  accessType: "Read" | "Write" | "Restricted";
  updatedAt: string;
};

export interface GeographyTabProps {
  /** Initial geography data rows */
  initialData?: GeographyRow[];
  /** Currently selected row IDs */
  selectedRows?: string[];
  /** Callback function called when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Callback function called when a row is removed */
  onRowRemove?: (rowId: string) => void;
}

const MOCK_GEO: GeographyRow[] = [
  { id: "na-1", country: "United States", region: "North America", accessType: "Read", updatedAt: "2025-10-01" },
  { id: "na-2", country: "Canada", region: "North America", accessType: "Write", updatedAt: "2025-10-02" },
  { id: "eu-1", country: "Portugal", region: "Western Europe", accessType: "Write", updatedAt: "2025-10-03" },
  { id: "eu-2", country: "Germany", region: "Central Europe", accessType: "Read", updatedAt: "2025-10-04" },
  { id: "eu-3", country: "France", region: "Western Europe", accessType: "Restricted", updatedAt: "2025-10-05" },
  { id: "eu-4", country: "United Kingdom", region: "Western Europe", accessType: "Write", updatedAt: "2025-10-06" },
  { id: "apac-1", country: "Japan", region: "East Asia", accessType: "Restricted", updatedAt: "2025-10-05" },
  { id: "apac-2", country: "Australia", region: "Oceania", accessType: "Read", updatedAt: "2025-10-07" },
  { id: "apac-3", country: "Singapore", region: "Southeast Asia", accessType: "Write", updatedAt: "2025-10-08" },
  { id: "sa-1", country: "Brazil", region: "South America", accessType: "Read", updatedAt: "2025-10-09" },
];

export const GeographyTab: React.FC<GeographyTabProps> = ({
  initialData,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  onRowRemove,
}) => {
  // Use MOCK_GEO if initialData is not provided or is empty
  const baseData = initialData && initialData.length > 0 ? initialData : MOCK_GEO;
  const [data, setData] = useState<GeographyRow[]>(baseData);
  
  const [internalSelected, setInternalSelected] = useState<Record<string, boolean>>({});
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Update data when initialData changes
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    } else {
      setData(MOCK_GEO);
    }
  }, [initialData]);

  const isControlled = controlledSelectedRows !== undefined;
  const selectedRows = isControlled
    ? controlledSelectedRows.reduce((acc, id) => ({ ...acc, [id]: true }), {} as Record<string, boolean>)
    : internalSelected;

  const countries = useMemo(() => Array.from(new Set(data.map((r) => r.country))).sort(), [data]);
  const filteredRows = useMemo(
    () => {
      if (selectedCountries.length === 0) {
        return data;
      }
      return data.filter((r) => selectedCountries.includes(r.country));
    },
    [data, selectedCountries]
  );

  const handleRemoveRow = (rowId: string) => {
    setData((prev) => prev.filter((row) => row.id !== rowId));
    onRowRemove?.(rowId);
  };

  const countryOptions = countries.map((c) => ({ value: c, label: c }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-12, 12px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-12, 12px)" }}>
        <Label htmlFor="country-selector" style={{ fontSize: "var(--fonts-semantic-md)" }}>
          Country
        </Label>
        <MultiSelect
          id="country-selector"
          options={countryOptions}
          value={selectedCountries}
          onChange={setSelectedCountries}
          size="md"
          placeholder="Select countries..."
          ariaLabel="Select countries to display in table"
        />
      </div>

      <div
        style={{
          borderRadius: "var(--radius-md)",
          border: "var(--border-width-thin, 1px) solid var(--semantic-border-subtle)",
          overflow: "hidden",
        }}
      >
        <Table ariaLabel="Geography access table" size="xs">
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead style={{ whiteSpace: "nowrap" }}>Last Updated</TableHead>
              <TableHead style={{ width: "60px", textAlign: "center" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow
                key={row.id}
                isEven={index % 2 === 0}
                isSelected={Boolean(selectedRows[row.id])}
              >
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    {row.country}
                  </div>
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>{row.updatedAt}</TableCell>
                <TableCell style={{ width: "60px", textAlign: "center" }}>
                  <Button
                    size="sm"
                    hierarchy="secondary"
                    tone="grey"
                    function="table-action"
                    leadingIconName="Trash2"
                    iconLeading={true}
                    showText={false}
                    onClick={() => handleRemoveRow(row.id)}
                    ariaLabel={`Remove ${row.country}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

