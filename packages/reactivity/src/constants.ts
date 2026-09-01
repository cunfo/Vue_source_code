export enum ReactiveFlags{
    IS_REACTIVE = '__v_isReactive'
}

export enum DirtyLevels{
    Dirty = 4, //脏值 重新运行计算属性
    NoDirty = 0, //不脏 返回上次计算属性结果
}