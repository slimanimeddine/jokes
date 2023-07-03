import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const joke = await db.joke.findUnique({
    where: {
      id: params.jokeId
    }
  })

  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
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
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="bg-red-700 text-white p-6 rounded-xl">
        Huh? What the heck is "{jokeId}"?
      </div>
    );
  }

  return (
    <div className="bg-red-700 text-white p-6 rounded-xl">
      There was an error loading joke by the id "${jokeId}".
      Sorry.
    </div>
  );
}