<script>
  let rotate = Math.random() * 360;
  let left = 30 +
    Math.random() * 150;
  let top = 50 + Math.random() * 150;
</script>

<div
  class="MarisaAttack"
  style="transform:rotate({rotate}deg);left:{left}px;top:{top}px"
>
  <div class="icon-star" />
  <div class="icon-star" />
  <div class="icon-star" />
  <div class="icon-star" />
  <div class="icon-star" />
  <div class="icon-star" />
</div>

<style>
  .MarisaAttack {
    position: absolute;
    --length: 50px;
    transform: scale(3);
  }

  .MarisaAttack > div {
    transform: translate3d(0, 0, 0);
    width: 30px;
    height: 30px;
    position: absolute;
    background-image: radial-gradient(
        #ffffff91,
        #ffffff82,
        transparent,
        transparent
      );
    color: #ffff9b;
    font-size: 30px;
  }

  .MarisaAttack > div:nth-child(1) {
    animation: MarisaAttackStar1 0.8s forwards ease-out;
  }

  .MarisaAttack > div:nth-child(2) {
    animation: MarisaAttackStar2 0.8s forwards ease-out;
  }

  .MarisaAttack > div:nth-child(3) {
    animation: MarisaAttackStar3 0.8s forwards ease-out;
  }

  .MarisaAttack > div:nth-child(4) {
    animation: MarisaAttackStar4 0.8s forwards ease-out;
  }

  .MarisaAttack > div:nth-child(5) {
    animation: MarisaAttackStar5 0.8s forwards ease-out;
  }

  .MarisaAttack > div:nth-child(6) {
    animation: MarisaAttackStar6 0.8s forwards ease-out;
  }

  @keyframes MarisaAttackStar1 {
    50% {
      transform: translate3d(var(--length), 0, 0) rotate(360deg);
      opacity: 1;
    }

    100% {
      transform: translate3d(60px, 0, 0) rotate(450deg);
      opacity: 0;
    }
  }

  @keyframes MarisaAttackStar2 {
    50% {
      transform: translate3d(
          calc(var(--length) / 2),
          calc(var(--length) / 2 * 1.73),
          0
        )
        rotate(360deg);
      opacity: 1;
    }

    100% {
      transform: translate3d(
          calc(calc(var(--length) + 10px) / 2),
          calc(calc(var(--length) + 10px) / 2 * 1.73),
          0
        )
        rotate(450deg);
      opacity: 0;
    }
  }

  @keyframes MarisaAttackStar3 {
    50% {
      transform: translate3d(
          calc(var(--length) / -2),
          calc(var(--length) / 2 * 1.73),
          0
        )
        rotate(360deg);
      opacity: 1;
    }

    100% {
      transform: translate3d(
          calc(calc(var(--length) + 10px) / -2),
          calc(calc(var(--length) + 10px) / 2 * 1.73),
          0
        )
        rotate(450deg);
      opacity: 0;
    }
  }

  @keyframes MarisaAttackStar4 {
    50% {
      transform: translate3d(calc(var(--length) * -1), 0, 0) rotate(360deg);
      opacity: 1;
    }

    100% {
      transform: translate3d(calc(calc(var(--length) + 10px) * -1), 0, 0)
        rotate(450deg);
      opacity: 0;
    }
  }

  @keyframes MarisaAttackStar5 {
    50% {
      transform: translate3d(
          calc(var(--length) / -2),
          calc(var(--length) / -2 * 1.73),
          0
        )
        rotate(360deg);
      opacity: 1;
    }

    100% {
      transform: translate3d(
          calc(calc(var(--length) + 10px) / -2),
          calc(calc(var(--length) + 10px) / -2 * 1.73),
          0
        )
        rotate(450deg);
      opacity: 0;
    }
  }

  @keyframes MarisaAttackStar6 {
    50% {
      transform: translate3d(
          calc(var(--length) / 2),
          calc(var(--length) / -2 * 1.73),
          0
        )
        rotate(360deg);
      opacity: 1;
    }

    100% {
      transform: translate3d(
          calc(calc(var(--length) + 10px) / 2),
          calc(calc(var(--length) + 10px) / -2 * 1.73),
          0
        )
        rotate(450deg);
      opacity: 0;
    }
  }
</style>
