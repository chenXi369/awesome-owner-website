<template>
  <div :class="cn('flex items-center pt-0', props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiCardFooter',
})

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})
</script>
