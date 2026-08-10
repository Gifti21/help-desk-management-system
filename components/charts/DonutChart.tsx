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
    tooltipSuffix?: string;
}

export function DonutChart({ series, labels, colors, height = 280, tooltipSuffix = 'items' }: DonutChartProps) {
    const { colors: theme } = useTheme();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const defaultColors = colors || ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

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
            enabled: true,
            style: {
                fontSize: '14px',
                fontWeight: 600,
                colors: ['#fff']
            },
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 1,
                opacity: 0.5
            },
            formatter: (val: number, opts: any) => {
                return Math.round(val) + '%';
            }
        },
        plotOptions: {
            pie: {
                expandOnClick: true,
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 600,
                            color: theme.foreground
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 700,
                            color: theme.foreground,
                            formatter: (val: string) => {
                                return val;
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: theme.foregroundMuted,
                            formatter: (w: any) => {
                                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
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
            theme: 'light',
            style: {
                fontSize: '14px',
                fontFamily: 'inherit'
            },
            y: {
                formatter: (val: number, opts: any) => {
                    const label = labels[opts.seriesIndex];
                    return val && !isNaN(val) ? `${label}: ${val} ${tooltipSuffix}` : `${label}: 0 ${tooltipSuffix}`;
                },
                title: {
                    formatter: () => ''
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
                dataLabels: {
                    style: {
                        fontSize: '12px'
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
