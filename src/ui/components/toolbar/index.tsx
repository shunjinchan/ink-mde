import { Show, createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import { focus, format, insert } from '/src/api'
import { useStore } from '/src/ui/app'
import * as InkValues from '/types/values'
import { Button } from '../button'
import styles from './styles.css?inline'
import { HeadingIcon, BoldIcon, ItalicIcon, TextQuoteIcon, CodeIcon, ListIcon, ListOrderedIcon, ListTodoIcon, Link2Icon, ImageIcon, UploadIcon } from 'lucide-solid'

export const Toolbar: Component = () => {
  const [state, setState] = useStore()
  const [uploader, setUploader] = createSignal<HTMLInputElement>()

  const formatAs = (type: InkValues.Markup) => {
    format([state, setState], type)
    focus([state, setState])
  }

  const uploadChangeHandler = (event: Event) => {
    const target = event.target as HTMLInputElement

    if (target?.files) {
      Promise.resolve(state().options.files.handler(target.files)).then((url) => {
        if (url) {
          const markup = `![](${url})`

          insert([state, setState], markup)
          focus([state, setState])
        }
      })
    }
  }

  const uploadClickHandler = () => {
    uploader()?.click()
  }

  return (
    <div class='ink-mde-toolbar'>
      <style textContent={styles} />
      <div class='ink-mde-container'>
        <Show when={state().options.toolbar.heading || state().options.toolbar.bold || state().options.toolbar.italic}>
          <div class='ink-mde-toolbar-group'>
            <Show when={state().options.toolbar.heading}>
              <Button onclick={() => formatAs(InkValues.Markup.Heading)}>
                <HeadingIcon />
              </Button>
            </Show>
            <Show when={state().options.toolbar.bold}>
              <Button onclick={() => formatAs(InkValues.Markup.Bold)}>
                <BoldIcon />
              </Button>
            </Show>
            <Show when={state().options.toolbar.italic}>
              <Button onclick={() => formatAs(InkValues.Markup.Italic)}>
                <ItalicIcon />
              </Button>
            </Show>
          </div>
        </Show>
        <Show when={state().options.toolbar.quote || state().options.toolbar.codeBlock || state().options.toolbar.code}>
          <div class='ink-mde-toolbar-group'>
            <Show when={state().options.toolbar.quote}>
              <Button onclick={() => formatAs(InkValues.Markup.Quote)}>
                <TextQuoteIcon />
              </Button>
            </Show>
            <Show when={state().options.toolbar.codeBlock}>
              <Button onclick={() => formatAs(InkValues.Markup.CodeBlock)}>
                <CodeIcon />
              </Button>
            </Show>
            <Show when={state().options.toolbar.code}>
              <Button onclick={() => formatAs(InkValues.Markup.Code)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M7 4L8 6'/>
                </svg>
              </Button>
            </Show>
          </div>
        </Show>
        <Show when={state().options.toolbar.list || state().options.toolbar.orderedList || state().options.toolbar.taskList}>
          <div class='ink-mde-toolbar-group'>
            <Show when={state().options.toolbar.list}>
              <Button onclick={() => formatAs(InkValues.Markup.List)}>
                <ListIcon />
              </Button>
            </Show>
            <Show when={state().options.toolbar.orderedList}>
              <Button onclick={() => formatAs(InkValues.Markup.OrderedList)}>
                <ListOrderedIcon />
              </Button>
            </Show>
            <Show when={state().options.toolbar.taskList}>
              <Button onclick={() => formatAs(InkValues.Markup.TaskList)}>
                <ListTodoIcon />
              </Button>
            </Show>
          </div>
        </Show>
        <Show when={state().options.toolbar.link || state().options.toolbar.image || state().options.toolbar.upload}>
          <div class='ink-mde-toolbar-group'>
            <Show when={state().options.toolbar.link}>
              <Button onclick={() => formatAs(InkValues.Markup.Link)}>
                <Link2Icon />
              </Button>
            </Show>
            <Show when={state().options.toolbar.image}>
              <Button onclick={() => formatAs(InkValues.Markup.Image)}>
                <ImageIcon />
              </Button>
            </Show>
            <Show when={state().options.toolbar.upload}>
              <Button onclick={uploadClickHandler}>
                <UploadIcon />
                <input style={{ display: 'none' }} type='file' onChange={uploadChangeHandler} ref={setUploader} />
              </Button>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  )
}
