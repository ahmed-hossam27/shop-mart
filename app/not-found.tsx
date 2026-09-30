import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-32 flex flex-col items-center text-center">
      <p className="font-display text-7xl mb-4">404</p>
      <h1 className="font-display text-2xl mb-2">Nothing here</h1>
      <p className="text-ink-soft max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist, or it may have moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to home
      </Link>
    </div>
  );
}
