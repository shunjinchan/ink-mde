import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { type EditorSelection, EditorState, Prec } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { buildVendors } from '/src/extensions'
import { blockquote } from '/src/vendor/extensions/blockquote'
import { code } from '/src/vendor/extensions/code'
import { ink } from '/src/vendor/extensions/ink'
import { lineWrapping } from '/src/vendor/extensions/line_wrapping'
import { theme } from '/src/vendor/extensions/theme'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'
import { toCodeMirror } from './adapters/selections'
// hyper-link 性能有问题
// import { hyperLink } from '@uiw/codemirror-extensions-hyper-link';
import * as events from '@uiw/codemirror-extensions-events'
import { type Events } from '@uiw/codemirror-extensions-events'

const toVendorSelection = (selections: Ink.Editor.Selection[]): EditorSelection | undefined => {
  if (selections.length > 0)
    return toCodeMirror(selections)
}

export const makeState = ([state, setState]: InkInternal.Store): InkInternal.Vendor.State => {
  // console.log(state().options)
  const eventExt: Events = events.content(state().options.events);
  const keys = state().options?.keymaps.map(item => item.key)
  return EditorState.create({
    doc: state().options.doc,
    selection: toVendorSelection(state().options.selections),
    extensions: [
      keymap.of([
          // 重写需要先过滤掉默认的快捷键行为
        ...defaultKeymap.filter(item => keys?.every(key => key !== item.key)),
        ...historyKeymap,
      ]),
      // 自定义快捷键
      ...state().options?.keymaps.map((item) => {
        return Prec.highest(keymap.of(item))
      }),
      blockquote(),
      code(),
      history(),
      ink(),
      lineWrapping(),
      theme(),
      eventExt,
      ...buildVendors([state, setState]),
    ],
  })
}
