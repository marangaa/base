import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function SignIn(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  
  return (
    <>
      <div className="sm:mx-auto sm:w-full">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link className="font-medium text-indigo-600 hover:text-indigo-500" href="/sign-up">
            Sign up
          </Link>
        </p>
      </div>

      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </Label>
              <Link
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <SubmitButton
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          pendingText="Signing in..."
          formAction={signInAction}
        >
          Sign in
        </SubmitButton>

        <FormMessage message={searchParams} />
      </form>
    </>
  );
}
