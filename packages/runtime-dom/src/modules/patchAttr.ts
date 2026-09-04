export default function patchAttr(el: HTMLElement, key, value) {
    if (value) {
        el.removeAttribute(key)
    } else {
        el.setAttribute(key, value)
    }
}