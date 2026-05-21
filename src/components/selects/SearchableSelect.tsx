import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

export interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    metadata?: Record<string, unknown>;
}

export interface SearchableSelectProps {
    options: SelectOption[];
    value?: string | null;
    onChange: (value: string | null, option?: SelectOption) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    clearable?: boolean;
    highlightSelected?: boolean;
    renderOption?: (option: SelectOption, isSelected: boolean, isHighlighted: boolean) => React.ReactNode;
    renderValue?: (option?: SelectOption) => React.ReactNode;
    onSearch?: (searchTerm: string) => void;
    filterOptions?: (option: SelectOption, searchTerm: string) => boolean;
    maxHeight?: string;
}

const sizeClasses = {
    sm: "py-1.5 text-sm",
    md: "py-2 text-sm",
    lg: "py-2.5 text-base",
};

const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
};

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyMessage = "No options found",
    disabled = false,
    error = false,
    errorMessage,
    className = "",
    size = "md",
    clearable = true,
    highlightSelected = true,
    renderOption,
    renderValue,
    onSearch,
    filterOptions: customFilterOptions,
    maxHeight = "max-h-64",
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Default filter function
    const defaultFilter = (option: SelectOption, term: string) => {
        return option.label.toLowerCase().includes(term.toLowerCase());
    };

    const filterFn = customFilterOptions || defaultFilter;
    
    const filteredOptions = searchTerm
        ? options.filter(option => filterFn(option, searchTerm))
        : options;

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm("");
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSelect = (option: SelectOption) => {
        if (option.disabled) return;
        
        if (option.value === value) {
            // If same option is selected, clear it
            onChange(null, undefined);
        } else {
            onChange(option.value, option);
        }
        
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        
        if (onSearch) {
            onSearch("");
        }
    };

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex(prev => 
                        prev < filteredOptions.length - 1 ? prev + 1 : prev
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                    break;
                case "Enter":
                    e.preventDefault();
                    if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                        handleSelect(filteredOptions[highlightedIndex]);
                    }
                    break;
                case "Escape":
                    setIsOpen(false);
                    setSearchTerm("");
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, highlightedIndex, filteredOptions]);

    // Scroll highlighted option into view
    useEffect(() => {
        if (optionsRef.current && highlightedIndex >= 0) {
            const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        }
    }, [highlightedIndex]);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null, undefined);
        setIsOpen(false);
    };

    const defaultRenderOption = (option: SelectOption, isSelected: boolean, isHighlighted: boolean) => (
        <div className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
            isSelected && highlightSelected
                ? "bg-background border-muted-card"
                : isHighlighted
                ? "bg-background border-muted-card"
                : "hover:bg-card/50"
        } ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span className="flex-1 text-sm">{option.label}</span>
            {isSelected && <Check className={`shrink-0 text-primary ${iconSizeClasses[size]}`} />}
        </div>
    );

    const defaultRenderValue = (option?: SelectOption) => (
        <div className="flex items-center gap-2">
            {option?.icon && <span>{option.icon}</span>}
            <span className="text-sm">{option?.label || placeholder}</span>
        </div>
    );

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Select Trigger */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    relative w-full bg-background border rounded-lg cursor-pointer
                    transition-all duration-200
                    ${disabled ? "opacity-50 cursor-not-allowed bg-card/45" : "hover:border-card"}
                    ${error ? "border-red-500" : isOpen ? "border-primary ring-2 ring-primary/20" : "border-muted-card"}
                `}
            >
                <div className={`flex items-center justify-between px-3 ${sizeClasses[size]}`}>
                    <div className="flex-1 truncate">
                        {renderValue ? renderValue(selectedOption) : defaultRenderValue(selectedOption)}
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                        {clearable && value && !disabled && (
                            <button
                                onClick={handleClear}
                                className="p-0.5 hover:bg-card/50 rounded transition-colors"
                                type="button"
                            >
                                <X className={`${iconSizeClasses[size]} text-muted-foreground hover:text-foreground`} />
                            </button>
                        )}
                        <ChevronDown className={`${iconSizeClasses[size]} text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`} />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && errorMessage && (
                <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
            )}

            {/* Dropdown */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-muted-card rounded-lg shadow-lg overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-muted-card">
                        <div className="relative">
                            <Search className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground ${iconSizeClasses[size]}`} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setHighlightedIndex(-1);
                                    if (onSearch) onSearch(e.target.value);
                                }}
                                placeholder={searchPlaceholder}
                                className={`
                                    w-full pl-8 pr-3 bg-background border border-muted-card rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                    ${sizeClasses[size]}
                                `}
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div 
                        ref={optionsRef}
                        className={`overflow-y-auto ${maxHeight}`}
                    >
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                {emptyMessage}
                            </div>
                        ) : (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={option.disabled ? "cursor-not-allowed" : "hover:bg-background"}
                                >
                                    {renderOption
                                        ? renderOption(option, option.value === value, index === highlightedIndex)
                                        : defaultRenderOption(option, option.value === value, index === highlightedIndex)
                                    }
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}