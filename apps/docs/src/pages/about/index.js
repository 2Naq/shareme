import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import { HeaderAbout, MainAbout } from "./componets";

export default function Aboutme() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Portfolio - ${siteConfig.title}`}
      noFooter
      description="Personal portfolio and documentation site"
    >
      <HeaderAbout />
      <MainAbout />
    </Layout>
  );
}
