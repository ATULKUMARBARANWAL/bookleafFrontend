import Link from "next/link";
import PortalPreview from "./PortalPreview";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Author Support & Communication Portal
          </div>

          <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Your stories deserve a{" "}
            <span className="text-emerald-800">better journey.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Manage your published books, track royalty earnings, and connect
            with the BookLeaf support team — all from one place.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/author/login"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-900"
            >
              Access Author Portal <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-800 hover:border-emerald-700 hover:text-emerald-800"
            >
              Admin Portal
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            <span>✓ Book management</span>
            <span>✓ Royalty tracking</span>
            <span>✓ Support requests</span>
          </div>
        </div>

        <PortalPreview />
      </div>
    </section>
  );
}