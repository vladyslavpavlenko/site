import "../styles/globals.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import localFont from "next/font/local";

const sansFont = localFont({
  src: "../public/inter.roman.var.woff2",
  weight: "100 900",
  display: "swap",
});

const Archipelago = dynamic(
  () => import("../components/Navigation/Archipelago")
);


export default function MyApp({
  Component,
  pageProps,
}) {

  return (
    <>
        <style jsx global>
          {`
            :root {
              --sans-font: ${sansFont.style.fontFamily};
            }
          `}
        </style>

        <Component {...pageProps} />

        <Suspense>
          <Archipelago />
        </Suspense>
    </>
  );
}
