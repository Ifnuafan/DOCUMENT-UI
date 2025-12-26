// lib/nav.ts
import {
  Squares2X2Icon,
  DocumentTextIcon,
  RectangleStackIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export const NAV = [
  {
    group: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
      { label: "Documents", href: "/documents", icon: DocumentTextIcon },
      { label: "Versions", href: "/versions", icon: RectangleStackIcon },
    ],
  },
  {
    group: "Compare",
    items: [
      { label: "New Compare", href: "/", icon: ArrowsRightLeftIcon }, // ✅ ใช้ / ตามของคุณ
      { label: "History", href: "/history", icon: ClockIcon },
    ],
  },
  {
    group: "Output",
    items: [{ label: "Reports", href: "/reports", icon: DocumentChartBarIcon }],
  },
  {
    group: "Admin",
    items: [{ label: "Settings", href: "/settings", icon: Cog6ToothIcon }],
  },
] as const;
