import { Suspense } from "react";
import BookingForm from "./BookingForm";

export default function BookingPage() {
  return (
    <Suspense fallback={<p>Booking page loading...</p>}>
      <BookingForm />
    </Suspense>
  );
}
