export default function PortalPreview() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-amber-200/50 blur-2xl" />

      <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-emerald-200/60 blur-2xl" />

      <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <p className="text-sm text-slate-500">WELCOME TO</p>
            <h2 className="mt-1 text-xl font-bold">Your Author Space</h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
            📚
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm text-slate-600">My Books</p>
            <p className="mt-2 text-xl font-bold text-emerald-900">
              Book Library
            </p>
            <p className="mt-1 text-xs text-slate-500">
              View your publications
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="text-sm text-slate-600">Royalty Reports</p>
            <p className="mt-2 text-xl font-bold text-amber-900">
              Earnings
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Track your royalties
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              💬
            </div>

            <div>
              <p className="font-semibold">Support & Communication</p>
              <p className="mt-1 text-sm text-slate-500">
                Get help with your publishing journey
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span className="text-emerald-700">✓</span>
          Your publishing journey, organised in one place.
        </div>
      </div>
    </div>
  );
}