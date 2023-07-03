import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });

  if(!randomJoke) {
    throw new Error('joke not found')
  }

  return json({ randomJoke })
}

export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col gap-4">
      <p>Here's a random joke:</p>
      <p>
        {data.randomJoke.content}
      </p>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="bg-red-600 text-white">
      I did a whoopsies.
    </div>
  );
}