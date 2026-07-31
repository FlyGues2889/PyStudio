<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = withDefaults(
  defineProps<{
    progressPercent: number;
    strokeWidth?: number;
    amplitude?: number;
  }>(),
  {
    progressPercent: 0,
    strokeWidth: 4.2,
    amplitude: 1.1,
  }
);

const containerRef = ref<HTMLDivElement | null>(null);
const containerWidth = ref(400);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (containerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          containerWidth.value = Math.max(100, Math.floor(entry.contentRect.width));
        }
      }
    });
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const wavyPaths = computed(() => {
  const prog = Math.min(100, Math.max(0, props.progressPercent)) / 100;
  const width = containerWidth.value;
  const sWidth = props.strokeWidth;
  const amp = props.amplitude;
  const lobes = Math.max(2, Math.round((width / 520) * 9));

  const lineGap = (prog <= 0 || prog >= 1) ? 0 : 12;
  const activeLineEnd = prog * width;
  const trackStartPoint = Math.min(width, activeLineEnd + lineGap / 2);
  const activeLineEndValid = Math.max(0, activeLineEnd - lineGap / 2);

  const drawFixedWavyPath = (start: number, end: number) => {
    if (start >= end) return "";
    let d = "";
    const numSteps = 240; // Constant number of steps ensures silky smooth SVG path interpolation/animations
    const distance = end - start;
    for (let i = 0; i <= numSteps; i++) {
      const x = start + distance * (i / numSteps);
      const y = 30 + amp * 5 * Math.sin((x / width) * lobes * 2 * Math.PI);
      d += (i === 0 ? "M " : "L ") + `${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d;
  };

  const drawLinePath = (start: number, end: number) => {
    if (start >= end) return "";
    return `M ${start.toFixed(2)} 30 L ${end.toFixed(2)} 30`;
  };

  const activePath = drawFixedWavyPath(0, activeLineEndValid);
  const trackPath = drawLinePath(trackStartPoint, width);

  return { activePath, trackPath, strokeWidth: sWidth };
});
</script>

<template>
  <div ref="containerRef" class="progress-container">
    <svg class="progress-svg" :viewBox="`0 0 ${containerWidth} 60`">
      <!-- Background track path (straight line) -->
      <path
        class="track-path"
        :d="wavyPaths.trackPath"
        :stroke-width="wavyPaths.strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- Active progress path (wavy line) -->
      <path
        class="active-path"
        :d="wavyPaths.activePath"
        :stroke-width="wavyPaths.strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- Cap circle at end of the container track to make it clean -->
      <circle
        :cx="containerWidth"
        cy="30"
        :r="wavyPaths.strokeWidth / 2"
        class="cap-circle"
      />
    </svg>
  </div>
</template>

<style scoped>
.progress-container {
  width: 220px;
  max-width: 100%;
  user-select: none;
}

.progress-svg {
  width: 100%;
  height: 40px;
  overflow: visible;
}

.track-path {
  fill: none;
  stroke: var(--bg-color);
}

.active-path {
  fill: none;
  stroke: var(--primary);
  transition: all 100ms linear;
}

.cap-circle {
  fill: var(--primary);
}
</style>
