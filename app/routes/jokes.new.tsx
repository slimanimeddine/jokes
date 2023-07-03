import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useNavigation, Form, useActionData, isRouteErrorResponse, useRouteError, Link } from "@remix-run/react";
import { badRequest } from "~/utils/request.server";
import { requireUserId, getUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { JokeDisplay } from "~/components/joke";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return json({});
};

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
  const navigation = useNavigation();

  if (navigation.formData) {
    const content = navigation.formData.get("content");
    const name = navigation.formData.get("name");
    if (
      typeof content === "string" &&
      typeof name === "string" &&
      !validateJokeContent(content) &&
      !validateJokeName(name)
    ) {
      return (
        <JokeDisplay
          canDelete={false}
          isOwner={true}
          joke={{ name, content }}
        />
      );
    }
  }

  return (
    <div>
      <p className="mb-6">Add your own hilarious joke</p>
      <Form className="flex flex-col gap-4" method="post">
        <div className="flex flex-col">
          <label>Name:</label>
          <input
            className="bg-indigo-700 border-2 border-indigo-400 rounded-md "
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
            className="bg-indigo-700 border-2 border-indigo-400 rounded-md aria-invalid:border-red-600"
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
          <button type="submit" className="w-full rounded-md bg-amber-400 hover:bg-amber-500 p-2 text-center text-indigo-900 text-2xl font-extrabold">
            Add
          </button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div className="bg-red-700 text-white p-6 rounded-xl">
        <p>You must be logged in to create a joke.</p>
        <Link className="text-amber-500 hover:text-amber-600" to="/login">Login</Link>
      </div>
    );
  }
  return (
    <div className="bg-red-700 text-white p-6 rounded-xl">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}