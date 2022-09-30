import { defineComponent, toRef } from 'vue'
import { useLayer, useProps as useLayerProps } from '@/composables/useLayer'
import { disabled } from '@/composables/useProps'

export const ABtn = defineComponent({
  name: 'ABtn',
  props: {
    ...useLayerProps({
      color: {
        default: 'primary',
      },
      variant: {
        default: 'fill',
      },
      states: {
        default: true,
      },
    }),
    icon: {
      type: String,
    },
    appendIcon: {
      type: String,
    },
    iconOnly: {
      type: Boolean,
      default: false,
    },
    disabled,
  },
  setup(props, { slots, attrs: _ }) {
    const { getLayerClasses } = useLayer()

    const { styles, classes } = getLayerClasses(
      toRef(props, 'color'),
      toRef(props, 'variant'),
      toRef(props, 'states'),
    )

    // FIX: ABtn gets full width if placed inside flex container
    return () => <button data-x={classes.value} class={[props.iconOnly ? 'a-btn-icon-only' : 'a-btn', 'uno-layer-base-text-base whitespace-nowrap inline-flex justify-center items-center', { 'opacity-50 pointer-events-none': props.disabled }, ...classes.value]} style={[...styles.value]}>
      {props.icon ? <i class={props.icon}></i> : null}{slots.default?.()}{props.appendIcon ? <i class={props.appendIcon}></i> : null}
    </button>
  },
})

export type ABtn = InstanceType<typeof ABtn>
