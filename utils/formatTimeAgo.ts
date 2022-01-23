import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { zonedTimeToUtc } from 'date-fns-tz';

TimeAgo.addLocale(en);

export default function formatTimeAgo(
  time: string
): string | [string, number?] {
  const timeAgo = new TimeAgo('en-US');
  return timeAgo.format(zonedTimeToUtc(time, 'gmt'));
}
