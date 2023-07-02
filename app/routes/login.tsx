export default function login() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="bg-white text-purple-900 gap-4 rounded-md">
                <div className="flex flex-col items-center gap-4 p-10 shadow-xl">
                    <h1 className="uppercase text-4xl font-extrabold">login</h1>
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <input type="radio" id="login" value="login" />
                            <label className="ml-2">login</label>
                        </div>
                        <div>
                            <input type="radio" id="register" value="register" />
                            <label className="ml-2">register</label>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-left">username</label>
                        <input className="bg-purple-300 border-2 border-purple-400 rounded-md aria-invalid:border-red-600" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-left">password</label>
                        <input className="bg-purple-300 border-2 border-purple-400 rounded-md aria-invalid:border-red-600" type="text" />
                    </div>
                    <button className="w-full rounded-md bg-yellow-400 hover:bg-yellow-500 p-2 text-center text-purple-900 text-2xl font-extrabold">submit</button>

                </div>
            </div>
        </div>
    )
}