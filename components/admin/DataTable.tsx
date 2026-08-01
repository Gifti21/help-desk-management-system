'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { colors } from '@/lib/colors';
import { fonts } from '@/lib/fonts';
import { useTheme } from '../providers/ThemeProvider';

interface Column {
    key: string;
    title: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    title?: string;
    columns: Column[];
    data: any[];
    actions?: React.ReactNode;
    emptyMessage?: string;
}

export function DataTable({ title, columns, data, actions, emptyMessage = 'No data available' }: DataTableProps) {
    return (
        <Card
            className="shadow-sm transition-colors"
            style={{
                backgroundColor: 'white',
                borderColor: colors.borderGrey
            }}
        >
            {(title || actions) && (
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        {title && (
                            <CardTitle
                                style={{
                                    fontSize: fonts.heading.sm.size,
                                    fontWeight: fonts.heading.sm.weight,
                                    color: colors.primaryText,
                                    lineHeight: fonts.heading.sm.lineHeight
                                }}
                            >
                                {title}
                            </CardTitle>
                        )}
                        {actions && <div className="flex items-center space-x-2">{actions}</div>}
                    </div>
                </CardHeader>
            )}

            <CardContent className={title || actions ? 'pt-0' : 'p-6'}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr
                                style={{
                                    borderBottom: `1px solid ${colors.borderGrey}`,
                                    backgroundColor: colors.lightTealBgAlt
                                }}
                            >
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="text-left py-3 px-4 uppercase tracking-wider"
                                        style={{
                                            fontSize: fonts.caption.regular.size,
                                            fontWeight: fonts.fontWeight.medium,
                                            color: colors.bodyTextGrey,
                                            letterSpacing: fonts.caption.regular.letterSpacing
                                        }}
                                    >
                                        {column.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="text-center py-12"
                                        style={{
                                            fontSize: fonts.body.regular.size,
                                            color: colors.mutedGreyGreen,
                                            lineHeight: fonts.body.regular.lineHeight
                                        }}
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="transition-colors"
                                        style={{
                                            borderBottom: `1px solid ${colors.borderGrey}`,
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={column.key}
                                                className="py-4 px-4"
                                                style={{
                                                    fontSize: fonts.body.regular.size,
                                                    color: colors.primaryText,
                                                    lineHeight: fonts.body.regular.lineHeight
                                                }}
                                            >
                                                {column.render
                                                    ? column.render(row[column.key], row)
                                                    : row[column.key]
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}