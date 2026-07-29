// Script to update all admin pages with proper design system colors and fonts
const fs = require('fs');
const path = require('path');

const adminPages = [
    'app/admin/page.tsx',
    'app/admin/tickets/page.tsx', 
    'app/admin/users/page.tsx',
    'app/admin/departments/page.tsx',
    'app/admin/categories/page.tsx',
    'app/admin/reports/page.tsx',
    'app/admin/settings/page.tsx',
    'app/admin/help/page.tsx',
    'app/admin/profile/page.tsx'
];

// Common imports to add
const importsToAdd = `
import { colors } from '@/lib/colors';
import { fonts } from '@/lib/fonts';`;

// Common replacements for consistent styling
const replacements = [
    {
        from: 'bg-gray-50',
        to: `style={{ backgroundColor: colors.pageBackground, fontFamily: fonts.fontFamily.primary }}`
    },
    {
        from: 'bg-white border-b border-gray-200',
        to: `style={{ backgroundColor: 'white', borderBottom: \`1px solid \${colors.borderGrey}\` }}`
    },
    {
        from: 'text-2xl font-semibold text-gray-900',
        to: `style={{ fontSize: fonts.heading.lg.size, fontWeight: fonts.heading.lg.weight, color: colors.primaryText, lineHeight: fonts.heading.lg.lineHeight }}`
    },
    {
        from: 'text-sm text-gray-600',
        to: `style={{ fontSize: fonts.body.sm.size, color: colors.bodyTextGrey, lineHeight: fonts.body.sm.lineHeight }}`
    },
 