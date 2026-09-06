"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "../providers/ThemeProvider";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BarChartProps {
  categories: string[];
  series: { name: string; data: number[] }[];
  height?: number;
  horizontal?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

export function BarChart({
  categories,
  series,
  height = 280,
  horizontal = false,
  xAxisTitle,
  yAxisTitle,
}: BarChartProps) {
  const { colors: theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
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
        top: 0,
        left: 0,
        blur: 4,
        opacity: 0.1,
      },
    },
    plotOptions: {
      bar: {
        horizontal,
        borderRadius: 8,
        borderRadiusApplication: "end",
        dataLabels: {
          position: "top",
        },
        distributed: false,
        columnWidth: horizontal ? "75%" : "60%",
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: horizontal ? 30 : 0,
      offsetY: horizontal ? 0 : -20,
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: [theme.foreground],
      },
      background: {
        enabled: false,
      },
      formatter: (val: number) => {
        return val ? val.toString() : "0";
      },
    },
    xaxis: {
      categories,
      title: {
        text: xAxisTitle || (horizontal ? "Number of Tickets" : "Categories"),
        style: {
          color: theme.foreground,
          fontSize: "14px",
          fontWeight: 700,
        },
        offsetY: horizontal ? 0 : 15,
      },
      labels: {
        style: {
          colors: theme.foregroundMuted,
          fontSize: "12px",
          fontWeight: 500,
        },
        rotate: -45,
        rotateAlways: true,
        hideOverlappingLabels: true,
        trim: false,
        maxHeight: 140,
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
    },
    yaxis: {
      title: {
        text: yAxisTitle || (horizontal ? "Categories" : "Number of Tickets"),
        style: {
          color: theme.foreground,
          fontSize: "14px",
          fontWeight: 700,
        },
        offsetX: horizontal ? 0 : -10,
      },
      labels: {
        style: {
          colors: theme.foregroundMuted,
          fontSize: "12px",
          fontWeight: 500,
        },
        formatter: horizontal
          ? undefined
          : (val: number) => {
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
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: horizontal ? "horizontal" : "vertical",
        shadeIntensity: 0.5,
        gradientToColors: [theme.primary],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.85,
        stops: [0, 100],
      },
    },
    colors: [theme.primary],
    tooltip: {
      enabled: true,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "inherit",
      },
      y: {
        formatter: (val: number) => {
          return val && !isNaN(val) ? `${val} tickets` : "0 tickets";
        },
      },
      marker: {
        show: true,
      },
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
          plotOptions: {
            bar: {
              columnWidth: "85%",
            },
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

  const summary = series
    .flatMap((item) =>
      item.data.map(
        (value, index) =>
          `${item.name} ${categories[index] || index + 1}: ${value}`,
      ),
    )
    .join(", ");

  return (
    <div role="img" aria-label={`Bar chart. ${summary || "No data"}`}>
      <Chart options={options} series={series} type="bar" height={height} />
    </div>
  );
}
