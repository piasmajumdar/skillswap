export default function MarketplaceSkeleton({ variant = "cards" }) {
  if (variant === "page") {
    return (
      <div className="mx-auto w-[calc(100%-2rem)] max-w-7xl py-8 sm:w-11/12 sm:py-12">
        <div className="mx-auto max-w-2xl space-y-3 px-2 text-center sm:px-0">
          <div className="mx-auto h-3 w-36 animate-pulse rounded bg-slate-200 sm:w-44" />
          <div className="mx-auto h-8 w-56 animate-pulse rounded-lg bg-slate-200 sm:h-10 sm:w-72" />
          <div className="mx-auto h-4 w-full max-w-96 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mx-auto mt-6 h-12 max-w-5xl animate-pulse rounded-2xl bg-white sm:mt-8 sm:h-14" />
        <div className="mt-6 sm:mt-8">
          <MarketplaceSkeleton />
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="mx-auto w-[calc(100%-2rem)] max-w-7xl space-y-4 py-6 sm:w-11/12 sm:space-y-6 sm:py-10">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200 sm:w-36" />
        <div className="h-56 animate-pulse rounded-3xl bg-white sm:h-72" />
        <div className="h-48 animate-pulse rounded-3xl bg-white sm:h-56" />
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <div key={item} className="h-56 min-w-0 animate-pulse rounded-2xl bg-white sm:h-64" />
      ))}
    </div>
  );
}
