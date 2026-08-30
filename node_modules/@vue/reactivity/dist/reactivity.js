// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}

// packages/reactivity/src/effect.ts
var activeEffect;
function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, () => _effect.run());
  _effect.run();
  if (options) {
    Object.assign(_effect, options);
  }
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
function preCleanEffect(e) {
  e._depslength = 0;
  e._trackId++;
}
function postCleanEffect(e) {
  if (e._deps.length > e._depslength) {
    for (let i = e._depslength; i < e._deps.length; i++) {
      clearDepEffect(e._deps[i], e);
    }
  }
}
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this._trackId = 0;
    //记录当前effect执行了几次
    this._deps = [];
    this._depslength = 0;
    this._running = false;
    this.active = true;
  }
  run() {
    if (!this.active) return this.fn();
    if (this._running) return;
    this._running = true;
    let lastEffect = activeEffect;
    try {
      activeEffect = this;
      preCleanEffect(this);
      return this.fn();
    } finally {
      postCleanEffect(this);
      this._running = false;
      activeEffect = lastEffect;
    }
  }
};
function clearDepEffect(dep, effect2) {
  dep.delete(effect2);
  if (dep.size == 0) {
    dep.cleanup();
  }
}
function trackEffect(effect2, dep) {
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    let oldDep = effect2._deps[effect2._depslength];
    if (oldDep !== dep) {
      if (oldDep) clearDepEffect(oldDep, effect2);
      effect2._deps[effect2._depslength++] = dep;
    } else {
      effect2._depslength++;
    }
  }
}
function triggerEffects(dep) {
  for (const effect2 of dep.keys()) {
    if (effect2.scheduler && !effect2._running) {
      effect2.scheduler();
    }
  }
}

// packages/reactivity/src/hooks.ts
var onlyReactive = /* @__PURE__ */ Symbol("__v_isReactive");
var reactiveHandler = {
  get: (target, key, recerver) => {
    if (key === onlyReactive) return true;
    const result = Reflect.get(target, key, recerver);
    if (isObject(result)) {
      return reactive(result);
    }
    track(target, key);
    return result;
  },
  set: (target, key, value, recerver) => {
    let oldValue = target[key];
    let newValue = Reflect.set(target, key, value, recerver);
    if (oldValue !== newValue) {
      console.log(oldValue, newValue);
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
  if (!isObject(target)) return target;
  if (target[onlyReactive]) return target;
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) return exitsProxy;
  const proxy = new Proxy(target, reactiveHandler);
  reactiveMap.set(target, proxy);
  return proxy;
}
function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

// packages/reactivity/src/ref.ts
function ref(value) {
  return createRef(value);
}
function createRef(value) {
  return new RefImpl(value);
}
var RefImpl = class {
  constructor(rawValue) {
    this.rawValue = rawValue;
    this.__v_isRef = "refImpl";
    this._value = toReactive(rawValue);
  }
  get value() {
    trackRef(this);
    return this._value;
  }
  set value(newValue) {
    if (newValue !== this._value) {
      this.rawValue = newValue;
      this._value = newValue;
      triggerRef(this);
    }
  }
};
function objectRef(value) {
  return createObjectRef(value);
}
function createObjectRef(value) {
  let objRef = {
    __v_isRef: "objRef",
    _value: toReactive(value),
    _dep: void 0,
    get value() {
      trackRef(this);
      return this._value;
    },
    set value(newValue) {
      if (newValue !== this._value) {
        this._value = newValue;
        triggerRef(this);
      }
    }
  };
  return objRef;
}
function trackRef(e) {
  if (activeEffect) {
    if (!e._dep) {
      e._dep = createDep(() => {
        e._dep = void 0;
      }, e.__v_isRef);
    }
    trackEffect(activeEffect, e._dep);
  }
}
function triggerRef(e) {
  let dep = e._dep;
  if (dep) {
    triggerEffects(dep);
  }
}
export {
  activeEffect,
  effect,
  objectRef,
  reactive,
  ref,
  toReactive,
  trackEffect,
  triggerEffects
};
//# sourceMappingURL=reactivity.js.map
