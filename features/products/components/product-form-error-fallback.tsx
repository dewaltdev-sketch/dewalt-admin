"use client";

import { AlertTriangle } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ProductFormErrorFallbackProps = FallbackProps & {
  onClose: () => void;
};

export function ProductFormErrorFallback({
  error,
  resetErrorBoundary,
  onClose,
}: ProductFormErrorFallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "უცნობი შეცდომა";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-center">
            ფორმის გახსნისას შეცდომა მოხდა
          </DialogTitle>
          <DialogDescription className="text-center">
            სცადეთ ფორმის ხელახლა გახსნა ან დახურეთ ეს ფანჯარა.
          </DialogDescription>
        </DialogHeader>

        <details className="rounded-md border p-3">
          <summary className="cursor-pointer text-sm font-medium">
            შეცდომის დეტალები
          </summary>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-xs text-destructive">
            {errorMessage}
          </pre>
        </details>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            დახურვა
          </Button>
          <Button type="button" onClick={resetErrorBoundary}>
            ხელახლა ცდა
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
