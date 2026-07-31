'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '../providers/ThemeProvider';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DonutChartProps {
    series: number[];
    labels: string[];
    colors?: string[];
    height?: number;
}

export function DonutChart({ series, labels, colors, height = 280 }: DonutChartProps) {
    const { colors: theme, isDark } = useTheme();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const defaultColors = colors || [theme.primary, '#f59e0b', '#ef4444'];

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'donut',
            background: 'transparent',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            },
            dropShadow: {
                enabled: true,
                top: 0,
                left: 0,
                blur: 8,
                opacity: 0.15
            }
        },
        labels,
        colors: defaultColors,
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            pie: {
                expandOnClick: true,
                donut: {
                    size: '75%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 600,
                            color: theme.foregroundMuted,
                            offsetY: -10
                        },
                        value: {
                            show: true,
                            fontSize: '32px',
                            fontWeight: 700,
                            color: theme.foreground,
                            offsetY: 10,
                            formatter: (val: string) => val
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total Tickets',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: theme.foregroundMuted,
                            formatter: () => {
                                return series.reduce((a, b) => a + b, 0).toString();
                            }
                        }
                    }
                }
            }
        },
        stroke: {
            show: true,
            width: 3,
            colors: [theme.card]
        },
        states: {
            hover: {
                filter: {
                    type: 'lighten',
                    value: 0.15
                }
            },
            active: {
                filter: {
                    type: 'darken',
                    value: 0.2
                }
            }
        },
        tooltip: {
            enabled: true,
            theme: isDark ? 'dark' : 'light',
            style: {
                fontSize: '14px',
                fontFamily: 'inherit'
            },
            y: {
                formatter: (val: number) => {
                    return val && !isNaN(val) ? `${val} tickets` : '0 tickets';
                }
            },
            fillSeriesColor: false
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    height: 250
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                value: {
                                    fontSize: '24px'
                                }
                            }
                        }
                    }
                }
            }
        }]
    };

    if (!isClient) {
        return (
            <div className="flex items-center justify-center" style={{ height }}>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: theme.primary }} />
                    <div style={{ color: theme.foregroundMuted, fontSize: '14px' }}>
                        Loading chart...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Chart
            options={options}
            series={series}
            type="donut"
            height={height}
        />
    );
}
