import type { LoaderArgs, ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useParams, isRouteErrorResponse, useRouteError, Outlet, useLocation } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { requireUserId, getUserId } from "~/utils/session.server";
import { JokeDisplay } from "~/components/joke";

export const meta: V2_MetaFunction<typeof loader> = ({
  data,
}) => {
  const { description, title } = data
    ? {
      description: `Enjoy the "${data.joke.name}" joke`,
      title: `"${data.joke.name}" joke`,
    }
    : { description: "No joke found", title: "No joke" };

  return [
    { name: "description", content: description },
    { title },
  ];
};

export const action = async ({
  params,
  request,
}: ActionArgs) => {
  const form = await request.formData();
  if (form.get("intent") === "delete") {
    throw new Response(
      `The intent ${form.get("intent")} is not supported`,
      { status: 400 }
    );
  }
  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    });
  }
  if (joke.jokesterId !== userId) {
    throw new Response(
      "Pssh, nice try. That's not your joke",
      { status: 403 }
    );
  }
  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect("/jokes");
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await getUserId(request);
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

  return json({
    isOwner: userId === joke.jokesterId,
    joke
  })
}

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>()
  const location = useLocation()
  console.log(location.pathname.split("/").pop() === 'edit')
  return (
    <>
      {
        location.pathname.split("/").pop() === 'edit' ?
          <Outlet /> :
          <JokeDisplay isOwner={data.isOwner} joke={data.joke} />
      }
    </>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <div className="bg-red-700 text-white p-6 rounded-xl">
          What you're trying to do is not allowed.
        </div>
      );
    }
    if (error.status === 403) {
      return (
        <div className="bg-red-700 text-white p-6 rounded-xl">
          Sorry, but "{jokeId}" is not your joke.
        </div>
      );
    }
    if (error.status === 404) {
      return (
        <div className="bg-red-700 text-white p-6 rounded-xl">
          Huh? What the heck is "{jokeId}"?
        </div>
      );
    }
  }

  return (
    <div className="bg-red-700 text-white p-6 rounded-xl">
      There was an error loading joke by the id "${jokeId}".
      Sorry.
    </div>
  );
}