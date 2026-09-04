import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { isRef } from "./ref";

export function watch(source, cb, options = {} as any) {
    return doWatch(source, cb, options);
}

export function watchEffect(source, options = {} as any) {
    return doWatch(source, null, options);
}

function doWatch(source, cb, { deep, immediate }) {

    const reactiveGetter = (source) => traverse(source, deep === false ? 1 : undefined)

    let getter
    if (isReactive(source)) {
        getter = () => reactiveGetter(source)
    } else if (isRef(source)) {
        getter = () => source.value
    } else if (isFunction(source)) {
        getter = source;
    } else {
        return
    }
    let oldValue
    let clean
    const onCleanup = (fn) =>{
        clean = () =>{
            fn();
            clean = undefined
        }
    }
    const obj = () => {
        if (cb) {
            const newValue = effect.run()
            if(clean) clean()
            cb(newValue, oldValue, onCleanup)
            oldValue = newValue;
        } else {
            effect.run() // wacthEffect implement
        }
    }

    const effect = new ReactiveEffect(getter, obj)

    if (cb) {
        immediate ? obj() : oldValue = effect.run()
    } else {
        effect.run()
    }

    // 返回一个函数，用于取消监听
    const unWatch = () => {
        effect.stop()
    }
    return unWatch
} 

// 递归遍历对象
function traverse(source, depth, currentDepth = 0, seen = new Set()) {
    if (!isObject(source)) return source;

    if (depth) {
        if (currentDepth >= depth) return source;
        currentDepth++
    }

    if (seen.has(source)) return source;
    seen.add(source);
    console.log(seen);
    for (const key in source) {
        traverse(source[key], depth, currentDepth, seen)
    }

    return source;
}