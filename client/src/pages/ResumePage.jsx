import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchResume } from '../store/resumeSlice';
import ResumeEditor from '../components/ResumeEditor/ResumeEditor';

export default function ResumePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchResume());
  }, [dispatch]);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">My Resume</h1>
      <p className="mt-1 text-slate-400">Keep your resume updated — AI uses it to score job matches</p>
      <div className="mt-8 glass rounded-xl p-6">
        <ResumeEditor />
      </div>
    </div>
  );
}
