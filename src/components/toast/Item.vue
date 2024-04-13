<template>
  <li class="toast-item" :class="classList" @click="del">
    <div ref="tagRef" :style="animation" class="toast-item__tag"/>
    <div class="toast-item__message text-default text-lg font-bold">
      <span v-html="toast.message" />
    </div>
    <div class="toast-item__icon">
      <span v-if="toast.showIcon" v-html="icons[toast.type]"/>
    </div>
  </li>
</template>

<script setup lang="ts">
  import {ref, PropType, computed, onMounted} from "vue";
  import {Toast} from './interface'
  import {Layout, Type, Appearance} from './enmu'
  import {Store} from "./store";
  const props = defineProps({
    toast: {
      type: Object as PropType<Toast>,
      required: true,
      default: {
        showIcon: true,
        dismiss: {
          manually: true,
          automatically: true,
        },
        duration: 2500,
        showProgress: true,
      }
    },
    layout: {
      type: String as PropType<Layout>,
      default: Layout.Left
    }
  })
  const { unset } = Store()
  const icons = {
    success: `
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 511.755 511.755" xml:space="preserve" fill="currentColor">
        <path d="M436.891,74.867c-99.819-99.819-262.208-99.819-362.027,0c-99.819,99.797-99.819,262.229,0,362.027 c49.899,49.92,115.456,74.859,181.013,74.859s131.093-24.939,181.013-74.859C536.709,337.096,536.709,174.664,436.891,74.867z M398.96,185.629L249.627,334.963c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251l-85.333-85.333 c-8.341-8.341-8.341-21.824,0-30.165c8.341-8.341,21.824-8.341,30.165,0l70.251,70.251l134.251-134.251 c8.341-8.341,21.824-8.341,30.165,0C407.301,163.805,407.301,177.288,398.96,185.629z"/>
    </svg>
  `,
    alert: `
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 511.76 511.76" xml:space="preserve" fill="currentColor">
        <path d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048 c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251 l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251 c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165 c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0 c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"/>
    </svg>
  `,
    warning: `
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 511.755 511.755" xml:space="preserve" fill="currentColor">
        <path d="M436.891,74.867c-99.819-99.819-262.208-99.819-362.027,0c-99.819,99.797-99.819,262.229,0,362.027 c49.899,49.92,115.456,74.859,181.013,74.859s131.115-24.939,181.013-74.859C536.709,337.096,536.709,174.664,436.891,74.867z M255.877,426.547c-11.776,0-21.333-9.557-21.333-21.333s9.557-21.333,21.333-21.333c11.776,0,21.333,9.557,21.333,21.333 S267.653,426.547,255.877,426.547z M277.211,319.88c0,11.776-9.536,21.333-21.333,21.333c-11.797,0-21.333-9.557-21.333-21.333 V106.547c0-11.776,9.536-21.333,21.333-21.333c11.797,0,21.333,9.557,21.333,21.333V319.88z"/>
    </svg>
  `,
    info: `
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 460 460" xml:space="preserve" fill="currentColor">
        <path d="M230,0C102.975,0,0,102.975,0,230s102.975,230,230,230s230-102.974,230-230S357.025,0,230,0z M268.333,377.36 c0,8.676-7.034,15.71-15.71,15.71h-43.101c-8.676,0-15.71-7.034-15.71-15.71V202.477c0-8.676,7.033-15.71,15.71-15.71h43.101 c8.676,0,15.71,7.033,15.71,15.71V377.36z M230,157c-21.539,0-39-17.461-39-39s17.461-39,39-39s39,17.461,39,39 S251.539,157,230,157z"/>
    </svg>
  `,
  }
  const animation = ref({
    // duration - appear time - start delay - end delay
    animationDuration: `${props.toast.duration - 500 - 100}ms`,
  })
  const ItemType = computed(() => props.toast.type || Type.Success)
  const ItemLayout = computed(() => props.layout || Layout.Left)
  const ListItemAppearance = computed(() => props.toast.appearance || Appearance.Light)
  const classList = computed(() => ({
    'toast-item--dismissible-manual': props.toast.dismiss.manually,
    'toast-item--dismissible-automatic': props.toast.dismiss.automatically && props.toast.showProgress,
    [`toast-item--${ItemType.value}`]: true,
    [`toast-item--${ItemLayout.value}`]: true,
    [`toast-item--${ListItemAppearance.value}`]: true,
  }))
  const del = () => {
    if (!props.toast.dismiss.manually) return
    unset(props.toast.id)
  }
  const Auto = () => {
    if (!props.toast.dismiss.automatically) return
    setTimeout(() => {
      unset(props.toast.id)
    }, props.toast.duration)
  }
  onMounted(() => {
    Auto()
  })
</script>

<style lang="scss">
  $color-success: #009800;
  $color-alert: #ff3600;
  $color-warning: #ffa600;
  $color-info: #0088ff;
  .toast-item {
    $root: &;
    position: relative;
    display: flex;
    margin: 8px;
    min-height: 74px;
    width: 100vw;
    max-width: 20rem;
    border-radius: 4px;
    overflow: hidden;
    &--light {
      background-color: #fcfcfc;
      color: #333;
    }
    &--dark {
      background-color: #333;
      color: #eee;
    }
    &--glass {
      background-color: rgba(255, 255, 255, .1);
      backdrop-filter: blur(5px);
      border-top-color: rgba(255, 255, 255, .25);
      border-left-color: rgba(255, 255, 255, .25);
      color: #eee;
    }
    &--dismissible-manual {
      cursor: pointer;
    }
    &__tag {
      position: absolute;
      bottom: 0;
      height: 100%;
      width: 6px;
      #{$root}--dismissible-automatic & {
        animation-name: progress;
        animation-timing-function: linear;
        animation-delay: .5s;
        animation-fill-mode: forwards;
      }
    }
    &__message {
      z-index: 1;
      flex: 1;
      padding: 12px 12px 12px 18px;
    }
    &__icon {
      position: absolute;
      bottom: -24px;
      opacity: .25;
      width: 80px;
      #{$root}--glass & {
        opacity: .5;
      }
    }
    &--left {
      text-align: right;
      #{$root}__tag {
        right: 0;
      }
      #{$root}__icon {
        left: -24px;
        transform: rotate(12deg);
      }
    }
    &--right {
      text-align: left;
      #{$root}__icon {
        right: -24px;
        transform: rotate(-12deg);
      }
    }
    &--success {
      #{$root}__tag {
        background-color: $color-success;
      }
      #{$root}__icon {
        color: $color-success;
      }
    }
    &--alert {
      #{$root}__tag {
        background-color: $color-alert;
      }
      #{$root}__icon {
        color: $color-alert;
      }
    }
    &--warning {
      #{$root}__tag {
        background-color: $color-warning;
      }
      #{$root}__icon {
        color: $color-warning;
      }
    }
    &--info {
      #{$root}__tag {
        background-color: $color-info;
      }
      #{$root}__icon {
        color: $color-info;
      }
    }
  }
  @keyframes progress {
    0% { height: 100%; opacity: 1; }
    100% { height: 0; opacity: .5; }
  }
</style>