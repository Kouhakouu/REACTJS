
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value; // Lấy token từ cookies

    // Nếu không có token và truy cập /dashboard hoặc /assistant, chuyển hướng về /auth/login
    if (!token && (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/assistant") || request.nextUrl.pathname.startsWith("/teacher") || request.nextUrl.pathname.startsWith("/manager"))) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

// Áp dụng middleware cho cả /dashboard/* và /assistant/*
export const config = {
    matcher: [],
    //matcher: ["/dashboard/:path*", "/assistant/:path*", "/teacher/:path*", "/manager/:path*"],
};
