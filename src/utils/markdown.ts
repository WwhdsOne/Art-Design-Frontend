import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'

// 插件
import markdownItFootnote from 'markdown-it-footnote'

// Prism 插件（按需加载）
import 'prismjs/plugins/toolbar/prism-toolbar.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js'

import 'prismjs/themes/prism-okaidia.css' // 基础主题
import 'prismjs/plugins/line-numbers/prism-line-numbers.css' // 行号插件样式
import 'prismjs/plugins/toolbar/prism-toolbar.css' // 工具栏插件样式

// Prism 支持的语言
// Web 前端语言
// 下一行的引入必须先于php引入，否则无法解析
// issue: https://github.com/PrismJS/prism/issues/1400
import 'prismjs/components/prism-markup-templating.js'

import 'prismjs/components/prism-markup.js' // HTML
import 'prismjs/components/prism-css.js'
import 'prismjs/components/prism-scss.js'
import 'prismjs/components/prism-less.js'
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-jsx.js' // 支持 React JSX
import 'prismjs/components/prism-tsx.js' // 支持 React TSX
import 'prismjs/components/prism-markdown.js'

// 后端语言
import 'prismjs/components/prism-json.js'
import 'prismjs/components/prism-yaml.js'
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-python.js'
import 'prismjs/components/prism-java.js'
import 'prismjs/components/prism-c.js'
import 'prismjs/components/prism-cpp.js'
import 'prismjs/components/prism-csharp.js'
import 'prismjs/components/prism-go.js'
import 'prismjs/components/prism-rust.js'
import 'prismjs/components/prism-php.js'
import 'prismjs/components/prism-ruby.js'
import 'prismjs/components/prism-perl.js'
import 'prismjs/components/prism-sql.js'

// 文档 / 配置类
import 'prismjs/components/prism-ini.js'
import 'prismjs/components/prism-diff.js'
import 'prismjs/components/prism-properties.js'

import 'prismjs/components/prism-yaml.js'
import 'prismjs/components/prism-json.js'

// shell 和无高亮语言
import 'prismjs/components/prism-shell-session.js'
import 'prismjs/components/prism-powershell.js'
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-powershell.js'
import 'prismjs/components/prism-batch.js'

// 数据分析 / 科学计算
import 'prismjs/components/prism-r.js'
import 'prismjs/components/prism-matlab.js'

// Docker / DevOps
import 'prismjs/components/prism-docker.js'
import 'prismjs/components/prism-nginx.js'
import 'prismjs/components/prism-makefile.js'

// 核心样式
import 'prismjs/themes/prism-tomorrow.css' // 你可以选自己喜欢的主题

// 引入 Prism 的 css 主题
import 'prismjs/themes/prism-tomorrow.css' // 也可以用其他主题，如 prism.css
import 'prismjs/plugins/show-language/prism-show-language'

// 需要引入你想支持的语言，比如：
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-go'

import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/toolbar/prism-toolbar.js'
// 行号插件样式和脚本
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'

// 复制按钮插件样式和脚本
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js'
// KaTeX
import texmath from 'markdown-it-texmath'
import katex from 'katex'

import 'katex/dist/katex.min.css'
export function useMarkdown() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight(code, lang): string {
      if (lang && Prism.languages[lang]) {
        return `<pre class="line-numbers language-${lang}"><code class="language-${lang}">${Prism.highlight(code, Prism.languages[lang], lang)}</code></pre>`
      }
      return `<pre class="line-numbers"><code>${md.utils.escapeHtml(code)}</code></pre>`
    }
  })

  md.use(markdownItFootnote)
  // 使用 texmath 插件，配合 katex 渲染数学公式
  md.use(texmath, {
    engine: katex,
    delimiters: 'dollars', // 支持 $...$ 和 $$...$$
    katexOptions: {
      throwOnError: false, // 数学错误不抛出异常
      macros: { '\\RR': '\\mathbb{R}' }
    }
  })

  return md
}
