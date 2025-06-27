"use client";

import { Suspense, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { ModelFilter } from "@/components/filters/ModelFilter";
import { TaskTypeFilter } from "@/components/filters/TaskTypeFilter";
import { OrganFilter } from "@/components/filters/OrganFilter";

import { TaskDistributionChart } from "@/components/charts/TaskDistributionChart";
import { OverallRankBarChart } from "@/components/charts/OverallRankBarChart";

import { PieDataDistributionChart } from "@/components/charts/PieDataDistributionChart";
import PerformanceContent from "@/components/tables/PerformanceContent";

import { MetricSelector } from "@/components/selectors/MetricSelector";
import { Footer } from "@/components/layout/Footer";
import { LeaderboardTable } from "@/components/tables/LeaderboardTable";
import Header from "@/components/layout/Header";
import { EvaluationProvider } from "@/context/EvaluationContext";

const TAB_VALUES = {
  OVERVIEW: "overview",
  AVERAGE: "average",
  LEADERBOARD: "leaderboard",
  PERFORMANCE: "performance",
} as const;

// Extracted tab configuration
const TAB_CONFIG = [
  {
    value: TAB_VALUES.OVERVIEW,
    label: "Overview",
  },
  {
    value: TAB_VALUES.AVERAGE,
    label: "Average",
  },
  {
    value: TAB_VALUES.LEADERBOARD,
    label: "Leaderboard",
  },
  {
    value: TAB_VALUES.PERFORMANCE,
    label: "Performance",
  },
];

// Extracted tab content configuration
const TAB_CONTENT_CONFIG = [
  {
    value: TAB_VALUES.OVERVIEW,
    content: (
      <div className="my-4 sm:my-6">
        <span className="text-sm">
          This is the overview of the competition.
        </span>
      </div>
    ),
  },
  {
    value: TAB_VALUES.AVERAGE,
    content: null, // Complex content, handled separately
  },
  {
    value: TAB_VALUES.LEADERBOARD,
    content: (
      <div className="my-4 sm:my-6">
        <span className="text-sm">
          This is the leaderboard of the competition.
        </span>
      </div>
    ),
  },
  {
    value: TAB_VALUES.PERFORMANCE,
    content: (
      <div className="my-4 sm:my-6">
        <span className="text-sm">
          This is the performance of the competition.
        </span>
      </div>
    ),
  },
];

export function Dashboard() {
  const [selectedMetrics, setSelectedMetrics] = useState<
    string[]
  >([]);

  // Helper function to render TabsContent
  const renderTabContent = (
    tabConfig: (typeof TAB_CONTENT_CONFIG)[0],
  ) => {
    if (tabConfig.value === TAB_VALUES.AVERAGE) {
      // Complex content for AVERAGE tab
      return (
        <TabsContent
          key={tabConfig.value}
          value={tabConfig.value}
          className={"space-y-4 sm:space-y-6"}
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <TaskDistributionChart chartType="taskType" />
            <PieDataDistributionChart
              selectedMetrics={selectedMetrics}
            />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <ModelFilter />
            <TaskTypeFilter />
            <OrganFilter />
            <MetricSelector
              value={selectedMetrics}
              onChange={setSelectedMetrics}
            />
          </div>
          <div className="grid w-full">
            <OverallRankBarChart
              selectedMetrics={selectedMetrics}
            />
          </div>
        </TabsContent>
      );
    }

    // Other tabs with simple content
    return (
      <TabsContent
        key={tabConfig.value}
        value={tabConfig.value}
        className={"space-y-4 sm:space-y-6"}
      >
        {tabConfig.content}
      </TabsContent>
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EvaluationProvider>
        <div className="container mx-auto max-w-[1600px] py-3 sm:py-6">
          <Header />

          <Tabs defaultValue={TAB_VALUES.OVERVIEW}>
            <div className="w-full overflow-x-auto">
              <TabsList className="flex w-auto min-w-max space-x-0.5 rounded-xl border border-gray-100 bg-gray-50">
                {TAB_CONFIG.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={
                      "w-[120px] whitespace-nowrap rounded-lg px-2 py-1.5 text-gray-600 transition-all hover:bg-gray-100/70 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    }
                  >
                    <span
                      className={
                        "text-xs font-medium sm:text-sm"
                      }
                    >
                      {tab.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {TAB_CONTENT_CONFIG.map((tabConfig) =>
              renderTabContent(tabConfig),
            )}
          </Tabs>

          <Footer />
        </div>
      </EvaluationProvider>
    </Suspense>
  );
}
