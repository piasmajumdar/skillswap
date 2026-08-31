import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Bounce, ToastContainer } from "react-toastify";
import NextThemeProvider from "@/providers/NextThemeProvider";

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const inter = Inter({
  subsets: ["latin"],
})


export const metadata = {
  title: "SkillSwap",
  description:
    "Find skilled freelancers, hire for your next project, and earn by offering your skills on SkillSwap.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased `}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">

        <NextThemeProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </NextThemeProvider>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </body>
    </html>
  );
}
