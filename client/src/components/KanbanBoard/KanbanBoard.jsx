import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateApplication } from '../../store/applicationsSlice';
import KanbanCard from './KanbanCard';

const COLUMNS = [
  { id: 'saved', title: 'Saved', color: 'border-slate-500/40', bg: 'bg-slate-500/5' },
  { id: 'applied', title: 'Applied', color: 'border-blue-500/40', bg: 'bg-blue-500/5' },
  { id: 'interview', title: 'Interview', color: 'border-violet-500/40', bg: 'bg-violet-500/5' },
  { id: 'offer', title: 'Offer', color: 'border-emerald-500/40', bg: 'bg-emerald-500/5' },
  { id: 'rejected', title: 'Rejected', color: 'border-red-500/40', bg: 'bg-red-500/5' },
];

export default function KanbanBoard({ applications }) {
  const dispatch = useDispatch();
  const [dragged, setDragged] = useState(null);

  const handleDrop = async (status) => {
    if (!dragged || dragged.status === status) {
      setDragged(null);
      return;
    }
    try {
      await dispatch(updateApplication({ id: dragged._id, data: { status } })).unwrap();
    } catch (err) {
      alert(err.message);
    }
    setDragged(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const cards = applications.filter((a) => a.status === col.id);
        return (
          <div
            key={col.id}
            className={`min-w-[260px] flex-1 rounded-xl border-t-2 ${col.color} ${col.bg} p-3`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-slate-300">{col.title}</h3>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400">{cards.length}</span>
            </div>
            <div className="space-y-2 min-h-[80px]">
              {cards.map((app) => (
                <KanbanCard key={app._id} application={app} onDragStart={setDragged} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
