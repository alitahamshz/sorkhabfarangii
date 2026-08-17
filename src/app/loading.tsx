export default function GlobalLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center bg-background/80 p-6 backdrop-blur-sm"
      role="status"
    >
      <div className="flex flex-col items-center gap-4 text-primary-500">
        <span className="relative grid size-14 place-items-center rounded-full border-4 border-primary-100">
          <span className="size-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </span>
        <span className="text-sm font-medium text-foreground">در حال بارگذاری…</span>
      </div>
    </main>
  );
}
