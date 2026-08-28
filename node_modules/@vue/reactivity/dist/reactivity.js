// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}

// packages/reactivity/src/effect.ts
function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
}
var activeEffect;
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this._trackId = 0;
    //记录当前effect执行了几次
    this._deps = [];
    this._depslength = 0;
    this.active = true;
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let lastEffect = activeEffect;
    try {
      activeEffect = this;
      this._depslength = 0;
      this._trackId++;
      return this.fn();
    } finally {
      activeEffect = lastEffect;
    }
  }
};
function trackEffect(effect2, dep) {
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    let oldDep = effect2._deps[effect2._depslength];
    if (oldDep !== dep) {
      effect2._deps[effect2._depslength++] = dep;
    } else {
      effect2._depslength++;
    }
    console.log("effect", effect2);
  }
}
function triggerEffects(dep) {
  for (const effect2 of dep.keys()) {
    if (effect2.scheduler) {
      effect2.scheduler();
    }
  }
}

// packages/reactivity/src/hooks.ts
var onlyReactive = /* @__PURE__ */ Symbol("__v_isReactive");
var reactiveHandler = {
  get: (target, key, recerver) => {
    if (key === onlyReactive) return true;
    track(target, key);
    return Reflect.get(target, key, recerver);
  },
  set: (target, key, value, recerver) => {
    let oldValue = target[key];
    let newValue = Reflect.set(target, key, value, recerver);
    if (oldValue !== newValue) {
      trigger(target, key, newValue, oldValue);
    }
    return newValue;
  }
};
var targetMap = /* @__PURE__ */ new WeakMap();
var createDep = (cleanup, key) => {
  let dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.key = key;
  return dep;
};
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    let dep = depsMap.get(key);
    if (!dep) depsMap.set(key, dep = createDep(() => depsMap.delete(key), key));
    trackEffect(activeEffect, dep);
  }
}
function trigger(target, key, newValue, oldValue) {
  console.log("\u89E6\u53D1\u4F9D\u8D56");
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    triggerEffects(dep);
  }
}

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function reactive(target) {
  return createReactive(target);
}
function createReactive(target) {
  if (!isObject(target)) return TypeError(`target must be an object`);
  if (target[onlyReactive]) return target;
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) return exitsProxy;
  const proxy = new Proxy(target, reactiveHandler);
  reactiveMap.set(target, proxy);
  return proxy;
}
export {
  activeEffect,
  effect,
  reactive,
  trackEffect,
  triggerEffects
};
//# sourceMappingURL=reactivity.js.map
