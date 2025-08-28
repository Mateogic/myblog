import path from "node:path";
import { writeFileSync } from "node:fs";
import { Feed } from "feed";
import { createContentLoader, type SiteConfig } from "vitepress";

const hostname = "https://blog.mateogic.cn";

export async function createRssFileZH(config: SiteConfig) {
  const feed = new Feed({
    title: 'Mateogic',
    description: '一名希望成为开发者的学生，喜欢健身、摄影等。',
    id: hostname,
    link: hostname,
    language: "zh-Hans",
    image: "https://oss.mateogic.cn/blog/1756397179300-headshot.jpeg",
    favicon: `https://oss.mateogic.cn/blog/1756397179300-headshot.jpeg`,
    copyright: "Copyright© 2025-present Mateogic",
  });

  const posts = await createContentLoader("posts/**/*.md", {
    excerpt: true,
    render: true,
  }).load();

  posts.sort((a, b) => Number(+new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)));

  for (const { url, excerpt, html, frontmatter } of posts) {
    // 仅保留最近 5 篇文章
    if (feed.items.length >= 5) {
      break;
    }

    feed.addItem({
      title: frontmatter.title,
      id: `${hostname}${url}`,
      link: `${hostname}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: "Mateogic",
          email: "ljc_2318516761@163.com",
          link: "https://blog.mateogic.cn",
        },
      ],
      date: frontmatter.date,
    });
  }

  writeFileSync(path.join(config.outDir, "feed.xml"), feed.rss2(), "utf-8");
}

export async function createRssFileEN(config: SiteConfig) {
  const feed = new Feed({
    title: "Mateogic",
    description: "A student who wants to become a developer and enjoys fitness, photography, etc.",
    id: hostname,
    link: hostname,
    language: "en-US",
    image: "https://oss.mateogic.cn/blog/1756397179300-headshot.jpeg",
    favicon: `https://oss.mateogic.cn/blog/1756397179300-headshot.jpeg`,
    copyright: "Copyright© 2025-present Mateogic",
  });

  const posts = await createContentLoader("en/posts/**/*.md", {
    excerpt: true,
    render: true,
  }).load();

  posts.sort((a, b) => Number(+new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)));

  for (const { url, excerpt, html, frontmatter } of posts) {
    // 仅保留最近 5 篇文章
    if (feed.items.length >= 5) {
      break;
    }

    feed.addItem({
      title: frontmatter.title,
      id: `${hostname}${url}`,
      link: `${hostname}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: "Mateogic",
          email: "ljc_2318516761@163.com",
          link: "https://blog.mateogic.cn",
        },
      ],
      date: frontmatter.date,
    });
  }

  writeFileSync(path.join(config.outDir, "feed-en.xml"), feed.rss2(), "utf-8");
}
