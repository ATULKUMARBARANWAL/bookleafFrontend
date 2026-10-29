export default function AdminHeader() {
  return (
    <header className="flex h-[88px] items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <p className="text-sm text-slate-500">
          Admin Workspace
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">
          Overview
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">
            BookLeaf Admin
          </p>
          <p className="text-xs text-slate-500">
            Support Administrator
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800">
          BA
        </div>
      </div>
    </header>
  );
}