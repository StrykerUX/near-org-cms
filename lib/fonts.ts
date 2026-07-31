import localFont from "next/font/local";

export const montreal = localFont({
  src: [
    {
      path: "../public/fonts/pp-neue-montreal/PPNeueMontreal-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/pp-neue-montreal/PPNeueMontreal-BookItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/pp-neue-montreal/PPNeueMontreal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/pp-neue-montreal/PPNeueMontreal-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-montreal",
  display: "swap",
});
