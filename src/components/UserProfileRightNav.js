"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@heroui/react";
import {
    Avatar,
    Dropdown,
    Label,
} from "@heroui/react";

import {
    ArrowRightFromSquare,
    LayoutHeaderSideContent,
    Person,
} from "@gravity-ui/icons";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

import ThemeToggle from "./ThemeToggle";

const UserProfileRightNav = () => {

    const router = useRouter();

    const {
        data: session,
        isPending,
    } = authClient.useSession();


    const handleLogOut = async () => {

        const data = await authClient.signOut();

        if (data?.data?.success) {
            toast.success("Logged out successfully");
            router.push("/");
            router.refresh();
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (isPending) {
        return (
            <div className="flex items-center gap-3">
                <ThemeToggle />

                <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Not Logged In
    |--------------------------------------------------------------------------
    */

    if (!session) {
        return (
            <div className="flex items-center gap-2">
                <ThemeToggle />

                <Button
                    className="
                        rounded-lg
                        bg-indigo-600
                        px-5
                        font-medium
                        text-white
                        shadow-sm
                        transition-all
                        hover:bg-indigo-700
                        hover:shadow-lg
                        hover:shadow-indigo-600/20
                    "
                >
                    <Link
                        href="/auth/login"
                    >
                        Login
                    </Link>
                </Button>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Logged In User
    |--------------------------------------------------------------------------
    */

    const user = session?.user;

    const role = user?.role;


    /*
    |--------------------------------------------------------------------------
    | Dashboard Route Based On Role
    |--------------------------------------------------------------------------
    */

    const getDashboardRoute = () => {

        switch (role) {

            case "admin":
            case "Admin":
                return "/dashboard/admin";

            case "freelancer":
            case "Freelancer":
                return "/dashboard/freelancer";

            case "client":
            case "Client":
            default:
                return "/dashboard/client";
        }
    };


    const dashboardRoute = getDashboardRoute();


    return (
        <div className="flex items-center gap-3">

            {/* Theme */}
            <ThemeToggle />


            {/* User Name */}
            <p className="hidden text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
                {user?.name?.split(" ")[0]}
            </p>


            {/* User Dropdown */}
            <Dropdown>

                <Dropdown.Trigger className="cursor-pointer rounded-full outline-none">

                    <Avatar className="h-9 w-9 ring-2 ring-indigo-100 transition-all hover:ring-indigo-300 dark:ring-indigo-900">
                        <Avatar.Image
                            src={user?.image}
                            alt={user?.name || "User profile"}
                        />

                        <Avatar.Fallback delayMs={600}>
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar>

                </Dropdown.Trigger>


                <Dropdown.Popover className="min-w-64">

                    {/* Profile Header */}
                    <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">

                        <div className="flex items-center gap-3">

                            <Avatar size="sm">
                                <Avatar.Image
                                    src={user?.image}
                                    alt={user?.name || "User profile"}
                                />

                                <Avatar.Fallback delayMs={600}>
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </Avatar.Fallback>
                            </Avatar>


                            <div className="min-w-0">

                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                    {user?.name}
                                </p>

                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                    {user?.email}
                                </p>

                                <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold capitalize text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                    {role}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Private Navigation */}
                    <Dropdown.Menu>

                        {/* Dashboard */}
                        <Dropdown.Item
                            id="dashboard"
                            textValue="Dashboard"
                        >
                            <Link
                                href={dashboardRoute}
                                className="flex w-full items-center gap-3"
                            >
                                <LayoutHeaderSideContent className="size-4" />

                                <Label>
                                    Dashboard
                                </Label>
                            </Link>
                        </Dropdown.Item>


                        {/* Profile */}
                        <Dropdown.Item
                            id="profile"
                            textValue="Profile"
                        >
                            <Link
                                href={`/dashboard/${role}/profile`}
                                className="flex w-full items-center gap-3"
                            >
                                <Person className="size-4" />

                                <Label>
                                    Profile
                                </Label>
                            </Link>
                        </Dropdown.Item>


                        {/* Divider */}
                        <Dropdown.Section>


                            {/* Logout */}
                            <Dropdown.Item
                                id="logout"
                                textValue="Logout"
                                variant="danger"
                                onClick={handleLogOut}
                            >

                                <div className="flex w-full items-center justify-between gap-3">

                                    <div className="flex items-center gap-3">
                                        <ArrowRightFromSquare className="size-4" />

                                        <Label>
                                            Logout
                                        </Label>
                                    </div>

                                </div>

                            </Dropdown.Item>

                        </Dropdown.Section>

                    </Dropdown.Menu>

                </Dropdown.Popover>

            </Dropdown>

        </div>
    );
};

export default UserProfileRightNav;