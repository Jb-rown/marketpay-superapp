import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg font-sans text-text">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-surface-deep bg-surface px-4 py-2 text-sm text-text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-food" />
              MarketPay Super App
            </div>

            <div className="space-y-5">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Faster food commerce, clearer payments, and smarter price discovery.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-text-muted sm:text-xl">
                A MarketPay workspace for wallets, marketplace flows, and AI-assisted savings across
                consumers, retailers, and wholesalers.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-action px-6 text-sm font-semibold text-white transition-colors hover:bg-action/90"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full border border-surface-deep bg-surface px-6 text-sm font-semibold text-ink transition-colors hover:bg-surface-deep"
              >
                Create account
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-surface-deep bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-text-muted">Payments</p>
                <p className="mt-2 text-lg font-semibold text-ink">Secure wallet flows</p>
              </div>
              <div className="rounded-2xl border border-surface-deep bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-text-muted">Marketplace</p>
                <p className="mt-2 text-lg font-semibold text-ink">Food-first commerce</p>
              </div>
              <div className="rounded-2xl border border-surface-deep bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-text-muted">Insights</p>
                <p className="mt-2 text-lg font-semibold text-ink">AI price intelligence</p>
              </div>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] border border-surface-deep bg-surface p-8 shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(22,163,74,0.14),transparent_30%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted">Today&apos;s snapshot</p>
                  <p className="mt-1 text-2xl font-semibold text-ink">MarketPay</p>
                </div>
                <div className="rounded-full bg-food-tint px-3 py-1 text-sm font-medium text-food">
                  Live
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl bg-white/90 p-4">
                  <p className="text-sm text-text-muted">Wallet balance</p>
                  <p className="mt-2 text-3xl font-semibold text-ink">KES 42,180</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/90 p-4">
                    <p className="text-sm text-text-muted">Escrow status</p>
                    <p className="mt-2 text-lg font-semibold text-success">Protected</p>
                  </div>
                  <div className="rounded-2xl bg-white/90 p-4">
                    <p className="text-sm text-text-muted">Price alert</p>
                    <p className="mt-2 text-lg font-semibold text-action">-12% this week</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
