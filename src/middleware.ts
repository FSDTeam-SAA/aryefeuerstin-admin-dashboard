// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// /**
//  * Route → Permission
//  * MUST match sidebar
//  */
// const routePermissions: Record<string, string> = {
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
//   "/dashboard": "Overview",
// };

// export async function middleware(request: NextRequest) {
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   const pathname = request.nextUrl.pathname;

//   // ❌ Not logged in
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   const role = token.role as string;
//   const permissions = (token.permissions || []) as string[];

//   // 👑 SUPER_ADMIN → allow everything
//   if (role === "SUPER_ADMIN") {
//     return NextResponse.next();
//   }

//   // ❌ Only ADMIN allowed
//   if (role !== "ADMIN") {
//     return NextResponse.redirect(new URL("/unauthorized", request.url));
//   }

//   // 🔍 Find matching route (longest match)
//   const matchedRoute = Object.keys(routePermissions)
//     .sort((a, b) => b.length - a.length)
//     .find(
//       (route) =>
//         pathname === route || pathname.startsWith(route + "/")
//     );

//   // ❌ No route matched → BLOCK
//   if (!matchedRoute) {
//     return NextResponse.redirect(new URL("/unauthorized", request.url));
//   }

//   const requiredPermission = routePermissions[matchedRoute];

  
//   if (
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
 * MUST match sidebar exactly
 */
const routePermissions: Record<string, string> = {
  "/dashboard": "Overview",
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
  "/dashboard/contacts-management": "Contacts Management",
  "/dashboard/banner-management": "Banner Management",
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log(token);
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

  // ❌ Only ADMIN allowed beyond this point
  if (role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // 🔥 ADMIN with "All Access" → allow everything
  if (permissions.includes("All Access")) {
    return NextResponse.next();
  }

  // 🔍 Find matching route (longest match first)
  const matchedRoute = Object.keys(routePermissions)
    .sort((a, b) => b.length - a.length)
    .find(
      (route) =>
        pathname === route || 
        (pathname.startsWith(route + "/") && route !== "/dashboard")
    );

  // ❌ No route matched → BLOCK
  if (!matchedRoute) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const requiredPermission = routePermissions[matchedRoute];

  // ✅ Check if user has the required permission
  if (!permissions.includes(requiredPermission)) {
    // Find first allowed route for this user
    const firstAllowedRoute = Object.entries(routePermissions).find(
      ([ permission]) => permissions.includes(permission)
    );

    if (firstAllowedRoute) {
      return NextResponse.redirect(new URL(firstAllowedRoute[0], request.url));
    }

    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};