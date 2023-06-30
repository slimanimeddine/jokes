import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async () => json({
  jokeListItems: await db.joke.findMany()
})

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <header className="border-b-2 border-purple-400">
        <h1 className="uppercase text-4xl font-extrabold py-6 pl-8">jokes</h1>
      </header>
      <div className="flex justify-start gap-8 pt-20 px-20">
        <aside className="flex flex-col gap-4">
          <p className="">Check these jokes out:</p>
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
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}