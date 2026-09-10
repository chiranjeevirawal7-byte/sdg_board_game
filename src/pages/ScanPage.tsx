import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanLine, ArrowLeft, Camera } from 'lucide-react';

export default function ScanPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    setError(null);
    setScanning(true);

    try {
      const html5Qrcode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5Qrcode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      await html5Qrcode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          html5Qrcode.stop().then(() => {
            handleScannedCode(decodedText);
          });
        },
        () => {}
      );
    } catch {
      setError('Could not access camera. Please allow camera permissions and try again.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {
        // already stopped
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScannedCode = (decodedText: string) => {
    const match = decodedText.match(/room(\d+)/i);
    if (match) {
      const roomNum = parseInt(match[1], 10);
      if (roomNum >= 1 && roomNum <= 10) {
        navigate(`/room${roomNum}`);
        return;
      }
    }

    // If the QR code is a full URL, try to extract the room path
    try {
      const url = new URL(decodedText);
      const path = url.pathname;
      const pathMatch = path.match(/room(\d+)/i);
      if (pathMatch) {
        const roomNum = parseInt(pathMatch[1], 10);
        if (roomNum >= 1 && roomNum <= 10) {
          navigate(`/room${roomNum}`);
          return;
        }
      }
    } catch {
      // not a URL
    }

    setError('Invalid QR code. Please scan a JANMA board game QR code.');
    setScanning(false);
  };

  return (
    <div className="min-h-screen mandala-bg flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="btn-secondary mb-6 w-full">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="card text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-saffron-500/15 border border-saffron-500/30">
              <ScanLine size={28} className="text-saffron-300" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-saffron-200 mb-2">Scan QR Code</h1>
          <p className="text-ink-300 text-sm mb-6">
            Scan the QR code from your JANMA board game to enter your party's private room.
          </p>

          {!scanning && !error && (
            <button onClick={startScanner} className="btn-primary w-full">
              <Camera size={20} />
              Start Scanning
            </button>
          )}

          {scanning && (
            <div className="space-y-4">
              <div id="qr-reader" className="w-full rounded-xl overflow-hidden border border-saffron-700/30" />
              <p className="text-ink-300 text-sm">Point your camera at the QR code...</p>
              <button onClick={stopScanner} className="btn-danger w-full">
                Cancel
              </button>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-terracotta-900/30 border border-terracotta-700/40 text-terracotta-200 text-sm">
                {error}
              </div>
              <button onClick={startScanner} className="btn-primary w-full">
                <Camera size={20} />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
