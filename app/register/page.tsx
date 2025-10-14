import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Link from "next/link";

const Register = () => {
  const isLoading = false;
  return (
    <>
      <section className=" pt-10 pb-10">
        <div className="max-w-2xl mx-auto border-1 shadow-2xs rounded-2xl">
          <form className="bg-white px-10 py-5">
            <div className="mb-5">
              <Label className="block text-gray-700 mb-2">Your Full Name</Label>
              <Input
                type="text"
                name="name"
                className="w-full"
                placeholder="Full Name"
              />
            </div>
            {/* Email */}
            <div className="mb-5">
              <Label className="block text-gray-700 mb-2">Your Email</Label>
              <Input
                type="text"
                name="email"
                className="w-full"
                placeholder="Email"
              />
            </div>

            <div className="mb-5">
              <Label className="block text-gray-700 mb-2" htmlFor="Last Name">
                Password
              </Label>
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
              Already have an account? {""}
              <Link href="/login" className="text-black font-medium underline ">
                Login
              </Link>
            </span>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
