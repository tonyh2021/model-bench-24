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
  OVERVIEW_2: "overview_2",
  LEADERBOARD: "leaderboard",
  PERFORMANCE: "performance",
} as const;

export function Dashboard() {
  const [selectedMetrics, setSelectedMetrics] = useState<
    string[]
  >([]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EvaluationProvider>
        <div className="container mx-auto max-w-[1600px] py-3 sm:py-6">
          <Header />

          <Tabs defaultValue={TAB_VALUES.OVERVIEW}>
            <div className="w-full overflow-x-auto">
              <TabsList className="flex w-auto min-w-max space-x-0.5 rounded-xl border border-gray-100 bg-gray-50">
                <TabsTrigger
                  value={TAB_VALUES.OVERVIEW}
                  className="whitespace-nowrap rounded-lg px-2 py-1.5 text-gray-600 transition-all hover:bg-gray-100/70 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  <span className="text-sm font-medium">
                    Overview
                  </span>
                </TabsTrigger>
                {/* <TabsTrigger
              value={TAB_VALUES.OVERVIEW_2}
              className="whitespace-nowrap rounded-lg px-2 py-1.5 text-gray-600 transition-all hover:bg-gray-100/70 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm sm:px-6 sm:py-2"
            >
              <span className="text-xs font-medium sm:text-sm">
                Overview
              </span>
            </TabsTrigger> */}
                {/* <TabsTrigger
              value={TAB_VALUES.LEADERBOARD}
              className="whitespace-nowrap rounded-lg px-2 py-1.5 text-gray-600 transition-all hover:bg-gray-100/70 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm sm:px-6 sm:py-2"
            >
              <span className="text-xs font-medium sm:text-sm">
                Leaderboard
              </span>
            </TabsTrigger>
            <TabsTrigger
              value={TAB_VALUES.PERFORMANCE}
              className="whitespace-nowrap rounded-lg px-2 py-1.5 text-gray-600 transition-all hover:bg-gray-100/70 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm sm:px-6 sm:py-2"
            >
              <span className="text-xs font-medium sm:text-sm">
                Performance
              </span>
            </TabsTrigger> */}
              </TabsList>
            </div>

            <TabsContent
              value={TAB_VALUES.OVERVIEW}
              className="space-y-4 sm:space-y-6"
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

            <TabsContent
              value={TAB_VALUES.OVERVIEW_2}
              className="space-y-4 sm:space-y-6"
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

            <TabsContent value={TAB_VALUES.LEADERBOARD}>
              <div className="my-4 sm:my-6">
                <LeaderboardTable />
              </div>
            </TabsContent>

            <TabsContent
              value={TAB_VALUES.PERFORMANCE}
              className="space-y-4 sm:space-y-6"
            >
              <PerformanceContent />
            </TabsContent>
          </Tabs>

          <Footer />
        </div>
      </EvaluationProvider>
    </Suspense>
  );
}
