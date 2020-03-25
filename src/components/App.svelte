<script>
import { onMount } from 'svelte';
import _ from 'lodash';
import {isBeforeYesterday, isToday, isTomorrow, isYesterday, isFuture, todayDay} from '../utils/date';
import { exportJSONFile } from '../utils/export'
import { getCookie } from '../utils/cookies'
import { isMobileDevice } from '../utils/agent'
import PouchDB from 'pouchdb-browser';
import {TasksAPI} from '../api/tasks';
import {SettingsAPI} from '../api/settings';
import {LocalAPI} from '../api/local';
import {format, compareAsc} from 'date-fns';

import { quintOut, backOut } from 'svelte/easing';
import { crossfade, fade, fly } from 'svelte/transition';
import { flip } from 'svelte/animate';

import TaskColumn from './TaskColumn.svelte';
import TopNav from './TopNav.svelte';
import Icon from './Icon.svelte';
import TaskCreateForm from './TaskCreateForm.svelte';
import DateTimePicker from './DateTimePicker.svelte';
import Button from './Button.svelte';
import Dialog from './Dialog.svelte';
import Checkbox from './Checkbox.svelte';

import { name, firstVisit, completedTasksVisible, shortcutsVisible } from "../stores"

let tasks = [];
let settings = [];

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

$: uncompletedTasks  = tasks.filter(t => !t.isComplete)
$: sortedTasks  = uncompletedTasks.filter(t => !t.isComplete).sort((a,b) => { return compareAsc(new Date(a.date), new Date(b.date)) })

$: earlierTasks = _.orderBy(uncompletedTasks.filter(t => isBeforeYesterday(t.date)), [function(o) { return new Date(o.date); }], ['asc']);
$: somedayTasks = sortedTasks.filter(t => !t.date);
$: tomorrowTasks = sortedTasks.filter(t => isTomorrow(t.date))
$: todayTasks = sortedTasks.filter(t => isToday(t.date))
$: futureTasks = sortedTasks.filter(t => isFuture(t.date))
$: completedTasks = tasks.filter(t => t.isComplete)

$: columns = [
	isEmpty('earlier', earlierTasks), 
	isEmpty('today',todayTasks), 
	isEmpty('tomorrow',tomorrowTasks), 
	isEmpty('future',futureTasks), 
	isEmpty('someday',somedayTasks),
	isEmpty('completed',completedTasks)
].filter(Boolean)

function isEmpty(name, array) {
	return Array.isArray(array) && array.length ? name : undefined
}

function handleKeydown(event) {
  key = event.key;
	keyCode = event.keyCode;

	var activeElement = document.activeElement;
	var inputs = ['input', 'select', 'button', 'textarea', 'label'];

	if (keyCode === 27 && input == activeElement) {
		input.blur()
		form.resetValue()
	}

	if (activeElement && inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1) {
	  return false;
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
		if (grindMode) {
			event.preventDefault()
		}
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

onMount(async() => {
	tasks = await TasksAPI.findAll();
})

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
  	let task = {
			position: tasks.length + 1,
			isComplete: false,
			date: date,
			name: name
		}

	 TasksAPI.create(task);
	
		if (!grindMode) {
			input.blur()
		}
  }
}

function removeAllCompleted() {
	TasksAPI.destroyAll(completedTasks);
}

const [send, receive] = crossfade({
  duration: d => Math.sqrt(d * 200),

  fallback(node, params) {
    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;

    return {
      duration: 400,
      delay: 200,
      easing: backOut,
      css: t => `
        transform: ${transform} scale(${t});
        opacity: ${t}
      `
    };
  }
})
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="wrapper">
	<TopNav name="Tasks">
		<div slot="left">
			<h1 style="font-weight: 600;display: flex;flex: 1;flex-wrap: wrap;justify-content: flex-start;">
				<span class="current">{todayDay()}</span>
				<span style="font-size: 14px; color: #898989; flex-basis: 100%;margin: -0.2rem 0 0 0.2rem;text-transform: uppercase;">{$name}</span>
			</h1>
		</div>

		<span slot="center">
			<TaskCreateForm bind:this={form} grindMode={grindMode} bind:input={input} on:submit={handleSubmit}/>
		</span>

		<span slot="right">
			<div class="actions-wrapper">
				<div class="actions-wrapper-remove">
					{#if completedTasks.length > 0}
						<span transition:fly="{{ y: 200, duration: 20 }}">
							<Button on:click={removeAllCompleted}>
								Remove completed
							</Button>
						</span>
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

	<div class="" style="padding-top: 100px;">
		{#if tasks.length > 0}
			<div class="columns">
				{#each columns as name, i (name)}
					<div animate:flip="{{delay: 200, duration: 250}}">
						{#if name == 'earlier'}
							<TaskColumn name={name} send={send} receive={receive} tasks={earlierTasks} group='date' on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
						{/if}
						{#if name == 'today'}
							<TaskColumn name={name} send={send} receive={receive} tasks={todayTasks} on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
						{/if}
						{#if name == 'tomorrow'}
							<TaskColumn name={name} send={send} receive={receive} tasks={tomorrowTasks} on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
						{/if}
						{#if name == 'future'}
							<TaskColumn name={name} send={send} receive={receive} tasks={futureTasks} group='date' on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
						{/if}
						{#if name == 'someday'}
							<TaskColumn name={name} send={send} receive={receive} tasks={somedayTasks} on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
						{/if}
						{#if name == 'completed' && $completedTasksVisible}
							<TaskColumn name={name} send={send} receive={receive} tasks={completedTasks} on:delete={handleDelete} on:check={handleCheck} on:newname={handleCheck}/>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="no-tasks">
				<div>
					<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="100" viewBox="0 0 24 24" width="100"><path d="m23.908 12.331-3.963-8.587c-.489-1.059-1.558-1.744-2.725-1.744h-10.44c-1.167 0-2.236.685-2.724 1.743l-3.964 8.588c-.061.131-.092.274-.092.419v6.25c0 1.654 1.346 3 3 3h18c1.654 0 3-1.346 3-3v-6.25c0-.145-.031-.288-.092-.419z" fill="#2196f3"/><path d="m5.184 3.438c.181-.418.577-.688 1.01-.688h11.613c.432 0 .829.27 1.01.689l3.808 8.798h-2.29c-.866 0-1.615.594-1.864 1.479l-1.193 4.239c-.036.126-.142.211-.266.211h-10.024c-.123 0-.23-.085-.266-.212l-1.193-4.238c-.249-.885-.998-1.479-1.864-1.479h-2.29z" fill="#f5f5f5"/><path d="m21.25 22h-18.5c-1.517 0-2.75-1.233-2.75-2.75v-6.5c0-.106.022-.211.066-.308l4.5-10c.121-.269.389-.442.684-.442h13.5c.295 0 .563.173.684.442l4.5 10c.044.097.066.202.066.308v6.5c0 1.517-1.233 2.75-2.75 2.75zm-19.75-9.089v6.339c0 .689.561 1.25 1.25 1.25h18.5c.689 0 1.25-.561 1.25-1.25v-6.339l-4.235-9.411h-12.53z"/><path d="m16.506 18.5h-9.012c-.778 0-1.452-.501-1.676-1.247l-1.073-3.574c-.031-.106-.129-.179-.239-.179h-3.756c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h3.756c.778 0 1.452.501 1.676 1.247l1.073 3.574c.032.106.13.179.239.179h9.012c.109 0 .208-.073.239-.179l1.073-3.574c.224-.746.897-1.247 1.676-1.247h3.756c.414 0 .75.336.75.75s-.336.75-.75.75h-3.756c-.109 0-.208.073-.239.179l-1.073 3.574c-.224.746-.898 1.247-1.676 1.247z"/></svg>
					<h1>Everything has been done</h1>
				</div>
			</div>
		{/if}
	</div>

	{#if $shortcutsVisible && !isMobileDevice()}
	<div class="shortcuts">
		<span class="key">A</span>
		<span class="desc">Add task</span>
		<span class="key">D</span>
		<span class="desc">Delete completed</span>
		<span class="key">G</span>
		<span class="desc">Grind mode</span>
	</div>
	{/if}


	<aside class="drawer" class:slidein={settingsOpen} class:slideout={!settingsOpen}>
		<div class="drawer-wrapper">
			<div class="layout-column layout-column--space-between">
				<h2>Settings</h2>
				<Button look={"flat"} on:click={() => { settingsOpen = false; }}>CLOSE</Button>
			</div>

			<h3>General</h3>

			<p>Use this field to enter a sentence, that will remind you of what is most important to you or will give you a kick for hard work.</p>

			<input type="text" placeholder="Motto" bind:value={$name} style="width: 100%;"/>

			{#if !isMobileDevice() }
				<p>After a while when you can remember all the shortcuts, maybe it's better to hide them.</p>

				<div style="display: flex;align-items: center;">
					<Checkbox checked={$shortcutsVisible} on:change={(e) => { $shortcutsVisible = e.detail.value }}/>
					<label style="padding: 0.3rem 0 0 0.5rem;">
						Show shortcut cheatsheet
					</label>
				</div>
			{/if}

			<p>When completed tasks are visible can be motivating, but sometimes it is better to hide them so that they do not distract you.</p>
			
			<div style="display: flex;align-items: center;">
				<Checkbox checked={$completedTasksVisible} on:change={(e) => { $completedTasksVisible = e.detail.value }}/>
				<label style="padding: 0.3rem 0 0 0.5rem;">
					Show completed tasks
				</label>
			</div>

			<h3>Data</h3>

			<p>Get a backup just in case. Later, you will be able to import the downloaded data even on another device.</p>

			<Button on:click={() => {exportJSONFile(tasks, format(new Date(), "'tasks-'y-MM-dd-hh_mm_ss"))}}>Export Data</Button>
		</div>
	</aside>
</div>

<style type="text/scss">
	.shortcuts {
		position: fixed;
		bottom: 10px;
		left: 20px;

		.key {
		  font-size: 15px;
  		color: #555;
	    display: inline-block;
	    padding: 0 8px;
	    text-align: center;
	    background-color: #eee;
	    background-repeat: repeat-x;
	    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#f5f5f5), to(#eee));
	    background-image: -webkit-linear-gradient(#f5f5f5 0%, #eee 100%);
	    background-image: -moz-linear-gradient(#f5f5f5 0%, #eee 100%);
	    background-image: -o-linear-gradient(#f5f5f5 0%, #eee 100%);
	    background-image: linear-gradient(#f5f5f5 0%, #eee 100%);
	    border: 1px solid #ccc;
	    -webkit-border-radius: 3px;
	    -moz-border-radius: 3px;
	    border-radius: 3px;
	    -webkit-box-shadow: inset 0 1px 0 #fff, 0 1px 0 #ccc;
	    box-shadow: inset 0 1px 0 #fff, 0 1px 0 #ccc;
		}

		.desc {
			font-size: 1.3rem;
			padding: 0.4rem 0.5rem 0 0.3rem;
		}
	}

	.drawer { 
		border-left: 1px solid #ddd;
		max-width: 400px;
		width: 100%;
		background: #fff;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		visibility: hidden;
		transition: visibility 0.3s;
		z-index: 10;
	}

	.drawer .drawer-wrapper {
		padding: 1rem 3rem;
	}

	.slidein {
	    animation: slide-in 0.3s forwards;
	    -webkit-animation: slide-in 0.3s forwards;
	    visibility: visible;
	}

	.slideout {
	    animation: slide-out 0.3s forwards;
	    -webkit-animation: slide-out 0.3s forwards;
	}
	    
	@keyframes slide-in {
	    0% { transform: translateX(100%); }
	    100% { transform: translateX(0%); }
	}

	@-webkit-keyframes slide-in {
			0% { -webkit-transform: translateX(100%); }
	    100% { -webkit-transform: translateX(0%); }
	}
	    
	@keyframes slide-out {
	    0% { transform: translateX(0%); }
	    100% { transform: translateX(100%); }
	}

	@-webkit-keyframes slide-out {
	    0% { -webkit-transform: translateX(0%); }
	    100% { -webkit-transform: translateX(100%); }
	}
	
	.no-tasks {
	  align-items: center;
	  display: flex;
	  justify-content: center;
		height: 100%;

		div {
			display: flex;
			flex-direction: column;
			justify-items: center;
			align-items: center;
		}

	  h1 {
	  	text-align: center;
	  	// text-transform: uppercase;
	  	font-size: 20px;
	  	margin: 1rem 0 0 ;
	  }
	}

	.wrapper {
	
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

		.columns {
	    justify-content: left;
		}
	}
</style>
