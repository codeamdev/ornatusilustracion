export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-6 h-6 border-2 border-gallery-border border-t-gallery-black rounded-full animate-spin" />
    </div>
  );
}
