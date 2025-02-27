<script>
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { Explain, Admin } from "../store";

  let title;
  let detail;
  let color;
  let x;
  let y;
  let visibility = "hide";
  let display = "flex";
  let E;

  $Explain = explain;
  const handle = {
    move: (e, info, c) => {
      title = info.name;
      detail = info.detail;
      color = c;
      if (E) {
        x = document.body.clientWidth - e.x > 240 ? e.x + 5 : e.x - 230;
        y = e.y - E.offsetHeight > 0 ? e.y - E.offsetHeight - 5 : 5;
      }
    },
    show: (e, info, c) => {
      if ($Admin.mobile) display = "flex";
      else visibility = "show";
      title = info.name;
      detail = info.detail;
      color = c;
      if ($Admin.mobile) {
        if (!e.x) e.x = e.touches[0].pageX;
        if (!e.y) e.y = e.touches[0].pageY;
        let root = document.getElementById("root");
        x =
          (e.y -
            (document.body.clientHeight / $Admin.mobile - root.clientWidth) /
              2) /
            $Admin.mobile -
          20;
        let _y = root.clientHeight - e.x / $Admin.mobile - 5;
        setTimeout((_) => {
          window.ontouchstart = handle.hide;
          if (_y > E.getBoundingClientRect().width / $Admin.mobile) y = _y;
          else y = E.getBoundingClientRect().width / $Admin.mobile;
        });
      } else {
        x = document.body.clientWidth - e.x > 240 ? e.x + 5 : e.x - 230;
        y = e.y - 5;
      }
    },
    hide: (_) => {
      window.ontouchstart = null;
      if ($Admin.mobile) display = "none";
      else visibility = "hide";
      title = null;
    },
  };

  onMount(function () {
    if ($Admin.mobile) {
      E.ontouchstart = handle.hide;
      visibility = "show";
      display = "none";
    }
  });
  afterUpdate(function () {
    if (E) {
      E.onmouseenter = handle.hide;
      if ($Admin.mobile) {
        if (y > E.clientHeight) {
          y -= E.clientHeight;
        }
      }
    }
  });

  function explain(element) {
    return {
      color: function (color) {
        this.Color = color;
        return this;
      },
      with: function (info) {
        let color = this.Color ? this.Color : "blue";
        this.color = false;
        if (element && info) {
          element.ontouchstart = (e) => {
            handle.hide();
            handle.show(e, info, color);
          };
          if (!$Admin.mobile) {
            element.onmouseenter = (e) => handle.show(e, info, color);
            element.onmousemove = (e) => handle.move(e, info, color);
            element.onmouseleave = (_) => handle.hide();
          }
        }
      },
      clear: function () {
        element.ontouchstart = _void;
        element.onmouseenter = _void;
        element.onmousemove = _void;
        handle.hide();
      },
      bind: function (e, info) {
        handle.show(e, info, this.Color ? this.Color : "blue");
      },
    };
  }
</script>

{#if visibility == "show" || $Admin.mobile}
  <div
    class="explain"
    style="left:{x}px;top:{y}px;visibility:{title
      ? 'visible'
      : 'hidden'};display:{display};"
    bind:this={E}
  >
    <span style="background-color:var(--{color})">{title}</span>
    <a>{detail}</a>
  </div>
{/if}

<style>
  .explain {
    z-index: 100;
    position: fixed;
    color: white;
    text-shadow:
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666,
      0 0 3px #666;
    box-shadow: 0 0 5px 4px rgba(255, 255, 255, 0.5);
  }

  .explain > span {
    --blue: rgb(103, 186, 255);
    --purple: #c84df0;
    --green: #60d560;
    --red: #e55c5c;
    --gold: #ffe661;
    --gray: #aaa;
    width: 225px;
    height: 26px;
    font-size: 18px;
    line-height: 24px;
    font-family: normal;
    padding-left: 10px;
  }

  .explain > a {
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    width: 225px;
    padding: 10px;
    font-size: 14px;
    font-family: remark;
    white-space: pre-wrap;
  }
</style>
