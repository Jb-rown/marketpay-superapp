// app/login/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Icons (using simple emoji/symbols for demo, replace with lucide-react or similar)
const IconMail = () => <span className="text-action">📧</span>;
const IconLock = () => <span className="text-action">🔒</span>;
const IconEye = () => <span>👁️</span>;
const IconEyeOff = () => <span>🙈</span>;
const IconLoader = () => <span className="animate-spin inline-block">⏳</span>;
const IconMpesa = () => <span>💳</span>;
const IconUSSD = () => <span>📱</span>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  // Form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaMethod, setMfaMethod] = useState<'sms' | 'totp'>('sms');
  const [rememberMe, setRememberMe] = useState(false);

  // Offline detection
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!mfaRequired) {
        // Step 1: Primary authentication
        const response = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: identifier, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed. Check your credentials.');
        }

        if (data.mfa_required) {
          setMfaRequired(true);
          setMfaMethod(data.mfa_method || 'sms');
          setIsLoading(false);
          return;
        }

        // No MFA required - login success
        handleLoginSuccess(data);
      } else {
        // Step 2: MFA verification
        const response = await fetch('/api/v1/auth/mfa/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_number: identifier,
            code: mfaCode,
            method: mfaMethod,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Invalid verification code');
        }

        handleLoginSuccess(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLoginSuccess = (data: any) => {
    // Store tokens securely
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    if (rememberMe) {
      localStorage.setItem('remember_me', 'true');
    }
    // Store user role for RBAC
    localStorage.setItem('user_role', data.user.role);
    
    // Redirect
    router.push(redirect);
  };

  const handleResendMfa = async () => {
    setError('');
    try {
      const response = await fetch('/api/v1/auth/mfa/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: identifier, method: mfaMethod }),
      });
      if (!response.ok) throw new Error('Failed to resend code');
      setError('Verification code resent');
    } catch (err) {
      setError('Could not resend code. Try again.');
    }
  };

  const handleUssdLogin = () => {
    // USSD deep link for feature phones
    window.location.href = 'tel:*384#';
  };

  return (
    <div className="min-h-screen bg-bg font-sans">
      {/* Offline banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-warning z-50 py-2 px-4 text-center text-ink text-sm">
          <span className="font-medium">⚠️ You are offline</span> — Some features may be limited. 
          <button 
            onClick={() => window.location.reload()} 
            className="ml-2 underline font-medium"
          >
            Retry connection
          </button>
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left panel - Branding & SDG 2 messaging */}
        <div className="relative flex flex-col justify-between bg-primary p-8 lg:w-1/2 lg:p-12">
          <div className="absolute inset-0 bg-primary/95" />
          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-food" />
              <span className="text-xl font-bold text-white">MarketPay</span>
              <span className="ml-2 rounded-full bg-food/20 px-2 py-0.5 text-xs text-white">
                SDG 2
              </span>
            </div>
            <h1 className="mt-12 text-3xl font-bold leading-tight text-white lg:text-4xl">
              Reducing food costs through<br />
              AI-powered fintech
            </h1>
            <p className="mt-4 text-white/80">
              Join thousands of consumers, retailers, and wholesalers across Kenya, Nigeria, and Ethiopia.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white">
                <span></span> Zero Hunger
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white">
                <span>🔒</span> Escrow Protection
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white">
                <span>🤖</span> AI Price Intel
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-auto pt-12 text-white/60 text-sm">
            <p>MarketPay Super App v1.0 — Aligned with UN SDG 2: Zero Hunger</p>
            <p className="mt-1">© 2026 MarketPay. All rights reserved.</p>
          </div>
        </div>

        {/* Right panel - Login form */}
        <div className="flex w-full items-center justify-center bg-bg px-4 py-12 lg:w-1/2 lg:px-8">
          <div className="w-full max-w-md">
            {/* Logo for mobile */}
            <div className="mb-8 flex justify-center lg:hidden">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-food" />
                <span className="text-xl font-bold text-primary">MarketPay</span>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-semibold text-ink">Welcome back</h2>
              <p className="mt-2 text-text-muted">
                Sign in to access your wallet, marketplace, and AI price insights
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-danger/20 bg-danger-tint p-3 text-sm text-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {!mfaRequired ? (
                <>
                  <div>
                    <label htmlFor="identifier" className="block text-sm font-medium text-ink">
                      Phone number or email
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <IconMail />
                      </div>
                      <input
                        id="identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="block w-full rounded-lg border border-surface-deep bg-white pl-10 pr-3 py-2.5 text-ink placeholder:text-text-light focus:border-action focus:outline-none focus:ring-2 focus:ring-action/20"
                        placeholder="+254 700 123 456 or email@example.com"
                        required
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-ink">
                      Password
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <IconLock />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-lg border border-surface-deep bg-white pl-10 pr-10 py-2.5 text-ink placeholder:text-text-light focus:border-action focus:outline-none focus:ring-2 focus:ring-action/20"
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-ink"
                      >
                        {showPassword ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-surface-deep text-action focus:ring-action/20"
                      />
                      Remember me
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-action hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="mfaCode" className="block text-sm font-medium text-ink">
                      Verification Code
                    </label>
                    <p className="mt-1 text-xs text-text-muted">
                      We sent a {mfaMethod === 'sms' ? 'SMS with 6-digit code' : 'TOTP code'} to{' '}
                      <span className="font-medium text-ink">{identifier}</span>
                    </p>
                    <div className="relative mt-2">
                      <input
                        id="mfaCode"
                        type="text"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        className="block w-full rounded-lg border border-surface-deep bg-white px-4 py-2.5 text-center text-ink text-lg tracking-wider placeholder:text-text-light focus:border-action focus:outline-none focus:ring-2 focus:ring-action/20"
                        placeholder="000000"
                        maxLength={6}
                        required
                        autoComplete="one-time-code"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleResendMfa}
                      className="mt-2 text-sm text-action hover:underline"
                    >
                      Resend code
                    </button>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-action py-3 font-semibold text-white transition-all hover:bg-action/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <IconLoader />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : mfaRequired ? (
                  'Verify & Login'
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-deep" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-bg px-2 text-text-muted">Or continue with</span>
              </div>
            </div>

            {/* Alternative auth methods */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleUssdLogin}
                className="flex items-center justify-center gap-2 rounded-lg border border-surface-deep bg-surface py-2.5 text-ink transition-all hover:bg-surface-deep"
              >
                <IconUSSD />
                <span className="text-sm font-medium">USSD *384#</span>
              </button>
              <button
                onClick={() => {/* M-Pesa STK Push login - redirect to deep link */}}
                className="flex items-center justify-center gap-2 rounded-lg border border-surface-deep bg-surface py-2.5 text-ink transition-all hover:bg-surface-deep"
              >
                <IconMpesa />
                <span className="text-sm font-medium">M-Pesa</span>
              </button>
            </div>

            {/* Sign up link */}
            <p className="mt-8 text-center text-sm text-text-muted">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-action hover:underline">
                Create account
              </Link>
            </p>

            {/* Role hint */}
            <div className="mt-6 rounded-lg bg-surface p-3 text-center text-xs text-text-muted">
              <span className="font-medium text-ink">Demo credentials:</span> Consumer: 254700000001 / pass123 • 
              Retailer: 254700000002 / pass123 • Admin: 254700000009 / pass123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}