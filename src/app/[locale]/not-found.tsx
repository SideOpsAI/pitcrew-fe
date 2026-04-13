import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-shell py-24 text-center">
      <h1 className="font-heading text-5xl uppercase tracking-wider text-white">404</h1>
      <p className="mt-4 text-white/80">The page you are looking for was not found.</p>
      <Link
        href="/en"
        className="mt-8 inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black"
      >
        Back Home
      </Link>
    </section>
  );
}
