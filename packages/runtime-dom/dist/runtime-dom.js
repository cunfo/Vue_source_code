// packages/runtime-dom/src/nodeOps.ts
var nodeOps = {
  // 创建dom元素
  createElement: (type) => document.createElement(type),
  // 插入当前dom元素,anchor不存在.insetBefore() == .appendChild()
  insert: (el, parent, anchor) => parent.insertBefore(el, anchor || null),
  // 移除当前dom元素
  remove(el) {
    const parent = el.parentNode;
    if (parent) parent.removeChild(el);
  },
  // 为当前dom元素添加文本内容
  setElementText: (el, text) => el.textContent = text,
  // 创建当前元素的文本节点
  createText: (text) => document.createTextNode(text),
  // 设置当前元素的文本
  setText: (node, text) => node.nodeValue = text,
  // 获取夫亲节点
  parentNode: (node) => node.parentNode,
  // 获取下一个元素
  nextSibling: (node) => node.nextSibling
  // 创建注释
  // createComment:() =>{},
  // 设置默认值的id
  // setScopeId: () => {},
  // 是否插入静态内容
  // insertStaticContent: () => {}
};

// packages/runtime-dom/src/modules/patchAttr.ts
function patchAttr(el, key, value) {
  if (value) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, value);
  }
}

// packages/runtime-dom/src/modules/patchClass.ts
function patchClass(el, value) {
  if (value === null) {
    el.removeAttribute("class");
  } else {
    el.className = value;
  }
}

// packages/runtime-dom/src/modules/patchEvent.ts
function patchEvent(el, name, nextValue) {
  let invokers = el._vei || (el._vei = {});
  const eventName = name.slice(2).toLowerCase();
  const exisitingInvoker = invokers[name];
  if (nextValue && exisitingInvoker) {
    return exisitingInvoker.value = nextValue;
  }
  if (nextValue) {
    const invoker = invokers[name] = createInvoker(nextValue);
    return el.addEventListener(eventName, invoker);
  }
  if (exisitingInvoker) {
    el.removeEventListener(eventName, exisitingInvoker);
    invokers[name] = void 0;
  }
}
function createInvoker(value) {
  const invoker = (e) => invoker.value(e);
  invoker.value = value;
  return invoker;
}

// packages/runtime-dom/src/modules/patchStyle.ts
function patchStyle(el, perValue, nextValue) {
  const style = el.style;
  if (nextValue) {
    for (const key in nextValue) {
      style[key] = nextValue[key];
    }
  }
  if (perValue) {
    for (const key in perValue) {
      if (!nextValue || nextValue[key] == null) {
        style[key] = "";
      }
    }
  }
}

// packages/runtime-dom/src/patchProp.ts
function patchProp(el, key, preValue, nextValue) {
  if (key === "class") {
    return patchClass(el, nextValue);
  } else if (key === "style") {
    return patchStyle(el, preValue, nextValue);
  } else if (/^on[^a-z]/.test(key)) {
    return patchEvent(el, key, nextValue);
  } else {
    return patchAttr(el, key, nextValue);
  }
}

// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function isFunction(value) {
  return typeof value === "function";
}

// packages/reactivity/src/effect.ts
var activeEffect;
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this._trackId = 0;
    //记录当前effect执行了几次
    this._dirty = 4 /* Dirty */;
    this._depslength = 0;
    this._running = false;
    this._deps = [];
    this.active = true;
  }
  // 观察当前effect是否为脏值
  get dirty() {
    return this._dirty === 4 /* Dirty */;
  }
  // 修改脏值
  set dirty(v) {
    this._dirty = v ? 4 /* Dirty */ : 0 /* NoDirty */;
  }
  run() {
    this._dirty = 0 /* NoDirty */;
    if (!this.active) return this.fn();
    if (this._running) return;
    this._running = true;
    this._parent = activeEffect;
    try {
      activeEffect = this;
      preCleanEffect(this);
      return this.fn();
    } finally {
      postCleanEffect(this);
      this._running = false;
      activeEffect = this._parent;
    }
  }
  stop() {
    if (this.active) {
      this.active = false;
      preCleanEffect(this);
      postCleanEffect(this);
    }
  }
};
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
    e._deps.length = e._depslength;
  }
}
function clearDepEffect(dep, effect2) {
  dep.delete(effect2);
  if (dep.size == 0) dep.cleanup();
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
    if (effect2._dirty < 4 /* Dirty */) {
      effect2._dirty = 4 /* Dirty */;
    }
    if (effect2.scheduler && !effect2._running) {
      effect2.scheduler();
    }
  }
}

// packages/reactivity/src/hooks.ts
var reactiveHandler = {
  get: (target, key, recerver) => {
    if (key === "__v_isReactive" /* IS_REACTIVE */) return true;
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
  if (target["__v_isReactive" /* IS_REACTIVE */]) return target;
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) return exitsProxy;
  const proxy = new Proxy(target, reactiveHandler);
  reactiveMap.set(target, proxy);
  return proxy;
}
function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}
function isReactive(value) {
  return value && value["__v_isReactive" /* IS_REACTIVE */];
}

// packages/reactivity/src/ref.ts
var RefImpl = class {
  constructor(rawValue) {
    this.rawValue = rawValue;
    this.__v_isRef = true;
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
var ObjectRefImpl = class {
  constructor(_object, _key) {
    this._object = _object;
    this._key = _key;
    this.__v_isRef = true;
  }
  get value() {
    return this._object[this._key];
  }
  set value(newValue) {
    this._object[this._key] = newValue;
  }
};
function ref(value) {
  return createRef(value);
}
function createRef(value) {
  return new RefImpl(value);
}
function trackRef(e) {
  if (activeEffect) {
    if (!e._dep) e._dep = createDep(() => e._dep = void 0, e.__v_isRef);
    trackEffect(activeEffect, e._dep);
  }
}
function triggerRef(e) {
  let dep = e._dep;
  if (dep) triggerEffects(dep);
}
function toRef(target, key) {
  return new ObjectRefImpl(target, key);
}
function toRefs(target) {
  const ref2 = {};
  for (let key in target) {
    ref2[key] = toRef(target, key);
  }
  return ref2;
}
function proxyRefs(target) {
  return new Proxy(target, {
    get(target2, key, receiver) {
      let result = Reflect.get(target2, key, receiver);
      return result.__v_isRef ? result.value : result;
    },
    set(target2, key, value, receiver) {
      const oldValue = target2[key];
      if (oldValue.__v_isRef) {
        oldValue.value = value;
        return true;
      }
      return Reflect.set(target2, key, value, receiver);
    }
  });
}
function isRef(value) {
  return value && value.__v_isRef;
}

// packages/reactivity/src/computed.ts
var ComputedRefImpl = class {
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = setter;
    this.effect = new ReactiveEffect(
      () => {
        return getter(this._value);
      },
      () => {
        triggerRef(this);
      }
    );
  }
  get value() {
    trackRef(this);
    if (this.effect.dirty) {
      this._value = this.effect.run();
    }
    return this._value;
  }
  set value(newValue) {
    console.log("computed.set", newValue);
    this.setter(newValue);
  }
};
function computed(getterOrOptions) {
  let onlyGetter = isFunction(getterOrOptions);
  let getter;
  let setter;
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return new ComputedRefImpl(getter, setter);
}

// packages/reactivity/src/watch.ts
function watch(source, cb, options = {}) {
  return doWatch(source, cb, options);
}
function watchEffect(source, options = {}) {
  return doWatch(source, null, options);
}
function doWatch(source, cb, { deep, immediate }) {
  const reactiveGetter = (source2) => traverse(source2, deep === false ? 1 : void 0);
  let getter;
  if (isReactive(source)) {
    getter = () => reactiveGetter(source);
  } else if (isRef(source)) {
    getter = () => source.value;
  } else if (isFunction(source)) {
    getter = source;
  } else {
    return;
  }
  let oldValue;
  let clean;
  const onCleanup = (fn) => {
    clean = () => {
      fn();
      clean = void 0;
    };
  };
  const obj = () => {
    if (cb) {
      const newValue = effect2.run();
      if (clean) clean();
      cb(newValue, oldValue, onCleanup);
      oldValue = newValue;
    } else {
      effect2.run();
    }
  };
  const effect2 = new ReactiveEffect(getter, obj);
  if (cb) {
    immediate ? obj() : oldValue = effect2.run();
  } else {
    effect2.run();
  }
  const unWatch = () => {
    effect2.stop();
  };
  return unWatch;
}
function traverse(source, depth, currentDepth = 0, seen = /* @__PURE__ */ new Set()) {
  if (!isObject(source)) return source;
  if (depth) {
    if (currentDepth >= depth) return source;
    currentDepth++;
  }
  if (seen.has(source)) return source;
  seen.add(source);
  console.log(seen);
  for (const key in source) {
    traverse(source[key], depth, currentDepth, seen);
  }
  return source;
}

// packages/runtime-dom/src/index.ts
var renderObtions = Object.assign({ patchProp }, nodeOps);
export {
  ReactiveEffect,
  activeEffect,
  computed,
  effect,
  isReactive,
  isRef,
  proxyRefs,
  reactive,
  ref,
  renderObtions,
  toReactive,
  toRef,
  toRefs,
  trackEffect,
  trackRef,
  triggerEffects,
  triggerRef,
  watch,
  watchEffect
};
//# sourceMappingURL=runtime-dom.js.map
