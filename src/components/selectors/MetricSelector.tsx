"use client";

import React from "react";
import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MetricSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function MetricSelector({ value, onChange }: MetricSelectorProps) {
  const { getAvailableMetrics, getFilteredTasks } = useEvaluation();
  const allMetrics = getAvailableMetrics();
  const filteredTasks = getFilteredTasks();

  // 根据当前选择的task types确定可用的metrics
  const getValidMetricsForTasks = () => {
    if (filteredTasks.length === 0) {
      return allMetrics;
    }

    const validMetrics = new Set<string>();

    filteredTasks.forEach((task) => {
      task.evaluationMetrics.forEach((metric) => validMetrics.add(metric));
    });

    return Array.from(validMetrics);
  };

  const metrics = getValidMetricsForTasks();

  const handleMetricToggle = (metric: string) => {
    const newValue = value.includes(metric)
      ? value.filter((m) => m !== metric)
      : [...value, metric];
    onChange(newValue);
  };

  // 当可用metrics变化时，自动清理无效的选择
  React.useEffect(() => {
    const validSelections = value.filter((metric) => metrics.includes(metric));
    if (validSelections.length !== value.length) {
      onChange(validSelections);
    }
  }, [metrics, value, onChange]);

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-xs sm:text-sm font-medium">
          Select Metric
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {allMetrics.map((metric) => {
            const isAvailable = metrics.includes(metric);
            return (
              <div key={metric} className="flex items-center space-x-2">
                <Checkbox
                  id={`metric-${metric}`}
                  checked={value.includes(metric)}
                  onCheckedChange={() => handleMetricToggle(metric)}
                  disabled={!isAvailable}
                  className="h-3 w-3 sm:h-4 sm:w-4"
                />
                <Label
                  htmlFor={`metric-${metric}`}
                  className={`text-xs sm:text-sm leading-tight ${
                    isAvailable
                      ? "cursor-pointer"
                      : "cursor-not-allowed text-gray-400"
                  }`}
                >
                  {metric.replace("_", " ")}
                </Label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
