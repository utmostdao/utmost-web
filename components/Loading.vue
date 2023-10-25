<template>
  <div class="status-loading">
    <div class="loader" :class="status"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'StatusLoading',
  props: {
    status: {
      type: String,
      default: 'loading',
    },
  },
})
</script>

<style scoped lang="scss">
.status-loading {
  position: relative;
  height: 80px;
  width: 80px;
  margin: 10px;
}
.loader {
  position: absolute;
  content: '';
  width: 80px;
  height: 80px;
  border: 5px solid $textColor;
  border-radius: 50%;
  overflow: hidden;
  transition: 0.3s;
  animation: spin 1s linear infinite;
}
.success {
  background: $textColor;
  border-color: $textColor;
}
.fail {
  background: $textColor;
  border-color: $textColor;
}
.loader.success {
  &::before {
    height: 7px;
    width: 2.5rem;
    position: absolute;
    top: 65%;
    left: 44%;
    background-color: $primary;
    transform: rotate(-45deg);
    transform-origin: 0% 50%;
    border-radius: 5px;
    animation: baseGrow 1s;
    content: '';
  }

  &::after {
    height: 7px;
    width: 1.5rem;
    position: absolute;
    top: 65%;
    left: 50%;
    background-color: $primary;
    transform: rotate(-135deg);
    transform-origin: 0% 50%;
    border-radius: 5px;
    animation: tipGrow 1s;
    content: '';
  }
}
.loader.fail {
  &::before {
    width: 3rem;
    height: 0.5rem;
    background: $error;
    transform-origin: 50% 50%;
    top: calc(50% - 0.25rem);
    left: calc(50% - 1.5rem);
    transform: rotate(45deg);
    position: absolute;
    content: '';
    border-radius: 10px;
    animation: leftIn 0.4s linear;
    content: '';
  }

  &::after {
    width: 3rem;
    height: 0.5rem;
    background: $error;
    transform-origin: 50% 50%;
    top: calc(50% - 0.25rem);
    right: calc(50% - 1.5rem);
    transform: rotate(-45deg);
    position: absolute;
    content: '';
    border-radius: 10px;
    animation: rightIn 0.4s linear;
    content: '';
  }
}
.loader.success,
.loader.fail {
  animation: pop 1.2s ease-in-out;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
    border-top: 5px solid $primary;
  }
  100% {
    transform: rotate(360deg);
    border-top: 5px solid $primary;
  }
}

@keyframes tipGrow {
  0% {
    width: 0px;
    left: 0;
    top: 0;
  }
  25% {
    width: 0px;
    left: 0;
    top: 0;
  }
  50% {
    top: 0%;
    left: 0%;
    width: 0;
  }
  75% {
    top: 0%;
    left: 0%;
    width: 0rem;
  }
  100% {
    top: 65%;
    left: 50%;
    width: 1.5rem;
  }
}

@keyframes baseGrow {
  0% {
    width: 0;
  }
  90% {
    width: 0;
  }
  100% {
    width: 2.5rem;
  }
}

@keyframes pop {
  0% {
    transform: scale(1);
    background-color: transparent;
  }
  70% {
    transform: scale(1);
    background-color: $textColor;
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes leftIn {
  0% {
    left: 0;
    top: 0;
    width: 0;
  }
  100% {
    top: calc(50% - 0.25rem);
    left: calc(50% - 1.5rem);
    width: 3rem;
  }
}

@keyframes rightIn {
  0% {
    right: 0;
    top: 0;
    width: 0;
  }
  100% {
    top: calc(50% - 0.25rem);
    right: calc(50% - 1.5rem);
    width: 3rem;
  }
}
</style>
