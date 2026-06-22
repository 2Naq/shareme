// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';
import { categorys } from './src/constants/category.js';
import { myData } from './src/constants/my_data.js';
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const dynamicPlugins = categorys.map((category) => [
  '@docusaurus/plugin-content-docs',
  {
    id: category.id,
    path: category.path,
    routeBasePath: category.routeBasePath,
    sidebarPath: './sidebars.js',
  },
]);

// Automatically generate navbar items
const dynamicNavbarItems = categorys.map((category) => ({
  to: category.introLink,
  label: category.label,
  position: 'left',
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
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://2naq.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/shareme',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '2naq', // Usually your GitHub org/user name.
  projectName: 'shareme', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
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
                '@': require('path').resolve(context.siteDir, 'src'),
              },
            },
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
      navbar: {
        title: myData.brand_name,
        items: [
          ...dynamicNavbarItems,
          // { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: myData.link_github,
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '#',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: '#',
              },
              {
                label: 'Discord',
                href: '#',
              },
              {
                label: 'X',
                href: '#',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: myData.link_github,
              },
            ],
          },
        ],
        copyright: `Built by ${myData.user_name}. TRUONG SA, HOANG SA BELONG TO VIETNAM.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
