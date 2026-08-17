"use client";
import Link from "next/link";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const onSubmit = async (data: FormData) => {
    try {
      const response = await login(data);
      setAuth(response.user, response.accessToken);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Invalid email or password");
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <Card className="w-full max-w-md p-8">
        <CardContent className="p-0">
          <h1 className="mb-6 text-center text-xl font-bold text-[var(--fg)]">Log in to SecureTasks</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <Input type="email" placeholder="Email" {...register("email", { required: true })} />
            <Input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            <Button type="submit" disabled={isSubmitting} className="mt-1">
              Log in
            </Button>
          </form>
          <p className="mt-5 text-center text-xs text-[var(--fg-muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-[var(--accent)]">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
