import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, BookOpen } from 'lucide-react';

const ROOM_COUNT = 10;

export default function QrCodesPage() {
  const baseUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin;

  return (
    <div className="min-h-screen mandala-bg py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="btn-secondary mb-6">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-300 text-sm font-medium mb-4">
            <BookOpen size={14} />
            Board Game Companion
          </div>
          <h1 className="text-3xl font-bold text-saffron-200 mb-2">Room QR Codes</h1>
          <p className="text-ink-300 max-w-xl mx-auto">
            Print these QR codes and include them with your JANMA board game. Each code sends players
            to a unique private room. Scanning the same code always leads to the same room.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: ROOM_COUNT }, (_, i) => {
            const roomNum = i + 1;
            const roomUrl = `${baseUrl}/room${roomNum}`;
            return (
              <div
                key={roomNum}
                className="card flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-3 p-3 bg-white rounded-xl">
                  <QRCodeSVG
                    value={roomUrl}
                    size={140}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#1a1612"
                  />
                </div>
                <h3 className="text-saffron-200 font-display font-bold text-lg">Room {roomNum}</h3>
                <p className="text-ink-400 text-xs mt-1 break-all">{roomUrl}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
