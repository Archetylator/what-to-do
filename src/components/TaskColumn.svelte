<script>
  import _ from 'lodash';
  import TaskList from './TaskList';
  import {format} from 'date-fns';
  import { fade } from 'svelte/transition';
  export let name;
  export let tasks;
  export let group = null;
  export let empty;
  export let showCompleted;

  $: toBeDoneTasks = tasks.filter(t => !t.isComplete)
  $: completedTasks = tasks.filter(t => t.isComplete)
  $: groupedTasks = Object.entries(_.groupBy(toBeDoneTasks, group))
</script>

{#if tasks.length > 0}
  <div class="container {name.toLowerCase()}" transition:fade={{duration: 300}}>
    <h3>{name}</h3>

    <ul class='column'>
      {#if group}
        {#each groupedTasks as grouped }
          <li class='group-by'>
            {format(new Date(grouped[0]), 'd MMMM')}
          </li>
          <TaskList tasks={grouped[1]} on:delete on:check />
        {/each}
      {:else}
        <div transition:fade={{duration: 200}}>
          <TaskList tasks={toBeDoneTasks} on:delete on:check />
        </div>
      {/if}
    </ul>

    {#if completedTasks.length > 0}
      {#if toBeDoneTasks.length === 0}
        <div class='all-completed'>
          No more tasks
        </div>
      {/if}
      {#if completedTasks.length}
        <div class="finished" transition:fade={{duration: 200}}>Completed ({completedTasks.length})</div>
        {#if showCompleted }
          <div transition:fade={{duration: 200}}>
            <TaskList tasks={completedTasks} on:delete on:check />
          </div>
        {/if}
      {/if}
    {/if}
  </div>
{/if}

<style>
  .container {
    min-width: 26rem;
    max-width: 27rem;
    margin: 0 3rem 0 0;
  }

  .container.earlier h3 {
    color: #EC5B5B;
  }

  .container.yesterday h3 {
    color: burlywood;
  }

  .container.today h3 {
    color: #5BAFEC;
  }

  .all-completed {
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    color: #898989;
    margin: 0 0 2.1rem;
  }

  .all-completed svg {
    padding: 0 0.4rem 0 0;
  }

  .finished {
    font-size: 12px;
    line-height: 16px;

    letter-spacing: 1.5px;
    margin: 1rem 0 1.2rem 0rem;
    color: #898989;
  }

  ul {
    list-style: none;
    margin: 0 0 1.7rem;
    padding: 0;
  }

  ul + .completed {
    border-top: 1px solid #EEEEEE;
    padding-top: 1.5rem;
  }

  .column li {
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    line-height: 16px;
    margin: 0 0 0.1rem;
    letter-spacing: 1.5px;
    color: #898989;
    margin: 1.5rem 0 1rem;
  }

  .column > ul {
    list-style: none;
  }

  h3 {
    font-weight: 700;
    font-size: 1.9rem;
    line-height: 24px;
    margin: 0 0 1.4rem;

    letter-spacing: 0.15px;

    mix-blend-mode: normal;   
  }
</style>