"use client";

import { CompetitionType, DataType, Model } from "@/types";
import allModelsData from "./model_all.json";
import allModelsData2 from "./model_all_2.json";

const modelsAll: Model[] = allModelsData;
const modelsAll2: Model[] = allModelsData2;

export const fetchModels = (
  dataType: DataType,
  competition: CompetitionType,
): Model[] => {
  if (dataType === DataType.AllData) {
    return modelsAll;
  } else {
    return modelsAll2;
  }
};
