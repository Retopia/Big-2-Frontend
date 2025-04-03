import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

function BackButton({ to = '/', label = 'Back' }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="text-gray-300 hover:text-white flex items-center gap-1 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded py-1 transition"
    >
      <ArrowLeft size={18} />
      {label}
    </button>
  );
}

export default BackButton;