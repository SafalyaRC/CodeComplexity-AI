"use client";

import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            color: '#fff',
          },
          className: 'my-toast',
          duration: 3000,
        }}
      />
    </>
  );
}