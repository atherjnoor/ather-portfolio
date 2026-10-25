import { useSyncExternalStore } from 'react';

const TZ = 'America/Winnipeg';

/** "4:50 p.m." style clock, or "--:--" if Intl/timezones are unavailable. */
export function winnipegClock(d: Date): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: TZ }).format(d);
  } catch {
    return '--:--';
  }
}

/** Fractional hour of day in Winnipeg, e.g. 13.5 for 1:30 p.m. */
export function winnipegHour(d: Date): number {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
      timeZone: TZ,
    }).formatToParts(d);
    const get = (t: string) => Number(parts.find((x) => x.type === t)?.value ?? 0);
    return (get('hour') % 24) + get('minute') / 60;
  } catch {
    return d.getHours() + d.getMinutes() / 60;
  }
}

export type HoursStatus = {
  /** Clock text, e.g. "9:05 a.m." */
  time: string;
  /** Short sidebar status */
  side: string;
  /** Sentence for the work-hours card (also spoken by the "time" voice command) */
  line: string;
  /** 0–1 position on the 6a–10p day bar */
  pos: number;
  working: boolean;
};

export function hoursStatus(d: Date): HoursStatus {
  const h = winnipegHour(d);
  const t = winnipegClock(d);
  const working = h >= 9 && h < 17;
  let side: string, line: string;
  if (working) {
    side = 'in work mode';
    line = 'It’s ' + t + ' in Winnipeg, so I’m in work mode. Great time to reach me.';
  } else if (h < 9) {
    side = 'online at 9 a.m.';
    line = 'It’s ' + t + ' in Winnipeg. Coffee first. I’m at my sharpest from 9 a.m.';
  } else {
    side = 'back at 9 a.m.';
    line = 'It’s ' + t + ' in Winnipeg. Off the clock for now, and back at it at 9 a.m.';
  }
  return { time: t, side, line, working, pos: Math.max(0, Math.min(1, (h - 6) / 16)) };
}

/* One shared minute ticker for every component that shows the time. */
const minuteNow = () => Math.floor(Date.now() / 60000);
function subscribeMinute(onChange: () => void) {
  const id = window.setInterval(onChange, 5000);
  return () => window.clearInterval(id);
}

/** Live Winnipeg hours status, refreshed every minute. `null` during server render. */
export function useWinnipegHours(): HoursStatus | null {
  const minute = useSyncExternalStore<number | null>(subscribeMinute, minuteNow, () => null);
  return minute === null ? null : hoursStatus(new Date(minute * 60000));
}
