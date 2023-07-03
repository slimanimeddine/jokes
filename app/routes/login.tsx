import type {
  ActionArgs,
} from "@remix-run/node";
import { Link, useSearchParams, useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";

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


export default function Login() {
    const [searchParams] = useSearchParams();
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="bg-white text-purple-900 gap-4 rounded-md">
                <form method="post" className="flex flex-col items-center gap-4 p-10 shadow-xl">
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
                            <input type="radio" name="loginType" value="login" defaultChecked />
                            <label className="ml-2">login</label>
                        </div>
                        <div>
                            <input type="radio" name="registerType" value="register" />
                            <label className="ml-2">register</label>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-left">username</label>
                        <input name="username" className="bg-purple-300 border-2 border-purple-400 rounded-md focus:outline-none focus:border-purple-600 focus:ring-purple-600" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-left">password</label>
                        <input name="password" className="bg-purple-300 border-2 border-purple-400 rounded-md focus:outline-none focus:border-purple-600 focus:ring-purple-600" type="password" />
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
                </form>
            </div>
        </div>
    )
}