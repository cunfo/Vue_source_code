// 对节点元素的增删改查

export const nodeOps = {
    // 创建dom元素
    createElement:type => document.createElement(type),
        // 插入当前dom元素,anchor不存在.insertBefore() == .appendChild()
    insert:(el,parent, anchor) => parent.insertBefore(el,anchor || null),
    // 移除当前dom元素
    remove(el){
        const parent = el.parentNode
        if(parent) parent.removeChild(el)
    },
    // 为当前dom元素添加文本内容
    setElementText:(el,text) => el.textContent = text,
    // 创建当前元素的文本节点
    createText:text => document.createTextNode(text),
    // 设置当前元素的文本
    setText:(node,text)=> node.nodeValue = text,
    // 获取夫亲节点
    parentNode:(node) => node.parentNode,
    // 获取下一个元素
    nextSibling:(node) => node.nextSibling,
    // 创建注释
    // createComment:() =>{},
    // 设置默认值的id
    // setScopeId: () => {},
    // 是否插入静态内容
    // insertStaticContent: () => {}
}
