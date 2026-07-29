import Image from "next/image";
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-[380px] rounded-xl border bg-white shadow-lg p-10">

        <h1 className="text-5xl font-bold text-center mb-8">
          Login
        </h1>

        {/* Google Login */}
        <form
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: "/",
            });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 rounded-lg bg-green-50 hover:bg-green-100 py-3 transition"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              width={20}
              height={20}
              alt="Google"
            />

            <span className="font-medium">
              Login with Google
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t"></div>

          <span className="mx-4 text-gray-400 text-sm">
            or sign up through email
          </span>

          <div className="flex-1 border-t"></div>
        </div>

        {/* Email Login */}
        <form className="space-y-4">

          <input
            type="email"
            placeholder="Email ID"
            className="w-full rounded-lg bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 text-white py-3 hover:bg-green-700 transition"
          >
            Login
          </button>

        </form>
      </div>
    </main>
  );
}