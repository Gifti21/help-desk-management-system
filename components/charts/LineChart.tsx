"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "../providers/ThemeProvider";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LineChartProps {
  categories: string[];
  series: { name: string; data: number[] }[];
  height?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

export function LineChart({
  categories,
  series,
  height = 280,
  xAxisTitle,
  yAxisTitle,
}: LineChartProps) {
  const { colors: theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      background: "transparent",
      parentHeightOffset: 0,
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 20,
      },
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 0,
        blur: 8,
        opacity: 0.15,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      lineCap: "round",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: [theme.primary],
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -8,
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: [theme.foreground],
      },
      background: {
        enabled: true,
        foreColor: theme.foreground,
        borderRadius: 4,
        padding: 4,
        opacity: 0.1,
        borderWidth: 0,
      },
      formatter: (val: number) => {
        return val && !isNaN(val) ? val.toString() : "0";
      },
    },
    xaxis: {
      categories,
      title: {
        text: xAxisTitle || "Categories",
        style: {
          color: theme.foreground,
          fontSize: "14px",
          fontWeight: 700,
        },
        offsetY: 15,
      },
      labels: {
        style: {
          colors: theme.foregroundMuted,
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: true,
        color: theme.cardBorder,
        height: 1,
      },
      axisTicks: {
        show: true,
        color: theme.cardBorder,
        height: 6,
      },
      crosshairs: {
        show: true,
        stroke: {
          color: theme.cardBorder,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      title: {
        text: yAxisTitle || "Values",
        style: {
          color: theme.foreground,
          fontSize: "14px",
          fontWeight: 700,
        },
        offsetX: -10,
      },
      labels: {
        style: {
          colors: theme.foregroundMuted,
          fontSize: "12px",
          fontWeight: 500,
        },
        formatter: (val: number) => {
          return val && !isNaN(val) ? Math.round(val).toString() : "0";
        },
      },
      axisBorder: {
        show: true,
        color: theme.cardBorder,
      },
    },
    grid: {
      borderColor: theme.cardBorder,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 10,
        bottom: 30,
        left: 10,
      },
    },
    colors: [theme.primary],
    markers: {
      size: 6,
      colors: [theme.primary],
      strokeColors: theme.card,
      strokeWidth: 3,
      hover: {
        size: 8,
        sizeOffset: 2,
      },
      discrete: series[0].data
        .map((val, index) => {
          const maxValue = Math.max(...series[0].data);
          if (val === maxValue) {
            return {
              seriesIndex: 0,
              dataPointIndex: index,
              fillColor: "#10b981",
              strokeColor: theme.card,
              size: 8,
            };
          }
          return null;
        })
        .filter(Boolean) as any[],
    },
    tooltip: {
      enabled: true,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "inherit",
      },
      x: {
        show: true,
        format: "MMM",
      },
      y: {
        formatter: (val: number) => {
          return val && !isNaN(val) ? `${val} tickets` : "0 tickets";
        },
        title: {
          formatter: (seriesName: string) => seriesName + ":",
        },
      },
      marker: {
        show: true,
      },
    },
    legend: {
      show: false,
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.1,
        },
      },
      active: {
        filter: {
          type: "darken",
          value: 0.1,
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          markers: {
            size: 4,
          },
          dataLabels: {
            enabled: false,
          },
        },
      },
    ],
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: theme.primary }}
          />
          <div style={{ color: theme.foregroundMuted, fontSize: "14px" }}>
            Loading chart...
          </div>
        </div>
      </div>
    );
  }

  return (
    <Chart options={options} series={series} type="area" height={height} />
  );
}
