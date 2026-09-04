export default function MarketplaceSkeleton({ variant = "cards" }) {
  if (variant === "page") {
    return (
      <div className="mx-auto w-11/12 max-w-7xl py-8 sm:py-12">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <div className="mx-auto h-3 w-44 animate-pulse rounded bg-slate-200" />
          <div className="mx-auto h-10 w-72 animate-pulse rounded-lg bg-slate-200" />
          <div className="mx-auto h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mx-auto mt-8 h-14 max-w-5xl animate-pulse rounded-2xl bg-white" />
        <div className="mt-8">
          <MarketplaceSkeleton />
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="mx-auto w-11/12 max-w-7xl space-y-6 py-10">
        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
        <div className="h-72 animate-pulse rounded-3xl bg-white" />
        <div className="h-56 animate-pulse rounded-3xl bg-white" />
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <div key={item} className="h-64 animate-pulse rounded-2xl bg-white" />
      ))}
    </div>
  );
}
