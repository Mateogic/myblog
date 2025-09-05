/**
 * 主页交互功能
 * - 主题切换
 * - 平滑滚动
 * - 导航栏状态
 */

class Homepage {
  constructor() {
    this.init();
  }

  init() {
    this.initThemeToggle();
    this.initSmoothScroll();
    this.initNavbar();
    this.initAnimations();
  }

  /**
   * 初始化主题切换功能
   */
  initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // 监听系统主题变化
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  /**
   * 切换主题
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * 设置主题
   * @param {string} theme - 主题名称 ('light' | 'dark')
   */
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // 保险：清除可能遗留的旧版本脚本写入的 inline 样式（用户缓存旧 JS 导致）
    const navbar = document.querySelector('.nav');
    if (navbar) {
      navbar.style.backgroundColor = '';
      navbar.style.backdropFilter = '';
    }
  // 主题切换后立即同步导航栏状态（避免滚动前的旧内联样式残留）
  this.syncNavbarState();

    // 添加切换动画效果
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  /**
   * 初始化平滑滚动
   */
  initSmoothScroll() {
    // 处理锚点链接的平滑滚动
    const supportsScrollBehavior = 'scrollBehavior' in document.documentElement.style;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      // 注意：不能使用 passive:true，因为需要调用 preventDefault()
      anchor.addEventListener('click', (e) => {
        const hash = anchor.getAttribute('href');
        if (hash.length === 1) return; // href="#"
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        // 使用 scrollIntoView + scroll-margin-top (由 CSS 控制) 避免读取 offsetTop 触发布局
        if (supportsScrollBehavior) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // 降级：不平滑滚动（避免额外测量）
          target.scrollIntoView();
        }
      });
    });
  }

  /**
   * 初始化导航栏功能
   */
  initNavbar() {
    const navbar = document.querySelector('.nav');
    if (!navbar) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const scrolled = window.scrollY > 100; // 仅一次读取
      navbar.classList.toggle('is-scrolled', scrolled);
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /**
   * 主题切换后同步导航栏（类名方式，无需处理具体颜色）
   */
  syncNavbarState() {
    const navbar = document.querySelector('.nav');
    if (!navbar) return;
    const scrolled = window.scrollY > 100;
    navbar.classList.toggle('is-scrolled', scrolled);
  }

  /**
   * 初始化动画效果
   */
  initAnimations() {
    // 滚动时的项目卡片动画
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!reduceMotion) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
          } else {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // 观察项目卡片
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      observer.observe(card);
    });
  }

  /**
   * 获取当前主题
   * @returns {string} 当前主题
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  /**
   * 检测用户偏好的主题
   * @returns {string} 偏好主题
   */
  getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}

/**
 * 工具函数
 */
const Utils = {
  /**
   * 防抖函数
   * @param {Function} func - 要防抖的函数
   * @param {number} wait - 等待时间
   * @returns {Function} 防抖后的函数
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} limit - 时间限制
   * @returns {Function} 节流后的函数
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 检测是否为移动设备
   * @returns {boolean} 是否为移动设备
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise<boolean>} 复制是否成功
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new Homepage();
  
  // 添加加载完成的类名用于动画
  document.body.classList.add('loaded');
  
  // 初始化页面统计
  initPageStats();
});

// 处理页面可见性变化
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // 页面变为可见时的处理
    document.title = 'Mateogic';
  } else {
    // 页面变为不可见时的处理
    document.title = '👋 Come back soon!';
  }
});

// 错误处理
window.addEventListener('error', (e) => {
  console.error('页面发生错误:', e.error);
});

/**
 * 初始化页面统计信息
 */
function initPageStats() {
  // 显示页面加载时间
  if (performance && performance.timing) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    if (loadTime > 0) {
      console.log(`🚀 页面加载时间: ${loadTime}ms`);
    }
  }
  
  // 添加版权信息
  const currentYear = new Date().getFullYear();
  const footerText = document.querySelector('.footer-text');
  if (footerText && !footerText.textContent.includes(currentYear)) {
    footerText.innerHTML = footerText.innerHTML.replace('2025', currentYear);
  }
}

// 导出到全局作用域（如果需要）
window.Homepage = Homepage;
window.Utils = Utils;
window.initPageStats = initPageStats;