import { toKebabCase } from "@vue/shared";

export default function patchStyle(el, perValue, nextValue) {
    const style = el.style;
    if (nextValue) {
        for (const key in nextValue) {
            style[key] = nextValue[key];
        }
    }
    if (perValue) {
        for (const key in perValue) {
            if (!nextValue || nextValue[key] == null ) {
                style[key] = '';
                // style.removeProperty(toKebabCase(key));
            }
        }
    }
}
