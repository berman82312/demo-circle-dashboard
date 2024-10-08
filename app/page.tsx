'use client'
import { NotificationsProvider } from "@toolpad/core";
import { PaymentForm } from "./components/PaymentForm";
import { RecentPayments } from "./components/RecentPayments";

export default function Home() {
  return (
    <NotificationsProvider slotProps={{
      snackbar: {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        }
      }
    }}>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <PaymentForm />
          <p>Recent payments</p>
          <RecentPayments />
        </main>
      </div>
    </NotificationsProvider>
  );
}
