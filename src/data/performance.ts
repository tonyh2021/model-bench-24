"use client";

import {
  CompetitionType,
  DataType,
  Performance,
} from "@/types";
import performanceAllData from "./performance_all.json";
import performanceAllData2 from "./performance_all_2.json";

const performanceAll: Performance[] =
  performanceAllData.map((item) => ({
    id: item.id,
    modelId: item.model_id,
    organ: item.organ,
    taskName: item.task_name,
    dataType: item.data_type,
    taskId: item.id.toString().slice(0, -2),
    metrics: item.metrics,
    rankMean: item.rank_mean,
    rank: item.rank,
  }));

const performanceAll2: Performance[] =
  performanceAllData2.map((item) => ({
    id: item.id,
    modelId: item.model_id,
    organ: item.organ,
    taskName: item.task_name,
    dataType: item.data_type,
    taskId: item.id.toString().slice(0, -2),
    metrics: item.metrics,
    rankMean: item.rank_mean,
    rank: item.rank,
  }));

export const fetchPerformance = (
  dataType: DataType,
  competition: CompetitionType,
): Performance[] => {
  console.log(dataType, competition);
  if (dataType === DataType.AllData) {
    return performanceAll;
  } else {
    return performanceAll2;
  }
};
