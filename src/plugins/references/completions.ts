import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import type { Config } from './index'

export const completions = (config: Config) => {
  return (context: CompletionContext): CompletionResult | null => {
    const line = context.state.doc.lineAt(context.pos)
    // 光标之前的文本
    const headText = line.text.slice(0, context.pos - line.from)
    const tailText = line.text.slice(context.pos - line.from)

    const headIndex = headText.lastIndexOf('[[')
    const headTailText = headText.substring(headIndex + 2)

    // 没找到 [[，不符合规则
    if (headIndex < 0) return null
    // 找到了 [[，前面有 [，不符合规则
    if (headIndex >= 0 && headText[headIndex - 1] === '[') return null
    // 最后一个 [[ 闭合了，不符合规则
    if (headIndex >= 0 && headTailText.includes(']]')) return null
    // 后面起始字符不是 ]]，或者 ] 大于两个，不符合规则
    if (!tailText.startsWith(']]') || tailText.startsWith(']]]')) return null

    return {
      from: context.pos - headTailText.length,
      options: config.docs.map((doc) => {
        return {
          apply: doc.id,
          label: doc.title || doc.id,
          type: 'text',
        }
      }),
    }

    // matchBefore calls .search on the line text up to the current position
    // const match = context.matchBefore(/\[\[.*?/)
    // if (!match) { return null }
    //
    // return {
    //   from: match.from + 2,
    //   options: config.docs.map((doc) => {
    //     return {
    //       apply: doc.id,
    //       label: doc.title || doc.id,
    //       type: 'text',
    //     }
    //   }),
    // }
  }
}
