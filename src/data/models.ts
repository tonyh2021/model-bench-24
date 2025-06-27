"use client";

import { CompetitionType, DataType, Model } from "@/types";
import allModelsData from "./model_all.json";

const modelsAll: Model[] = allModelsData;

export const fetchModels = (
  dataType: DataType,
  competition: CompetitionType,
): Model[] => {
  return modelsAll;
};
