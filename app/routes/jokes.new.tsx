import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { badRequest } from "~/utils/request.server";
import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "That joke is too short";
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return "That joke's name is too short";
  }
}

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData()
  const name = form.get('name')
  const content = form.get('content')
  if (
    typeof name !== 'string' ||
    typeof content !== 'string'
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name),
  };

  const fields = { content, name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const joke = await db.joke.create({ 
    data: { ...fields, jokesterId: userId }, 
  })
  return redirect(`/jokes/${joke.id}`)
}

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <p className="mb-6">Add your own hilarious joke</p>
      <form className="flex flex-col gap-4" method="post">
        <div className="flex flex-col">
          <label>Name:</label>
          <input
            className="bg-purple-700 border-2 border-purple-400 rounded-md "
            type="text"
            name="name"
            defaultValue={actionData?.fields?.name}
            aria-invalid={Boolean(
              actionData?.fieldErrors?.name
            )}
            aria-errormessage={
              actionData?.fieldErrors?.name
                ? "name-error"
                : undefined
            }
          />
          {actionData?.fieldErrors?.name ? (
            <p
              className="text-red-600 text-xs"
              id="name-error"
              role="alert"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col">
          <label>Content:</label>
          <textarea
            className="bg-purple-700 border-2 border-purple-400 rounded-md aria-invalid:border-red-600"
            name="content"
            defaultValue={actionData?.fields?.content}
            aria-invalid={Boolean(
              actionData?.fieldErrors?.content
            )}
            aria-errormessage={
              actionData?.fieldErrors?.content
                ? "content-error"
                : undefined
            }
          />
          {actionData?.fieldErrors?.content ? (
            <p
              className="text-red-600 text-xs"
              id="content-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p
              className="form-validation-error"
              role="alert"
            >
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="w-full rounded-md bg-yellow-400 hover:bg-yellow-500 p-2 text-center text-purple-900 text-2xl font-extrabold">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="bg-red-600 text-white">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}