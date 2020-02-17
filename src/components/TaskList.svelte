<script>
  import TaskItem from './TaskItem';

  import { flip } from 'svelte/animate';
  import { quintOut, backOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';

  export let tasks;

  const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 400),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
        duration: 400,
				easing: backOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
  });
</script>

<ul>
  {#each tasks as task (task._id)}
    <div in:receive="{{key: task._id}}" out:send="{{key: task._id}}" animate:flip="{{duration: 400, delay: 200}}">
      <TaskItem {...task} on:delete on:check on:newname/>
    </div>
  {/each} 
</ul>


<style>
  ul {
    margin: 0;
    padding: 0;
  }
</style>