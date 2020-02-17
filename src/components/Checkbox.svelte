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
  {@html checked ? checkboxCheckedIcon : checkboxIcon }
</span>

<style type="text/scss">
  :global(.checkbox svg) {
    height: 24px;
  }
</style>