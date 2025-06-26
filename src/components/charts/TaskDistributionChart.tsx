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
import type {
  EChartsOption,
  PieSeriesOption,
} from "echarts";
import debounce from "lodash/debounce";

interface TaskDistributionChartProps {
  chartType?: "organ" | "taskType";
}

export function TaskDistributionChart({
  chartType = "organ",
}: TaskDistributionChartProps) {
  const { getFilteredTasks, allTaskTypes } =
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

    if (filteredTasks.length === 0) {
      return {
        title: {
          text: "No tasks available",
          left: "center",
        },
        tooltip: {},
        series: [],
      };
    }

    // Generate data based on chart type
    if (chartType === "organ") {
      // Count tasks by organ using reduce for better performance
      const organCounts = filteredTasks.reduce(
        (acc, task) => {
          acc[task.organ] = (acc[task.organ] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Format data for pie chart
      const data = Object.entries(organCounts).map(
        ([organ, count]) => ({
          name: organ,
          value: count,
        }),
      );

      // Create pie series with optimized settings
      const pieSeries: PieSeriesOption = {
        name: "Organ Distribution",
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
          text: "Task Distribution by Organ",
          top: isMobile ? "2%" : "1%",
          left: "center",
          textStyle: {
            fontSize: isMobile ? 14 : 18,
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          confine: true,
          enterable: true,
        },
        legend: {
          orient: "vertical",
          left: isMobile ? 5 : 10,
          top: isMobile ? "30%" : "30%",
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
    } else {
      // Count tasks by task type
      const taskTypeCounts: Record<string, number> = {};
      filteredTasks.forEach((task) => {
        const taskType = task.taskType;
        taskTypeCounts[taskType] =
          (taskTypeCounts[taskType] || 0) + 1;
      });

      // Format data for pie chart with custom order
      const data = allTaskTypes
        .filter((taskType) => taskTypeCounts[taskType] > 0) // Only include types that exist
        .map((taskType) => ({
          name: taskType,
          value: taskTypeCounts[taskType],
        }));

      // Create pie series
      const pieSeries: PieSeriesOption = {
        name: "Task Type Distribution",
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
      };

      return {
        // Optimize animations for better performance
        animation: true,
        animationDuration: 600,
        animationEasing: "cubicOut",
        animationDelay: function (idx: number) {
          return idx * 50;
        },
        animationDurationUpdate: 300,
        animationEasingUpdate: "cubicOut",

        title: {
          text: "Task Distribution by Type",
          top: isMobile ? "2%" : "1%", // Higher on mobile too
          left: "center",
          textStyle: {
            fontSize: isMobile ? 14 : 18, // Larger font on desktop
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: isMobile ? 5 : 0,
          top: isMobile ? "37.5%" : "37.5%", // Move down to match pie chart center
          bottom: undefined,
          type: "scroll",
          z: 0,
          textStyle: {
            fontSize: isMobile ? 13 : 16, // Larger font for mobile too
            color: "#333",
          },
          itemWidth: isMobile ? 12 : 16, // Slightly larger icons for mobile
          itemHeight: isMobile ? 12 : 16,
          itemGap: isMobile ? 8 : 15, // More spacing for mobile
        },
        series: [pieSeries],
      };
    }
  }, [
    getFilteredTasks,
    allTaskTypes,
    chartType,
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
