export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md mx-4 border border-border/40 p-8">
        <h1 className="text-2xl font-bold tracking-tight">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">Page not found.</p>
        <a href="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold tracking-widest uppercase border-b border-foreground pb-1 hover:opacity-50 transition-opacity">
          Home
        </a>
      </div>
    </div>
  );
}
