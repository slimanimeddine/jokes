import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const jokeListItems = await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
    take: 5,
  });
  const user = await getUser(request);

  return json({ jokeListItems, user });
}

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <header className="flex justify-between items-center border-b-2 border-purple-400 p-4">
        <h1 className="uppercase text-4xl font-extrabold">
          <Link to='/'>jokes</Link>
        </h1>
        {data.user ? (
          <div className="flex justify-between items-center gap-4">
            <span>{`Hi ${data.user.username}`}</span>
            <Form action="/logout" method="post">
              <button type="submit" className="rounded-md bg-yellow-400 hover:bg-yellow-500 p-2 text-center text-purple-900 text-2xl font-extrabold">
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <Link className="rounded-md bg-yellow-400 hover:bg-yellow-500 p-2 text-center text-purple-900 text-2xl font-extrabold" to="/login">Login</Link>
        )}
      </header>
      <div className="flex justify-start gap-8 pt-20 px-20">
        <aside className="flex flex-col gap-4 flex-initial w-64">
          <Link className="text-yellow-500 hover:text-yellow-600" to='.'>Get a random joke</Link>
          <p>Check these jokes out:</p>
          <ul className="list-disc pl-12 text-yellow-500">
            {data.jokeListItems.map(({ id, name }) => (
              <li className="hover:ml-2" key={id}>
                <Link to={id}>{name}</Link>
              </li>
            ))}
          </ul>
          <Link className="rounded-md bg-yellow-400 hover:bg-yellow-500 p-2 text-center text-purple-900 text-2xl font-extrabold" to="new">
            Add a joke
          </Link>
        </aside>
        <main className="flex-initial w-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}