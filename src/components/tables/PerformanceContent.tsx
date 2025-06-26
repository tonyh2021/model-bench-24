"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  FaSearch,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { DetailedPerformanceChart } from "../charts/DetailedPerformanceChart";
import { LazyLoad } from "../ui/LazyLoad";
import { fetchTasks } from "@/data/tasks";
import { Task } from "@/types";
import { fetchModels } from "@/data/models";
import { useDataType } from "@/hooks/useDataType";
import { useCompetition } from "@/hooks/useCompetition";

export default function PerformanceContent() {
  const dataType = useDataType();
  const competition = useCompetition();
  const tasks = fetchTasks(dataType, competition);
  const models = fetchModels(dataType, competition);
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrgans, setSelectedOrgans] = useState<
    string[]
  >([]);
  const [selectedTaskTypes, setSelectedTaskTypes] =
    useState<string[]>([]);
  const [selectedCohorts, setSelectedCohorts] = useState<
    string[]
  >([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const allOrgans = useMemo(
    () =>
      [...new Set(tasks.map((task) => task.organ))].sort(),
    [],
  );
  const allTaskTypes = useMemo(
    () =>
      [
        ...new Set(tasks.map((task) => task.taskType)),
      ].sort(),
    [],
  );
  const allCohorts = useMemo(
    () =>
      [...new Set(tasks.map((task) => task.cohort))].sort(),
    [],
  );

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      // Search filter
      const matchesSearch =
        task.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        task.organ
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        task.taskType
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Organ filter
      const matchesOrgan =
        selectedOrgans.length === 0 ||
        selectedOrgans.includes(task.organ);

      // Task type filter
      const matchesTaskType =
        selectedTaskTypes.length === 0 ||
        selectedTaskTypes.includes(task.taskType);

      // Cohort filter
      const matchesCohort =
        selectedCohorts.length === 0 ||
        selectedCohorts.includes(task.cohort);

      return (
        matchesSearch &&
        matchesOrgan &&
        matchesTaskType &&
        matchesCohort
      );
    });
    return result;
  }, [
    searchTerm,
    selectedOrgans,
    selectedTaskTypes,
    selectedCohorts,
  ]);

  // Group filtered tasks by organ and sort alphabetically
  const tasksByOrgan = useMemo(() => {
    const organMap = new Map<string, Task[]>();

    filteredTasks.forEach((task) => {
      if (!organMap.has(task.organ)) {
        organMap.set(task.organ, []);
      }
      organMap.get(task.organ)!.push(task);
    });

    // Sort organs alphabetically and tasks within each organ
    const sortedOrgans = Array.from(organMap.keys()).sort();
    const result: { organ: string; tasks: Task[] }[] = [];

    sortedOrgans.forEach((organ) => {
      const organTasks = organMap
        .get(organ)!
        .sort((a, b) => a.name.localeCompare(b.name));
      result.push({ organ, tasks: organTasks });
    });

    return result;
  }, [filteredTasks]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedOrgans([]);
    setSelectedTaskTypes([]);
    setSelectedCohorts([]);
  };

  // Toggle filter functions
  const toggleOrgan = (organ: string) => {
    setSelectedOrgans((prev) =>
      prev.includes(organ)
        ? prev.filter((o) => o !== organ)
        : [...prev, organ],
    );
  };

  const toggleTaskType = (taskType: string) => {
    setSelectedTaskTypes((prev) =>
      prev.includes(taskType)
        ? prev.filter((t) => t !== taskType)
        : [...prev, taskType],
    );
  };

  const toggleCohort = (cohort: string) => {
    setSelectedCohorts((prev) =>
      prev.includes(cohort)
        ? prev.filter((c) => c !== cohort)
        : [...prev, cohort],
    );
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm ||
    selectedOrgans.length > 0 ||
    selectedTaskTypes.length > 0 ||
    selectedCohorts.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Detailed Performance
          </h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            Comprehensive performance analysis across all
            tasks and metrics
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-500 sm:text-sm">
            <span className="font-medium">
              {models.length}
            </span>{" "}
            models •
            <span className="ml-1 font-medium">
              {filteredTasks.length}
            </span>{" "}
            tasks
            {hasActiveFilters && (
              <span className="ml-1 text-blue-600">
                (filtered from {tasks.length})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2 sm:gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search tasks by name, organ, or type..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="pl-10"
            />
          </div>

          <div className="flex flex-shrink-0 gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-2 sm:gap-2 sm:px-4"
            >
              <FaFilter className="h-4 w-4" />
              <span className="hidden sm:inline">
                Filters
              </span>
              {hasActiveFilters && (
                <span className="ml-0.5 min-w-[18px] rounded-full bg-blue-500 px-1.5 py-0.5 text-center text-xs text-white sm:ml-1">
                  {
                    [
                      selectedOrgans.length,
                      selectedTaskTypes.length,
                      selectedCohorts.length,
                    ].filter((n) => n > 0).length
                  }
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-2 text-gray-600 hover:text-gray-900 sm:gap-2 sm:px-4"
              >
                <FaTimes className="h-3 w-3" />
                <span className="hidden sm:inline">
                  Clear
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Filter Panels */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Organ Filter */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  Filter by Organ
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[120px] overflow-y-auto sm:max-h-[180px]">
                <div className="space-y-2 sm:space-y-3">
                  {allOrgans.map((organ) => (
                    <div
                      key={organ}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`organ-${organ}`}
                        checked={selectedOrgans.includes(
                          organ,
                        )}
                        onCheckedChange={() =>
                          toggleOrgan(organ)
                        }
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label
                        htmlFor={`organ-${organ}`}
                        className="text-xs font-normal leading-tight sm:text-sm"
                      >
                        {organ}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Type Filter */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  Filter by Modality Type
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[120px] overflow-y-auto sm:max-h-[180px]">
                <div className="space-y-2 sm:space-y-3">
                  {allTaskTypes.map((taskType) => {
                    return (
                      <div
                        key={taskType}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`tasktype-${taskType}`}
                          checked={selectedTaskTypes.includes(
                            taskType,
                          )}
                          onCheckedChange={() =>
                            toggleTaskType(taskType)
                          }
                          className="h-3 w-3 sm:h-4 sm:w-4"
                        />
                        <Label
                          htmlFor={`tasktype-${taskType}`}
                          className="text-xs font-normal leading-tight sm:text-sm"
                        >
                          {taskType}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Cohort Filter */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  Filter by Cohort
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[120px] overflow-y-auto sm:max-h-[180px]">
                <div className="space-y-2 sm:space-y-3">
                  {allCohorts.map((cohort) => (
                    <div
                      key={cohort}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`cohort-${cohort}`}
                        checked={selectedCohorts.includes(
                          cohort,
                        )}
                        onCheckedChange={() =>
                          toggleCohort(cohort)
                        }
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label
                        htmlFor={`cohort-${cohort}`}
                        className="text-xs font-normal leading-tight sm:text-sm"
                      >
                        {cohort}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Performance Charts by Organ - Optimized with lazy loading */}
      {tasksByOrgan.length === 0 ? (
        <Card className="w-full border border-gray-200 shadow-sm">
          <CardContent className="flex h-64 flex-col items-center justify-center text-center">
            <FaSearch className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No tasks found
            </h3>
            <p className="mb-4 text-gray-500">
              {hasActiveFilters
                ? "Try adjusting your search terms or filters to find tasks."
                : "No tasks are available to display."}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="flex items-center gap-2"
              >
                <FaTimes className="h-4 w-4" />
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        tasksByOrgan.map(({ organ, tasks: organTasks }) => (
          <div
            key={organ}
            className="space-y-3 sm:space-y-4"
          >
            <h2 className="border-b pb-2 text-xl font-bold text-gray-900 sm:text-2xl">
              {organ}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({organTasks.length} task
                {organTasks.length !== 1 ? "s" : ""})
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
              {organTasks.map((task) => (
                <LazyLoad
                  key={task.id}
                  height={450}
                  rootMargin="200px"
                  threshold={0.1}
                  placeholder={
                    <div className="h-[450px] w-full animate-pulse rounded-lg border border-gray-200 bg-gray-50">
                      <div className="p-6">
                        <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
                        <div className="mb-6 h-4 w-1/2 rounded bg-gray-200"></div>
                        <div className="space-y-4">
                          <div className="h-8 w-full rounded bg-gray-200"></div>
                          <div className="h-8 w-5/6 rounded bg-gray-200"></div>
                          <div className="h-8 w-4/6 rounded bg-gray-200"></div>
                          <div className="h-8 w-3/6 rounded bg-gray-200"></div>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <DetailedPerformanceChart
                    taskId={task.id}
                    taskName={task.name}
                    organ={organ}
                  />
                </LazyLoad>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
