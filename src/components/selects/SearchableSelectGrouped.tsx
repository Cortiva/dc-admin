import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

export interface GroupedSelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    group?: string;
    metadata?: Record<string, unknown>;
}

export interface GroupConfig {
    label: string;
    options: GroupedSelectOption[];
}

export interface SearchableSelectGroupedProps {
    options: GroupedSelectOption[] | GroupConfig[];
    value?: string | null;
    onChange: (value: string | null, option?: GroupedSelectOption) => void;
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
    highlightColor?: string;
    groupBy?: (option: GroupedSelectOption) => string;
    renderOption?: (option: GroupedSelectOption, isSelected: boolean, isHighlighted: boolean) => React.ReactNode;
    renderGroupHeader?: (groupName: string) => React.ReactNode;
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

export function SearchableSelectGrouped({
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
    highlightColor = "bg-primary-50 border-primary-200",
    groupBy,
    renderOption,
    renderGroupHeader,
    maxHeight = "max-h-64",
}: SearchableSelectGroupedProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    // Normalize options to grouped format
    const normalizedGroups = (): GroupConfig[] => {
        if (options.length === 0) return [];

        // Check if options are already grouped
        if ('options' in options[0]) {
            return options as GroupConfig[];
        }

        // Group by the provided function
        if (groupBy) {
            const groupedMap = new Map<string, GroupedSelectOption[]>();
            (options as GroupedSelectOption[]).forEach(option => {
                const group = groupBy(option);
                if (!groupedMap.has(group)) {
                    groupedMap.set(group, []);
                }
                groupedMap.get(group)!.push(option);
            });
            
            return Array.from(groupedMap.entries()).map(([label, opts]) => ({
                label,
                options: opts,
            }));
        }

        // Default: single group
        return [{ label: "Options", options: options as GroupedSelectOption[] }];
    };

    const groups = normalizedGroups();
    const selectedOption = groups
        .flatMap(g => g.options)
        .find(opt => opt.value === value);

    // Flatten options for filtering and navigation
    // const flatOptions = groups.flatMap(g => g.options);
    
    const filteredGroups = searchTerm
        ? groups
            .map(group => ({
                ...group,
                options: group.options.filter(option =>
                    option.label.toLowerCase().includes(searchTerm.toLowerCase())
                ),
            }))
            .filter(group => group.options.length > 0)
        : groups;

    const filteredFlatOptions = filteredGroups.flatMap(g => g.options);

    // Handle click outside
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

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex(prev => 
                        prev < filteredFlatOptions.length - 1 ? prev + 1 : prev
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                    break;
                case "Enter":
                    e.preventDefault();
                    if (highlightedIndex >= 0 && filteredFlatOptions[highlightedIndex]) {
                        handleSelect(filteredFlatOptions[highlightedIndex]);
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
    }, [isOpen, highlightedIndex, filteredFlatOptions]);

    const handleSelect = (option: GroupedSelectOption) => {
        if (option.disabled) return;
        
        if (option.value === value) {
            onChange(null, undefined);
        } else {
            onChange(option.value, option);
        }
        
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null, undefined);
        setIsOpen(false);
    };

    const defaultRenderOption = (option: GroupedSelectOption, isSelected: boolean, isHighlighted: boolean) => (
        <div className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
            isSelected && highlightSelected
                ? highlightColor
                : isHighlighted
                ? "bg-card"
                : "hover:bg-card/50"
        } ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span className="flex-1 text-sm">{option.label}</span>
            {isSelected && <Check className={`shrink-0 text-primary ${iconSizeClasses[size]}`} />}
        </div>
    );

    const defaultRenderGroupHeader = (groupName: string) => (
        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted-card border-b border-muted-card">
            {groupName}
        </div>
    );

    const defaultRenderValue = () => (
        <div className="flex items-center gap-2">
            {selectedOption?.icon && <span>{selectedOption.icon}</span>}
            <span className="text-sm">{selectedOption?.label || placeholder}</span>
        </div>
    );

    let currentIndex = -1;

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Select Trigger */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    relative w-full bg-background border rounded-lg cursor-pointer
                    transition-all duration-200
                    ${disabled ? "opacity-50 cursor-not-allowed bg-muted-card" : "hover:border-muted-card"}
                    ${error ? "border-red-500" : isOpen ? "border-primary ring-2 ring-primary/20" : "border-muted-card"}
                `}
            >
                <div className={`flex items-center justify-between px-3 ${sizeClasses[size]}`}>
                    <div className="flex-1 truncate">
                        {defaultRenderValue()}
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                        {clearable && value && !disabled && (
                            <button
                                onClick={handleClear}
                                className="p-0.5 hover:bg-muted-card rounded transition-colors"
                                type="button"
                            >
                                <X className={`${iconSizeClasses[size]} text-muted-foreground hover:text-muted-foreground`} />
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
                    <div className="p-2 border-b border-muted-card sticky top-0 bg-card z-10">
                        <div className="relative">
                            <Search className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground ${iconSizeClasses[size]}`} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setHighlightedIndex(-1);
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
                        {filteredGroups.length === 0 ? (
                            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                {emptyMessage}
                            </div>
                        ) : (
                            filteredGroups.map((group, groupIndex) => (
                                <div key={groupIndex}>
                                    {renderGroupHeader 
                                        ? renderGroupHeader(group.label)
                                        : defaultRenderGroupHeader(group.label)
                                    }
                                    {group.options.map((option) => {
                                        currentIndex++;
                                        const isHighlighted = currentIndex === highlightedIndex;
                                        const isSelected = option.value === value;
                                        
                                        return (
                                            <div
                                                key={option.value}
                                                onClick={() => handleSelect(option)}
                                                onMouseEnter={() => setHighlightedIndex(currentIndex)}
                                                className={option.disabled ? "cursor-not-allowed" : ""}
                                            >
                                                {renderOption
                                                    ? renderOption(option, isSelected, isHighlighted)
                                                    : defaultRenderOption(option, isSelected, isHighlighted)
                                                }
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}