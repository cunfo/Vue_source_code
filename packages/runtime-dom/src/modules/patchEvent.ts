
export default function patchEvent(el, name, nextValue) {
    // el.addEventListener(key,value)
    let invokers = el._vei || (el._vei = {});
    const eventName = name.slice(2).toLowerCase();

    const exisitingInvoker = invokers[name]

    // 事件换绑
    if (nextValue && exisitingInvoker) {
        return (exisitingInvoker.value = nextValue)
    }

    if (nextValue) {
        // 创建一个调用函数内部会执行nextValue
        const invoker = (invokers[name] = createInvoker(nextValue))
        return el.addEventListener(eventName, invoker)
    }

    // 以前有事件,现在没有事件了，移除事件监听器
    if (exisitingInvoker) {
        el.removeEventListener(eventName, exisitingInvoker)
        invokers[name] = undefined
    }
}

function createInvoker(value) {
    const invoker = (e) => invoker.value(e)
    invoker.value = value;
    return invoker
}
