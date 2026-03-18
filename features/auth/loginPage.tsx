"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogin } from "./hooks/useLogin";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const session = useSession();
  const [password, setPassword] = useState("");
  const { login, error, isLoading, clearError } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  useEffect(() => {
    if (session.data?.user) {
      redirect("/dashboard");
    }
  }, [session]);

  if (session.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        სისტემა იტვირთება...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Dewalt Admin</CardTitle>
          <CardDescription>
            ადმინისტრაციის პანელზე შესასვლელად შეიყვანეთ მონაცემები
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">ელ.ფოსტა</Label>
              <Input
                id="email"
                name="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">პაროლი</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="შეიყვანეთ პაროლი"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "შესვლა მიმდინარეობს..." : "შესვლა"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
