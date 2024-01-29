// https://discuss.codemirror.net/t/adding-support-for-the-additional-inline-syntax-to-markdown/3099
import { Tag } from '@lezer/highlight'
import type { MarkdownConfig } from '../markdown/lezer-markdown'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'

const tags = {
    link: Tag.define(),
}

const autolinkRE = /(www\.)|(https?:\/\/)|([\w.+-]+@)|(mailto:|xmpp:)/gy;
const urlRE = /[\w-]+(\.[\w-]+)+(\/[^\s<]*)?/gy;
const lastTwoDomainWords = /[\w-]+\.[\w-]+($|\/)/;
const emailRE = /[\w.+-]+@[\w-]+(\.[\w.-]+)+/gy;
const xmppResourceRE = /\/[a-zA-Z\d@.]+/gy;
function count(str, from, to, ch) {
    let result = 0;
    for (let i = from; i < to; i++)
        if (str[i] == ch)
            result++;
    return result;
}
function autolinkURLEnd(text, from) {
    urlRE.lastIndex = from;
    let m = urlRE.exec(text);
    if (!m || lastTwoDomainWords.exec(m[0])[0].indexOf("_") > -1)
        return -1;
    let end = from + m[0].length;
    for (;;) {
        let last = text[end - 1], m;
        if (/[?!.,:*_~]/.test(last) ||
            last == ")" && count(text, from, end, ")") > count(text, from, end, "("))
            end--;
        else if (last == ";" && (m = /&(?:#\d+|#x[a-f\d]+|\w+);$/.exec(text.slice(from, end))))
            end = from + m.index;
        else
            break;
    }
    return end;
}
function autolinkEmailEnd(text, from) {
    emailRE.lastIndex = from;
    let m = emailRE.exec(text);
    if (!m)
        return -1;
    let last = m[0][m[0].length - 1];
    return last == "_" || last == "-" ? -1 : from + m[0].length - (last == "." ? 1 : 0);
}

const AutoLink: MarkdownConfig = {
    defineNodes: [
        {
            name: 'AutoLink',
            style: tags.link,
        },
    ],
    /// Extension that implements autolinking for
    /// `www.`/`http://`/`https://`/`mailto:`/`xmpp:` URLs and email
    /// addresses.
    parseInline: [{
        name: "AutoLink",
        parse(cx, next, absPos) {
            let pos = absPos - cx.offset;
            autolinkRE.lastIndex = pos;
            let m = autolinkRE.exec(cx.text), end = -1;
            if (!m)
                return -1;
            if (m[1] || m[2]) { // www., http://
                end = autolinkURLEnd(cx.text, pos + m[0].length);
            }
            else if (m[3]) { // email address
                end = autolinkEmailEnd(cx.text, pos);
            }
            else { // mailto:/xmpp:
                end = autolinkEmailEnd(cx.text, pos + m[0].length);
                if (end > -1 && m[0] == "xmpp:") {
                    xmppResourceRE.lastIndex = end;
                    m = xmppResourceRE.exec(cx.text);
                    if (m)
                        end = m.index + m[0].length;
                }
            }
            if (end < 0)
                return -1;
            cx.addElement(cx.elt("AutoLink", absPos, end + cx.offset));
            return end + cx.offset;
        },
    }]
}

const theme = syntaxHighlighting(
    HighlightStyle.define([
        {
            tag: tags.link,
            // 使用了 class 其他 css 样式属性就失效了
            // backgroundColor: 'var(--ink-internal-syntax-hashtag-background-color)',
            // borderRadius: '0.25rem',
            // color: 'var(--ink-internal-syntax-hashtag-color)',
            // padding: '0.125rem 0.25rem',
            class: 'link',
        },
    ]),
)

// export const hashtags = (config: Config): Ink.Options.Plugin[] => {
export const autoLink = () => {
    return [
        { type: 'default', value: theme },
        { type: 'grammar', value: AutoLink },
    ]
}
