<script>
  import { createEventDispatcher } from 'svelte';
  import DateTimePicker from './DateTimePicker.svelte';
  import Checkbox from './Checkbox.svelte';

  const dispatch = createEventDispatcher();

  export let _id;
  export let _rev;
  export let name;
  export let date;
  export let isComplete;

  function moveCursorToEnd(event) {
    let el = event.target;
    
    if(el.innerText && document.createRange)
    {
      window.setTimeout(() =>
        {
          let selection = document.getSelection();
          let range = document.createRange();

          range.setStart(el.childNodes[0],el.innerText.length);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      , 1);
    }
  }

  function editName(event) {
    const newName = event.srcElement.textContent;

    dispatch('check', {
      _id: _id,
      _rev: _rev,
      name: newName
		});
  }

  function changeDate(event) {
    dispatch('check', {
      _id: _id,
      _rev: _rev,
      date: event.detail.date
		});
  }

  function deleteTask() {
    dispatch('delete', {_id: _id});
  }

  function checkTask(event) {
    dispatch('check', {
      _id: _id,
      _rev: _rev,
      isComplete: event.detail.value
		});
  }
</script>

<li class:completed={isComplete}>
  <Checkbox checked={isComplete} on:change={checkTask}/>
  <label class="name" on:focus={moveCursorToEnd} on:input={editName} contenteditable={isComplete ? 'false' : 'true'}>
    {name}
  </label>
  {#if !isComplete }
  <menu>
    <div style="width: 18px;height: 18px;"><DateTimePicker on:change={changeDate} selectedDay={date} /></div>
    <div style="width: 18px;height: 18px;"><svg on:click={deleteTask} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg></div>
  </menu>
  {/if}
</li>

<style type="text/scss">
  li {
    display: flex;
    margin: 0 0 1.5rem;
    z-index: 5;

    &.completed {
      color: #A8A8A8;
      text-decoration: line-through;

      :global(svg) {
        fill: #A8A8A8;
      }
    }
  }

  .name {
    margin: 0.2rem 0 0 0.7rem;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.25px;
  }

  menu {
    display: flex;
    min-width: 30px;
    margin: 0.4rem 0 0 0;
    margin-left: auto;
    padding: 0 0 0 0.5rem;
    align-items: center;
    align-self: start;
  }

  menu > * {
    display: none;
  }

  li:focus menu > *, li:hover menu > * {
    display: inline-block;
  }
</style>