import type { ActionArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const name = form.get('name')
  const content = form.get('content')
  if (
    typeof name !== 'string' ||
    typeof content !== 'string'
  ) {
    throw new Error("Form not submitted correctly.");
  }

  const joke = await db.joke.create({ data: { name, content } })
  return redirect(`/jokes/${joke.id}`)
}

export default function NewJokeRoute() {
  return (
    <div>
      <p className="mb-6">Add your own hilarious joke</p>
      <form className="flex flex-col gap-4" method="post">
        <div className="flex flex-col">
          <label>Name:</label>
          <input className="bg-purple-700 border-2 border-purple-400 rounded-md" type="text" name="name" />
        </div>
        <div className="flex flex-col">
          <label>Content:</label>
          <textarea className="bg-purple-700 border-2 border-purple-400 rounded-md" name="content" />
        </div>
        <button type="submit" className="rounded-md bg-yellow-400 hover:bg-yellow-500 p-2 text-center text-purple-900 text-2xl font-extrabold">
          Add
        </button>
      </form>
    </div>
  );
}
