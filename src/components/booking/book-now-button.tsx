"use client";

import { useBooking } from "@/components/booking/booking-provider";
import type { PlanSlug } from "@/types/content";

type BookNowButtonProps = {
  label: string;
  className?: string;
  planSlug?: PlanSlug;
  onOpen?: () => void;
};

export function BookNowButton({
  label,
  className,
  planSlug,
  onOpen,
}: BookNowButtonProps) {
  const { openBooking } = useBooking();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        openBooking({ planSlug });
        onOpen?.();
      }}
    >
      {label}
    </button>
  );
}

