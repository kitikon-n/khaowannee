import React, { useState, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Custom Date Input component that displays and accepts dd/mm/yyyy format
 */
export function DateInput({ value, onChange, className, error, disabled, ...props }) {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef(null);

  // Convert yyyy-mm-dd to dd/mm/yyyy for display
  const formatToDisplay = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  // Convert dd/mm/yyyy to yyyy-mm-dd for value
  const formatToISO = (ddmmyyyy) => {
    if (!ddmmyyyy) return '';
    const cleaned = ddmmyyyy.replace(/\D/g, '');
    if (cleaned.length !== 8) return '';

    const day = cleaned.substring(0, 2);
    const month = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);

    return `${year}-${month}-${day}`;
  };

  // Initialize display value from prop
  React.useEffect(() => {
    setDisplayValue(formatToDisplay(value));
  }, [value]);

  const handleChange = (e) => {
    let input = e.target.value.replace(/\D/g, ''); // Remove non-digits

    // Limit to 8 digits (ddmmyyyy)
    if (input.length > 8) {
      input = input.substring(0, 8);
    }

    // Format as user types
    let formatted = '';
    if (input.length > 0) {
      formatted = input.substring(0, 2); // dd
      if (input.length >= 3) {
        formatted += '/' + input.substring(2, 4); // /mm
      }
      if (input.length >= 5) {
        formatted += '/' + input.substring(4, 8); // /yyyy
      }
    }

    setDisplayValue(formatted);

    // Only call onChange when we have complete date (8 digits)
    if (input.length === 8) {
      const day = parseInt(input.substring(0, 2));
      const month = parseInt(input.substring(2, 4));
      const year = parseInt(input.substring(4, 8));

      // Validate date
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900) {
        const isoDate = formatToISO(formatted);
        onChange({ target: { value: isoDate, name: props.name } });
      }
    } else if (input.length === 0) {
      // Clear value
      onChange({ target: { value: '', name: props.name } });
    }
  };

  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    // Validate on blur
    const cleaned = displayValue.replace(/\D/g, '');
    if (cleaned.length > 0 && cleaned.length !== 8) {
      // Invalid date format - clear it
      setDisplayValue('');
      onChange({ target: { value: '', name: props.name } });
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="dd/mm/yyyy"
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 dark:text-stone-400 pointer-events-none" />
    </div>
  );
}
