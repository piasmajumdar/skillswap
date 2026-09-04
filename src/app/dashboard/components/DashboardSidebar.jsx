"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FiGrid,
  FiPlus,
  FiList,
  FiFileText,
  FiBriefcase,
  FiDollarSign,
  FiUsers,
  FiClipboard,
  FiCreditCard,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const navigation = {
  client: [
    ["Dashboard", "/dashboard/client", FiGrid],
    ["Post a Task", "/dashboard/client/post-task", FiPlus],
    ["My Tasks", "/dashboard/client/my-tasks", FiList],
    ["Manage Proposals", "/dashboard/client/proposals", FiFileText],
    ["Payments History", "/dashboard/client/payments-history", FiFileText],
    ["Edit Profile", "/dashboard/client/profile", FiUser],
  ],

  freelancer: [
    ["Dashboard", "/dashboard/freelancer", FiGrid],
    ["Browse Tasks", "/tasks", FiBriefcase],
    ["My Proposals", "/dashboard/freelancer/my-proposals", FiFileText],
    ["Active Projects", "/dashboard/freelancer/active-projects", FiClipboard],
    ["My Earnings", "/dashboard/freelancer/earnings", FiDollarSign],
    ["Edit Profile", "/dashboard/freelancer/profile", FiUser],
  ],

  admin: [
    ["Dashboard", "/dashboard/admin", FiGrid],
    ["Manage Users", "/dashboard/admin/users", FiUsers],
    ["Manage Tasks", "/dashboard/admin/tasks", FiClipboard],
    ["Transactions", "/dashboard/admin/transactions", FiCreditCard],
  ],
};

const DashboardSidebar = () => {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role?.toLowerCase();

  const menuItems = navigation[role] || [];

  const isActive = (href) => {
    const dashboardRoutes = [
      "/dashboard/client",
      "/dashboard/freelancer",
      "/dashboard/admin",
    ];

    return dashboardRoutes.includes(href)
      ? pathname === href
      : pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const result = await authClient.signOut();

      if (result?.error) {
        toast.error(result.error.message || "Failed to logout.");
        return;
      }

      toast.success("Logged out successfully.");

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while logging out.");
    } finally {
      setLoggingOut(false);
    }
  };

  /*
    |--------------------------------------------------------------------------
    | Loading Skeleton
    |--------------------------------------------------------------------------
    */

  if (isPending) {
    return (
      <>
        {/* Mobile Header Skeleton */}
        <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
          <div className="h-8 w-32 animate-pulse rounded-md bg-slate-200" />

          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />
        </div>

        {/* Desktop Sidebar Skeleton */}
        <aside
          className="
                        relative
                        hidden
                        h-screen
                        w-[260px]
                        shrink-0
                        flex-col
                        border-r
                        border-slate-200
                        bg-white
                        md:flex
                    "
        >
          {/* Logo */}
          <div className="flex h-[88px] items-center border-b border-slate-100 px-6">
            <div className="h-9 w-36 animate-pulse rounded-md bg-slate-200" />
          </div>

          {/* Dashboard Label */}
          <div className="px-4 pt-5">
            <div className="h-[62px] animate-pulse rounded-xl bg-slate-100" />
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-5">
            <div className="space-y-3">
              <div className="h-11 animate-pulse rounded-lg bg-slate-100" />

              <div className="h-11 animate-pulse rounded-lg bg-slate-100" />

              <div className="h-11 animate-pulse rounded-lg bg-slate-100" />

              <div className="h-11 animate-pulse rounded-lg bg-slate-100" />

              <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>

          {/* User + Logout */}
          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />

                <div className="h-3 w-14 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>

            <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* -----------------------------------------------------------------
                Mobile Header
            ----------------------------------------------------------------- */}

      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-md md:hidden">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <div className="relative h-8 w-8">
            <Image
              src="/logo.png"
              alt="SkillSwap"
              fill
              sizes="32px"
              className="object-contain"
            />
          </div>

          <span className="text-lg font-bold tracking-tight text-slate-900">
            Skill<span className="text-indigo-600">Swap</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Open dashboard menu"
        >
          <FiMenu size={23} />
        </button>
      </div>

      {/* -----------------------------------------------------------------
                Mobile Overlay
            ----------------------------------------------------------------- */}

      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] md:hidden"
          aria-label="Close menu"
        />
      )}

      {/* -----------------------------------------------------------------
                Dashboard Sidebar
            ----------------------------------------------------------------- */}

      <aside
        className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-[260px] shrink-0 flex-col
                    border-r border-slate-200
                    bg-white
                    shadow-xl shadow-slate-200/40
                    transition-transform duration-300

                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

                    md:relative
                    md:translate-x-0
                    md:shadow-none
                `}
      >
        {/* Logo */}
        <div className="flex h-[88px] items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="relative h-9 w-9">
              <Image
                src="/logo.png"
                alt="SkillSwap Logo"
                fill
                sizes="36px"
                priority
                className="object-contain"
              />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              Skill<span className="text-indigo-600">Swap</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Close menu"
          >
            <FiX size={21} />
          </button>
        </div>

        {/* Dashboard Label */}
        <div className="px-4 pt-5">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Dashboard
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
              {role} Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <ul className="space-y-1.5">
            {menuItems.map(([label, href, Icon]) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                                        group flex items-center gap-3
                                        rounded-lg px-4 py-3
                                        text-sm font-medium
                                        transition-all

                                        ${
                                          isActive(href)
                                            ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                        }
                                    `}
                >
                  <Icon
                    size={19}
                    className={
                      isActive(href)
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-indigo-600"
                    }
                  />

                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User + Logout */}
        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-indigo-100">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user?.name || "User"}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-indigo-600">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>

              <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 ring-1 ring-indigo-100">
                {role}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="
                            group flex w-full items-center gap-3
                            rounded-lg px-4 py-3
                            text-sm font-medium
                            text-slate-600
                            transition-all
                            hover:bg-red-50
                            hover:text-red-600
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            cursor-pointer
                        "
          >
            <FiLogOut
              size={19}
              className="text-slate-400 group-hover:text-red-500"
            />

            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
