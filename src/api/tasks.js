import PouchModel from '../utils/pouchmodel';

export const TasksAPI = new PouchModel('tasks');
export const db = TasksAPI;