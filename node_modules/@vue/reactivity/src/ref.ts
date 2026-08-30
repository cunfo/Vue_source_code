import { activeEffect, trackEffect, triggerEffects } from "./effect";
import { createDep } from "./hooks";
import { toReactive } from "./reactive";

// 类实现ref
export function ref(value) {
    return createRef(value);
}

function createRef(value) {
    return new RefImpl(value)
}

class RefImpl {
    __v_isRef = "refImpl"
    _value
    _dep
    constructor(public rawValue) {
        this._value = toReactive(rawValue)
    }
    get value() {
        // 依赖搜集
        trackRef(this)
        return this._value
    }
    set value(newValue) {
        if (newValue !== this._value) {
            // 更新值
            this.rawValue = newValue
            this._value = newValue
            // 依赖触发
            triggerRef(this)
        }
    }
}

// 对象实现ref
export function objectRef(value) {
    return createObjectRef(value)
}

function createObjectRef(value) {
    let objRef = {
        __v_isRef: 'objRef',
        _value: toReactive(value),
        _dep: undefined,
        get value() {
            trackRef(this)
            return this._value
        },
        set value(newValue) {
            if (newValue !== this._value) {
                this._value = newValue
                triggerRef(this)
            }

        }
    }
    return objRef
}

// 通过全局activeEffect来收集依赖，表示在当前activeEffect中绑定了这个ref
function trackRef(e) {
    if (activeEffect) {
        if (!e._dep) {
            e._dep = createDep(() => {
                e._dep = undefined
            }, e.__v_isRef)
        }
        trackEffect(activeEffect, e._dep)
    }
}


/* 错误点
*这个逻辑会导致由于你每次都是重新创建一个map导致引用地址不一样
*你在一个effect实例下多次修改值后
*触发完set()后重新effect.run()时首先触发get()
*trackEffect()就会因为新旧依赖不一样，从而改变你对象的this._dep里面的值为undefined，失去映射的effect实例
*再次触发set()时,你对象里面的this._dep = undefined,然后不再执行triggerEffects()去更新视图
*/
// function trackRef(e) {
//     console.log(activeEffect,e._value);
//     if (activeEffect) {
//         trackEffect(activeEffect, e._dep = createDep(() => {
//             console.log('cleanup 被调用！', e)
//             e._dep = undefined
//             console.log(e.__v_isRef,e.__v_isRef+"._dep",e._dep);
//         }, e.__v_isRef))
//     }
// }


// 通过获取RefImpl的_dep，触发activeEffect中的schedule属性对应的方法实现重新执行activeEffect中的run()
function triggerRef(e) {
    let dep = e._dep
    if (dep) {
        triggerEffects(dep)
    }
}