import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="kicker">Not found</p>
      <h1 className="mt-3 text-2xl font-semibold">That chapter doesn't exist.</h1>
      <p className="mt-4 text-muted-foreground">dbt has 35 version chapters plus its origins. Start from the beginning.</p>
      <Link to="/" className="mt-6 inline-block text-accent-bright underline underline-offset-4">
        Go to the first chapter
      </Link>
    </main>
  );
}
