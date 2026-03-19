import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="space-y-1">
          <p className="text-base font-medium">იტვირთება...</p>
          <p className="text-sm text-muted-foreground">
            გთხოვთ მოითმინოთ რამდენიმე წამი.
          </p>
        </div>
      </div>
    </div>
  );
}
