import type { Joke } from "@prisma/client";
import { Form } from "@remix-run/react";

export function JokeDisplay({
  canDelete = true,
  isOwner,
  joke,
}: {
  canDelete?: boolean;
  isOwner: boolean;
  joke: Pick<Joke, "content" | "name">;
}) {
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      {isOwner ? (
        <Form method="post">
          <button
            className="bg-red-600 rounded-xl p-2 mt-2 hover:bg-red-700"
            disabled={!canDelete}
            name="intent"
            type="submit"
            value="delete"
          >
            Delete
          </button>
        </Form>
      ) : null}
    </div>
  );
}
