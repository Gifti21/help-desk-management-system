/**
 * Standardized Spacing System
 * Use these consistent spacing values across all components
 */

export const spacing = {
    // Base spacing unit (4px)
    unit: 4,

    // Common spacing values
    xs: '4px',      // 4px
    sm: '8px',      // 8px
    md: '12px',     // 12px
    base: '16px',   // 16px (default)
    lg: '20px',     // 20px
    xl: '24px',     // 24px
    '2xl': '32px',  // 32px
    '3xl': '40px',  // 40px
    '4xl': '48px',  // 48px

    // Page layout spacing
    page: {
        padding: '24px',           // Standard page padding
        paddingMobile: '16px',     // Page padding on mobile
        gap: '24px',               // Gap between sections
        gapMobile: '16px',         // Gap on mobile
    },

    // Card spacing
    card: {
        padding: '24px',           // Standard card padding
        paddingCompact: '16px',    // Compact card padding
        gap: '16px',               // Gap between card elements
        gapSmall: '12px',          // Small gap within cards
    },

    // Form spacing
    form: {
        fieldGap: '16px',          // Gap between form fields
        labelMargin: '8px',        // Margin below labels
        sectionGap: '24px',        // Gap between form sections
    },

    // Table spacing
    table: {
        cellPadding: '12px 16px',  // Table cell padding
        headerPadding: '12px 16px', // Table header padding
        rowGap: '0px',             // Gap between rows (use border instead)
    },

    // Search bar spacing
    searchBar: {
        padding: '12px 16px',      // Search input padding
        gap: '12px',               // Gap between search elements
    },

    // Button spacing
    button: {
        paddingSm: '8px 12px',     // Small button
        paddingMd: '10px 16px',    // Medium button
        paddingLg: '12px 20px',    // Large button
        gap: '8px',                // Gap between buttons
    },

    // Modal spacing
    modal: {
        padding: '24px',           // Modal content padding
        headerPadding: '24px',     // Modal header padding
        footerPadding: '24px',     // Modal footer padding
        gap: '16px',               // Gap between modal sections
    },
} as const;

// Helper function to get spacing value
export function getSpacing(value: keyof typeof spacing | string): string {
    if (value in spacing) {
        return spacing[value as keyof typeof spacing] as string;
    }
    return value;
}
