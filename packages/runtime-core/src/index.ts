import { ShapeFlags } from "@vue/shared";

export function createRenderer(renderObtions) {
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
    } = renderObtions;

    const render = (vnode, container) => {
        console.log(vnode);
        let instance
        if (vnode == null) {
            if (container._vonde) {
                instance = container._vonde.component
            }
        } else {
            patch(container._vonde || null, vnode, container)
        }
        container._vonde = vnode;
    }

    const patch = (n1, n2, container) => {
        if (n1 == n2) {
            return
        }
        if (n1 === null) {
            // 初始化
            mountElement(n2, container)
        }

    }

    const mountElement = (vnode, container) => {
        const { type, children, props, shapeFlag } = vnode
        let el = hostcreateElement(type)
        if (props) {
            for (let key in props) {
                hostPatchProp(el, key, null, props[key])
            }
        }
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children)
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
           mountChildren(children, el)
        }

        hostInsert(el, container)
    }

    const mountChildren = (children, container) =>{
        for(let i = 0; i < children.length; i++){
            patch(null, children[i],container)
        }
    }
    
    return {
        render,
    }
}

