import { type DefaultTheme, defineConfig } from 'vitepress'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Mateogic",
  description: "一名希望成为开发者的学生，喜欢健身、摄影等。",
  lang: "zh-Hans", //语言

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
			{ text: "博客", link: "/" },
			{ text: "归档", link: "/archive", activeMatch: '/archive' },
			{ text: "关于", link: "/about", activeMatch: '/about' },
    ],
    footer: {
      message: 'Copyright © 2025-present <a href="https://blog.mateogic.cn/about">Mateogic</a>.' +
      '&nbsp;&nbsp;&nbsp;✧ <a href="https://blog.mateogic.cn/about#%E7%8E%A9%E5%85%B7-%E4%BD%9C%E5%93%81">个人项目</a>' + 
      '&nbsp;&nbsp;&nbsp;✧ <a href="https://blog.mateogic.cn/about#%E8%81%94%E7%B3%BB%E6%88%91">联系方式</a>' + 
      '&nbsp;&nbsp;&nbsp;✧ <a href="https://blog.mateogic.cn/friends">友情链接</a>',
      
      // copyright: 'Copyright © 2022-present <a href="https://justin3go.com/about">Justin3go</a>.',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    outlineTitle: "当前页面",
    lastUpdatedText: "最近更新时间",

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mateogic' },
    ],

    editLink: {
      pattern: "https://github.com/mateogic/myblog/edit/master/docs/:path",
      text: "在 GitHub 上编辑此页",
    },
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "目录",
    darkModeSwitchLabel: "深色模式",
  },
})

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  root: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消'
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: '收藏',
          removeFavoriteSearchButtonTitle: '从收藏中移除'
        },
        errorScreen: {
          titleText: '无法获取结果',
          helpText: '你可能需要检查你的网络连接'
        },
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
          searchByText: '搜索提供者'
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: '你认为该查询应该有结果？',
          reportMissingResultsLinkText: '点击反馈'
        }
      }
    }
  }
}
