import "./globals.css";

export const metadata = {
  title: "Mrida The Label | Price & Availability Dashboard",
  description: "Track prices, real-time availability, and detailed specifications of our premium handloom, silk, and designer sarees collection in India. Curated by @mrida_thelabel.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>{children}</body>
    </html>
  );
}
