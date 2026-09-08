// 节点元素的属性操作 暂时针对 class style event 普通属性

import patchAttr from "./modules/patchAttr";
import patchClass from "./modules/patchClass";
import patchEvent from "./modules/patchEvent";
import patchStyle from "./modules/patchStyle";

type PatchValueImpl = string | Record<string, string> | ((...args: any[]) => any) | number | boolean | null

// diff 
export default function patchProp(el, key, preValue, nextValue) {
    if (key === 'class') {
        return patchClass(el, nextValue)
    } else if (key === 'style') {
        return patchStyle(el, preValue, nextValue)
    } else if (/^on[^a-z]/.test(key)) {
        return patchEvent(el, key, nextValue)
    } else {
        return patchAttr(el, key, nextValue)
    }
}


/* export default function patchProp(el: HTMLElement, key, preValue, nextValue) {
    switch (true) {
        case key === 'class':
            return patchClass(el, nextValue)
        case key === 'style':
            return patchStyle(el, preValue, nextValue)
        case /^on[^a-z]/.test(key):
            return patchEvent(el, key, nextValue)
        default:
            return patchAttr(el, key, nextValue)
    }
} */