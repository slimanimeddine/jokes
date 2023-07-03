import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const joke = await db.joke.findUnique({
    where: {
      id: params.jokeId
    }
  })

  if(!joke) {
    throw new Error('joke not found')
  }

  return json({ joke })
}

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>
        {data.joke.content}
      </p>
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="bg-red-600 text-white">
      There was an error loading joke by the id "${jokeId}".
      Sorry.
    </div>
  );
}