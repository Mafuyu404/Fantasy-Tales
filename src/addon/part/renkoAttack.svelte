<script>
  let left = Math.random() * 150;
  let top = Math.random() * 150;
</script>

<div
  class="RenkoAttack"
  style="left:{left}px;top:{top}px"
>
  <div></div>
</div>

<style>
  .RenkoAttack {
    position: absolute;
  }

  .RenkoAttack > div {
    font-size: 80px;
    opacity: 0;
    animation: RenkoAttack 0.8s forwards;
    border-radius: 50%;
    box-shadow: 0px 0px 32px #000;
    width: 80px;
    height: 80px;
    backdrop-filter: invert(1);
  }

  @keyframes RenkoAttack {
    0% {
      transform: scale(0.2);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    30% {
      opacity: 1;
    }
    70% {
      transform: scale(3);
      opacity: 0.9;
    }
    100% {
      transform: scale(0.1);
      opacity: 0;
    }
  }
</style>
