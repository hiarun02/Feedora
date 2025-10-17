import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Link from "next/link";

const Login = () => {
  const isLoading = false;
  return (
    <>
      <section className="h-screen flex flex-col justify-center px-5">
        <div className="mx-auto border-1 shadow-2xs rounded-2xl w-full max-w-lg bg-white">
          <form className="bg-white px-10 py-5">
            {/* Email */}
            <div className="mb-5 w-full">
              <Label className="block text-gray-700 mb-2">Your Email</Label>
              <Input
                type="text"
                name="email"
                className="w-full"
                placeholder="Email"
              />
            </div>

            <div className="mb-5">
              <Label className="block text-gray-700 mb-2">Password</Label>
              <Input
                name="password"
                type="password"
                className="w-full "
                placeholder="Password"
              />
            </div>

            <div className="mb-3 items-center gap-2">
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {isLoading ? "Please Wait..." : "Login"}
              </button>
            </div>
            <span className="text-gray-700 text-sm font-mono">
              {" "}
              Dont have an account? {""}
              <Link
                href="/register"
                className="text-black font-medium underline "
              >
                Create Account
              </Link>
            </span>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
