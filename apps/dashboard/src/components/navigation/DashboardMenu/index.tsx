"use client";

import clsx from "@/lib/clsx";
import { LayoutDashboardIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { WorkspaceSwitcher } from "@/components/navigation/WorkspaceSwitcher";
import { ProjectList } from "@/components/navigation/ProjectList";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";

import styles from "./styles.module.css";

export type DashboardMenuProps = {
  className?: string;
};

export function DashboardMenu({ className }: DashboardMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardHome =
    pathname === "/dashboard" || pathname === "/dashboard/";

  return (
    <Box
      as="aside"
      direction="column"
      gap={24}
      className={clsx(styles.menu, className)}
    >
      <Button
        type="button"
        variant="ghost"
        aria-current={isDashboardHome ? "page" : undefined}
        className={clsx(
          styles.dashboardLink,
          isDashboardHome && styles.active,
        )}
        onClick={() => router.push("/dashboard")}
      >
        <LayoutDashboardIcon size={20} aria-hidden />
        Tableau de bord
      </Button>
      <ProjectList />
      <WorkspaceSwitcher className={styles.workspaceSwitcher} />
    </Box>
  );
}
