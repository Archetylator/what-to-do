<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { parseISO, getDaysInMonth, startOfMonth, format, subMonths, addMonths, isSameMonth, getDate, isSameDay, startOfWeek, addDays, subDays } from 'date-fns';

  const dispatch = createEventDispatcher();
  const rows = [1, 2, 3, 4, 5, 6]
  const cols = [1, 2, 3, 4, 5, 6, 7]

  export let selectedDay;

  let currentView = selectedDay ? new Date(selectedDay) : new Date();

  $: calendar = returnDays(currentView);
  $: currentMonth = format(currentView, 'MMMM y');

  function returnDays(day) {
    let matrix = []
    let firstDayInMonth = startOfMonth(day)

    let curDate = startOfWeek(firstDayInMonth, { weekStartsOn: 1 })

    rows.forEach(row => {
      let week = []
      cols.forEach(col => {
        week.push(curDate)
        curDate = addDays(curDate, 1)
      })

      matrix.push(week)
    })

    return matrix
  }

  function leftClick() {
    currentView = subMonths(currentView, 1)
  }

  function rightClick() {
    currentView = addMonths(currentView, 1)
  }

  let dayNames = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT'
  ]


</script>

<style>
  .day-names {
    display: flex;
    cursor: pointer;
  }

  .day-names span {
    color: #AAA;
    text-transform: uppercase;
    font-weight: 300;
    font-size: 11px;
    padding: 8px 5px;
    text-align: center;
    width: 14.28571429%;
  }

  header {
    display: flex;
    justify-content: space-between;
    padding: 0 13px;
  }

  .month {
    color: #000 !important;
  }
  
  .today {
    color: #75BCFC !important;
  }

  .active {
    background: #75BCFC;
    color: white !important;
  }

  section {
    z-index: 12;
    padding: 0 13px 13px;
  }

  .actions {
    font-size: 1.3rem;
    padding: 1rem 13px;
    margin: 0 0 1rem 0;
    background: #eeeeee;
  }
</style>

<div>
  <header class="actions">
    <span on:click={() => {selectedDay = new Date(); dispatch('change', { date: selectedDay });}}>
      Today
    </span>

    {#if selectedDay}
      <span on:click={() => { selectedDay = null }}>
        Reset
      </span>
    {/if}

    <span on:click={() => {selectedDay = addDays(new Date(), 1); dispatch('change', { date: selectedDay });}}>
      Tomorrow
    </span>
  </header>
  <header>
    <span on:click={leftClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/></svg>
    </span>
    {currentMonth}
    <span on:click={rightClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/></svg>
    </span>
  </header>
  <section>
    <div class="day-names">
      {#each dayNames as name}
        <span>{name}</span>
      {/each}
    </div>
    <div>
      {#each calendar as week}
        <div class="day-names">
          {#each week as day}
            <span on:click={() => {selectedDay = day; dispatch('change', { date: day });}} class:today={isSameDay(day, new Date())} class:month={isSameMonth(day, currentView)} class:active={isSameDay(day, selectedDay)}>{getDate(day)}</span>
          {/each}
        </div>
      {/each}
    </div>
  </section>
</div>