import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isTruthyFlag(value?: string | number | null) {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return value === 1;
  const normalized = String(value).trim().toLowerCase();
  return normalized === "1" || normalized === "yes" || normalized === "true" || normalized === "y";
}

export function formatYesNo(value?: string | number | null) {
  return isTruthyFlag(value) ? "Yes" : "No";
}

const serverColorMap: Record<string, string> = {
  "Server 1 (OLG & CC)": "bg-orange-100 text-orange-800 border-orange-200",
  "Server 1": "bg-orange-100 text-orange-800 border-orange-200",
  "Server 2 (Gearhead & CC)": "bg-blue-100 text-blue-800 border-blue-200",
  "Server 2": "bg-blue-100 text-blue-800 border-blue-200",
  "Server 3 (Custom systems US)": "bg-purple-100 text-purple-800 border-purple-200",
  "Server 3": "bg-purple-100 text-purple-800 border-purple-200",
  "Server 4 (Dev)": "bg-red-100 text-red-800 border-red-200",
  "Server 4": "bg-red-100 text-red-800 border-red-200",
  "Server 5 (Temp)": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Server 5": "bg-cyan-100 text-cyan-800 border-cyan-200",
};

export function getServerBadgeClasses(serverName?: string) {
  if (!serverName) {
    return "bg-muted text-foreground border-transparent";
  }
  return serverColorMap[serverName] || "bg-muted text-foreground border-transparent";
}
