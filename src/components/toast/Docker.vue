<template>
  <transition-group :class="classList" name="toast" tag="ul" appear class="toast2">
    <ToastItem v-for="k in List" :key="k" :toast="k" :layout="layout" />
  </transition-group>
</template>
<script setup lang="ts" >
import { computed, PropType } from "vue";
import ToastItem from "./Item.vue";
import { Position, Layout } from './enmu'
import { Store } from "./store";

const { toasts } = Store()
const props = defineProps({
  position: {
    type: String as PropType<Position>,
    default: Position.TopRight,
  },
})
const position = computed(() => props.position)
const List = computed(() => {
  //if (position.value.includes(Layout.Bottom)) {
  //  return toasts.value
  //}
  return Object.keys(toasts.value).reverse().reduce((acc, cur) => ({
    ...acc,
    [cur]: toasts.value[cur],
  }), {})
})
const classList = computed(() => `toast2--${position.value}`)
const layout = computed(() => position.value.includes(Layout.Left) ? Layout.Left : Layout.Right)
</script>
<style lang="scss" scoped>
$timing-function: cubic-bezier(0.820, 0.085, 0.395, 0.895);

.toast2 {
  position: fixed;
  z-index: 1000;
  margin: 0;
  padding: 0;
  white-space: inherit;

  &--top-left {
    top: 0;
    left: 0;

    .toast-enter-from {
      opacity: 0;
      transform: translateX(-100%);
    }

    .toast-leave-to {
      opacity: 0;
      transform: translate(-100%, calc(0% - 8px));
    }

    .toast-enter-to,
    .toast-leave-from {
      opacity: 1;
    }

    .toast-enter-active,
    .toast-leave-active {
      transition: all .3s $timing-function;
    }

    .toast-leave-active {
      position: absolute;
    }

    .toast-move {
      transition: all .6s ease-in-out;
    }
  }

  &--bottom-left {
    bottom: 0;
    left: 0;

    .toast-enter-from {
      opacity: 0;
      transform: translateX(-100%);
    }

    .toast-leave-to {
      opacity: 0;
      transform: translate(-100%, calc(-100% - 8px));
    }

    .toast-enter-to,
    .toast-leave-from {
      opacity: 1;
    }

    .toast-enter-active,
    .toast-leave-active {
      transition: all .3s $timing-function;
    }

    .toast-leave-active {
      position: absolute;
    }

    .toast-move {
      transition: all .6s ease-in-out;
    }
  }

  &--top-right {
    top: 0;
    right: 0;

    .toast-enter-from {
      opacity: 1;
      transform: translateX(100%);
    }

    .toast-leave-to {
      opacity: 0;
      transform: translate(100%, calc(0% - 8px));
    }

    .toast-enter-to,
    .toast-leave-from {
      opacity: 1;
    }

    .toast-enter-active,
    .toast-leave-active {
      transition: all .3s $timing-function;
    }

    .toast-leave-active {
      position: absolute;
      z-index: 90;
    }

    .toast-move {
      transition: all .6s ease-in-out;
    }
  }

  &--bottom-right {
    bottom: 0;
    right: 0;

    .toast-enter-from {
      opacity: 0;
      transform: translateX(100%);
    }

    .toast-leave-to {
      opacity: 0;
      transform: translate(100%, calc(-100% - 8px));
    }

    .toast-enter-to,
    .toast-leave-from {
      opacity: 1;
    }

    .toast-enter-active,
    .toast-leave-active {
      transition: all .3s $timing-function;
    }

    .toast-leave-active {
      position: absolute;
      z-index: 90;
    }

    .toast-move {
      transition: all .6s ease-in-out;
    }
  }
}
</style>