import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, isRouteErrorResponse, useRouteError, Link } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });

  if (!randomJoke) {
    throw new Response("No random joke found", {
      status: 404,
    });
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
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="bg-red-700 text-white p-6 rounded-xl">
        <p>There are no jokes to display.</p>
        <Link to="new">Add your own</Link>
      </div>
    );
  }
  return (
    <div className="bg-red-700 text-white p-6 rounded-xl">
      I did a whoopsies.
    </div>
  );
}