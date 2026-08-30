export let activeEffect

export function effect(fn, options?) {
    // 创建一个响应式effect 数据变化后可以重新执行
    const _effect = new ReactiveEffect(fn, () => _effect.run())
    _effect.run()
    if(options) {
        Object.assign(_effect, options)
    }

    const runner = _effect.run.bind(_effect)
    runner.effect = _effect // 可以在run方法中获取_effect
    return runner
}

function preCleanEffect(e){
    e._depslength = 0
    e._trackId++
}

function postCleanEffect(e) {
    if (e._deps.length > e._depslength) {
        for (let i = e._depslength; i < e._deps.length; i++) {
            clearDepEffect(e._deps[i], e)
        }
    }
}
class ReactiveEffect {
    _trackId = 0 //记录当前effect执行了几次
    _deps = []
    _depslength = 0
    _running = false
    public active = true
    constructor(public fn, public scheduler) {

    }
    run() {
        // 让fn执行
        if (!this.active) return this.fn()
        // 
        if(this._running) return
        this._running = true

        let lastEffect = activeEffect
        try {
            activeEffect = this
            // 初始化依赖长度和依赖版本更新
            preCleanEffect(this)
            return this.fn()
        } finally {
            // 删除多余的旧依赖
            postCleanEffect(this)
/* 等同于 updateEffectDeps(this)         
*           if (this._deps.length > this._depslength) {
*               for (let i = this._depslength; i < this._deps.length; i++) {
*                   clearDepEffect(this._deps[i], this)
*               }
*           }
*/
            this._running = false
            activeEffect = lastEffect
        }
    }
}

/* 
*删除旧依赖，是为了提高一点性能。并不是必须要的，源码里面没有这个逻辑
*/ 
function clearDepEffect(dep, effect) {
    dep.delete(effect)
    if (dep.size == 0) {
        dep.cleanup()
    }
}


// 双向依赖收集
export function trackEffect(effect, dep) {
    if (dep.get(effect) !== effect._trackId) {
        dep.set(effect, effect._trackId)
        let oldDep = effect._deps[effect._depslength]
        // 判断旧依赖和新依赖是否相同，不一样让新依赖覆盖旧依赖
        if (oldDep !== dep) {
            if (oldDep) clearDepEffect(oldDep, effect)
            effect._deps[effect._depslength++] = dep
        } else {
            effect._depslength++
        }
    }
}

// 触发依赖重新执行effect.run()
export function triggerEffects(dep) {   
    for (const effect of dep.keys()) {
        if (effect.scheduler && !effect._running) {
            effect.scheduler()
        }
    }
}
