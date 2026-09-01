import {isObject} from '@vue/shared'; 
import {  reactiveHandler } from './hooks';
import { ReactiveFlags } from './constants'

const reactiveMap = new WeakMap()

export function reactive(target){
    return createReactive(target);
}

function createReactive(target){
    // 判断是否为对象
    if(!isObject(target)) return target
    // 判断对象是否被代理过了
    if(target[ReactiveFlags.IS_REACTIVE]) return target;

    // 判断当前对象是否被缓存过了
    const exitsProxy = reactiveMap.get(target);
    if(exitsProxy) return exitsProxy

    // 创建代理对象
    const proxy = new Proxy(target,reactiveHandler)
    
    // 根据对象缓存，
    reactiveMap.set(target,proxy);

    // 返回代理对象
    return proxy;
}   


export function toReactive(value){
    return isObject(value) ? reactive(value) : value;
}