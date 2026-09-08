// packages/runtime-dom/src/nodeOps.ts
var nodeOps = {
  // 创建dom元素
  createElement: (type) => document.createElement(type),
  // 插入当前dom元素,anchor不存在.insertBefore() == .appendChild()
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
  if (value === null) {
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

// packages/runtime-core/src/index.ts
function createRenderer(renderObtions2) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostcreateElement,
    setElementText: hostSetElementText,
    createText: hostCreateText,
    setText: hostSetText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp
  } = renderObtions2;
  const render2 = (vnode, container) => {
    console.log(vnode);
    let instance;
    if (vnode == null) {
      if (container._vonde) {
        instance = container._vonde.component;
      }
    } else {
      patch(container._vonde || null, vnode, container);
    }
    container._vonde = vnode;
  };
  const patch = (n1, n2, container) => {
    if (n1 == n2) {
      return;
    }
    if (n1 === null) {
      mountElement(n2, container);
    }
  };
  const mountElement = (vnode, container) => {
    const { type, children, props, shapeFlag } = vnode;
    let el = hostcreateElement(type);
    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      hostSetElementText(el, children);
    } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
      mountChildren(children, el);
    }
    hostInsert(el, container);
  };
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container);
    }
  };
  return {
    render: render2
  };
}

// packages/runtime-dom/src/index.ts
var renderObtions = Object.assign({ patchProp }, nodeOps);
var render = (vnode, Container) => {
  return createRenderer(renderObtions).render(vnode, Container);
};
export {
  createRenderer,
  render,
  renderObtions
};
//# sourceMappingURL=runtime-dom.js.map
