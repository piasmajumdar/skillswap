"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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



/*
|--------------------------------------------------------------------------
| Sidebar Navigation
|--------------------------------------------------------------------------
*/

const navigation = {
    client: [
        {
            label: "Dashboard",
            href: "/dashboard/client",
            icon: FiGrid,
        },
        {
            label: "Post a Task",
            href: "/dashboard/client/post-task",
            icon: FiPlus,
        },
        {
            label: "My Tasks",
            href: "/dashboard/client/my-tasks",
            icon: FiList,
        },
        {
            label: "Manage Proposals",
            href: "/dashboard/client/proposals",
            icon: FiFileText,
        },
        {
            label: "Edit Profile",
            href: "/dashboard/client/profile",
            icon: FiUser,
        },
    ],

    freelancer: [
        {
            label: "Dashboard",
            href: "/dashboard/freelancer",
            icon: FiGrid,
        },
        {
            label: "Browse Tasks",
            href: "/dashboard/freelancer/browse-tasks",
            icon: FiBriefcase,
        },
        {
            label: "My Proposals",
            href: "/dashboard/freelancer/my-proposals",
            icon: FiFileText,
        },
        {
            label: "Active Projects",
            href: "/dashboard/freelancer/active-projects",
            icon: FiClipboard,
        },
        {
            label: "My Earnings",
            href: "/dashboard/freelancer/earnings",
            icon: FiDollarSign,
        },
        {
            label: "Edit Profile",
            href: "/dashboard/freelancer/profile",
            icon: FiUser,
        },
    ],

    admin: [
        {
            label: "Dashboard",
            href: "/dashboard/admin",
            icon: FiGrid,
        },
        {
            label: "Manage Users",
            href: "/dashboard/admin/users",
            icon: FiUsers,
        },
        {
            label: "Manage Tasks",
            href: "/dashboard/admin/tasks",
            icon: FiClipboard,
        },
        {
            label: "Transactions",
            href: "/dashboard/admin/transactions",
            icon: FiCreditCard,
        },
    ],
};


/*
|--------------------------------------------------------------------------
| Role Labels
|--------------------------------------------------------------------------
*/

const roleLabels = {
    client: "Client",
    freelancer: "Freelancer",
    admin: "Admin",
};


/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

const DashboardSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const {
        data: session,
        isPending,
    } = authClient.useSession();


    /*
    |--------------------------------------------------------------------------
    | User
    |--------------------------------------------------------------------------
    */

    const user = session?.user;

    const role = user?.role?.toLowerCase();

    const menuItems = navigation[role] || [];


    /*
    |--------------------------------------------------------------------------
    | Active Link
    |--------------------------------------------------------------------------
    */

    const isActive = (href) => {
        // Dashboard should only be active on the exact dashboard route.
        if (
            href === "/dashboard/client" ||
            href === "/dashboard/freelancer" ||
            href === "/dashboard/admin"
        ) {
            return pathname === href;
        }

        return pathname.startsWith(href);
    };


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            const result = await authClient.signOut();

            if (result?.error) {
                toast.error(
                    result.error.message || "Failed to logout."
                );
                return;
            }

            toast.success("Logged out successfully.");

            setMobileOpen(false);

            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);

            toast.error(
                "Something went wrong while logging out."
            );
        } finally {
            setLoggingOut(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const handleNavigation = () => {
        setMobileOpen(false);
    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (isPending) {
        return (
            <>
                {/* Mobile Header */}
                <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white px-4 md:hidden">
                    <div className="h-9 w-32 animate-pulse rounded-md bg-slate-100" />
                </div>

                {/* Desktop Sidebar */}
                <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] border-r border-slate-200 bg-white md:block">
                    <div className="p-6">
                        <div className="h-9 w-32 animate-pulse rounded-md bg-slate-100" />
                    </div>
                </aside>
            </>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Sidebar
    |--------------------------------------------------------------------------
    */

    return (
        <>
            {/* =========================================================
                MOBILE TOP BAR
            ========================================================= */}

            <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-md md:hidden">

                {/* Logo */}
                <Link
                    href="/"
                    className={`flex items-center gap-2`}
                    onClick={handleNavigation}
                >
                    <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                        <Image
                            src="/logo.png"
                            alt="SkillSwap"
                            sizes="32px"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <span className="text-lg font-bold tracking-tight text-slate-900">
                        Skill
                        <span className="text-indigo-600">
                            Swap
                        </span>
                    </span>
                </Link>


                {/* Menu Button */}
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
                    aria-label="Open dashboard menu"
                >
                    <FiMenu size={23} />
                </button>
            </div>


            {/* =========================================================
                MOBILE OVERLAY
            ========================================================= */}

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close dashboard menu"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] md:hidden"
                />
            )}


            {/* =========================================================
                SIDEBAR
            ========================================================= */}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-[260px] flex-col
                    border-r border-slate-200
                    bg-white
                    shadow-xl shadow-slate-200/40
                    transition-transform duration-300 ease-in-out

                    md:translate-x-0 md:shadow-none

                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* =====================================================
                    LOGO
                ===================================================== */}

                <div className="flex h-[88px] items-center justify-between border-b border-slate-100 px-6">

                    <Link
                        href="/"
                        onClick={handleNavigation}
                        className={`$flex items-center gap-2`}
                    >
                        <div className="relative h-9 w-9 overflow-hidden rounded-lg">
                            <Image
                                src="/logo.png"
                                alt="SkillSwap Logo"
                                sizes="36px"
                                fill
                                priority
                                className="object-contain"
                            />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Skill
                            <span className="text-indigo-600">
                                Swap
                            </span>
                        </span>
                    </Link>


                    {/* Mobile Close */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 md:hidden"
                        aria-label="Close dashboard menu"
                    >
                        <FiX size={21} />
                    </button>
                </div>


                {/* =====================================================
                    USER ROLE / DASHBOARD LABEL
                ===================================================== */}

                <div className="px-4 pt-5">

                    <div className="rounded-xl bg-slate-50 px-4 py-3">

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Dashboard
                        </p>

                        <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                            {role || "User"} Portal
                        </p>

                    </div>

                </div>


                {/* =====================================================
                    NAVIGATION
                ===================================================== */}

                <nav className="flex-1 overflow-y-auto px-4 py-5">

                    <ul className="space-y-1.5">

                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <li key={item.href}>

                                    <Link
                                        href={item.href}
                                        onClick={handleNavigation}
                                        className={`
                                            group flex items-center gap-3
                                            rounded-lg px-4 py-3
                                            text-sm font-medium
                                            transition-all duration-200

                                            ${
                                                active
                                                    ? "bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                            }
                                        `}
                                    >

                                        <Icon
                                            size={19}
                                            className={`
                                                shrink-0 transition-colors

                                                ${
                                                    active
                                                        ? "text-indigo-600"
                                                        : "text-slate-400 group-hover:text-indigo-600"
                                                }
                                            `}
                                        />

                                        <span>
                                            {item.label}
                                        </span>

                                    </Link>

                                </li>
                            );
                        })}

                    </ul>

                </nav>


                {/* =====================================================
                    BOTTOM USER SECTION
                ===================================================== */}

                <div className="border-t border-slate-200 p-4">

                    {/* User Information */}
                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                        {/* Avatar */}
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-indigo-100">

                            {user?.image ? (
                                <Image
                                    src={user.image}
                                    alt={user?.name || "User"}
                                    sizes="40px"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-indigo-600">
                                    {user?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "U"}
                                </div>
                            )}

                        </div>


                        {/* Name + Role */}
                        <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-semibold text-slate-900">
                                {user?.name || "User"}
                            </p>

                            <div className="mt-1">

                                <span className="
                                    inline-flex
                                    items-center
                                    rounded-full
                                    bg-indigo-50
                                    px-2
                                    py-0.5
                                    text-[10px]
                                    font-semibold
                                    capitalize
                                    text-indigo-600
                                    ring-1
                                    ring-indigo-100
                                ">
                                    {roleLabels[role] || role || "User"}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="
                            group flex w-full items-center gap-3
                            rounded-lg px-4 py-3
                            text-sm font-medium
                            text-slate-600
                            transition-all duration-200
                            hover:bg-red-50
                            hover:text-red-600
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        <FiLogOut
                            size={19}
                            className="text-slate-400 transition-colors group-hover:text-red-500"
                        />

                        <span>
                            {loggingOut
                                ? "Logging out..."
                                : "Logout"}
                        </span>

                    </button>

                </div>

            </aside>
        </>
    );
};

export default DashboardSidebar;