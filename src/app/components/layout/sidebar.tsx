import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  FolderOpen,
  Palette,
  UserCircle,
  Settings,
  ChevronLeft,
  Library,
  LayoutTemplate,
  BarChart3,
  FileJson,
  Globe,
} from "lucide-react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { clsx } from "clsx";
import { BrandLogo } from "../ui/brand-logo";
import { LanguageSwitcher } from "./language-switcher";

const NAV_ITEMS = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: Home },
  { id: "projects", labelKey: "nav.projects", icon: FolderOpen },
  { id: "audits", labelKey: "nav.audits", icon: BarChart3 },
  { id: "brand-kit", labelKey: "nav.brandKit", icon: Palette },
  { id: "writer-profiles", labelKey: "nav.writerProfiles", icon: UserCircle },
  { id: "resources", labelKey: "nav.resources", icon: Library },
  { id: "templates", labelKey: "nav.templates", icon: LayoutTemplate },
  { id: "settings", labelKey: "nav.settings", icon: Settings },
];

export function Sidebar() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.slice(1) || 'dashboard';

  return (
    <TooltipPrimitive.Provider delayDuration={120} skipDelayDuration={0}>
      <aside
        className="relative h-screen bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0"
        style={{
          width: collapsed ? 56 : 240,
          transition: "width 200ms ease",
          minWidth: collapsed ? 56 : 240,
        }}
      >
        {/* ── Logo ── */}
        <div
          className={clsx(
            "flex items-center h-14 border-b border-sidebar-border flex-shrink-0 overflow-hidden",
            collapsed ? "justify-center px-0" : "px-4 gap-3"
          )}
        >
          <BrandLogo
            variant={collapsed ? "icon" : "full"}
            size={collapsed ? 28 : "md"}
            className="flex-shrink-0"
          />
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 px-2 pt-3 pb-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.id || currentPath.startsWith(item.id + '/');
            const Icon = item.icon;

            return (
              <TooltipPrimitive.Root key={item.id}>
                <TooltipPrimitive.Trigger asChild>
                  <Link
                    to={`/${item.id}`}
                    className={clsx(
                      "relative w-full flex items-center rounded-lg mb-0.5",
                      "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "transition-colors duration-150",
                      collapsed ? "justify-center p-[11px]" : "gap-3 px-3 py-[9px]",
                      isActive
                        ? "bg-primary/[0.11] text-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {/* Left accent strip */}
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-primary"
                      style={{
                        height: isActive ? 20 : 0,
                        opacity: isActive ? 1 : 0,
                        transition: "height 200ms ease, opacity 150ms ease",
                      }}
                    />

                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />

                    {/* Label */}
                    <div
                      className="overflow-hidden"
                      style={{
                        maxWidth: collapsed ? 0 : 140,
                        opacity: collapsed ? 0 : 1,
                        transition: "max-width 200ms ease, opacity 120ms ease",
                      }}
                    >
                      <span
                        className={clsx(
                          "block text-sm font-medium whitespace-nowrap",
                          isActive ? "text-foreground" : ""
                        )}
                      >
                        {t(item.labelKey)}
                      </span>
                    </div>
                  </Link>
                </TooltipPrimitive.Trigger>

                {collapsed && (
                  <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                      side="right"
                      sideOffset={10}
                      className={clsx(
                        "z-50 select-none rounded-md px-2.5 py-1.5",
                        "bg-card text-card-foreground text-xs font-medium",
                        "border border-border shadow-xl",
                        "will-change-[transform,opacity]",
                        "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0",
                        "data-[side=right]:data-[state=delayed-open]:slide-in-from-left-1"
                      )}
                    >
                      {t(item.labelKey)}
                      <TooltipPrimitive.Arrow
                        width={8}
                        height={4}
                        className="fill-card"
                      />
                    </TooltipPrimitive.Content>
                  </TooltipPrimitive.Portal>
                )}
              </TooltipPrimitive.Root>
            );
          })}
        </nav>

        {/* ── Language Switcher ── */}
        <div className="px-2 py-2">
          {!collapsed ? (
            <LanguageSwitcher />
          ) : (
            <div className="flex justify-center">
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* ── Collapse toggle ── */}
        <div className="border-t border-sidebar-border px-2 py-3">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={clsx(
              "w-full flex items-center rounded-lg p-2.5",
              "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              "transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring",
              collapsed ? "justify-center" : "gap-2"
            )}
            aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
          >
            <ChevronLeft
              className="w-4 h-4 flex-shrink-0"
              style={{
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms ease",
              }}
            />
            <div
              className="overflow-hidden"
              style={{
                maxWidth: collapsed ? 0 : 80,
                opacity: collapsed ? 0 : 1,
                transition: "max-width 200ms ease, opacity 120ms ease",
              }}
            >
              <span className="text-xs font-medium whitespace-nowrap">
                {t('nav.collapse')}
              </span>
            </div>
          </button>
        </div>
      </aside>
    </TooltipPrimitive.Provider>
  );
}
