import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function SignUp(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  
  if ("message" in searchParams) {
    return (
      <div className="text-center">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className="sm:mx-auto sm:w-full">
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="font-medium text-indigo-600 hover:text-indigo-500" href="/sign-in">
            Sign in
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
            <Label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="mt-1"
              placeholder="Create a password"
            />
          </div>
        </div>

        <SubmitButton
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          pendingText="Creating account..."
          formAction={signUpAction}
        >
          Create account
        </SubmitButton>

        <FormMessage message={searchParams} />
      </form>
    </>
  );
}
