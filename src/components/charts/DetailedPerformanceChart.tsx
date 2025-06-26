"use client";

import React, { useMemo, memo } from "react";
import ReactECharts from "echarts-for-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchPerformance } from "@/data/performance";
import { fetchTasks } from "@/data/tasks";
import type { EChartsOption } from "echarts";
import { Performance } from "@/types";
import { useDataType } from "@/hooks/useDataType";
import { useCompetition } from "@/hooks/useCompetition";

interface DetailedPerformanceChartProps {
  taskId: string;
  taskName: string;
  organ: string;
}

interface ModelStats {
  modelName: string;
  mean: number;
  std: number;
  values: number[];
  min: number;
  max: number;
  cohort: string;
}

interface SingleCohortChartProps {
  taskName: string;
  organ: string;
  cohort: string;
  modelStats: ModelStats[];
  selectedMetric: string;
}

// Single cohort chart component - memoized for performance
const SingleCohortChart = memo(function SingleCohortChart({
  taskName,
  organ,
  cohort,
  modelStats,
  selectedMetric,
}: SingleCohortChartProps) {
  const chartOptions = useMemo((): EChartsOption => {
    if (!modelStats || modelStats.length === 0) {
      return {
        // Disable animations for empty state
        animation: false,
        title: {
          text: `No data available for ${cohort}`,
          left: "center",
          textStyle: { fontSize: 14, color: "#666" },
        },
        xAxis: { type: "category", data: [] },
        yAxis: { type: "value" },
        series: [],
      };
    }

    const modelNames = modelStats.map(
      (d) => d?.modelName || "",
    );
    const means = modelStats.map((d) => d?.mean || 0);
    const stds = modelStats.map((d) => d?.std || 0);

    // Calculate Y-axis range for better visualization
    const allValues = means.concat(
      modelStats.flatMap((d) => d?.values || []),
    );
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const range = maxValue - minValue;
    const yAxisMin = Math.max(0, minValue - range * 0.1);
    const yAxisMax = maxValue + range * 0.1;

    // Prepare scatter data (individual fold values)
    const scatterData: [number, number][] = [];
    modelStats.forEach((modelData, modelIndex) => {
      if (modelData && modelData.values) {
        modelData.values.forEach((value: number) => {
          scatterData.push([modelIndex, value]);
        });
      }
    });

    return {
      // Optimize animations for better performance
      animation: true,
      animationDuration: 200, // Faster animation
      animationEasing: "cubicOut",
      animationDelay: function (idx: number) {
        return idx * 8; // Even faster stagger
      },
      animationDurationUpdate: 100, // Faster updates
      animationEasingUpdate: "cubicOut",

      backgroundColor: "#fafafa",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textStyle: { color: "#374151" },
        formatter: function (params: unknown) {
          if (Array.isArray(params) && params.length > 0) {
            const dataIndex = params[0].dataIndex;
            const modelData = modelStats[dataIndex];
            if (modelData) {
              return `
                <div style="font-weight: bold; margin-bottom: 8px;">${
                  modelData.modelName
                }</div>
                <div>Mean: <span style="font-weight: bold;">${modelData.mean.toFixed(
                  3,
                )}</span></div>
                <div>Std: ${modelData.std.toFixed(3)}</div>
                <div>Range: ${modelData.min.toFixed(
                  3,
                )} - ${modelData.max.toFixed(3)}</div>
                <div>Folds: ${modelData.values.length}</div>
              `;
            }
          }
          return "";
        },
      },
      grid: {
        left: "12%",
        right: "5%",
        bottom: "7%",
        top: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: modelNames,
        axisLabel: {
          rotate: 45,
          fontSize: 11,
          color: "#374151",
          interval: 0,
        },
        axisLine: {
          lineStyle: { color: "#d1d5db" },
        },
        axisTick: {
          lineStyle: { color: "#d1d5db" },
        },
      },
      yAxis: {
        type: "value",
        name: selectedMetric,
        nameLocation: "middle",
        nameGap: 60,
        nameTextStyle: {
          fontSize: 14,
          color: "#374151",
          fontWeight: "bold",
        },
        min: yAxisMin,
        max: yAxisMax,
        axisLabel: {
          formatter: function (value: number) {
            return value.toFixed(3);
          },
          fontSize: 11,
          color: "#374151",
          showMinLabel: true,
          showMaxLabel: true,
          // Add margin between labels to prevent overlap
          margin: 10,
        },
        splitNumber: (() => {
          const range = yAxisMax - yAxisMin;
          // Adaptive split number based on range to prevent crowding
          if (range < 0.05) return 3; // Very small range, only show 3 labels
          if (range < 0.1) return 4; // Small range, show 4 labels
          if (range < 0.2) return 5; // Medium range, show 5 labels
          return 6; // Larger range, show up to 6 labels
        })(),
        // Add interval to control label spacing for small ranges
        ...(() => {
          const range = yAxisMax - yAxisMin;
          // For very small ranges, use larger intervals to prevent crowding
          if (range < 0.05)
            return { interval: (yAxisMax - yAxisMin) / 2 };
          if (range < 0.1)
            return { interval: (yAxisMax - yAxisMin) / 3 };
          return {}; // Let ECharts decide for larger ranges
        })(),
        axisLine: {
          lineStyle: { color: "#d1d5db" },
        },
        axisTick: {
          lineStyle: { color: "#d1d5db" },
        },
        splitLine: {
          lineStyle: {
            color: "#e5e7eb",
            type: "dashed",
          },
        },
      },
      series: [
        // Bar chart with custom color palette
        {
          name: "Mean Performance",
          type: "bar",
          data: means.map((mean, index) => {
            // Custom color palette from user
            const colorPalette = [
              "#67001F",
              "#981328",
              "#B72C34",
              "#C5413F",
              "#CF5349",
              "#D86654",
              "#D96856",
              "#EC9578",
              "#F6B89C",
              "#F7BB9F",
              "#F7BCA0",
              "#FAD3BE",
              "#F8EAE3",
              "#F6EDE8",
              "#E5EEF2",
              "#E4EDF2",
              "#96C6DF",
              "#8DC1DC",
              "#053061",
            ];

            // Select color based on ranking (index)
            const colorIndex = index % colorPalette.length;
            const baseColor = colorPalette[colorIndex];

            return {
              value: mean,
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: baseColor },
                    { offset: 1, color: baseColor },
                  ],
                },
                borderRadius: [2, 2, 0, 0],
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 4,
                shadowOffsetY: 2,
              },
            };
          }),
          barWidth: "65%",
          z: 1,
          emphasis: {
            itemStyle: {
              shadowColor: "rgba(0, 0, 0, 0.3)",
              shadowBlur: 8,
              shadowOffsetY: 4,
            },
          },
        },
      ],
    };
  }, [modelStats, selectedMetric, cohort]);

  return (
    <Card className="w-full border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-2 pt-3 sm:pt-4">
        <CardTitle className="text-base leading-tight text-gray-900 sm:text-lg">
          {taskName}
        </CardTitle>
        <p className="text-xs text-gray-600 sm:text-sm">
          {organ} • {modelStats.length} models •{" "}
          {selectedMetric} • {cohort}
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-2 pt-2 sm:px-6">
        <div className="h-[250px] sm:h-[350px]">
          <ReactECharts
            option={chartOptions}
            style={{ height: "100%", width: "100%" }}
            opts={{
              renderer: "canvas", // Canvas is faster for complex charts
              devicePixelRatio:
                typeof window !== "undefined" &&
                window.innerWidth < 768
                  ? 1
                  : 1.5, // Lower pixel ratio on mobile for better performance
            }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </CardContent>
    </Card>
  );
});

export function DetailedPerformanceChart({
  taskId,
  taskName,
  organ,
}: DetailedPerformanceChartProps) {
  const dataType = useDataType();
  const competition = useCompetition();
  const performances = fetchPerformance(
    dataType,
    competition,
  );
  const tasks = fetchTasks(dataType, competition);

  // Optimize data processing with better caching
  const cohortCharts = useMemo(() => {
    // Get performances for this specific task - use more efficient filtering
    const taskPerformances = performances.filter(
      (p) => p.taskId === taskId,
    );

    if (taskPerformances.length === 0) {
      return [];
    }

    // Determine the metric for this task based on available metrics
    const availableMetrics = Object.keys(
      taskPerformances[0]?.metrics || {},
    );
    const selectedMetric = availableMetrics[0]; // Use the first available metric

    if (!selectedMetric) {
      return [];
    }

    // Pre-find the task to avoid repeated lookups
    const currentTask = tasks.find((t) => t.id === taskId);
    const defaultCohort = currentTask?.cohort || "unknown";

    // Group by cohort more efficiently
    const cohortGroups = new Map();
    taskPerformances.forEach((perf) => {
      const cohort = defaultCohort; // Use pre-found cohort

      if (!cohortGroups.has(cohort)) {
        cohortGroups.set(cohort, []);
      }
      cohortGroups.get(cohort).push(perf);
    });

    // Create chart data for each cohort with optimized calculations
    const chartDataArray = [];
    for (const [
      cohort,
      cohortPerformances,
    ] of cohortGroups.entries()) {
      // Calculate statistics for each model in this cohort
      const modelStats = cohortPerformances
        .map((perf: Performance) => {
          const mean = perf.rankMean;
          return {
            modelName: perf.modelId,
            mean,
            cohort,
          };
        })
        .filter(Boolean);

      // Sort by mean performance (descending)
      modelStats.sort(
        (a: ModelStats | null, b: ModelStats | null) =>
          (b?.mean || 0) - (a?.mean || 0),
      );

      if (modelStats.length > 0) {
        chartDataArray.push({
          cohort,
          modelStats,
          selectedMetric,
        });
      }
    }

    return chartDataArray;
  }, [taskId]);

  if (cohortCharts.length === 0) {
    return (
      <Card className="w-full border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">
            {taskName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-gray-500">
            No data available for this task
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {cohortCharts.map((chartData) => (
        <SingleCohortChart
          key={`${taskId}-${chartData.cohort}`}
          taskName={taskName}
          organ={organ}
          cohort={chartData.cohort}
          modelStats={chartData.modelStats}
          selectedMetric={chartData.selectedMetric}
        />
      ))}
    </>
  );
}
