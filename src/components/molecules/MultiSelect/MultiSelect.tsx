import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import "./MultiSelect.css";

export type MultiSelectOption = {
  /** Option value */
  value: string;
  /** Option display label */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
};

export type MultiSelectProps = {
  /** Size variant of the multi-select */
  size?: "sm" | "md" | "lg";
  /** Array of multi-select options */
  options: MultiSelectOption[];
  /** Selected values (controlled) */
  value?: string[];
  /** Callback function called when selection changes */
  onChange?: (values: string[]) => void;
  /** Placeholder text displayed when no option is selected */
  placeholder?: string;
  /** Whether the multi-select is disabled */
  disabled?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  size = "md",
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  disabled = false,
  className,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const multiSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (multiSelectRef.current && !multiSelectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (optionValue: string) => {
    if (options.find((opt) => opt.value === optionValue)?.disabled) {
      return;
    }
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== optionValue);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange?.([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value));

  const classes = [
    "arkem-multiselect",
    `arkem-multiselect--${size}`,
    disabled && "arkem-multiselect--disabled",
    isOpen && "arkem-multiselect--open",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} ref={multiSelectRef}>
      <button
        type="button"
        className="arkem-multiselect__trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="arkem-multiselect__value-container">
          {selectedOptions.length > 0 ? (
            <div className="arkem-multiselect__tags">
              {selectedOptions.slice(0, 2).map((option) => (
                <span key={option.value} className="arkem-multiselect__tag">
                  <span className="arkem-multiselect__tag-label">{option.label}</span>
                  <button
                    type="button"
                    className="arkem-multiselect__tag-remove"
                    onClick={(e) => handleRemove(option.value, e)}
                    aria-label={`Remove ${option.label}`}
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </span>
              ))}
              {selectedOptions.length > 2 && (
                <span className="arkem-multiselect__tag-count">
                  +{selectedOptions.length - 2}
                </span>
              )}
            </div>
          ) : (
            <span className="arkem-multiselect__value">{placeholder}</span>
          )}
        </div>
        <div className="arkem-multiselect__icons">
          {selectedValues.length > 0 && (
            <button
              type="button"
              className="arkem-multiselect__clear"
              onClick={handleClearAll}
              aria-label="Clear all selections"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
          <ChevronDown
            className={`arkem-multiselect__icon ${isOpen ? "arkem-multiselect__icon--open" : ""}`}
            aria-hidden="true"
          />
        </div>
      </button>
      {isOpen && (
        <div className="arkem-multiselect__menu" role="listbox">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                className={`arkem-multiselect__option ${
                  isSelected ? "arkem-multiselect__option--selected" : ""
                } ${option.disabled ? "arkem-multiselect__option--disabled" : ""}`}
                onClick={() => handleToggle(option.value)}
                disabled={option.disabled}
                role="option"
                aria-selected={isSelected}
              >
                <span className="arkem-multiselect__option-checkbox">
                  {isSelected && "✓"}
                </span>
                <span className="arkem-multiselect__option-label">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

