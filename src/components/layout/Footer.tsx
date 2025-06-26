"use client";

import { useEffect, useRef, useState } from "react";

export function Footer() {
  const clustrmapsContainerRef =
    useRef<HTMLDivElement | null>(null);
  const [currentYear, setCurrentYear] =
    useState<string>("");
  const [buildInfo, setBuildInfo] = useState({
    buildTimestamp:
      process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || "",
  });

  useEffect(() => {
    console.log(
      `Last updated: ${buildInfo.buildTimestamp} UTC`,
    );
    setCurrentYear(new Date().getFullYear().toString());
    if (!buildInfo.buildTimestamp) {
      setBuildInfo({
        buildTimestamp: new Date()
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
      });
    }

    const loadClusterMaps = () => {
      // 检查是否在客户端环境
      if (
        typeof window === "undefined" ||
        typeof document === "undefined"
      ) {
        return;
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "clustrmaps";
      script.src =
        "//clustrmaps.com/map_v2.js?d=6JsXBcGcARt_EW18e64lIGhVpCxBw31yOysM5PYFNBw&cl=ffffff&w=a";
      script.async = true;

      if (clustrmapsContainerRef.current) {
        clustrmapsContainerRef.current.appendChild(script);
      }
    };

    loadClusterMaps();
    return () => {
      if (typeof document !== "undefined") {
        const script =
          document.getElementById("clustrmaps");
        if (script) {
          script.remove();
        }
      }
    };
  }, [buildInfo.buildTimestamp]);

  return (
    <footer className="mt-8 w-full border-t sm:mt-12">
      <div className="flex min-h-[200px] w-full flex-col items-center justify-center">
        <div
          ref={clustrmapsContainerRef}
          style={{
            width: "200px",
            height: "150px",
          }}
          className="mt-5 flex items-center justify-center"
        ></div>

        <div className="mt-3 flex justify-center px-4 pb-1">
          <p
            className="text-center text-xs text-muted-foreground"
            suppressHydrationWarning
          >
            © {currentYear || "2025"} University of Toronto
          </p>
        </div>

        <div className="flex justify-center">
          <p
            className="text-center text-xs text-muted-foreground"
            suppressHydrationWarning
          >
            <a
              href="https://github.com/tonyh2021/model-bench-24"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Model-Bench&nbsp;·&nbsp;
            </a>
            Inspired by{" "}
            <a
              href="https://github.com/birkhoffkiki/PathBench/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              PathBench
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
