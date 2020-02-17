<script>
	import { onMount } from 'svelte';
	import _ from 'lodash';
	import {isBeforeYesterday, isToday, isTomorrow, isYesterday, isFuture} from '../utils/date';
	import { exportJSONFile } from '../utils/export'
	import { getCookie } from '../utils/cookies'
	import PouchDB from 'pouchdb-browser';
	import {TasksAPI} from '../api/tasks';
	import {SettingsAPI} from '../api/settings';
	import {LocalAPI} from '../api/local';
	import {format, compareAsc} from 'date-fns';

	import TaskColumn from './TaskColumn.svelte';
	import TopNav from './TopNav.svelte';
	import Icon from './Icon.svelte';
	import TaskCreateForm from './TaskCreateForm.svelte';
	import DateTimePicker from './DateTimePicker.svelte';
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';
	import Checkbox from './Checkbox.svelte';

	export let tasks = [];
	export let settings = [];
	export let localStorage = {
		firstVisit: true,
		name: 'Have a nice day',
		lastVisit: '',
		completedTasksVisible: true
	};

	let selected;
	let visible;
	let settingsOpen = false;
	let mainNavigation = false;
	let loginValue;
	let key;
	let keyCode;
	let form;
	let formFocused;
	let input;
	let grindMode = false;

	$: sortedTasks  = tasks.sort((a,b) => { return compareAsc(new Date(a.date), new Date(b.date)) })
	$: earlierTasks = _.orderBy(tasks.filter(t => isBeforeYesterday(t.date)), [function(o) { return new Date(o.date); }], ['asc']);
	$: somedayTasks = sortedTasks.filter(t => !t.date);
	$: tomorrowTasks = sortedTasks.filter(t => isTomorrow(t.date))
	$: todayTasks = sortedTasks.filter(t => isToday(t.date))
	$: futureTasks = sortedTasks.filter(t => isFuture(t.date))
	$: completedTasks = tasks.filter(t => t.isComplete)

	function handleKeydown(event) {
	  key = event.key;
		keyCode = event.keyCode;

		if (input === document.activeElement) {
			if (keyCode === 27) {
				grindMode = false
				input.blur()
			}
			return;
		}

		if (keyCode === 65) {
			event.preventDefault()
			form.handleClick()
		}

		if (keyCode === 68) {
			removeAllCompleted()
		}

		if (keyCode === 71) {
			grindMode = !grindMode
		}
	}
	
	SettingsAPI.changes({
		since: 0,
		live: true,
		include_docs: true
	}).on('change', async function (change) {
		settings = await SettingsAPI.findAll();
	});
	
	TasksAPI.changes({
		since: 0,
		live: true,
		include_docs: true
	}).on('change', async function (change) {
		tasks = await TasksAPI.findAll();
	});

	function handleDelete(event) {
		TasksAPI.destroy(event.detail._id);
	}

	function handleCheck(event) {
		TasksAPI.update(event.detail._id, event.detail);
	}

	function handleChange(event) {
		selected = event.detail.date;
		visible = false;
	}

  function handleSubmit(event) {
		const name = event.detail.name;
		const date = event.detail.date ? event.detail.date.toString() : ''

    if (name.length > 0) {
			TasksAPI.create({
				position: tasks.length + 1,
				isComplete: false,
				date: date,
				name: name
			});

			if (!grindMode) {
				input.blur()
			}
    }
	}

	function removeAllCompleted() {
		TasksAPI.destroyAll(completedTasks);
	}
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="wrapper">
	<TopNav name="Tasks">
		<div slot="left">
			<h1 style="font-weight: 600;display: flex;flex: 1;flex-wrap: wrap;justify-content: flex-start;">
				<span class="current">What to do?</span>
				<span style="font-size: 12px; color: #898989; flex-basis: 100%;margin: -0.4rem 0 0 0.2rem;text-transform: uppercase;">{localStorage.name}</span>
			</h1>
		</div>
		{formFocused}
		<span slot="center">
			<TaskCreateForm bind:this={form} grindMode={grindMode} bind:input={input} on:submit={handleSubmit}/>
		</span>

		<span slot="right">
			<div class="actions-wrapper">
				<div class="actions-wrapper-remove">
					{#if completedTasks.length > 0}
						<Button on:click={removeAllCompleted}>
							Remove completed
						</Button>
						<Button on:click={removeAllCompleted} look="transparent" class="button-remove">
	  					<svg style="fill: #898989;" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 22 22"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
						</Button>
					{/if}
				</div>

				<Button look="transparent" on:click={() => { settingsOpen = !settingsOpen; }}>
					<svg style="fill: #898989;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
				</Button>
			</div>
		</span>
	</TopNav>

	{#if settingsOpen}
		<aside class="drawer">
			<p on:click={() => { settingsOpen = false; }}>CLOSE</p>
			<h2>Settings</h2>

			<label>
				<input type="text" placeholder="Name" bind:value={localStorage.name}/>
			</label>

			<label>
				<Checkbox checked={localStorage.completedTasksVisible} on:change={(e) => { localStorage.completedTasksVisible = e.detail.value }}/>
				Show completed tasks
			</label>

			<div>
				<button on:click={() => {exportJSONFile(tasks, format(new Date(), "'tasks-'y-MM-dd-hh_mm_ss"))}}>Export</button>
			</div>
		</aside>
	{/if}
	
	<div class="columns">
		<TaskColumn name='Earlier' showCompleted={localStorage.completedTasksVisible} tasks={earlierTasks} group='date' on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
		<TaskColumn name='Today' showCompleted={localStorage.completedTasksVisible} tasks={todayTasks} on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
		<TaskColumn name='Tomorrow' showCompleted={localStorage.completedTasksVisible} tasks={tomorrowTasks} on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
		<TaskColumn name='Someday' showCompleted={localStorage.completedTasksVisible} tasks={somedayTasks} on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
		<TaskColumn name='Future' showCompleted={localStorage.completedTasksVisible} tasks={futureTasks} group='date' on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
	</div>
</div>

<style type="text/scss">
  :global(h1) {
		font-weight: 300;
    font-size: 2.6rem;
		line-height: 2.8rem;
		margin: 0; 
	}

	.drawer { 
		border-left: 1px solid #ddd;
		width: 400px;
		transition: 0.4s;
		background: #fff;
		height: 97%;
		position: absolute;
		top: 0;
		right: 0;
		padding: 1rem 3rem;
	}

	.wrapper {
		margin-left: 20px;
	}

	.columns {
    display: flex;
		flex-wrap: wrap;
		margin: 4rem 2.3rem;
    justify-content: center;
	}

	input[type='text'],
	input[type='text'][disabled],
	input[type='text']::-moz-focus-inner,
	input[type='text']:focus, input[type='text']:hover
	{
		border:none;
		background-image:none;
		background-color:transparent;
		-webkit-box-shadow: none;
		-moz-box-shadow: none;
		box-shadow: none;
		outline:0;
	}
	
	input[type='text']:focus, input[type='text']:hover {
		outline: 0;
	} 

	input[type='text'] {
		margin-bottom: 0.5rem;
		font-size: 1.6rem;
		border: 0.1rem solid #EEEEEE;
		box-sizing: border-box;
		/* box-shadow: 0px 0.2rem 0.2rem rgba(0, 0, 0, 0.08); */
		border-radius: 0.5rem;
		background: #ECECEC;
		padding: 1.2rem 1.5rem;
		transition: border-color 150ms ease;
		
		&:focus {
			filter: brightness(103%);
			padding-bottom: 1.1rem;
			border-bottom: 0.2rem solid rgb(202, 202, 202);
		}

		&:hover {
			filter: brightness(103%);
		}
	}

	.actions-wrapper {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.actions-wrapper-remove > :nth-child(2) {
		display: none;
	}

	@media only screen and (max-width: 750px) {
		.actions-wrapper-remove > :nth-child(1) {
			display: none;
		}	
		.actions-wrapper-remove > :nth-child(2) {
			display: inline-block;
		}
	}

	:global(.current::after) {
		width: 0; 
    height: 0; 
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid black;
	}

	:global(.main-navigation) {
		position: absolute;
		padding: 2rem;
		border: 1px solid #eee;
		min-width: 20rem;
		min-height: 10rem;
		display: flex;
	}

	:global(.main-navigation a) {
		display: block;
	}
</style>
