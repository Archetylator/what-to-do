<script>
  import { createEventDispatcher } from 'svelte';
  import checkboxIcon from '../icons/checkbox.svg';
  import checkboxCheckedIcon from '../icons/checkbox-checked.svg';

  const dispatch = createEventDispatcher();

  export let hidden;
  export let checked;
  export let disabled;

  function handleClick() {
    checked = !checked;

    dispatch('change', {
      value: checked
    })
  }
</script>

<span class="checkbox" {checked} on:click={handleClick}>
  <input type="checkbox" {checked} style="opacity:0; position:absolute; left:9999px;"/>
  {@html checked ? checkboxCheckedIcon : checkboxIcon }
</span>

<style type="text/scss">
  .checkbox {
    height: 24px;
    width: 24px;
    display: inline-block;
  }
  :global(.checkbox svg) {
    height: 100%;
  }
</style>