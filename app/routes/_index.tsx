import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Jokes App" },
    { name: "description", content: "" },
  ];
};

export default function Index() {
  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="uppercase text-4xl font-extrabold">
        This is a jokes app
      </h1>
      <Link className="capitalize rounded-md bg-amber-400 hover:bg-amber-500 p-2 text-center text-indigo-900 text-2xl font-extrabold" to='/jokes'>jokes</Link>
    </div>
  );
}
