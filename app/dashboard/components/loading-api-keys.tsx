export function LoadingApiKeys() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-20 bg-muted rounded-lg" />
        </div>
      ))}
    </div>
  );
}
