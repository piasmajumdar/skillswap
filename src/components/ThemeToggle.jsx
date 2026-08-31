"use client";

import { Moon, Sun } from "@gravity-ui/icons";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
                relative
                flex
                h-8
                w-[52px]
                cursor-pointer
                items-center
                rounded-full
                border
                border-slate-200
                bg-slate-100
                p-1
                transition-all
                duration-300
                hover:bg-slate-200
                dark:border-slate-700
                dark:bg-slate-800
                dark:hover:bg-slate-700
            "
        >
            <span
                className={`
                    flex
                    size-6
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-sm
                    transition-transform
                    duration-300
                    dark:bg-slate-100
                    ${theme === "dark"
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                `}
            >
                {theme === "dark" ? (
                    <Moon className="size-4 text-slate-600" />
                ) : (
                    <Sun className="size-4 text-amber-500" />
                )}
            </span>
        </button>
    );
};

export default ThemeToggle;

