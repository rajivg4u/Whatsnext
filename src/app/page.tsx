"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays, Check, CircleAlert, CirclePlus, Clock3, LayoutDashboard,
  ListTodo, Search, SlidersHorizontal, Target, Trash2
} from "lucide-react";

type Status = "Pending" | "In Progress" | "Completed";
type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: Status;
  category: string;
  progress: number;
};

const today = new Date().toISOString().slice(0, 10);
const initialTasks: Task[] = [
  { id: "1", title: "Plan the weekly priorities", description: "Review commitments and decide the top priorities.", dueDate: today, priority: "High", status: "In Progress", category: "Personal", progress: 50 },
  { id: "2", title: "Review architecture notes", description: "Consolidate notes and action items.", dueDate: today, priority: "Medium", status: "Pending", category: "Work", progress: 0 },
  { id: "3", title: "Complete learning module", description: "Finish the current learning module.", dueDate: today, priority: "Low", status: "Completed", category: "Learning", progress: 100 },
  { id: "4", title: "Prepare project update", description: "Draft a concise update for stakeholders.", dueDate: "2026-11-12", priority: "High", status: "In Progress", category: "Work", progress: 65 },
];

const isOverdue = (task: Task) => task.status !== "Completed" && task.dueDate < today;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [category, setCategory] = useState("Work");

  const counts = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    active: tasks.filter(t => t.status === "In Progress").length,
    overdue: tasks.filter(isOverdue).length,
  }), [tasks]);

  const visibleTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Overdue" && isOverdue(task)) ||
      (filter === "Today" && task.dueDate === today) ||
      task.status === filter;
    return matchesSearch && matchesFilter;
  });

  const completion = counts.total ? Math.round(counts.completed / counts.total * 100) : 0;

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks(prev => [{
      id: crypto.randomUUID(), title: title.trim(), description: "",
      dueDate, priority, status: "Pending", category, progress: 0
    }, ...prev]);
    setTitle("");
    setShowForm(false);
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }

  function removeTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Check size={19} /></span><span>TaskFlow</span></div>
        <div className="nav-label">WORKSPACE</div>
        <button className="nav-item active"><LayoutDashboard size={18}/> Overview</button>
        <button className="nav-item" onClick={() => setFilter("All")}><ListTodo size={18}/> All tasks</button>
        <button className="nav-item" onClick={() => setFilter("Today")}><CalendarDays size={18}/> Today</button>
        <button className="nav-item" onClick={() => setFilter("Overdue")}><CircleAlert size={18}/> Overdue <span className="nav-count">{counts.overdue}</span></button>
        <div className="nav-label space-top">VIEWS</div>
        {(["Pending", "In Progress", "Completed"] as const).map(s =>
          <button className="nav-item" key={s} onClick={() => setFilter(s)}><span className={`status-dot ${s.toLowerCase().replace(" ", "-")}`}/>{s}</button>
        )}
        <div className="sidebar-bottom"><div className="avatar">TF</div><div><strong>My workspace</strong><small>Personal planner</small></div></div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Overview</div>
          <div className="top-actions"><span className="date-label">{new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span><button className="primary-btn" onClick={() => setShowForm(true)}><CirclePlus size={17}/> New task</button></div>
        </header>

        <div className="content">
          <div className="welcome-row"><div><p className="eyebrow">YOUR PRODUCTIVITY AT A GLANCE</p><h1>Good work starts with a plan.</h1><p className="subheading">Keep track of what matters and make steady progress.</p></div><div className="welcome-icon"><Target size={32}/></div></div>

          <div className="stats-grid">
            <Stat title="Total tasks" value={counts.total} icon={<ListTodo/>} tone="blue"/>
            <Stat title="Completed" value={counts.completed} icon={<Check/>} tone="green"/>
            <Stat title="In progress" value={counts.active} icon={<Clock3/>} tone="purple"/>
            <Stat title="Overdue" value={counts.overdue} icon={<CircleAlert/>} tone="red"/>
          </div>

          <div className="overview-grid">
            <section className="panel progress-panel">
              <div className="panel-heading"><div><h2>Overall progress</h2><p>Your completion snapshot</p></div><span className="soft-icon"><Target size={18}/></span></div>
              <div className="progress-number">{completion}<span>%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${completion}%` }}/></div>
              <div className="progress-foot"><span>{counts.completed} of {counts.total} tasks completed</span><strong>{completion}%</strong></div>
              <div className="legend"><span><i className="green-dot"/>Completed</span><span><i className="blue-dot"/>Remaining</span></div>
            </section>
            <section className="panel quick-panel">
              <div className="panel-heading"><div><h2>Quick insights</h2><p>Things that need attention</p></div><SlidersHorizontal size={18} className="muted"/></div>
              <div className="insight-row"><span className="insight-icon red-bg"><CircleAlert size={17}/></span><div><strong>{counts.overdue} overdue tasks</strong><small>Review deadlines and reschedule where needed.</small></div></div>
              <div className="insight-row"><span className="insight-icon blue-bg"><CalendarDays size={17}/></span><div><strong>{tasks.filter(t => t.dueDate === today && t.status !== "Completed").length} tasks due today</strong><small>Focus on the next actionable item.</small></div></div>
            </section>
          </div>

          <section className="panel task-panel">
            <div className="task-heading"><div><h2>Tasks</h2><p>Manage your commitments in one place.</p></div><div className="task-tools"><div className="search-box"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tasks"/></div><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter tasks"><option>All</option><option>Today</option><option>Overdue</option><option>Pending</option><option>In Progress</option><option>Completed</option></select></div></div>
            <div className="task-list">
              {visibleTasks.length === 0 && <div className="empty-state">No tasks match this view. Add a task to get started.</div>}
              {visibleTasks.map(task => <article className="task-row" key={task.id}>
                <button className={`task-check ${task.status === "Completed" ? "checked" : ""}`} aria-label="Mark completed" onClick={() => updateTask(task.id, { status: task.status === "Completed" ? "Pending" : "Completed", progress: task.status === "Completed" ? 0 : 100 })}>{task.status === "Completed" && <Check size={14}/>}</button>
                <div className="task-main"><div className="task-title-line"><strong className={task.status === "Completed" ? "done" : ""}>{task.title}</strong>{isOverdue(task) && <span className="overdue-pill">Overdue</span>}</div><div className="task-meta"><span>{task.category}</span><span>Due {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span></div></div>
                <div className="task-progress"><div className="mini-track"><div style={{width: `${task.progress}%`}}/></div><small>{task.progress}%</small></div>
                <select className="status-select" value={task.status} onChange={e => updateTask(task.id, { status: e.target.value as Status, progress: e.target.value === "Completed" ? 100 : task.progress })} aria-label={`Status for ${task.title}`}><option>Pending</option><option>In Progress</option><option>Completed</option></select>
                <button className="icon-btn delete-btn" aria-label="Delete task" onClick={() => removeTask(task.id)}><Trash2 size={16}/></button>
              </article>)}
            </div>
          </section>

          <section className="panel calendar-panel">
            <div className="panel-heading"><div><h2>Upcoming calendar</h2><p>Tasks grouped by due date</p></div><CalendarDays size={19} className="muted"/></div>
            <div className="calendar-strip">{Array.from({length: 7}, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); const iso = d.toISOString().slice(0,10); const n = tasks.filter(t => t.dueDate === iso && t.status !== "Completed").length; return <div className={`calendar-day ${i === 0 ? "today" : ""}`} key={iso}><small>{d.toLocaleDateString(undefined,{weekday:"short"})}</small><strong>{d.getDate()}</strong><span>{n ? `${n} task${n > 1 ? "s" : ""}` : "—"}</span></div>; })}</div>
          </section>
          <footer>TaskFlow starter · Your tasks are currently stored in this browser session only.</footer>
        </div>
      </section>

      {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><form className="task-modal" onSubmit={addTask} onClick={e => e.stopPropagation()}><div className="modal-head"><div><h2>Create a task</h2><p>Add a commitment to your list.</p></div><button type="button" className="close-btn" onClick={() => setShowForm(false)}>×</button></div><label>Task title<input required autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Prepare project update"/></label><label>Due date<input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)}/></label><div className="form-two"><label>Priority<select value={priority} onChange={e => setPriority(e.target.value as Task["priority"])}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Category<select value={category} onChange={e => setCategory(e.target.value)}><option>Work</option><option>Personal</option><option>Learning</option><option>Health</option><option>Other</option></select></label></div><div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="primary-btn">Create task</button></div></form></div>}
    </main>
  );
}

function Stat({ title, value, icon, tone }: { title: string; value: number; icon: React.ReactNode; tone: string }) {
  return <div className="stat-card"><span className={`stat-icon ${tone}`}>{icon}</span><div><p>{title}</p><strong>{value}</strong></div></div>;
}
