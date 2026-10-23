"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/i18n-provider";
import { invalidateRequestQueries } from "@/features/requests/cache";
import { assistantApi, type ActionInput, type ActionPreview } from "./api";
import { assistantCopy } from "./copy";
import type { ServiceRequest } from "@/types/api";

export function ActionReview({
  input,
  onComplete,
}: {
  input: ActionInput;
  onComplete: (result: ServiceRequest) => void;
}) {
  const { locale } = useI18n();
  const copy = assistantCopy[locale];
  const client = useQueryClient();
  const [preview, setPreview] = useState<ActionPreview>();
  const prepare = useMutation({
    mutationFn: () => assistantApi.prepare(input),
    onSuccess: setPreview,
  });
  const confirm = useMutation({
    mutationFn: () => assistantApi.confirm(preview!.token),
    onSuccess: async (result) => {
      await invalidateRequestQueries(client);
      onComplete(result);
    },
  });
  return (
    <div className="mt-4 rounded-xl border border-brand-200 p-4 dark:border-brand-700">
      {preview ? (
        <>
          <h3 className="font-semibold">{copy.review}</h3>
          <p className="my-3 whitespace-pre-wrap text-sm">{preview.summary}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={confirm.isPending} onClick={() => confirm.mutate()}>
              {copy.confirm}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={confirm.isPending}
              onClick={() => {
                setPreview(undefined);
                confirm.reset();
              }}
            >
              {copy.back}
            </Button>
          </div>
        </>
      ) : (
        <Button
          type="button"
          variant="secondary"
          disabled={prepare.isPending}
          onClick={() => prepare.mutate()}
        >
          {prepare.isPending ? copy.busy : copy.prepare}
        </Button>
      )}
      {(prepare.isError || confirm.isError) && (
        <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">
          {(prepare.error ?? confirm.error)?.message || copy.actionError}
        </p>
      )}
    </div>
  );
}
