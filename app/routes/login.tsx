import type {
    ActionArgs,
    V2_MetaFunction
} from "@remix-run/node";
import { Link, useSearchParams, useActionData, Form } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { login, createUserSession, register } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  const description =
    "Login to submit your own jokes";

  return [
    { name: "description", content: description },
    { title: "Jokes app | Login" },
  ];
};

function validateUsername(username: string) {
    if (username.length < 3) {
        return "Usernames must be at least 3 characters long";
    }
}

function validatePassword(password: string) {
    if (password.length < 6) {
        return "Passwords must be at least 6 characters long";
    }
}

function validateUrl(url: string) {
    const urls = ["/jokes", "/", "https://remix.run"];
    if (urls.includes(url)) {
        return url;
    }
    return "/jokes";
}

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const loginType = form.get("loginType");
    const password = form.get("password");
    const username = form.get("username");
    const redirectTo = validateUrl(
        (form.get("redirectTo") as string) || "/jokes"
    );
    if (
        typeof loginType !== "string" ||
        typeof password !== "string" ||
        typeof username !== "string"
    ) {
        return badRequest({
            fieldErrors: null,
            fields: null,
            formError: "Form not submitted correctly.",
        });
    }
    const fields = { loginType, password, username };
    const fieldErrors = {
        password: validatePassword(password),
        username: validateUsername(username),
    };
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({
            fieldErrors,
            fields,
            formError: null,
        });
    }
    switch (loginType) {
        case "login": {
            const user = await login({ username, password });
            console.log({ user });
            if (!user) {
                return badRequest({
                    fieldErrors: null,
                    fields,
                    formError:
                        "Username/Password combination is incorrect",
                });
            }
            return createUserSession(user.id, redirectTo);
        }
        case "register": {
            const userExists = await db.user.findFirst({
                where: { username },
            });
            if (userExists) {
                return badRequest({
                    fieldErrors: null,
                    fields,
                    formError: `User with username ${username} already exists`,
                });
            }
            const user = await register({ username, password });
            if (!user) {
                return badRequest({
                    fieldErrors: null,
                    fields,
                    formError:
                        "Something went wrong trying to create a new user.",
                });
            }
            return createUserSession(user.id, redirectTo);
        }
        default: {
            return badRequest({
                fieldErrors: null,
                fields,
                formError: "Login type invalid",
            });
        }
    }
}

export default function Login() {
    const actionData = useActionData<typeof action>();

    const [searchParams] = useSearchParams();
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="bg-white text-purple-900 gap-4 rounded-md">
                <Form method="post" className="flex flex-col items-center gap-4 p-10 shadow-xl">
                    <h1 className="uppercase text-4xl font-extrabold">login</h1>
                    <input
                        type="hidden"
                        name="redirectTo"
                        value={
                            searchParams.get("redirectTo") ?? undefined
                        }
                    />
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <input
                                type="radio"
                                name="loginType"
                                value="login"
                                defaultChecked={
                                    !actionData?.fields?.loginType ||
                                    actionData?.fields?.loginType === "login"
                                }
                            />
                            <label className="ml-2">login</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="loginType"
                                value="register"
                                defaultChecked={
                                    actionData?.fields?.loginType ===
                                    "register"
                                }
                            />
                            <label className="ml-2">register</label>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-left">username</label>
                        <input
                            name="username"
                            className="bg-purple-300 border-2 border-purple-400 rounded-md focus:outline-none focus:border-purple-600 focus:ring-purple-600"
                            type="text"
                            defaultValue={actionData?.fields?.username}
                            aria-invalid={Boolean(
                                actionData?.fieldErrors?.username
                            )}
                            aria-errormessage={
                                actionData?.fieldErrors?.username
                                    ? "username-error"
                                    : undefined
                            }
                        />
                        {actionData?.fieldErrors?.username ? (
                            <p
                                className="text-red-600 text-xs"
                                role="alert"
                                id="username-error"
                            >
                                {actionData.fieldErrors.username}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-left">password</label>
                        <input
                            name="password"
                            className="bg-purple-300 border-2 border-purple-400 rounded-md focus:outline-none focus:border-purple-600 focus:ring-purple-600"
                            type="password"
                            defaultValue={actionData?.fields?.password}
                            aria-invalid={Boolean(
                                actionData?.fieldErrors?.password
                            )}
                            aria-errormessage={
                                actionData?.fieldErrors?.password
                                    ? "password-error"
                                    : undefined
                            }
                        />
                        {actionData?.fieldErrors?.password ? (
                            <p
                                className="text-red-600 text-xs"
                                role="alert"
                                id="password-error"
                            >
                                {actionData.fieldErrors.password}
                            </p>
                        ) : null}
                    </div>
                    <div id="form-error-message">
                        {actionData?.formError ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                            >
                                {actionData.formError}
                            </p>
                        ) : null}
                    </div>
                    <button className="w-full capitalize rounded-md bg-yellow-400 hover:bg-yellow-500 p-2 text-center text-purple-900 text-2xl font-extrabold">submit</button>
                    <ul className="flex flex-row items-center justify-between gap-4 text-sm">
                        <li className="p-2 hover:bg-purple-300 hover:p-2 hover:rounded-xl">
                            <Link className="hover:text-purple-950" to="/">Home</Link>
                        </li>
                        <li className="p-2 hover:hover:bg-purple-300 hover:p-2 hover:rounded-xl">
                            <Link className="hover:text-purple-950 hover:mb-4" to="/jokes">Jokes</Link>
                        </li>
                    </ul>
                </Form>
            </div>
        </div>
    )
}