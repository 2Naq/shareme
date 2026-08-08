import React from "react";
import LayoutProvider from "@theme/Layout/Provider";
import Navbar from "@theme/Navbar";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import { myData } from "@/constants/my_data";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <>
      <LayoutProvider>
        <Head>
          <title>{siteConfig.title}</title>
          <meta
            name="description"
            content={`${myData.brand_name} - Sharing knowledge`}
          />
        </Head>

        {/* Đây là Header (Navbar) tự động render từ docusaurus.config.js */}
        <Navbar />

        {/* Tự do custom nội dung bên dưới mà không bị gò bó bởi Layout mặc định */}
        <div className="custom-layout-wrapper bg-white">
          <main className="container flex min-h-[calc(100vh-60px)] flex-col items-center justify-center text-center">
            <h1 className="text-primary text-6xl">
              Welcom to {myData.brand_name}
            </h1>
            <p className="text-muted-foreground mt-2 text-xl">
              Practice - Challenge - Persevere
            </p>

            <div className="w-full sm:max-w-112.5">
              <img
                src={useBaseUrl("/img/dribbble_1.gif")}
                alt="hello"
                className="w-full rounded-2xl"
              />
            </div>
            <Link
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 pr-4 pl-6 font-semibold text-white no-underline transition-opacity hover:opacity-90 sm:w-auto"
              to="/docs"
            >
              <span className="mb-0.5 leading-none">Get started</span>
              <ArrowRight className="size-5" />
            </Link>
          </main>
        </div>
      </LayoutProvider>
    </>
  );
}
