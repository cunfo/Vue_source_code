// class获取当前元素的class属性
export default function patchClass(el,value){
    if(value === null){
        el.removeAttribute('class')
    }else{
        // el.setAttribute('class',value)
        el.className = value
    }
}

