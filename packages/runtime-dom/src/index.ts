/* 
*  runtime-dom 作用是提供DOM API(提供一系列dom操作的api方法)
*  runtime-dom => 基于runtime-core实现 == runtime-core => 基于reactivity实现
*/


import { nodeOps } from './nodeOps';
import patchProp from './patchProp'

const renderObtions= Object.assign({patchProp}, nodeOps )

export {renderObtions}
export * from '@vue/reactivity'
// function createRenderer(){}