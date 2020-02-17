<script>
  import Popper from 'popper.js';
  import { onMount, afterUpdate } from 'svelte';
  import { slide } from 'svelte/transition';
  
  let content;
  let trigger;
  let popper;
  let arrow;
  let wrapper;

  export let visible;

  afterUpdate(() => {
    popper = new Popper(trigger, content, {
       placement: 'bottom'
    });
  })

  function closePopover(event) {
    if (!visible) return

    if (!wrapper.contains(event.target)) {
      visible = false
      window.removeEventListener('click', closePopover, false)
    }
  }

  function handleClick() {
    visible = !visible;
    window.addEventListener('click', closePopover, false)
  }
</script>

<style>
  .box {
    display: block;
    box-shadow: 0px 4px 4px #E5E5E5;
    border-radius: 5px;
    border: 1px solid #E5E5E5;
    z-index: 10;
    background: #fff;
    opacity: 0.99;
    backdrop-filter: blur(20px);
    background-color: rgba(255, 255, 255, 0.99);
  }

  .arrow {
    border-color: #e5e5e5;
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-width: 0 5px 5px 5px;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    top: -4px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }
</style>

<div class="wrapper" bind:this={wrapper}>
  <span class="trigger" bind:this={trigger} on:click={handleClick}>
    <slot name="trigger">
    
    </slot>
  </span>

  <div bind:this={content}>
    {#if visible}
      <div class="arrow" x-arrow bind:this={arrow}></div>
      <div class="box" transition:slide="{{ duration: 150 }}">
        <slot name="content" />
      </div>
    {/if}
  </div>
</div>
