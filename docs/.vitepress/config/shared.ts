import { defineConfig, type SiteConfig } from 'vitepress'
// 自动导入 TDesign 
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import viteCompression from 'vite-plugin-compression';

import { handleHeadMeta } from "../theme/utils/handleHeadMeta";
import { search as zhSearch } from './zh'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://blog.mateogic.cn'
  },
  head: [
    ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-MB7XVBG1TQ" }],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-MB7XVBG1TQ');`,
    ],

    [
      "link",
      {
        rel: "icon",
        href: "https://oss.mateogic.cn/blog/1756397179300-headshot.jpeg",
      },
    ],
  ],
  // https://vitepress.dev/reference/site-config#transformhead
  async transformHead(context) {
    return handleHeadMeta(context)
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: [2, 4],

    // 本地搜索
    search: {
      provider: "local",
      options: {
        locales: { ...zhSearch }
      }
    },

    // // algolia搜索，需要申请，如不需要，删除下面的配置，可使用本地搜索
    // search: {
    //   provider: 'algolia',
    //   options: {
    //     appId: 'LGWG5THRKY',
    //     apiKey: '8fb5c1dc72bc92580f7fa1471ad2b814',
    //     indexName: 'Mateogic',
    //     locales: { ...zhSearch }
    //   }
    // },

    externalLinkIcon: true,
  },

  markdown: {
    math: true
  },

  vite: {
    server: { 
      host: '0.0.0.0',
      port: 5173
    },
    plugins: [
      // ...
      AutoImport({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
      }),
      Components({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
      }),
      // 生成 gzip 压缩资源 (仅 js / css, >1KB)
      viteCompression({
        filter: (file) => /\.(js|css)$/i.test(file),
        threshold: 1024,
        algorithm: 'gzip',
        ext: '.gz'
      })
    ],
  },
})
