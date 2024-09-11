import { extendTheme } from "@chakra-ui/react"

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#E8E8E8",
        color: 'white'
      }
    }
  },
  fonts: {
    body: "Poppins, sans-serif",
    heading: "Georgia, serif",
    mono: "Menlo, monospace",
  },

})
