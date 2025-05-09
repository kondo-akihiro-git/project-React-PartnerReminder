import { useNavigate } from 'react-router-dom';

const Top = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Partner Reminder</h1>
      <button
        onClick={() => navigate('/meetings')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        デート一覧を見る
      </button>
    </div>
  );
};

export default Top;
