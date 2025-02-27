<script>
  let left = 40 + r() * 120;
  let top = 80 + r() * 120;
  let rotate = [-20 - r() * 50, 20 + r() * 50];
  let height = [200 + r() * 40, 200 + r() * 40];
  function r() {
    return Math.random();
  }
</script>

<div
  class="YoumuAttack"
  style="left:{left}px;top:{top}px;transform:rotate({30 - r() * 60})"
>
  <div style="z-index:0">
    <div
      class="shadow"
      style="--rotate:{rotate[0]}deg;--height:{height[0]}px"
    />
    <div
      class="shadow"
      style="--rotate:{rotate[1]}deg;--height:{height[1]}px"
    />
  </div>
  <div style="z-index:4">
    <div class="slash" style="--rotate:{rotate[0]}deg;--height:{height[0]}px" />
    <div class="slash" style="--rotate:{rotate[1]}deg;--height:{height[1]}px" />
  </div>
</div>

<style>
  .YoumuAttack {
    position: absolute;
  }
  .YoumuAttack > div {
    position: absolute;
    align-items: flex-start;
    justify-content: center;
  }
  .slash {
    position: absolute;
    width: 3px;
    background-color: rgb(236, 243, 244);
    border-radius: 50%;
    animation: slash 0.8s;
    z-index: 2;
  }
  .shadow {
    position: absolute;
    width: 3px;
    background-color: rgb(75, 129, 135);
    border-radius: 50%;
    outline: 2px solid rgb(75, 129, 135);
    animation: slash 0.8s forwards linear;
    z-index: 1;
  }

  @keyframes slash {
    0% {
      width: 3px;
      height: 0px;
      transform: rotate(var(--rotate)) translateY(calc(var(--height) / -2))
        scale(1.5);
    }
    25% {
      height: var(--height);
      transform: rotate(var(--rotate)) translateY(0px) scale(1.5);
    }
    70% {
      transform: rotate(var(--rotate)) scale(1.5);
      width: 3px;
    }
    80% {
      opacity: 1;
    }
    100% {
      width: 2px;
      opacity: 0;
      height: var(--height);
      transform: rotate(var(--rotate)) scale(2.5);
    }
  }
</style>
