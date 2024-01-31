// https://discuss.codemirror.net/t/adding-support-for-the-additional-inline-syntax-to-markdown/3099
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { Tag } from '@lezer/highlight'
import type { MarkdownConfig } from '../../markdown/lezer-markdown/markdown.ts'

// import type * as Ink from 'ink-mde'
import type { Config } from '../index'
import { completions } from './completions'
import { HASHTAG_CODES, matchHashtag, matchHashtagPrefix } from './parser'

const tags = {
  hashtag: Tag.define(),
}

type hashtagOptions = {
  onTagged?: (tag: string) => void,
}
const opt: hashtagOptions = {}

const Hashtag: MarkdownConfig = {
  defineNodes: [
    {
      name: 'Hashtag',
      style: tags.hashtag,
    },
  ],
  parseInline: [
    {
      name: 'Hashtag',
      parse: (inline, charCode, index) => {
        if (!HASHTAG_CODES.includes(charCode) || HASHTAG_CODES.includes(inline.char(index + 1)))
          return -1

        // "A #hashtag in a line." -> "A #"
        const text = inline.slice(inline.offset, index + 1)
        // "A #" will match but "A#" will not
        const prefixMatch = matchHashtagPrefix(text)

        if (prefixMatch) {
          const start = index - prefixMatch.boundary.length
          const fullMatch = matchHashtag(inline.slice(start, inline.end))
          if (opt?.onTagged) {
            opt.onTagged(fullMatch?.sign + fullMatch?.tag)
          }

          if (fullMatch) {
            return inline.addElement(
              inline.elt('Hashtag', index, index + fullMatch.length - fullMatch.boundary.length),
            )
          }
        }

        return -1
      },
      after: 'Emphasis',
    },
  ],
}

const theme = syntaxHighlighting(
  HighlightStyle.define([
    {
      tag: tags.hashtag,
      // backgroundColor: 'var(--ink-internal-syntax-hashtag-background-color)',
      // borderRadius: '0.25rem',
      // color: 'var(--ink-internal-syntax-hashtag-color)',
      // padding: '0.125rem 0.25rem',
      class: 'cm-hashtag',
    },
  ]),
)

// export const hashtags = (config: Config): Ink.Options.Plugin[] => {
export const hashtags = (config: Config, options?: hashtagOptions) => {
  if (options?.onTagged) {
    opt.onTagged = options.onTagged
  }
  return [
    { type: 'completion', value: completions(config) },
    { type: 'default', value: theme },
    { type: 'grammar', value: Hashtag },
  ]
}
