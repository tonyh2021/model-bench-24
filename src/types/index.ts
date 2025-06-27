export interface Organ {
  id: string;
  name: string;
  description: string;
}

export interface Task {
  id: string;
  name: string;
  organ: string;
  taskType: string;
  cohort: string;
  evaluationMetrics: string[];
  description?: string;
  info?: TaskInfo;
}

export interface TaskInfo {
  description: string;
  referenceUrl?: string;
  referenceTitle?: string;
}

export interface Model {
  name: string;
  citation: string;
  slides: string;
  patches: string;
  parameters: string;
  architecture: string;
  pretraining_strategy: string;
  pretraining_data_source: string;
  stain: string;
  released_date: string;
  publication: string;
}

export interface Performance {
  id: string;
  modelId: string;
  organ: string;
  taskName: string;
  dataType: string;
  taskId: string;
  metrics: string;
  rankMean: number;
  rank: number;
}

export enum DataType {
  AllData = "AllData",
}

export enum CompetitionType {
  Segment = "1847",
}
