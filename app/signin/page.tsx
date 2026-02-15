"use client";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useState, FormEvent, useEffect} from "react";
import {Button} from "@/components/ui/button";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {status} = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <section className="h-screen flex flex-col justify-center px-5">
        <div className="mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  // Don't render signin form if already authenticated
  if (status === "authenticated") {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (response?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (response?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="h-screen flex flex-col justify-center px-5">
        <div className="mx-auto border-1 shadow-2xs rounded-2xl w-full max-w-lg px-10 py-5">
          {/* header */}
          <div className="px-10 py-5 text-center ">
            <h2>Sign In & Sign Up to Your Account</h2>
          </div>
          <form className="" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="mb-5 w-full">
              <Label className="block mb-2">Your Email</Label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="user@gmail.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-5">
              <Label className="block  mb-2">Password</Label>
              <Input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full "
                placeholder="user123"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-3 items-center gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black dark:bg-white dark:text-black text-white py-2 rounded-lg font-medium dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {isLoading ? "Please Wait..." : "Continue"}
              </Button>
            </div>
          </form>
          <Button
            onClick={() => {
              signIn("google", {callbackUrl: "/dashboard"});
            }}
            variant="outline"
            className="w-full py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-5"
          >
            Continue with Google
          </Button>
        </div>
      </section>
    </>
  );
};

export default Signin;
