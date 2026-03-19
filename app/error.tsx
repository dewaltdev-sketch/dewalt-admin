"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-2 rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">დაფიქსირდა შეცდომა</CardTitle>
          <CardDescription>
            გვერდმა მოულოდნელი შეცდომა დააბრუნა. სცადეთ თავიდან ან დაბრუნდით
            დეშბორდზე.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1"
              onClick={() => {
                reset();
                router.refresh();
              }}
            >
              სცადეთ თავიდან
            </Button>
            <Button asChild className="flex-1" variant="outline">
              <Link href="/dashboard">დეშბორდზე დაბრუნება</Link>
            </Button>
          </div>

          <details className="rounded-md border p-3">
            <summary className="cursor-pointer text-sm font-medium">
              შეცდომის დეტალები
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-destructive">
              {error?.message}
              {error?.digest ? `\n\ndigest: ${error.digest}` : ""}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
