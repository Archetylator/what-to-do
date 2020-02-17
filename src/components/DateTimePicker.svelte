<script>
  import Calendar from './Calendar';
  import Popover from './Popover';

  export let visible = false;
  export let selectedDay;
</script>

<style>
  svg {
    padding: 0.3rem 0 0 0;
    fill: #898989;
  }
</style>

<Popover bind:visible>
  <span slot="trigger">
    {#if selectedDay}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
    {/if}
  </span>
	<div slot="content">
		<Calendar on:change bind:selectedDay/>
	</div>
</Popover>                                                                