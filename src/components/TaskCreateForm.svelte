<script context="module">
    var wastedTime = 0;
    export function changeNumber(){
        console.log('changing number')
        wastedTime = 50
    }
</script>

<script>  
  import DateTimePicker from './DateTimePicker.svelte';
  import { format } from 'date-fns';
  import { onMount, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let selectedDay;
  let inputValue = '';
  let visible;

  export let input;
  export let grindMode;

  onMount(() => {
    input.focus()
  })

  $: dateLabel = !selectedDay ? '' : format(selectedDay, 'd MMMM');
  $: focused = input === document.activeElement;

  function handleChange(event) {
    selectedDay = event.detail.date;
    visible = false
  }

  export function resetValue() {
    inputValue = ''
  }

  export function handleClick() {
    input.focus()
  }
</script>

<form on:submit|preventDefault={() => {dispatch('submit', { date: selectedDay, name: inputValue }); inputValue = ''; selectedDay = null; visible = false;}} class:grind="{grindMode === true}">
  <div class="container" on:click={handleClick}>
    <label class='label'>
      <input bind:this={input} class="input" type="text" placeholder="Add a task..." bind:value={inputValue}/>
    </label>
    <span class="selected-date">
      {#if dateLabel}
        <span>
          { dateLabel }
        </span>
      {/if}
    </span>
    <div class="date">
      <div style="width: 24px;height: 24px;">
        <DateTimePicker bind:visible={visible} on:change={handleChange} bind:selectedDay={selectedDay}/>
      </div>
    </div>
  </div>
</form>

<style>
.container {
  max-width: 35rem;
  width: 35rem;
  border: 0.2rem solid #EEEEEE;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #ECECEC;
  padding: 0.8rem 1.8rem;
  height: 55px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.container:focus-within {
  filter: brightness(103%);
  border-bottom: 0.2rem solid rgb(202, 202, 202);
}

.container:hover {
  filter: brightness(103%);
}

.grind .container {
  border-bottom: 4px solid orangered;
}

.date {
  padding: 0 0 0 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  color: #898989;
}

.date label {
  cursor: pointer;
}

.date label input {
  display: none;
}

.selected-date {
  color: #898989;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}

.input,
.input[disabled],
.input::-moz-focus-inner,
.input:focus, .input:hover
 {
  border:none;
  background-image:none;
  background-color:transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  outline:0;
}

.input {
  background: inherit;
  border: none;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  outline:0;
  font-weight: 600;
  font-size: 1.5rem;
  color: #000;
}

.input:focus, .input:hover {
  border: none;
} 

.label {
  display: block;
  height: 100%;
  flex-grow: 1;
}

.delete-date {
  margin-left: 0.5rem;

}

</style>