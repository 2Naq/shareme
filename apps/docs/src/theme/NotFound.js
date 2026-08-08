import React from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Layout
      title={translate({
        id: "theme.NotFound.title",
        message: "Page Not Found",
      })}
    >
      <main className="container my-4 flex min-h-[60vh] flex-col items-center justify-center bg-white text-center">
        <h1 className="text-primary text-6xl">404</h1>
        <p className="text-muted-foreground mt-2 text-xl">
          Ôi không! Ní đi lạc rồi?
        </p>

        <div className="w-full sm:max-w-112.5">
          <img
            src={useBaseUrl("/img/dribbble_1.gif")}
            alt="404 Animation"
            className="w-full rounded-2xl"
          />
        </div>

        <Link
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 pr-6 pl-4 font-semibold text-white no-underline transition-opacity hover:opacity-90 sm:w-auto"
          to="/"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="mb-0.5 leading-none">Quay lại</span>
        </Link>
      </main>
    </Layout>
  );
}
