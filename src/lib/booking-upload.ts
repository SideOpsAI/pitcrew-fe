export const BOOKING_MAX_PHOTO_BYTES = 4 * 1024 * 1024;
export const BOOKING_MAX_TOTAL_UPLOAD_BYTES = 7 * 1024 * 1024;

export function bytesToRoundedMb(bytes: number) {
  return Number((bytes / (1024 * 1024)).toFixed(1));
}
