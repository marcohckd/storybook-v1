import React, { useState } from "react";
import { Input } from "../../atoms/Input/Input";
import { Search, X } from "lucide-react";
import "./SearchBox.css";

export type SearchBoxProps = {
  /** Current value of the search box (controlled) */
  value?: string;
  /** Callback function called when the value changes */
  onChange?: (value: string) => void;
  /** Placeholder text displayed when search box is empty */
  placeholder?: string;
  /** Whether the search box is disabled */
  disabled?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Size variant of the search box */
  size?: "sm" | "md" | "lg";
  /** Callback function called when the clear button is clicked */
  onClear?: () => void;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "size" | "type"
>;

export const SearchBox: React.FC<SearchBoxProps> = ({
  value: controlledValue,
  onChange,
  placeholder = "Search...",
  disabled = false,
  className,
  size = "md",
  onClear,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleClear = () => {
    if (isControlled) {
      onChange?.("");
      onClear?.();
    } else {
      setInternalValue("");
      onChange?.("");
      onClear?.();
    }
  };

  // Filter out any conflicting props that might be in rest
  const {
    value: _value,
    onChange: _onChange,
    size: _size,
    type: _type,
    ...inputProps
  } = rest as React.InputHTMLAttributes<HTMLInputElement>;

  return (
    <div className={`arkem-searchbox ${className || ""}`}>
      <Input
        {...({
          type: "search",
          value: value || "",
          onChange: handleChange,
          placeholder,
          disabled,
          size,
          iconLeading: <Search size={20} aria-hidden="true" />,
          iconTrailing: value ? (
            <button
              onClick={handleClear}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
              aria-label="Clear search"
              type="button"
            >
              <X aria-hidden="true" />
            </button>
          ) : undefined,
          ariaLabel: placeholder,
          ...inputProps,
        } as React.ComponentProps<typeof Input>)}
      />
    </div>
  );
};

