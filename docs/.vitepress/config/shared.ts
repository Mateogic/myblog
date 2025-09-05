import { defineConfig } from 'vitepress'
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
  // 解决首屏自动预取文章页 chunk 导致 503（服务端短暂不可用或尚未同步）的问题：
  // VitePress 默认会预取视口内可见链接指向的页面资源。首页只有一篇文章时，会立即尝试拉取该文章的 js chunk。
  // 在某些部署 / CDN 场景下，构建产物刚发布瞬间或边缘节点尚未同步，预取易收到 503。禁用后仅在真正导航时加载，避免首屏报错。
  router: {
    prefetchLinks: false,
  },
  sitemap: {
    hostname: 'https://blog.mateogic.cn'
  },
  head: [
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
    //     appId: 'I902L5MI8T',
    //     apiKey: 'b68c4dcaf9015eeaccbed1bd06503ffc',
    //     indexName: 'crawler',
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
