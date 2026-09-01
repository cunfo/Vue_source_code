import { isFunction } from "@vue/shared";
import { ReactiveEffect } from './effect'
import { trackRef, triggerRef } from "./ref";

class ComputedRefImpl {
    public _value
    public effect
    public _dep
    constructor(public getter, public setter) {
        this.effect = new ReactiveEffect(
            () => {
                return getter(this._value)
            },
            () => {
                // 计算属性依赖值变化以后触发渲染
                triggerRef(this)
            })
    }
    get value() {
        if (this.effect.dirty) {
            this._value = this.effect.run()
            trackRef(this)
        }
        return this._value
    }
    set value(newValue) {
        this.setter(newValue)
    }
}


export function computed(getterOrOptions) {
    let onlyGetter = isFunction(getterOrOptions)

    let getter
    let setter
    if (onlyGetter) {
        getter = getterOrOptions
        setter = () => { }
    } else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }
    return new ComputedRefImpl(getter, setter)
}