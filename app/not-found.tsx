import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-2 rounded-full bg-muted p-3">
            <SearchX className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">გვერდი ვერ მოიძებნა</CardTitle>
          <CardDescription>
            მოთხოვნილი გვერდი არ არსებობს ან უკვე გადატანილია სხვა მისამართზე.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/dashboard">დეშბორდზე დაბრუნება</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">ლოგინზე გადასვლა</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
