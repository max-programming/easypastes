import { zonedTimeToUtc } from 'date-fns-tz';
import { format } from 'timeago.js';

const formatTimeAgo = (time: string) => format(zonedTimeToUtc(time, 'gmt'));

export default formatTimeAgo;
