/* 
    题目：检查是否是类的对象实例
    编写一个函数，检查给定的值是否是给定类或超类的实例。
    可以传递给函数的数据类型没有限制。例如，值或类可能是  undefined 。
 */

/**
 * @param {*} obj
 * @param {*} classFunction
 * @return {boolean}
 */
var checkIfInstanceOf = function(obj, classFunction) {
    if(obj === null || obj === undefined || !(classFunction instanceof Function)) return false
    return Object(obj) instanceof classFunction
};
