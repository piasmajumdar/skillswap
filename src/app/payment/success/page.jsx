import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

function PaymentSuccessFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <p className="text-slate-500">Loading payment confirmation...</p>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
