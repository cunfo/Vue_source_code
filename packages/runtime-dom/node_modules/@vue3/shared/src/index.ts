export function isObject(value){
    return typeof value === 'object' && value !== null;
}

export function isFunction(value){
    return typeof value === 'function';

}

export * from './shapeFlags'

// CSS 属性名的转换为 kebab-case 格式
export function toKebabCase(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

