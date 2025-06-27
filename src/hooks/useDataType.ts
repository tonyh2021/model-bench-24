import { useSearchParams } from "next/navigation";
import { DataType } from "@/types";

export function useDataType() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const dataType = DataType.AllData;

  return dataType;
}
