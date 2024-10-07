'use client'

import { createTheme } from "@mui/material"

export const theme = createTheme({
  palette: {
    mode: 'dark'
  },
  typography: {
    fontFamily: 'var(--font-geist-sans) var(--font-geist-mono)'
  }
})

export default theme;