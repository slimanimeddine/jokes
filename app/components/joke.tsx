import type { Joke } from "@prisma/client";
import { Form, Link } from "@remix-run/react";

export function JokeDisplay({
  canDelete = true,
  canEdit = true,
  isOwner,
  joke,
}: {
  canDelete?: boolean;
  canEdit?: boolean;
  isOwner: boolean;
  joke: Pick<Joke, "content" | "name">;
}) {
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      {isOwner ? (
        <div className="flex gap-4">
          <Link
            aria-disabled={!canEdit}
            className="bg-blue-600 rounded-xl p-2 hover:bg-blue-700"
            to="edit"
          >
            Edit
          </Link>
          <Form method="post">
            <button
              className="bg-red-600 rounded-xl p-2 hover:bg-red-700"
              disabled={!canDelete}
              name="intent"
              type="submit"
              value="delete"
            >
              Delete
            </button>
          </Form>
        </div>
      ) : null}
    </div>
  );
}
