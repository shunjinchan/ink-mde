import { createSignal } from 'solid-js'
import { createExtensions } from '/src/extensions'
import { override } from '/src/utils/merge'
import { makeQueue } from '/src/utils/queue'
import type { Options } from '/types/ink'
import type InkInternal from '/types/internal'
import * as InkValues from '/types/values'
import { createElement } from './ui/utils'

export const blankState = (): InkInternal.StateResolved => {
  const options = {
    doc: '',
    files: {
      clipboard: false,
      dragAndDrop: false,
      handler: () => {},
      injectMarkup: true,
      types: ['image/*'],
      processUrl: (str) => {
        return str
      },
    },
    hooks: {
      afterUpdate: () => {},
      beforeUpdate: () => {},
    },
    interface: {
      appearance: InkValues.Appearance.Auto,
      // 编辑器版权归属信息
      attribution: false,
      autocomplete: true,
      images: false,
      lists: false,
      readonly: false,
      spellcheck: true,
      toolbar: true,
    },
    katex: false,
    keybindings: {
      // Todo: Set these to false by default. https://codemirror.net/examples/tab
      tab: true,
      shiftTab: true,
    },
    placeholder: '',
    plugins: [
    ],
    readability: false,
    search: true,
    selections: [],
    toolbar: {
      bold: true,
      code: true,
      codeBlock: true,
      heading: true,
      image: true,
      italic: true,
      link: true,
      list: true,
      orderedList: true,
      quote: true,
      taskList: true,
      upload: true,
    },
    // This value overrides both `tab` and `shiftTab` keybindings.
    trapTab: undefined,
    vim: false,
    keymaps: [],
    events: undefined
  }

  return {
    doc: '',
    editor: {} as InkInternal.Editor,
    extensions: createExtensions(),
    options,
    root: createElement(),
    target: createElement(),
    workQueue: makeQueue(),
  }
}

export const makeState = (partialState: InkInternal.State): InkInternal.StateResolved => {
  return override(blankState(), partialState)
}

export const makeStore = (options: Options, overrides: InkInternal.State = {}): InkInternal.Store => {
  const [state, setState] = createSignal(makeState({ ...overrides, doc: options.doc || '', options }))

  return [state, setState]
}
