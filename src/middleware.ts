// import { getToken } from "next-auth/jwt";
// import { NextResponse, NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//     const token = await getToken({
//         req: request,
//         secret: process.env.NEXTAUTH_SECRET,
//     });
//     console.log(token)

//     const allowedRoles = ["ADMIN", "SUPER_ADMIN"];

//     if (!token || !allowedRoles.includes(token.role)) {
//         return NextResponse.redirect(new URL("/login", request.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/dashboard", "/dashboard/:path*"],
// };



// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// /**
//  * MUST match sidebar navigation permissions
//  */
// const routePermissions: Record<string, string> = {
//   "/dashboard": "Overview",
//   "/dashboard/driver-assignment": "Drivers Management",
//   "/dashboard/membership-status": "Membership Status",
//   "/dashboard/payment-status": "Payments Status",
//   "/dashboard/pickup-history": "Pickup History",
//   "/dashboard/order-requests": "Orders request",
//   "/dashboard/users-management": "User Management",
//   "/dashboard/workers-management": "All Access",
//   "/dashboard/subscription-management": "Subscription Management",
//   "/dashboard/driver-working-hours": "Subscription Management",
//   "/dashboard/setting": "Settings",
// };

// export async function middleware(request: NextRequest) {
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   const pathname = request.nextUrl.pathname;

//   console.log(token)
  
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   const role = token.role as string;
//   const permissions = (token.permissions || []) as string[];

//   // 👑 SUPER_ADMIN → FULL ACCESS
//   if (role === "SUPER_ADMIN") {
//     return NextResponse.next();
//   }

//   // ❌ Only ADMIN allowed
//   if (role !== "ADMIN") {
//     return NextResponse.redirect(new URL("/unauthorized", request.url));
//   }

//   // 🔎 Find required permission for this route
//   const requiredPermission = Object.entries(routePermissions).find(
//     ([route]) =>
//       pathname === route || pathname.startsWith(route + "/")
//   )?.[1];


//   if (
//     requiredPermission &&
//     !permissions.includes("All Access") &&
//     !permissions.includes(requiredPermission)
//   ) {
//     return NextResponse.redirect(new URL("/unauthorized", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };


import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * Route → Permission
 * MUST match sidebar
 */
const routePermissions: Record<string, string> = {
  "/dashboard/driver-assignment": "Drivers Management",
  "/dashboard/membership-status": "Membership Status",
  "/dashboard/payment-status": "Payments Status",
  "/dashboard/pickup-history": "Pickup History",
  "/dashboard/order-requests": "Orders request",
  "/dashboard/users-management": "User Management",
  "/dashboard/workers-management": "All Access",
  "/dashboard/subscription-management": "Subscription Management",
  "/dashboard/driver-working-hours": "Subscription Management",
  "/dashboard/setting": "Settings",
  "/dashboard": "Overview",
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = request.nextUrl.pathname;

  // ❌ Not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = token.role as string;
  const permissions = (token.permissions || []) as string[];

  // 👑 SUPER_ADMIN → allow everything
  if (role === "SUPER_ADMIN") {
    return NextResponse.next();
  }

  // ❌ Only ADMIN allowed
  if (role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // 🔍 Find matching route (longest match)
  const matchedRoute = Object.keys(routePermissions)
    .sort((a, b) => b.length - a.length)
    .find(
      (route) =>
        pathname === route || pathname.startsWith(route + "/")
    );

  // ❌ No route matched → BLOCK
  if (!matchedRoute) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const requiredPermission = routePermissions[matchedRoute];

  
  if (
    !permissions.includes("All Access") &&
    !permissions.includes(requiredPermission)
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
