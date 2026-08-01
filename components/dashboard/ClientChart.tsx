"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ClientChartProps {
  options: ApexOptions;
  series: any[];
  type: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap";
  width?: string | number;
  height?: string | number;
}

export function ClientChart({ options, series, type, width = "100%", height = 200 }: ClientChartProps) {
  return <ApexChart options={options} series={series} type={type} width={width} height={height} />;
}