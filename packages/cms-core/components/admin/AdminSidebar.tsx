"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Image,
  FolderDown,
  Megaphone,
  Link2,
  Tag,
  Users,
  Settings,
  Inbox,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
} from "lucide-react";
import { ThemeToggle } from "@cms/components/admin/ThemeToggle";
import { SidebarProfileMenu } from "@cms/components/admin/SidebarProfileMenu";
import { SidebarClock } from "@cms/components/admin/SidebarClock";
import { SidebarTooltip } from "@cms/components/admin/SidebarTooltip";
import { useNavigationGuard } from "@cms/components/admin/NavigationGuardProvider";
import { AdminTour } from "@cms/components/admin/onboarding/AdminTour";
import { useOnboarding } from "@cms/components/admin/onboarding/useOnboarding";

interface AdminSidebarProps {
  children: ReactNode;
  role: string;
  userName: string;
}

export function AdminSidebar({ children, role, userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { isDirty, requestNavigation } = useNavigationGuard();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname.startsWith("/admin/reset-password/");

  if (isAuthPage) {
    return <>{children}</>;
  }

  const iconSize = "w-4 h-4";

  const navLink = (href: string, label: string, icon: ReactNode, exact = false, tourId?: string) => {
    const active = exact ? pathname === href : pathname.startsWith(href);
    return (
      <SidebarTooltip key={href} label={label} collapsed={collapsed}>
        <Link
          href={href}
          data-tour-id={tourId}
          onClick={(e) => {
            if (isDirty) {
              e.preventDefault();
              requestNavigation(href);
            }
          }}
          className={`flex items-center rounded-xl transition-all ${
            collapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5"
          } ${
            active
              ? "bg-secondary text-secondary-foreground"
              : "hover:bg-secondary/50 hover:text-secondary-foreground"
          }`}
        >
          <span className="opacity-70">{icon}</span>
          {!collapsed && <span>{label}</span>}
        </Link>
      </SidebarTooltip>
    );
  };

  const sectionLabel = (label: string) => {
    if (collapsed) {
      return <div className="border-t border-border mx-2 my-2" />;
    }
    return (
      <div className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
        {label}
      </div>
    );
  };

  return (
    <div className="admin-wrapper dark flex h-screen bg-background text-foreground">
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-card border-r border-border flex flex-col transition-all duration-200 shrink-0`}
      >
        {/* Header */}
        {collapsed ? (
          /* Collapsed: icon centered, toggle below */
          <div className="flex flex-col items-center border-b border-border py-3 gap-2">
            <img src="/Near-logo-w.png" alt="NEAR" className="h-5 w-auto" />
            <button
              onClick={() => setCollapsed((v) => !v)}
              title="Expand sidebar"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Expanded: logo + toggle in same row */
          <div className="flex items-center justify-between px-6 border-b border-border h-[73px]">
            <img src="/near-ai.png" alt="NEAR AI" className="h-5 w-auto" />
            <button
              onClick={() => setCollapsed((v) => !v)}
              title="Collapse sidebar"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className={`flex-1 py-4 space-y-1 px-3`}>
          {navLink("/admin/dashboard",  "Dashboard",         <LayoutDashboard className={iconSize} />, true, "dashboard")}
          {navLink("/admin/posts",      "Blog Posts",        <FileText        className={iconSize} />, false, "posts")}
          {navLink("/admin/pages",      "Pages",             <Layers          className={iconSize} />)}
          {navLink("/admin/media",      "Media Library",     <Image           className={iconSize} />, true, "media")}
          {navLink("/admin/downloads",  "Downloads",         <FolderDown      className={iconSize} />, true, "downloads")}
          {navLink("/admin/banners",    "Banners",           <Megaphone       className={iconSize} />, true, "banners")}
          {navLink("/admin/linktrees",  "Linktrees",         <Link2           className={iconSize} />, false, "linktrees")}
          {navLink("/admin/categories", "Categories & Tags", <Tag             className={iconSize} />, true, "categories")}
          {navLink("/admin/feedback",   "Site Feedback",     <MessageSquare   className={iconSize} />, true)}
          {role === "ADMIN" && (
            <>
              {sectionLabel("Management")}
              {navLink("/admin/form-submissions", "Form Submissions", <Inbox className={iconSize} />, true)}
              {navLink("/admin/users", "Users", <Users className={iconSize} />, true)}
              {navLink("/admin/advanced", "Advanced", <Settings className={iconSize} />, true)}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className={`border-t border-border space-y-3 ${collapsed ? "p-2" : "p-4"}`}>
          <SidebarClock collapsed={collapsed} />
          <RestartTourButton collapsed={collapsed} />
          <ThemeToggle collapsed={collapsed} />
          <SidebarProfileMenu userName={userName} role={role} collapsed={collapsed} />
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">{children}</div>
      </main>

      <AdminTour userName={userName} />
    </div>
  );
}

function RestartTourButton({ collapsed }: { collapsed: boolean }) {
  const onboarding = useOnboarding();

  const handleRestart = () => {
    onboarding.restartTour();
  };

  if (collapsed) {
    return (
      <SidebarTooltip label="Restart tour" collapsed>
        <button
          onClick={handleRestart}
          className="w-full p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </SidebarTooltip>
    );
  }

  return (
    <button
      onClick={handleRestart}
      className="w-full px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition flex items-center gap-3 text-sm"
    >
      <RotateCcw className="w-4 h-4 opacity-70" />
      <span>Restart tour</span>
    </button>
  );
}
