const features = [
  {
    icon: "📖",
    title: "Manage Your Books",
    description:
      "View book details, publication status, and availability across platforms.",
  },
  {
    icon: "📊",
    title: "Track Royalties",
    description:
      "Understand your book sales, earnings, payments, and pending royalties.",
  },
  {
    icon: "💬",
    title: "Get Support",
    description:
      "Raise questions and follow the progress of your support requests.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-800">
          Everything in one portal
        </p>

        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Built around your publishing needs
        </h2>

        <p className="mt-4 leading-7 text-slate-600">
          The tools you need to stay informed and connected throughout your
          publishing journey.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
              {feature.icon}
            </div>

            <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>

            <p className="mt-3 leading-7 text-slate-600">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}