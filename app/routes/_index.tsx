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
    <div className="p-16">
      <h1 className="uppercase text-4xl font-extrabold">
        This is a jokes app
      </h1>
      <Link className="hover:ml-2 text-yellow-500" to='/jokes'>jokes</Link>
    </div>
  );
}
