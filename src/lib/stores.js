import { writable } from 'svelte/store';

export const feed = writable([]);
export const scrollEnd = writable(null);