'use client'
import { type ReactNode } from "react";
import { NotificationsProvider as ServiceProvider } from "@toolpad/core";

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ServiceProvider
      slotProps={{
        snackbar: {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          },
          sx: {
            borderColor:'#e5e7eb',
            borderWidth: 1,
            borderRadius: '4px'
          }
        }
      }}
    >
      {children}
    </ServiceProvider>
  )
}