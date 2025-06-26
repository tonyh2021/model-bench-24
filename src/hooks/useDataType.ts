import { useSearchParams } from "next/navigation";
import { DataType } from "@/types";

export function useDataType() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const dataType =
    data === "avg" ? DataType.AVG : DataType.AllData;

  return dataType;
}
