import { CompetitionType, DataType, Task } from "@/types";
import { fetchPerformance } from "./performance";

// Extract unique tasks from performance data
export const fetchTasks = (
  dataType: DataType,
  competition: CompetitionType,
): Task[] => {
  const taskMap = new Map<string, Task>();

  const performances = fetchPerformance(
    dataType,
    competition,
  );

  performances.forEach((perf) => {
    taskMap.set(perf.taskId, {
      id: perf.taskId,
      name: perf.taskName,
      organ: perf.organ,
      taskType: perf.taskName,
      cohort: perf.organ,
      evaluationMetrics: [perf.metrics],
      description: `${perf.taskName} task for ${perf.organ}`,
      info: {
        description: `${perf.taskName} task for ${perf.organ}`,
        referenceUrl: "",
        referenceTitle: "",
      },
    });
  });

  return Array.from(taskMap.values());
};
