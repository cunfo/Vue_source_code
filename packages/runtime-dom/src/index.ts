/* 
*  runtime-dom 作用是提供DOM API(提供一系列dom操作的api方法)
*  runtime-dom => 基于runtime-core实现 == runtime-core => 基于reactivity实现
*/


import { nodeOps } from './nodeOps';
import patchProp from './patchProp'
import {createRenderer} from '@vue/runtime-core'

const renderObtions= Object.assign({patchProp}, nodeOps )

const render = (vnode,Container) =>{
   return createRenderer(renderObtions).render(vnode,Container)
}

export {renderObtions,render}

// runtime-dom -> runtime-core -> reactivity
// export * from '@vue/reactivity'
export * from '@vue/runtime-core'


// function createRenderer(){}