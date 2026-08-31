import { isObject } from "@vue/shared";
import { reactive } from "./reactive"; 
import { activeEffect, trackEffect, triggerEffects } from "./effect";

export const onlyReactive = Symbol('__v_isReactive')

export const reactiveHandler: ProxyHandler<any> = {
    get: (target, key, recerver) => {
        if (key === onlyReactive) return true
        // reactive懒代理，代理子对象
        const result = Reflect.get(target, key, recerver)
        if (isObject(result)) {
            return reactive(result)
        }
        // 依赖收集
        track(target, key)

        return result
    },
    set: (target, key, value, recerver) => {
        // 找到属性，让对应的effect重新执行
        let oldValue = target[key]
        let newValue = Reflect.set(target, key, value, recerver)
        if(oldValue !== newValue) {
            // 触发依赖
            trigger(target, key, newValue, oldValue )
        }
        return newValue
    }
}
const targetMap = new WeakMap() // 代理对象和effect的映射关系

export const createDep = (cleanup,key) => {
    let dep = new Map() as any// 依赖关系的集合
    dep.cleanup = cleanup
    dep.key = key
    return dep
}


function track(target, key){
    // 依赖收集
    if(activeEffect){
        let depsMap = targetMap.get(target);
        if(!depsMap) targetMap.set(target, depsMap = new Map());
        let dep = depsMap.get(key);
        if(!dep) depsMap.set(key, dep = createDep(()=>depsMap.delete(key),key));
        trackEffect(activeEffect,dep)
    }
}

function trigger(target, key, newValue, oldValue){
    // 触发依赖
    const depsMap = targetMap.get(target)
    if(!depsMap) return;
    const dep = depsMap.get(key);
    if(dep){
        triggerEffects(dep)
    }

}

