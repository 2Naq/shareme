// oxlint-disable no-unused-vars
// @ts-nocheck
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";
import { categorys } from "./src/constants/category.js";
import { myData } from "./src/constants/my_data.js";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import fs from "fs";
import path from "path";

/**
 * @param {string} content
 */
function parseSimpleYaml(content) {
  const lines = content.split("\n");
  /** @type {Record<string, any>} */
  const result = {};
  /** @type {Record<string, any> | null} */
  let currentAuthor = null;
  /** @type {Record<string, any> | null} */
  let currentParent = null;

  for (let line of lines) {
    const commentIndex = line.indexOf("#");
    if (commentIndex !== -1) {
      line = line.substring(0, commentIndex);
    }
    const trimmed = line.trim();
    if (!trimmed) continue;

    const indent = line.length - line.trimStart().length;

    if (indent === 0) {
      if (trimmed.endsWith(":")) {
        const key = trimmed.slice(0, -1).trim();
        currentAuthor = {};
        result[key] = currentAuthor;
        currentParent = null;
      }
    } else if (indent === 2 && currentAuthor) {
      const colonIndex = trimmed.indexOf(":");
      if (colonIndex !== -1) {
        const key = trimmed.substring(0, colonIndex).trim();
        /** @type {string} */
        let value = trimmed.substring(colonIndex + 1).trim();

        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        } else if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        }

        if (value === "") {
          currentParent = {};
          currentAuthor[key] = currentParent;
        } else {
          currentAuthor[key] = value;
          currentParent = null;
        }
      }
    } else if (indent === 4 && currentParent) {
      const colonIndex = trimmed.indexOf(":");
      if (colonIndex !== -1) {
        const key = trimmed.substring(0, colonIndex).trim();
        let value = trimmed.substring(colonIndex + 1).trim();

        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        } else if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        }

        currentParent[key] = value;
      }
    }
  }
  return result;
}

let parsedAuthors = {};
try {
  const authorsPath = path.join(process.cwd(), "blog/authors.yml");
  if (fs.existsSync(authorsPath)) {
    const authorsContent = fs.readFileSync(authorsPath, "utf-8");
    parsedAuthors = parseSimpleYaml(authorsContent);
  }
} catch (err) {
  console.error("Failed to parse authors.yml:", err);
}

const dynamicPlugins = categorys.map((category) => [
  "@docusaurus/plugin-content-docs",
  {
    id: category.id,
    path: category.path,
    routeBasePath: category.routeBasePath,
    sidebarPath: "./sidebars.js",
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
]);

// Automatically generate navbar items
const dynamicNavbarItems = categorys.map((category) => ({
  to: category.introLink,
  label: category.label,
  position: "left",
  activeBaseRegex: `/${category.routeBasePath}/`,
}));

// Automatically generate footer links
const dynamicFooterLinks = categorys.map((category) => ({
  label: category.label,
  to: category.introLink,
}));

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: myData.brand_name,
  tagline: `${myData.brand_name} - Sharing knowledge ${myData.user_name}`,
  favicon: "/favicon.ico",
  // stylesheets: [
  //   {
  //     href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
  //     type: "text/css",
  //   },
  // ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  // Set the production url of your site here
  url: "https://2naq.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/shareme",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "2naq", // Usually your GitHub org/user name.
  projectName: "shareme", // Usually your repo name.
  trailingSlash: false,
  customFields: {
    authors: parsedAuthors,
  },

  onBrokenLinks: "throw",
  onBrokenAnchors: "ignore",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  // i18n: {
  //   defaultLocale: 'vi',
  //   locales: ['vi', 'en'],
  //   localeConfigs: {
  //     vi: { label: 'Tiếng Việt' },
  //     en: { label: 'English' }
  //   },
  // },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
          blogSidebarCount: "ALL",
          postsPerPage: 24,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  plugins: [
    ...dynamicPlugins,
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Tích hợp TailwindCSS vào tiến trình build
          postcssOptions.plugins.push(require("@tailwindcss/postcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
        configureWebpack(config, isServer, utils) {
          return {
            resolve: {
              alias: {
                "@": require("path").resolve(context.siteDir, "src"),
              },
            },
          };
        },
        injectHtmlTags() {
          return {
            headTags: [
              {
                tagName: "script",
                innerHTML: `
                  (function() {
                    try {
                      const urlParams = new URLSearchParams(window.location.search);
                      const pwaType = urlParams.get('pwa') || localStorage.getItem('pwa-preference') || 'all';
                      let manifestUrl = '/shareme/manifest-all.json';
                      
                      if (pwaType === 'docs') {
                        manifestUrl = '/shareme/manifest-docs.json';
                        localStorage.setItem('pwa-preference', 'docs');
                      } else {
                        manifestUrl = '/shareme/manifest-all.json';
                        localStorage.setItem('pwa-preference', 'all');
                      }

                      let link = document.getElementById('pwa-manifest');
                      if (!link) {
                        link = document.createElement('link');
                        link.rel = 'manifest';
                        link.id = 'pwa-manifest';
                        document.head.appendChild(link);
                      }
                      link.href = manifestUrl;
                    } catch(e) {
                      console.error('Failed to set manifest', e);
                    }

                    if ('serviceWorker' in navigator) {
                      window.addEventListener('load', function() {
                        navigator.serviceWorker.register('/shareme/sw.js', { scope: '/shareme/' })
                          .then(function(reg) {
                            console.log('Docs SW registered:', reg.scope);
                          })
                          .catch(function(err) {
                            console.error('Docs SW registration failed:', err);
                          });
                      });
                    }

                    window.addEventListener('beforeinstallprompt', (e) => {
                      e.preventDefault();
                      window.deferredPrompt = e;
                      window.dispatchEvent(new CustomEvent('pwa-install-prompt-ready'));
                    });
                  })();
                `,
              },
            ],
          };
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      colorMode: {
        respectPrefersColorScheme: true,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
      algolia: {
        appId: "EN380UNNOE",
        apiKey: "a21094e5e6565a08632d958eb85c8f49",
        indexName: "Shareme",
        contextualSearch: false,
        // searchParameters: {
        //   hitsPerPage: 20,
        // },
      },
      navbar: {
        logo: {
          alt: myData.brand_name,
          src: "/favicon.svg",
        },
        title: myData.brand_name,
        items: [
          ...dynamicNavbarItems,
          // {
          //   type: 'localeDropdown',
          //   position: 'right',
          // },
          {
            type: "search",
            position: "right",
          },
          // {
          //   href: myData.link_github,
          //   label: "GitHub",
          //   position: "right",
          // },
          {
            href: "pathname:///shareme/tool/",
            label: "Tool",
            position: "right",
            target: "_self",
          },
          { to: "/blog", label: "Blog", position: "right" },
          {
            href: "/about",
            label: "About Me",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Share docs",
            items: [
              {
                label: "PLC",
                to: "/plc/intro",
              },
              {
                label: "Invertor",
                to: "/inverter/intro",
              },
              {
                label: "Other",
                to: "/other/intro",
              },
            ],
          },
          {
            title: "Blog",
            items: [
              {
                label: "All blog",
                to: "/blog",
              },
              {
                label: "Authors",
                to: "/blog/authors",
              },
            ],
          },
        ],
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Stack Overflow',
        //       href: '#',
        //     },
        //     {
        //       label: 'Discord',
        //       href: '#',
        //     },
        //     {
        //       label: 'X',
        //       href: '#',
        //     },
        //   ],
        // },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'Blog',
        //       to: '/blog',
        //     },
        //     {
        //       label: 'GitHub',
        //       href: myData.link_github,
        //     },
        //   ],
        // },
        // ],
        copyright: `Built by ${myData.user_name}. TRUONG SA, HOANG SA BELONG TO VIETNAM.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
