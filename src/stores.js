import { writable } from 'svelte/store';

export const name = writable(localStorage.getItem("name") || "Have a nice day")
name.subscribe(val => localStorage.setItem("name", val))

export const firstVisit = writable(JSON.parse(localStorage.getItem("firstVisit")))
firstVisit.subscribe(val => localStorage.setItem("firstVisit", val))

export const completedTasksVisible = writable(JSON.parse(localStorage.getItem("completedTasksVisible")))
completedTasksVisible.subscribe(val => localStorage.setItem("completedTasksVisible", val))

export const shortcutsVisible = writable(JSON.parse(localStorage.getItem("shortcutsVisible")))
shortcutsVisible.subscribe(val => localStorage.setItem("shortcutsVisible", val))