import type { MaybeComputedRef } from '@vueuse/core'
import type { ExtractPropTypes, PropType } from 'vue'

export type CheckboxModelValue = null | string | number | boolean | unknown[]

export const useCheckboxProps = {
  /**
   * Bind v-model value
   */
  modelValue: {
    type: [Boolean, Number, String, Array] as PropType<CheckboxModelValue>,
    default: true,
  },

  /**
   * Switch value when in on state
   */
  checkedValue: [Boolean, Number, String, Array] as PropType<CheckboxModelValue>,

  /**
   * Switch value when in off state
   */
  uncheckedValue: {
    type: [Boolean, Number, String, Array] as PropType<CheckboxModelValue>,
    default: false,
  },

  /**
   * Set custom value for indeterminate state
   */
  indeterminateValue: {
    type: [Boolean, Number, String, Array] as PropType<CheckboxModelValue>,
    default: null,
  },

  /**
   * Enable cycling indeterminate state
   */
  cycleIndeterminate: {
    type: Boolean,
    default: false,
  },
}

export type UseCheckboxProps = ExtractPropTypes<typeof useCheckboxProps>

export function useCheckbox<Name extends string>(
  modelValue: MaybeComputedRef<CheckboxModelValue>,
  emit: (event: Name, ...args: any[]) => void,
  checkedValue: MaybeComputedRef<CheckboxModelValue> = true,
  uncheckedValue: MaybeComputedRef<CheckboxModelValue> = false,
  indeterminateValue: MaybeComputedRef<CheckboxModelValue> = null,
  cycleIndeterminate: MaybeComputedRef<boolean> = false,
) {
  const handleModelValueChange = () => {
    const _cycleIndeterminate = resolveUnref(cycleIndeterminate)
    const _modelValue = resolveUnref(modelValue)

    const _checkedValue = resolveUnref(checkedValue)
    const _uncheckedValue = resolveUnref(uncheckedValue)
    const _indeterminateValue = resolveUnref(indeterminateValue)

    const cycleInitialValue = Array.isArray(_modelValue)
      ? (_modelValue.includes(_checkedValue) ? _checkedValue : _uncheckedValue)
      : _modelValue
    const { next } = useCycleList(
      [...(_cycleIndeterminate ? [_indeterminateValue] : []), _checkedValue, _uncheckedValue],
      { initialValue: cycleInitialValue },
    )

    // Get next value in the cycle
    const newValue = next()

    if (Array.isArray(_modelValue)) {
      // ℹ️ Only add true values in the array
      if (newValue === _checkedValue)
        emit('update:modelValue' as Name, [..._modelValue, _checkedValue])

      else
        emit('update:modelValue' as Name, _modelValue.filter(item => item !== _checkedValue))
    }
    else {
      emit('update:modelValue' as Name, newValue)
    }
  }

  const onChange = () => {
    handleModelValueChange()
  }

  const isChecked = computed({
    get: () => {
      const _modelValue = resolveUnref(modelValue)
      const _checkedValue = resolveUnref(checkedValue)

      if (Array.isArray(_modelValue))
        return _modelValue.includes(_checkedValue)

      return _modelValue === _checkedValue
    },
    set: handleModelValueChange,
  })

  const isIndeterminate = computed(() => {
    const _modelValue = resolveUnref(modelValue)
    const _indeterminateValue = resolveUnref(indeterminateValue)

    if (Array.isArray(_modelValue))
      return _modelValue.includes(_indeterminateValue)

    return _modelValue === _indeterminateValue
  })

  return {
    isChecked,
    isIndeterminate,
    onChange,
  }
}