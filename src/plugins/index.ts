import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export { hashtags } from './hashtags'
export { references } from './references'
export { autoLink } from './autolink.ts'

// import { mermaid } from './mermaid'
// import { urls } from './urls'

export interface Config {
  docs: Doc[],
  tags: string[],
}

export interface Doc {
  id: string,
  title: string,
}

// console.log(tags)

export const addCustomClassNameForTagUrl = (className) => {
  return {
    type: 'default',
    value: syntaxHighlighting(
        HighlightStyle.define([
          {
            tag: tags.url,
            // 使用了 class 其他 css 样式属性就失效了
            // backgroundColor: 'var(--ink-internal-syntax-hashtag-background-color)',
            // borderRadius: '0.25rem',
            // color: 'var(--ink-internal-syntax-hashtag-color)',
            // padding: '0.125rem 0.25rem',
            class: className ||'link',
          },
        ]),
    ),
  }
}

// export { mermaid }

export const plugins = (config: Config) => {
  return [
    ...hashtags(config),
    // ...mermaid(config),
    ...references(config),
    ...autoLink(),
    // ...urls(config),
  ]
}
