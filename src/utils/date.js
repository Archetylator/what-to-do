import {subDays, addDays, isSameDay, parseISO, isBefore, isAfter, format} from 'date-fns';

export function yesterday() {
  return subDays(new Date(), 1);
}

export function todayDay() {
  return format(new Date(), "iiii")
}

export function isBeforeYesterday(dateString) {
  const compareDate = subDays(new Date(), 1);
  const date = new Date(dateString);

  return isBefore(date, compareDate);
}

export function isYesterday(dateString) {
  const compareDate = yesterday();
  const date = new Date(dateString);

  return isSameDay(date, compareDate);
}

export function isToday(dateString) {
  const date = new Date(dateString);

  return isSameDay(date, new Date());
}

export function tomorrow() {
  return addDays(new Date(), 1);
}

export function isTomorrow(dateString) {
  const compareDate = tomorrow();
  const date = new Date(dateString);

  return isSameDay(date, compareDate);
}

export function isFuture(dateString) {
  const compareDate = tomorrow();
  const date = new Date(dateString);

  return isAfter(date, compareDate)
}