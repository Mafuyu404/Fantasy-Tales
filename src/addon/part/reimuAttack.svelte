<script>
  let rotate = Math.random() * 360;
  let left = 30 + Math.random() * 150;
  let top = 50 + Math.random() * 150;
</script>

<div
  class="ReimuAttack"
  style="transform:rotate({rotate}deg);left:{left}px;top:{top}px"
>
  <icon class="icon-yinyang"></icon>
</div>

<style>
  .ReimuAttack {
    position: absolute;
    border-radius: 50%;
    filter: drop-shadow(0 0 4px #fff) drop-shadow(0 0 8px #fff)
      drop-shadow(0 0 16px #fff) drop-shadow(0 0 32px #fff);
  }

  .ReimuAttack > icon {
    color: rgb(255, 80, 80);
    font-size: 80px;
    opacity: 0;
    animation: ReimuAttack 0.8s forwards;
    clip-path: circle(45%);
    background-color:rgba(255, 255, 255, 0.68);
    width: 80px;
    height: 80px;
  }

  @keyframes ReimuAttack {
    0% {
      transform: scale(0.3) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    30% {
      opacity: 1;
    }
    70% {
      opacity: 0.8;
    }
    100% {
      transform: scale(3) rotate(270deg);
      opacity: 0;
    }
  }
</style>
