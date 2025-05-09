import { useEffect, useState } from 'react';

interface Meeting {
  id: number;
  title: string | null;
  location: string;
  date: string;
  image: string | null;
}

const MeetingList = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/meetings')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.meetings.map((m: any[]) => ({
          id: m[0],
          title: m[1],
          location: m[2],
          date: m[3],
          image: m[4],
        }));
        setMeetings(formatted);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">デート一覧</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetings.map((m) => (
          <div key={m.id} className="border p-4 rounded shadow">
            {m.image && <img src={m.image} alt="image" className="mb-2 w-full h-48 object-cover rounded" />}
            <h3 className="text-xl font-bold">{m.title || 'タイトルなし'}</h3>
            <p>{m.location}</p>
            <p>{m.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingList;
