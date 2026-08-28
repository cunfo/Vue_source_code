export function effect(fn, options?) {
    // 创建一个响应式effect 数据变化后可以重新执行
    const _effect = new ReactiveEffect(fn, () => {
        _effect.run()
    })
    // console.log(_effect);
    _effect.run()
}
export let activeEffect
class ReactiveEffect {
    _trackId = 0 //记录当前effect执行了几次
    _deps = []
    _depslength = 0
    public active = true
    constructor(public fn, public scheduler) {
        
    }
    run() {
        // 让fn执行
        if (!this.active) {
            return this.fn()
        }
        let lastEffect = activeEffect
        try {
            activeEffect = this
            this._depslength = 0
            this._trackId++
            return this.fn()
        } finally {
            activeEffect = lastEffect
        }
    }
} 

// 双向依赖收集
export function trackEffect(effect,dep){
    if(dep.get(effect) !== effect._trackId ){
        dep.set(effect,effect._trackId)
        let oldDep = effect._deps[effect._depslength]
        if(oldDep !== dep){
            effect._deps[effect._depslength++] = dep
        }else{
            effect._depslength++
        }
    }
}

// 触发依赖重新执行effect.run()
export function triggerEffects(dep){
    for(const effect of dep.keys()){
        if(effect.scheduler){
            effect.scheduler()
        }
    }
}
