<template>
  <div class="flex" v-click-away="onClickAway">
    <span class="inline-block w-full rounded-md shadow-sm">
      <button
        type="button"
        @click="openDropdown"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        class="cursor-pointer relative w-full rounded-md border border-none bg-[#3b3b3b] pl-4 pr-10 text-left
        focus:outline-none hover:border-info
        transition ease-in-out duration-150 sm:leading-5"
        :class="Array.isArray(value) ? 'py-1.5' : 'py-2.5'"
      >
        <div class="flex items-center space-x-3">
          <slot name="label">
            <span class="block" :class="{'text-sm': value?.name?.length > 12}">
              {{ value?.name || '请选择' }}
            </span>
          </slot>
        </div>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </button>
    </span>

    <div v-show="isOpen" class="absolute left-0 w-full px-4 z-10" :class="Array.isArray(value) ? 'mb-[3.15rem] mt-12' : 'my-11'">
      <div class="bg-[#333333] rounded-md shadow-lg">
        <div class="mx-2 pt-2" v-if="showSearch"><input class="s-input focus:ring-info" placeholder="请输入筛选词" v-model="keywords" /></div>
        <div class="rounded-md pt-2 text-base leading-6 shadow-xs overflow-auto sm:text-sm">
          <div v-bind="containerProps" style="min-height: 144px; max-height: 300px">
            <div v-bind="wrapperProps">
              <div v-for="item in list" :key="item.index" class="px-4 py-1 hover:bg-info/10" :class="{'bg-info/10': isSelected(item.data)}" @click="select(item.data)">
                <slot :itemData="item.data" :index="item.index" />
              </div>
            </div>
          </div>
          <!-- <VirtList itemKey="name" :list="data?.filter(row => { return row.name.includes(keywords) })" :minSize="20">
            <template #default="{ itemData, index }" >
              <div class="relative px-4 py-1 hover:bg-info/20" @click="select(itemData)">
                <slot :itemData="itemData" :index="index" />
                <span v-show="isSelected(itemData)" class="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </template>
          </VirtList> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, computed } from 'vue'
import { useVirtualList } from '@vueuse/core'
const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    required: true
  },
  value: {
    type: Array as PropType<any[]> | Object as PropType<any>,
    required: true
  },
  showSearch: Boolean,
})
const keywords = ref('')
const filteredItems = computed(() => {
  return props.data?.filter((row: any) => row.name.includes(keywords.value)) || []
})
const { list, containerProps, wrapperProps } = useVirtualList(
  filteredItems,
  {
    itemHeight: 48,
  },
)
const emit = defineEmits(['valueSelect'])
const isOpen = ref(false)

const isSelected = (val: any) => {
  if (Array.isArray(props.value)) {
    return props.value.some((item: any) => item.id === val.id)
  }
  return props.value?.id === val.id
}
const closeDropdown = () => {
  isOpen.value = false
}
const openDropdown = () => {
  isOpen.value = !isOpen.value
}
const select = (val: any) => {
  if (!Array.isArray(props.value)) closeDropdown()
  emit('valueSelect', val)
}
const onClickAway = () => {
  closeDropdown()
}
</script>