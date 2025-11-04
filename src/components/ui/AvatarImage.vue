<template>
  <img :class="cn('aspect-square h-full w-full', props.class)" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiAvatarImage',
})

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})
</script>
