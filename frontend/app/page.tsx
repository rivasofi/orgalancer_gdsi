import Chat from '@/components/Chat';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Chat />
      </main>
    </div>
  );
}
