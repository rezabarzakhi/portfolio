"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "@/components/toast";
import type { FormState } from "@/app/admin/actions";

type DeleteAction = (prev: FormState, formData: FormData) => Promise<FormState>;

const initial: FormState = null;

export function DeleteButton({ action, id, label }: { action: DeleteAction; id: string; label?: string }) {
  const [state, formAction, pending] = useActionState(action, initial);
  const router = useRouter();
  useEffect(() => {
    if (!state) return;
    if (state.status === "success") {
      toast.success(state.message);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);
  return <form action={formAction} className="inline"><input type="hidden" name="id" value={id} /><button className="mt-3 inline-flex items-center gap-2 text-sm text-red-400" type="submit" disabled={pending}><Trash2 size={15} />{label ?? "حذف"}</button></form>;
}
