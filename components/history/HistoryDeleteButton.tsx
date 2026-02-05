 "use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteTailoredDocument } from "@/app/history/[id]/actions";

type HistoryDeleteButtonProps = {
  id: string;
};

export function HistoryDeleteButton({ id }: HistoryDeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    const formData = new FormData();
    formData.set("id", id);
    startTransition(async () => {
      const result = await deleteTailoredDocument(formData);
      if (result.ok) {
        router.refresh();
        setIsConfirmOpen(false);
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleDelete}
        disabled={isPending}
        className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700"
      >
        Delete
      </Button>
      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete this tailored resume?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isPending}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
