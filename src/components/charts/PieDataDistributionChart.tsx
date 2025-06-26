"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent } from "@/components/ui/card";
import { Performance } from "@/types";
import type {
  EChartsOption,
  PieSeriesOption,
} from "echarts";
import debounce from "lodash/debounce";

interface PieDataDistributionChartProps {
  selectedMetrics?: string[];
}

export function PieDataDistributionChart({
  selectedMetrics = [],
}: PieDataDistributionChartProps) {
  const { getFilteredTasks, getFilteredPerformances } =
    useEvaluation();

  // Use React state for responsive design instead of window object
  const [isMobile, setIsMobile] = useState(false);
  const [isNarrowDesktop, setIsNarrowDesktop] =
    useState(false);

  useEffect(() => {
    const checkScreenSize = debounce(() => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsNarrowDesktop(width >= 768 && width < 1600);
    }, 150);

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
      checkScreenSize.cancel();
    };
  }, []);

  const chartOptions = useMemo((): EChartsOption => {
    const filteredTasks = getFilteredTasks();
    const filteredPerformances = getFilteredPerformances();

    if (
      filteredTasks.length === 0 ||
      filteredPerformances.length === 0
    ) {
      return {
        title: {
          text: "No tasks available",
          left: "center",
        },
        tooltip: {},
        series: [],
      };
    }

    // Get all filtered task IDs for efficient lookup
    const filteredTaskIds = new Set(
      filteredTasks.map((task) => task.id),
    );

    // Get all available metrics more efficiently
    const allAvailableMetrics = new Set<string>();
    const metricTaskSets: Record<string, Set<string>> = {};

    // Process performances in a single pass
    filteredPerformances.forEach(
      (performance: Performance) => {
        if (filteredTaskIds.has(performance.taskId)) {
          const metric = performance.metrics;
          if (metric !== undefined && metric !== null) {
            allAvailableMetrics.add(metric);
            if (!metricTaskSets[metric]) {
              metricTaskSets[metric] = new Set();
            }
            metricTaskSets[metric].add(performance.taskId);
          }
        }
      },
    );

    const allMetricsArray = Array.from(allAvailableMetrics);
    const isOverallMode =
      selectedMetrics.length === 0 ||
      (selectedMetrics.length === allMetricsArray.length &&
        selectedMetrics.every((m) =>
          allMetricsArray.includes(m),
        ));

    const metricsToShow = isOverallMode
      ? allMetricsArray
      : selectedMetrics;

    // Format data for pie chart with optimized processing
    const data = metricsToShow
      .filter((metric) => metricTaskSets[metric]?.size > 0)
      .map((metric) => ({
        name: metric,
        value: metricTaskSets[metric].size,
      }));

    // Create pie series with optimized settings
    const pieSeries: PieSeriesOption = {
      name: "Task Distribution",
      type: "pie",
      radius: isMobile ? ["35%", "65%"] : ["40%", "70%"],
      center: isMobile ? ["70%", "55%"] : ["65%", "55%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        scale: true,
        scaleSize: 5,
        label: {
          show: true,
          fontSize: isMobile ? 14 : 16,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data,
      silent: false,
      animationType: "expansion",
      animationTypeUpdate: "transition",
      animationDuration: 400,
      animationEasing: "cubicOut",
    };

    return {
      animation: true,
      animationDuration: 400,
      animationEasing: "cubicOut",
      animationThreshold: 2000,
      progressive: 500,
      progressiveThreshold: 3000,
      silent: false,
      blendMode: "source-over",
      hoverLayerThreshold: 10,

      title: {
        text: "Task Distribution by Metric",
        top: isMobile ? "2%" : "1%",
        left: "center",
        textStyle: {
          fontSize: isMobile ? 14 : 18,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} Tasks ({d}%)",
        confine: true,
        enterable: true,
      },
      legend: {
        orient: "vertical",
        left: isMobile ? 5 : 10,
        top: isMobile ? "47.5%" : "47.5%",
        bottom: undefined,
        type: "scroll",
        z: 0,
        textStyle: {
          fontSize: isMobile ? 13 : 16,
          color: "#333",
        },
        itemWidth: isMobile ? 12 : 16,
        itemHeight: isMobile ? 12 : 16,
        itemGap: isMobile ? 8 : 15,
        pageButtonPosition: "end",
        pageButtonGap: 5,
        pageIconSize: 12,
      },
      series: [pieSeries],
    };
  }, [
    getFilteredTasks,
    getFilteredPerformances,
    selectedMetrics,
    isMobile,
    isNarrowDesktop,
  ]);

  const handleChartReady = useCallback((chart: any) => {
    chart.setOption({
      progressive: 500,
      progressiveThreshold: 3000,
      silent: false,
      blendMode: "source-over",
      hoverLayerThreshold: 10,
    });
  }, []);

  return (
    <Card className="h-[250px] w-full sm:h-[350px]">
      <CardContent className="h-[250px] p-2 sm:h-[350px] sm:p-6">
        <ReactECharts
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
          opts={{
            renderer: "canvas",
            devicePixelRatio: isMobile ? 1 : 2,
          }}
          notMerge={true}
          lazyUpdate={true}
          showLoading={false}
          onChartReady={handleChartReady}
        />
      </CardContent>
    </Card>
  );
}
