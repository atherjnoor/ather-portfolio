'use client';

import { useEffect, useRef, useState } from 'react';
import { workout } from '@/content/interests';
import { Rich } from '../Rich';

const LIFT_MS = 380;

/** Working out: press "Do a rep" to lift the barbell; 10 reps make a set. */
export default function Workout() {
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [up, setUp] = useState(false);
  const [msg, setMsg] = useState(workout.intro);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const rep = () => {
    if (up) return;
    setUp(true);
    timer.current = window.setTimeout(() => {
      setUp(false);
      const next = reps + 1;
      if (next >= workout.repsPerSet) {
        setReps(0);
        setSets(sets + 1);
        setMsg(workout.setDone(sets + 1));
      } else {
        setReps(next);
        setMsg(`Rep ${next} of ${workout.repsPerSet}.`);
      }
    }, LIFT_MS);
  };

  return (
    <article className="panel crop card full" aria-labelledby="gymTitle">
      <div className="gym">
        <div className="gym-copy">
          <div className="top">
            <span className="label">{workout.label}</span>
            <span className="label" id="gymCount" aria-live="polite">
              {reps} / {workout.repsPerSet} · {sets} {sets === 1 ? 'set' : 'sets'}
            </span>
          </div>
          <h3 id="gymTitle">
            {workout.title.plain}
            <i style={{ color: 'var(--mint)' }}>{workout.title.em}</i>
          </h3>
          <p>{workout.text}</p>
          <p>
            <Rich text={workout.split} />
          </p>
        </div>
        <div className="gym-play">
          <div className={up ? 'rack up' : 'rack'} role="img" aria-label={workout.visualLabel}>
            <span className="post" style={{ left: '14%' }}></span>
            <span className="post" style={{ right: '14%' }}></span>
            <span className="lift">
              <span className="plate big" style={{ left: '6%' }}></span>
              <span className="plate" style={{ left: 'calc(6% + 16px)' }}></span>
              <span className="bar"></span>
              <span className="plate" style={{ right: 'calc(6% + 16px)' }}></span>
              <span className="plate big" style={{ right: '6%' }}></span>
            </span>
          </div>
          <div className="shootrow">
            <button className="btn primary" id="repBtn" type="button" onClick={rep}>
              {workout.button}
            </button>
            <div className="meter" aria-hidden="true">
              <span className="fill" style={{ width: (reps / workout.repsPerSet) * 100 + '%' }}></span>
            </div>
          </div>
          <p className="hoopmsg" aria-live="polite">
            {msg}
          </p>
        </div>
      </div>
    </article>
  );
}
