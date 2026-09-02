import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserProfileRightNav from "./UserProfileRightNav";
import { plusJakarta } from "@/app/layout";
import NavLink from "./NavLink";
import { Button, Drawer } from "@heroui/react";
import { ImMenu } from "react-icons/im";

const Navbar = async () => {
    const links = (
        <>
            <li>
                <NavLink href="/">Home</NavLink>
            </li>

            <li>
                <NavLink href="/browse-tasks">Browse Tasks</NavLink>
            </li>

            <li>
                <NavLink href="/browse-freelancers">
                    Browse Freelancers
                </NavLink>
            </li>
        </>
    );

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">

            <div className="mx-auto w-11/12 max-w-7xl">
                <div className="flex items-center justify-between py-4">

                    {/* LEFT: Logo + Mobile Menu */}
                    <div className="flex items-center gap-2">

                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Drawer>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    className="text-slate-700 dark:text-white"
                                >
                                    <ImMenu size={20} />
                                </Button>

                                <Drawer.Backdrop>
                                    <Drawer.Content placement="left" className="max-w-72">
                                        <Drawer.Dialog>

                                            <Drawer.Header>
                                                <Drawer.Heading>
                                                    <Link
                                                        href="/"
                                                        className={`${plusJakarta.className} flex items-center gap-2`}
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

                                                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                                                            Skill<span className="text-indigo-600">Swap</span>
                                                        </span>
                                                    </Link>
                                                </Drawer.Heading>
                                            </Drawer.Header>

                                            <Drawer.Body className="pt-6">
                                                <nav>
                                                    <ul className="flex flex-col gap-2">

                                                        <li>
                                                            <Button
                                                                slot="close"
                                                                variant="light"
                                                                className="w-full justify-start"
                                                            >
                                                                <NavLink
                                                                    href="/"
                                                                    className="w-full"
                                                                >
                                                                    Home
                                                                </NavLink>
                                                            </Button>
                                                        </li>

                                                        <li>
                                                            <Button
                                                                slot="close"
                                                                variant="light"
                                                                className="w-full justify-start"
                                                            >
                                                                <NavLink
                                                                    href="/browse-tasks"
                                                                    className="w-full"
                                                                >
                                                                    Browse Tasks
                                                                </NavLink>
                                                            </Button>
                                                        </li>

                                                        <li>
                                                            <Button
                                                                slot="close"
                                                                variant="light"
                                                                className="w-full justify-start"
                                                            >
                                                                <NavLink
                                                                    href="/browse-freelancers"
                                                                    className="w-full"
                                                                >
                                                                    Browse Freelancers
                                                                </NavLink>
                                                            </Button>
                                                        </li>

                                                       

                                                    </ul>
                                                </nav>
                                            </Drawer.Body>

                                        </Drawer.Dialog>
                                    </Drawer.Content>
                                </Drawer.Backdrop>
                            </Drawer>
                        </div>


                        {/* Logo */}
                        <Link
                            href="/"
                            className={`${plusJakarta.className} flex items-center gap-2`}
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

                            <h2 className="hidden text-xl font-bold tracking-tight text-slate-900 sm:block dark:text-white">
                                Skill<span className="text-indigo-600">Swap</span>
                            </h2>
                        </Link>

                    </div>


                    {/* DESKTOP PUBLIC NAVIGATION */}
                    <nav className="hidden md:block">
                        <ul className="flex items-center gap-1">
                            {links}
                        </ul>
                    </nav>


                    {/* RIGHT SIDE */}
                    <UserProfileRightNav />

                </div>
            </div>

        </header>
    );
};

export default Navbar;