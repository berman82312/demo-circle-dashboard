'use client'
import { useRouter } from "next/navigation";
import { Button, Typography } from "@mui/material";
import { RecentPayments } from "@/components/RecentPayments";

export default function Home() {
  const router = useRouter()
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Button fullWidth variant="outlined" onClick={() => router.push('/create')}>Add Payment</Button>
        <Typography variant="h6">
          Recent payments
        </Typography>
        <RecentPayments />
      </main>
    </div>
  );
}
