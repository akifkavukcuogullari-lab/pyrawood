export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-pyra-sand border-t-pyra-walnut" />
      </div>
      <p className="font-heading text-lg text-pyra-walnut animate-pulse">
        Loading...
      </p>
    </div>
  );
}
