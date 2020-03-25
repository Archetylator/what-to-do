<script>
  import _ from 'lodash';
  import TaskItem from './TaskItem';
  import {format} from 'date-fns';


  import { quintOut, backOut, bounceInOut } from 'svelte/easing';
  import { crossfade, fade, slide, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  export let name;
  export let tasks;
  export let group = null;
  export let empty;
  export let send, receive;

  $: groupedTasks = Object.entries(_.groupBy(tasks, group))
</script>

{#if tasks.length > 0}
  <div class="container {name.toLowerCase()}" transition:fly="{{ x: -200, duration: 200 }}">
    <h3>{name}</h3>

    <ul class='column'>
      {#if group}
        {#each groupedTasks as grouped }
          <div in:receive={receive} out:send={send}>
            <li class='group-by'>
              {format(new Date(grouped[0]), 'd MMMM')}
            </li>
            <ul>
              {#each grouped[1] as task (task._id)}
                <div animate:flip="{ { duration: 250 } }">
                  <TaskItem {...task} on:delete on:check on:newname/>
                </div>
              {/each} 
            </ul>
          </div>
        {/each}
      {:else}
        <div>
          <ul>
            {#each tasks as task (task._id)}
              <div in:receive={receive} out:send={send} animate:flip="{ { duration: 250 } }">
                <TaskItem {...task} on:delete on:check on:newname/>
              </div>
            {/each} 
          </ul>
        </div>
      {/if}
    </ul>
  </div>
{/if}

<style>
  .container {
    width: 23rem;
    margin: 0 3rem 1rem 0;
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

  .container.completed h3 {
    /*text-decoration: line-through;*/
    color: darkgray;
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
    font-size: 2rem;
    line-height: 24px;
    margin: 0 0 1.4rem;

    letter-spacing: 0.15px;

    mix-blend-mode: normal;   
  }
</style>