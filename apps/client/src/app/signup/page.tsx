"use client";
import Link from "next/link";
import { signup } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/auth-layout";

interface FormData {
  email: string;
  password: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const onSubmit = async (data: FormData) => {
    try {
      const response = await signup(data);
      setAuth(response.user, response.accessToken);
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup failed", error);
      toast.error("Could not create your account");
    }
  };

  return (
    <AuthLayout
      heading="Work that runs itself, with you in control."
      subtitle="Create your workspace — sprints, risk flags and AI suggestions, all in one place."
      formTitle="Create your account"
      formSubtitle={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-(--accent)">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-(--fg-muted)">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            {...register("email", { required: true })}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-(--fg-muted)">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password", { required: true })}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          Sign up
        </Button>
      </form>
    </AuthLayout>
  );
}
