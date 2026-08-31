"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    Button,
    Checkbox,
    Description,
    FieldError,
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

const SignupPage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [role, setRole] = useState("client");
    const [terms, setTerms] = useState(false);

    // ============================================================
    // Email Signup
    // ============================================================

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!terms) {
            toast.error(
                "Please accept the Terms of Service and Privacy Policy."
            );
            return;
        }

        const formDataInput = new FormData(e.currentTarget);
        const formData = Object.fromEntries(formDataInput.entries());

        const {
            name,
            email,
            photo,
            password,
            skills,
            bio
        } = formData;

        try {
            setLoading(true);

            const { data, error } =
                await authClient.signUp.email({
                    name: name.trim(),
                    email: email.trim(),
                    password: password,
                    image: photo?.trim() || undefined,
                    role: role,
                    callbackURL: "/",
                    skills: role === "freelancer" ? skills?.trim() : undefined,
                    bio: role === "freelancer" ? bio?.trim() : undefined,
                    isBlocked: false,
                });

            if (error) {
                toast.error(
                    error.message ||
                    "Unable to create your account."
                );
                return;
            }

            if (data) {
                toast.success(
                    "Account created successfully!"
                );

                if (role === "freelancer") {
                    router.push("/dashboard/freelancer");
                } else {
                    router.push("/");
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
    // Google Signup
    // ============================================================

    const handleGoogleSignup = async () => {
        try {
            setGoogleLoading(true);

            // Google users are always Clients.
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (error) {
            console.error(error);

            toast.error(
                "Google signup failed. Please try again."
            );

            setGoogleLoading(false);
        }
    };

    // ============================================================
    // Dynamic Role Colors
    // ============================================================

    const isFreelancer = role === "freelancer";

    const activeColor = isFreelancer
        ? "text-emerald-500"
        : "text-indigo-600";

    const activeUnderline = isFreelancer
        ? "bg-emerald-400"
        : "bg-indigo-600";

    const buttonColor = isFreelancer
        ? "bg-emerald-500 hover:bg-emerald-600"
        : "bg-indigo-600 hover:bg-indigo-700";

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">

            <div className="mx-auto flex min-h-screen w-11/12 max-w-7xl flex-col">

                {/* ========================================================
                    MAIN CONTENT
                ======================================================== */}

                <div className="grid flex-1 items-center gap-12 py-2 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

                    {/* ====================================================
                        LEFT SIDE
                    ==================================================== */}

                    <section className="hidden lg:block">

                        <div className="max-w-md">

                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 xl:text-5xl dark:text-white">
                                Create Account
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Join SkillSwap today and start your journey.
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
                                        Post Tasks
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                        Get your work done by skilled freelancers
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
                                        Find Work
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                        Discover interesting tasks and earn money
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
                                        Secure Payments
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                        Safe and secure payments powered by Stripe
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ====================================================
                        SIGNUP CARD
                    ==================================================== */}

                    <section className="w-full">

                        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                            {/* =================================================
                                GOOGLE SIGNUP
                            ================================================= */}

                            <div className="px-6 pt-6 sm:px-8 sm:pt-7">

                                <Button
                                    type="button"
                                    onPress={handleGoogleSignup}
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

                                {/* OR */}

                                <div className="my-1 flex items-center gap-3">

                                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                                    <span className="text-xs text-slate-400">
                                        OR
                                    </span>

                                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                                </div>

                            </div>

                            {/* =================================================
                                ROLE TABS
                            ================================================= */}

                            <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800">

                                {/* Client */}

                                <button
                                    type="button"
                                    onClick={() => setRole("client")}
                                    className={`
                                        relative
                                        py-4
                                        text-sm
                                        font-semibold
                                        transition-colors
                                        ${role === "client"
                                            ? "text-indigo-600"
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        }
                                    `}
                                >
                                    I'm a Client

                                    {role === "client" && (
                                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600" />
                                    )}
                                </button>

                                {/* Freelancer */}

                                <button
                                    type="button"
                                    onClick={() => setRole("freelancer")}
                                    className={`
                                        relative
                                        py-4
                                        text-sm
                                        font-semibold
                                        transition-colors
                                        ${role === "freelancer"
                                            ? "text-emerald-500"
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        }
                                    `}
                                >
                                    I'm a Freelancer

                                    {role === "freelancer" && (
                                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-emerald-400" />
                                    )}
                                </button>

                            </div>

                            {/* =================================================
                                FORM
                            ================================================= */}

                            <Form
                                onSubmit={handleSignup}
                                className="flex flex-col gap-5 px-6 py-6 sm:px-8 sm:py-7"
                            >

                                {/* =============================================
                                    FULL NAME
                                ============================================= */}

                                <TextField
                                    isRequired
                                    name="name"
                                    type="text"
                                    validate={(value) => {
                                        if (value.trim().length < 2) {
                                            return "Name must be at least 2 characters";
                                        }

                                        return null;
                                    }}
                                >
                                    <Label className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Full Name
                                    </Label>

                                    <Input
                                        placeholder="Enter your full name"
                                        startContent={
                                            <Person
                                                size={17}
                                                className="text-slate-400"
                                            />
                                        }
                                        className="h-11"
                                    />

                                    <FieldError />
                                </TextField>

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
                                        className="h-11"
                                    />

                                    <FieldError />
                                </TextField>
                                {isFreelancer && (
                                    <>
                                        <TextField
                                            isRequired
                                            name="skills"
                                        >
                                            <Label>Skills</Label>
                                            <Input placeholder="e.g. React, Node.js, MongoDB" />
                                            <FieldError />
                                        </TextField>

                                        <TextField
                                            isRequired
                                            name="bio"
                                        >
                                            <Label>Bio</Label>
                                            <Input placeholder="Tell us briefly about yourself" />
                                            <FieldError />
                                        </TextField>
                                    </>
                                )}

                                {/* =============================================
                                    IMAGE URL
                                ============================================= */}

                                <TextField
                                    isRequired
                                    name="photo"
                                    type="url"
                                    validate={(value) => {
                                        try {
                                            new URL(value);
                                            return null;
                                        } catch {
                                            return "Please enter a valid image URL";
                                        }
                                    }}
                                >
                                    <Label className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Image URL
                                    </Label>

                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        className="h-11"
                                    />

                                    <FieldError />
                                </TextField>

                                {/* =============================================
                                    PASSWORD
                                ============================================= */}

                                <TextField
                                    isRequired
                                    name="password"
                                    type="password"
                                    validate={(value) => {
                                        if (value.length < 6) {
                                            return "Password must be at least 6 characters";
                                        }

                                        if (!/[A-Z]/.test(value)) {
                                            return "Password must contain at least one uppercase letter";
                                        }

                                        if (!/[a-z]/.test(value)) {
                                            return "Password must contain at least one lowercase letter";
                                        }

                                        return null;
                                    }}
                                >
                                    <Label className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Password
                                    </Label>

                                    <Input
                                        placeholder="Create a password"
                                        startContent={
                                            <Lock
                                                size={17}
                                                className="text-slate-400"
                                            />
                                        }
                                        className="h-11"
                                    />

                                    <Description>
                                        Must be at least 6 characters with 1
                                        uppercase and 1 lowercase letter
                                    </Description>

                                    <FieldError />
                                </TextField>


                                {/* =============================================
                                    TERMS
                                ============================================= */}
                                <Checkbox
                                    name="terms"
                                    isSelected={terms}
                                    onChange={setTerms}
                                    size="sm"
                                >
                                    <Checkbox.Content>
                                        <Checkbox.Control>
                                            <Checkbox.Indicator />
                                        </Checkbox.Control>

                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            I agree to the{" "}

                                            <Link
                                                href="/terms"
                                                className="font-semibold text-indigo-600 hover:underline"
                                            >
                                                Terms of Service
                                            </Link>

                                            {" "}and{" "}

                                            <Link
                                                href="/privacy"
                                                className="font-semibold text-indigo-600 hover:underline"
                                            >
                                                Privacy Policy
                                            </Link>
                                        </span>
                                    </Checkbox.Content>
                                </Checkbox>
                                {/* =============================================
                                    CREATE ACCOUNT
                                ============================================= */}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={loading}
                                    isDisabled={loading}
                                    className={`
                                        mt-1
                                        h-11
                                        w-full
                                        rounded-lg
                                        font-semibold
                                        text-white
                                        shadow-sm
                                        transition-colors
                                        ${buttonColor}
                                    `}
                                >
                                    Create Account
                                </Button>

                                {/* =============================================
                                    SIGN IN
                                ============================================= */}

                                <p className="pt-1 text-center text-sm text-slate-500 dark:text-slate-400">

                                    Already have an account?{" "}

                                    <Link
                                        href="/auth/login"
                                        className="font-semibold text-indigo-600 hover:underline"
                                    >
                                        Sign in
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

export default SignupPage;