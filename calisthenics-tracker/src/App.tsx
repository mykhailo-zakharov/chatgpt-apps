import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type DayKey = 'mon' | 'tue' | 'thu' | 'sat';
type ExerciseType = 'push' | 'pull' | 'squat' | 'lunge' | 'plank' | 'raise' | 'bridge' | 'pike';

type Exercise = {
  id: string;
  name: string;
  target: string;
  type: ExerciseType;
  description: string;
  progression: string[];
};

type Workout = {
  title: string;
  focus: string;
  exercises: Exercise[];
};

const workouts: Record<DayKey, Workout> = {
  mon: {
    title: 'Push',
    focus: 'Chest · Shoulders · Triceps',
    exercises: [
      { id: 'push-ups', name: 'Push-ups', target: '4 × 6–15', type: 'push', description: 'Keep your body in one line, lower under control, then push the floor away.', progression: ['Incline push-up', 'Push-up', 'Diamond push-up', 'Decline push-up', 'Archer push-up'] },
      { id: 'pike-push-ups', name: 'Pike push-ups', target: '3 × 5–12', type: 'pike', description: 'Keep your hips high and lower your head between your hands.', progression: ['Hands elevated', 'Floor pike push-up', 'Feet elevated', 'Handstand push-up prep'] },
      { id: 'diamond-push-ups', name: 'Diamond push-ups', target: '3 × 5–12', type: 'push', description: 'Keep hands close under the chest and use a controlled range of motion.', progression: ['Knee diamond', 'Diamond', 'Slow diamond', 'Decline diamond'] },
      { id: 'dips', name: 'Bench dips', target: '3 × 8–15', type: 'push', description: 'Use a stable surface and keep the shoulders controlled through the movement.', progression: ['Bent knees', 'Straight legs', 'Feet elevated'] },
      { id: 'plank', name: 'Plank', target: '3 × 30–60 sec', type: 'plank', description: 'Brace the core and keep shoulders, hips and heels aligned.', progression: ['Knee plank', 'Plank', 'Long-lever plank', 'RKC plank'] },
    ],
  },
  tue: {
    title: 'Pull',
    focus: 'Back · Biceps · Core',
    exercises: [
      { id: 'pull-ups', name: 'Pull-ups', target: '4 × 3–10', type: 'pull', description: 'Start from a controlled hang and pull elbows toward the ribs without swinging.', progression: ['Dead hang', 'Scapular pull-up', 'Negative', 'Assisted pull-up', 'Pull-up'] },
      { id: 'rows', name: 'Australian rows', target: '4 × 6–15', type: 'pull', description: 'Keep the body straight and pull the chest toward the bar or table edge.', progression: ['High bar', 'Lower bar', 'Feet elevated'] },
      { id: 'negative-pull-ups', name: 'Negative pull-ups', target: '3 × 3–6', type: 'pull', description: 'Start at the top and lower yourself slowly for 3–5 seconds.', progression: ['3 sec negative', '5 sec negative', 'Assisted pull-up'] },
      { id: 'chin-ups', name: 'Chin-ups', target: '3 × 4–10', type: 'pull', description: 'Use an underhand grip and pull the elbows down while keeping the body still.', progression: ['Assisted', 'Chin-up', 'Slow chin-up', 'Weighted'] },
      { id: 'knee-raises', name: 'Hanging knee raises', target: '3 × 8–15', type: 'raise', description: 'Raise the knees without swinging and finish by curling the pelvis toward the ribs.', progression: ['Lying knee raise', 'Hanging knee raise', 'Straight-leg raise'] },
    ],
  },
  thu: {
    title: 'Legs + Core',
    focus: 'Quads · Glutes · Calves · Abs',
    exercises: [
      { id: 'squats', name: 'Bodyweight squats', target: '4 × 10–20', type: 'squat', description: 'Sit between your hips, keep the whole foot grounded, then stand tall.', progression: ['Squat', 'Pause squat', 'Tempo squat', 'Jump squat'] },
      { id: 'bulgarian-split-squat', name: 'Bulgarian split squats', target: '3 × 8–15 / leg', type: 'lunge', description: 'Keep the front foot planted and lower with control before driving upward.', progression: ['Assisted', 'Bodyweight', 'Slow tempo', 'Pistol progression'] },
      { id: 'reverse-lunge', name: 'Reverse lunges', target: '3 × 8–15 / leg', type: 'lunge', description: 'Step back softly, keep the torso tall and push through the front foot.', progression: ['Assisted', 'Reverse lunge', 'Deficit reverse lunge'] },
      { id: 'calf-raise', name: 'Single-leg calf raises', target: '4 × 12–20 / leg', type: 'raise', description: 'Rise through the ball of the foot and lower slowly through a comfortable range.', progression: ['Two-leg', 'Single-leg', 'Deficit single-leg'] },
      { id: 'glute-bridge', name: 'Glute bridges', target: '3 × 12–20', type: 'bridge', description: 'Drive the hips upward and squeeze the glutes without arching the lower back.', progression: ['Bridge', 'Pause bridge', 'Single-leg bridge'] },
      { id: 'plank-legs', name: 'Plank', target: '3 × 40–60 sec', type: 'plank', description: 'Brace the core, squeeze the glutes and breathe normally.', progression: ['Plank', 'Long-lever plank', 'RKC plank'] },
    ],
  },
  sat: {
    title: 'Full Body + Skills',
    focus: 'Strength · Skill · Core',
    exercises: [
      { id: 'fb-push-ups', name: 'Push-ups', target: '3 × 8–15', type: 'push', description: 'Choose the hardest variation you can perform with clean technique.', progression: ['Push-up', 'Diamond', 'Decline', 'Archer'] },
      { id: 'fb-pull-ups', name: 'Pull-ups', target: '3 × 4–10', type: 'pull', description: 'Use controlled reps and stop before technique starts to break down.', progression: ['Negative', 'Assisted', 'Pull-up', 'Chest-to-bar'] },
      { id: 'fb-split-squat', name: 'Bulgarian split squats', target: '3 × 8–12 / leg', type: 'lunge', description: 'Control the descent and keep the front knee tracking with the toes.', progression: ['Assisted', 'Bodyweight', 'Tempo', 'Pistol progression'] },
      { id: 'fb-pike', name: 'Pike push-ups', target: '3 × 6–12', type: 'pike', description: 'Focus on a vertical pressing pattern and smooth range of motion.', progression: ['Hands elevated', 'Floor', 'Feet elevated'] },
      { id: 'fb-knee-raise', name: 'Hanging knee raises', target: '3 × 8–15', type: 'raise', description: 'Keep the movement controlled and avoid generating momentum.', progression: ['Knee raise', 'Slow knee raise', 'Straight-leg raise'] },
      { id: 'fb-hollow', name: 'Hollow hold', target: '3 × 20–40 sec', type: 'plank', description: 'Press the lower back into the floor and keep the ribs tucked.', progression: ['Tuck', 'One-leg', 'Hollow hold'] },
    ],
  },
};

const days: Array<{ key: DayKey; label: string; meta: string }> = [
  { key: 'mon', label: 'Mon', meta: 'Push' },
  { key: 'tue', label: 'Tue', meta: 'Pull' },
  { key: 'thu', label: 'Thu', meta: 'Legs' },
  { key: 'sat', label: 'Sat', meta: 'Full Body' },
];

function ExerciseDemo({ type }: { type: ExerciseType }) {
  return (
    <div className="demo" aria-label="Animated exercise demonstration">
      <svg viewBox="0 0 500 220" role="img">
        <line className="ground" x1="40" y1="188" x2="460" y2="188" />
        {type === 'push' && (
          <motion.g animate={{ y: [12, 48, 12] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <circle className="joint" cx="120" cy="84" r="12" />
            <path className="person" d="M132 94 L210 125 L286 140 L366 160 M210 125 L164 178 M210 125 L246 178 M286 140 L332 187 M366 160 L407 188" />
          </motion.g>
        )}
        {type === 'pike' && (
          <motion.g animate={{ y: [6, 28, 6], rotate: [0, -3, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <circle className="joint" cx="156" cy="84" r="12" />
            <path className="person" d="M168 95 L242 124 L314 91 L386 176 M242 124 L210 181 M314 91 L344 181" />
          </motion.g>
        )}
        {type === 'squat' && (
          <motion.g animate={{ y: [0, 24, 0], scaleY: [1, 0.86, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <circle className="joint" cx="250" cy="50" r="13" />
            <path className="person" d="M250 64 L250 112 L204 162 L178 188 M250 112 L296 162 L322 188 M250 86 L206 112 M250 86 L294 112" />
          </motion.g>
        )}
        {type === 'lunge' && (
          <motion.g animate={{ x: [0, 14, 0], y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <circle className="joint" cx="250" cy="52" r="13" />
            <path className="person" d="M250 65 L250 112 L218 162 L178 188 M250 112 L315 160 L378 188 M250 88 L210 112 M250 88 L292 112" />
          </motion.g>
        )}
        {type === 'pull' && (
          <>
            <line className="person" x1="135" y1="24" x2="365" y2="24" />
            <motion.g animate={{ y: [48, 0, 48] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <circle className="joint" cx="250" cy="78" r="12" />
              <path className="person" d="M250 90 L250 140 M250 102 L190 67 M250 102 L310 67 M250 140 L216 188 M250 140 L284 188" />
            </motion.g>
          </>
        )}
        {type === 'bridge' && (
          <motion.g animate={{ y: [18, -4, 18] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <circle className="joint" cx="170" cy="128" r="11" />
            <path className="person" d="M182 132 L255 144 L328 172 L390 188 M255 144 L242 188 M328 172 L343 188" />
          </motion.g>
        )}
        {type === 'raise' && (
          <>
            <line className="person" x1="145" y1="24" x2="355" y2="24" />
            <motion.g animate={{ y: [0, -18, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <circle className="joint" cx="250" cy="76" r="12" />
              <path className="person" d="M250 88 L250 138 M250 100 L206 67 M250 100 L294 67 M250 138 L215 188 M250 138 L285 188" />
            </motion.g>
          </>
        )}
        {type === 'plank' && (
          <motion.g animate={{ y: [2, 6, 2] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <circle className="joint" cx="120" cy="96" r="12" />
            <path className="person" d="M133 106 L212 132 L286 145 L365 163 M212 132 L166 181 M365 163 L407 188" />
          </motion.g>
        )}
      </svg>
      <div className="demo-label">Live form preview</div>
    </div>
  );
}

function App() {
  const [day, setDay] = useState<DayKey>('mon');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [reps, setReps] = useState<Record<string, string[]>>({});

  const workout = workouts[day];
  const completedCount = workout.exercises.filter((exercise) => completed[exercise.id]).length;
  const progress = Math.round((completedCount / workout.exercises.length) * 100);

  const selectedDayLabel = useMemo(() => days.find((item) => item.key === day)?.label ?? 'Mon', [day]);

  const toggleExercise = (exerciseId: string) => {
    setExpanded((current) => (current === exerciseId ? null : exerciseId));
  };

  const toggleCompleted = (exerciseId: string) => {
    setCompleted((current) => ({ ...current, [exerciseId]: !current[exerciseId] }));
  };

  const updateRep = (exerciseId: string, setIndex: number, value: string) => {
    setReps((current) => {
      const next = [...(current[exerciseId] ?? [])];
      next[setIndex] = value;
      return { ...current, [exerciseId]: next };
    });
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <span className="eyebrow">CALISTHENICS TRACKER</span>
          <h1>Train with a plan.<br />Progress with purpose.</h1>
          <p>Home calisthenics workouts with guided movement, set tracking and built-in progression.</p>
        </div>
        <div className="hero-badge">Week 1</div>
      </header>

      <section className="week-strip" aria-label="Workout days">
        {days.map((item) => (
          <button key={item.key} className={`day-card ${item.key === day ? 'active' : ''}`} onClick={() => { setDay(item.key); setExpanded(null); }}>
            <span>{item.label}</span>
            <strong>{item.meta}</strong>
          </button>
        ))}
        <div className="rest-card"><span>Wed · Fri · Sun</span><strong>Recovery</strong></div>
      </section>

      <section className="summary-grid">
        <div className="summary-card"><span>Today</span><strong>{selectedDayLabel} · {workout.title}</strong></div>
        <div className="summary-card"><span>Focus</span><strong>{workout.focus}</strong></div>
        <div className="summary-card"><span>Exercises</span><strong>{workout.exercises.length}</strong></div>
        <div className="summary-card progress-summary"><span>Progress</span><strong>{progress}%</strong><div className="progress-bar"><span style={{ width: `${progress}%` }} /></div></div>
      </section>

      <section className="workout-list">
        {workout.exercises.map((exercise, index) => {
          const isOpen = expanded === exercise.id;
          const setCount = Number.parseInt(exercise.target, 10) || 3;
          return (
            <article key={exercise.id} className={`exercise-card ${isOpen ? 'open' : ''}`}>
              <div className="exercise-top">
                <div className="exercise-index">{String(index + 1).padStart(2, '0')}</div>
                <div className="exercise-title-block">
                  <h2>{exercise.name}</h2>
                  <p>{exercise.target}</p>
                </div>
                <button className="extend-button" onClick={() => toggleExercise(exercise.id)}>{isOpen ? 'Collapse' : 'Extend'}</button>
              </div>

              {isOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="exercise-details">
                  <ExerciseDemo type={exercise.type} />
                  <div className="detail-grid">
                    <div className="detail-panel"><span>How to</span><p>{exercise.description}</p></div>
                    <div className="detail-panel"><span>Progression</span><div className="progression-list">{exercise.progression.map((step, stepIndex) => <div key={step}><b>{stepIndex + 1}</b>{step}</div>)}</div></div>
                  </div>
                  <div className="sets-panel">
                    <div className="sets-heading"><span>Log your sets</span><small>{exercise.target}</small></div>
                    <div className="sets-grid">
                      {Array.from({ length: setCount }, (_, setIndex) => (
                        <label key={setIndex}>Set {setIndex + 1}<input value={reps[exercise.id]?.[setIndex] ?? ''} onChange={(event) => updateRep(exercise.id, setIndex, event.target.value)} inputMode="numeric" placeholder="reps" /></label>
                      ))}
                    </div>
                    <label className="done-toggle"><input type="checkbox" checked={Boolean(completed[exercise.id])} onChange={() => toggleCompleted(exercise.id)} /><span>Completed</span></label>
                  </div>
                </motion.div>
              )}
            </article>
          );
        })}
      </section>

      <footer className="footer-note">Next milestone: unlock a harder variation when you consistently reach the top of the rep range.</footer>
    </main>
  );
}
