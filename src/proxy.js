import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    /*
    |--------------------------------------------------------------------------
    | Get Current Session
    |--------------------------------------------------------------------------
    */

    const session = await auth.api.getSession({
        headers: request.headers,
    });

    /*
    |--------------------------------------------------------------------------
    | Not Logged In
    |--------------------------------------------------------------------------
    */

    if (!session) {
        return NextResponse.redirect(
            new URL("/auth/login", request.url)
        );
    }

    if (session.user?.isBlocked) {
        return NextResponse.redirect(
            new URL("/auth/login?blocked=1", request.url)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | User Role
    |--------------------------------------------------------------------------
    */

    const role = session.user?.role?.toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Client Dashboard
    |--------------------------------------------------------------------------
    */

    if (pathname.startsWith("/dashboard/client")) {
        if (role !== "client") {
            if (role === "freelancer") {
                return NextResponse.redirect(
                    new URL("/dashboard/freelancer", request.url)
                );
            }

            if (role === "admin") {
                return NextResponse.redirect(
                    new URL("/dashboard/admin", request.url)
                );
            }

            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Freelancer Dashboard
    |--------------------------------------------------------------------------
    */

    if (pathname.startsWith("/dashboard/freelancer")) {
        if (role !== "freelancer") {
            if (role === "client") {
                return NextResponse.redirect(
                    new URL("/dashboard/client", request.url)
                );
            }

            if (role === "admin") {
                return NextResponse.redirect(
                    new URL("/dashboard/admin", request.url)
                );
            }

            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Admin Dashboard
    |--------------------------------------------------------------------------
    */

    if (pathname.startsWith("/dashboard/admin")) {
        if (role !== "admin") {
            if (role === "client") {
                return NextResponse.redirect(
                    new URL("/dashboard/client", request.url)
                );
            }

            if (role === "freelancer") {
                return NextResponse.redirect(
                    new URL("/dashboard/freelancer", request.url)
                );
            }

            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Authorized
    |--------------------------------------------------------------------------
    */

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
