<template>
    <div class="drawer drawer-end z-20">
        <input id="tools" type="checkbox" class="drawer-toggle" />
        <div class="drawer-side z-20">
            <label for="tools" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="p-4 w-4/5 md:w-96 min-h-full bg-base-200 text-base-content space-y-1">
                <h1 class="font-bold text-2xl text-info">可支持的运算：</h1>
                <div class="divider my-2" />
                <p class="space-x-2 flex items-center mt-2">四则运算：
                    <code v-for="k in ['+','-','*','/']" class="kbd kbd-md text-info">{{ k }}</code>
                </p>
                <p class="text-white/50 text-sm mt-1">特别：由于JS存在浮点数精度缺失，结果最终将会取整显示</p>
                <p class="space-x-2 flex items-center">优先级规则：
                    <code v-for="k in ['(',')']" class="kbd kbd-md text-info">{{ k }}</code>
                </p>
                <p class="space-x-2 flex items-center">向下取整运算：
                    <code class="kbd kbd-md text-info">%</code>
                </p>
                <p class="text-white/50 text-sm">示例：3 % 2 = 1</p>
                <p class="space-x-2 flex items-center">参数变量：
                    <code class="kbd kbd-md text-info">{变量名}</code>
                </p>
                <p class="text-white/50 text-sm">
                    可使用下列显示的变量列表，多级使用
                    <code class="kbd kbd-sm text-info">.</code>
                    表示，如 <code class="kbd kbd-sm text-info">{skill.atk_scale}</code>
                </p>
                <p class="space-x-2 flex items-center">百分数计算：
                    <code class="kbd kbd-md text-info">{%变量名}</code>
                </p>
                <p class="text-white/50 text-sm">
                    将变量值
                    <code class="kbd kbd-sm text-info">* 100</code>
                    可避免精度问题，如
                    <code class="kbd kbd-sm text-info">{%up_atk}</code>
                </p>
                <div class="divider pt-6 pb-3">
                    <h1 class="font-bold text-2xl text-info">可用参数一览</h1>
                </div>
                <p class="text-white/50 text-sm text-center">点击可复制引用</p>
                <JsonTreeView :json="JSON.stringify(params)" :maxDepth="3" @selected="select" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { params } from "./globals"
    import { JsonTreeView } from "json-tree-view-vue3";
    import { setMsg } from "../../plugins/common" 
    import { Type } from "../toast/enmu";
    import { useClipboard } from '@vueuse/core'
    const { copy, isSupported } = useClipboard();
    interface event {
        path: string
    }
    const select = (event: event) => {
        if (!isSupported.value) {
            setMsg('当前浏览器不支持复制，请手动复制', Type.Alert)
            return
        }
        copy(event.path.replace('/.', '{')+"}")
        setMsg('复制成功', Type.Success)
    }
</script>
<style>
.json-view-item:not(.root-item) {
    margin-left: 15px
}

.value-key {
    color: var(--fallback-in,oklch(var(--in)));
    font-weight: 600;
    margin-left: 10px;
    border-radius: 2px;
    white-space: nowrap;
    padding: 1px 2px
}

.value-key.can-select {
    cursor: pointer
}

.value-key.can-select:hover {
    background-color: #00000014
}

.value-key.can-select:focus {
    outline: 2px solid var(--jtv-hover-color)
}

.data-key {
    font-size: 100%;
    font-family: inherit;
    border: 0;
    background-color: transparent;
    width: 100%;
    color: var(--fallback-wa, oklch(var(--wa)));
    display: flex;
    align-items: center;
    border-radius: 2px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    padding: 2px
}

.data-key:hover {
    background-color: var(--fallback-in,oklch(var(--in)/0.1))
}

.data-key:focus {
    outline: 2px solid var(--fallback-in,oklch(var(--in)))
}

.data-key::-moz-focus-inner {
    border: 0
}

.data-key .properties {
    font-weight: 300;
    opacity: .9;
    margin-left: 4px;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none
}

.chevron-arrow {
    flex-shrink: 0;
    border-right: 2px solid #444;
    border-bottom: 2px solid #444;
    width: 6px;
    height: 6px;
    margin-right: 10px;
    margin-left: 6px;
    transform: rotate(-45deg)
}

.chevron-arrow.opened {
    margin-top: -3px;
    transform: rotate(45deg)
}

.root-item {
    --jtv-valueKey-color: #073642;
    --jtv-string-color: #268bd2;
    --jtv-number-color: #2aa198;
    --jtv-boolean-color: #cb4b16;
    --jtv-null-color: #6c71c4;
    --jtv-hover-color: rgba(0, 0, 0, .1);
    margin-left: 0;
    width: 100%;
    height: auto
}
</style>