"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    Button,
    Checkbox,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";

import {
    Person,
    Lock,
    Briefcase,
    ShieldCheck,
} from "@gravity-ui/icons";

import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import { clientApi, withEmail } from "@/app/dashboard/components/clientApi";

const LoginPage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // ============================================================
    // Email Login
    // ============================================================

    const handleLogin = async (e) => {
        e.preventDefault();

        const formDataInput = new FormData(e.currentTarget);
        const formData = Object.fromEntries(formDataInput.entries());

        const { email, password } = formData;

        try {
            setLoading(true);

            const { data, error } = await authClient.signIn.email({
                email: email.trim(),
                password,
                rememberMe,
                // callbackURL: "/", --> Redirecting manually, it's not needed
            });

            if (error) {
                toast.error(
                    error.message || "Invalid email or password."
                );
                return;
            }

            if (data) {
                const account = await clientApi(
                    "/api/auth/account-status?email=" +
                    withEmail(data.user.email),
                );

                if (account.isBlocked) {
                    await authClient.signOut();
                    router.replace("/auth/blocked");
                    router.refresh();
                    return;
                }

                toast.success("Signed in successfully!");
                if (data.user.role === "freelancer") {
                    router.push("/dashboard/freelancer");
                }
                else if (data.user.role === "admin") {
                    router.push("/dashboard/admin");
                }
                else {
                    router.push('/')
                }
                router.refresh();
            }
        } catch (error) {
            console.error(error);

            toast.error(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // Google Login
    // ============================================================

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);

            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (error) {
            console.error(error);

            toast.error(
                "Google sign in failed. Please try again."
            );

            setGoogleLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">

            <div className="mx-auto flex min-h-screen w-11/12 max-w-7xl flex-col">

                {/* ========================================================
                    MAIN CONTENT
                ======================================================== */}

                <div className="grid flex-1 items-center gap-12 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

                    {/* ====================================================
                        LEFT SIDE
                    ==================================================== */}

                    <section className="hidden lg:block">

                        <div className="max-w-md">

                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 xl:text-5xl dark:text-white">
                                Welcome Back!
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Sign in to your account and continue your journey.
                            </p>

                            {/* ------------------------------------------------
                                Feature 1
                            ------------------------------------------------ */}

                            <div className="mt-12 flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    <Briefcase size={20} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Access your dashboard
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                        Manage your tasks and account from one place
                                    </p>
                                </div>

                            </div>

                            {/* ------------------------------------------------
                                Feature 2
                            ------------------------------------------------ */}

                            <div className="mt-8 flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    <Person size={20} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Manage your tasks
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                        Keep track of your work and connect with freelancers
                                    </p>
                                </div>

                            </div>

                            {/* ------------------------------------------------
                                Feature 3
                            ------------------------------------------------ */}

                            <div className="mt-8 flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    <ShieldCheck size={20} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Secure access
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                        Your account and personal information stay protected
                                    </p>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ====================================================
                        LOGIN CARD
                    ==================================================== */}

                    <section className="w-full">

                        <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                            {/* =================================================
                                CARD HEADER
                            ================================================= */}

                            <div className="px-6 pt-7 sm:px-8 sm:pt-8">

                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Sign In
                                </h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Enter your credentials to access your account
                                </p>

                            </div>


                            {/* =================================================
                                GOOGLE LOGIN
                            ================================================= */}

                            <div className="px-6 pt-6 sm:px-8">

                                <Button
                                    type="button"
                                    onPress={handleGoogleLogin}
                                    isLoading={googleLoading}
                                    isDisabled={googleLoading}
                                    variant="outline"
                                    className="
                                        h-11
                                        w-full
                                        rounded-lg
                                        border-slate-200
                                        bg-white
                                        font-medium
                                        text-slate-700
                                        shadow-none
                                        hover:bg-slate-50
                                        dark:border-slate-700
                                        dark:bg-white
                                        dark:text-slate-700
                                        dark:hover:bg-slate-50
                                    "
                                >
                                    {!googleLoading && (
                                        <FcGoogle size={19} />
                                    )}

                                    Continue with Google
                                </Button>


                                {/* ------------------------------------------------
                                    OR
                                ------------------------------------------------ */}

                                <div className="my-5 flex items-center gap-3">

                                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                                    <span className="text-xs text-slate-400">
                                        OR
                                    </span>

                                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                                </div>

                            </div>


                            {/* =================================================
                                EMAIL LOGIN FORM
                            ================================================= */}

                            <Form
                                onSubmit={handleLogin}
                                className="flex flex-col gap-5 px-6 pb-7 sm:px-8 sm:pb-8"
                            >

                                {/* =============================================
                                    EMAIL
                                ============================================= */}

                                <TextField
                                    isRequired
                                    name="email"
                                    type="email"
                                    validate={(value) => {
                                        if (
                                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                                value
                                            )
                                        ) {
                                            return "Please enter a valid email address";
                                        }

                                        return null;
                                    }}
                                    className="w-full"
                                >
                                    <Label className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Email Address
                                    </Label>

                                    <Input
                                        placeholder="Enter your email"
                                        startContent={
                                            <span className="text-sm text-slate-400">
                                                @
                                            </span>
                                        }
                                        className="h-11 w-full"
                                    />
                                </TextField>


                                {/* =============================================
                                    PASSWORD
                                ============================================= */}

                                <TextField
                                    isRequired
                                    name="password"
                                    type="password"
                                    validate={(value) => {
                                        if (!value) {
                                            return "Please enter your password";
                                        }

                                        return null;
                                    }}
                                    className="w-full"
                                >
                                    <div className="flex items-center justify-between">

                                        <Label className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            Password
                                        </Label>

                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-xs font-semibold text-indigo-600 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>

                                    </div>

                                    <Input
                                        placeholder="Enter your password"
                                        startContent={
                                            <Lock
                                                size={17}
                                                className="text-slate-400"
                                            />
                                        }
                                        className="h-11 w-full"
                                    />
                                </TextField>


                                {/* =============================================
                                    REMEMBER ME
                                ============================================= */}

                                <Checkbox
                                    name="rememberMe"
                                    isSelected={rememberMe}
                                    onChange={setRememberMe}
                                    size="sm"
                                >
                                    <Checkbox.Content>

                                        <Checkbox.Control>
                                            <Checkbox.Indicator />
                                        </Checkbox.Control>

                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Remember me
                                        </span>

                                    </Checkbox.Content>
                                </Checkbox>


                                {/* =============================================
                                    SIGN IN BUTTON
                                ============================================= */}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={loading}
                                    isDisabled={loading}
                                    className="
                                        mt-1
                                        h-11
                                        w-full
                                        rounded-lg
                                        bg-indigo-600
                                        font-semibold
                                        text-white
                                        shadow-sm
                                        transition-colors
                                        hover:bg-indigo-700
                                    "
                                >
                                    Sign In
                                </Button>


                                {/* =============================================
                                    SIGN UP
                                ============================================= */}

                                <p className="pt-1 text-center text-sm text-slate-500 dark:text-slate-400">

                                    Don't have an account?{" "}

                                    <Link
                                        href="/auth/signup"
                                        className="font-semibold text-indigo-600 hover:underline"
                                    >
                                        Sign up
                                    </Link>

                                </p>

                            </Form>

                        </div>

                    </section>

                </div>

            </div>

        </main>
    );
};

export default LoginPage;
