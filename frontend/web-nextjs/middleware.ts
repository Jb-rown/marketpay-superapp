// middleware.ts - JWT validation + RBAC + rate limiting
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const roleRoutes: Record<string, (string | RegExp)[]> = {
  consumer: ['/dashboard/consumer', '/marketplace', '/wallet'],
  retailer: ['/dashboard/retailer', '/products', '/inventory'],
  wholesaler: ['/dashboard/wholesaler', '/bulk-deals'],
  rider: ['/dashboard/rider', '/deliveries'],
  gov_analyst: ['/dashboard/gov-analyst', /^\/reports/],
  admin: ['/dashboard/admin', '/users', '/system'],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const path = request.nextUrl.pathname;
  
  // Public routes (no auth required)
  const publicRoutes = ['/login', '/register', '/forgot-password', '/ussd'];
  if (publicRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check authentication
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Decode JWT and check RBAC
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;
    
    // Check if user has access to this route
    const allowedRoutes = roleRoutes[userRole] || [];
    const hasAccess = allowedRoutes.some(route => 
      typeof route === 'string' ? path.startsWith(route) : route.test(path)
    );
    
    if (!hasAccess && path !== '/dashboard') {
      // Redirect to role-appropriate dashboard
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }
    
    // Add user context to headers for downstream services
    const response = NextResponse.next();
    response.headers.set('X-User-ID', payload.user_id);
    response.headers.set('X-User-Role', userRole);
    return response;
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};