import { Clock, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProcessingStatusProps {
  isProcessing: boolean;
  startTime: Date | null;
  estimatedEndTime: Date | null;
}

export function ProcessingStatus({ isProcessing, startTime, estimatedEndTime }: ProcessingStatusProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isProcessing || !startTime) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!isProcessing) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Loader className="w-6 h-6 text-blue-600 animate-spin" />
        <h3 className="text-blue-900">処理中...</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5" />
            <span>経過時間:</span>
          </div>
          <span className="text-blue-700">{formatTime(elapsedTime)}</span>
        </div>

        {estimatedEndTime && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <span>処理終了予定:</span>
            </div>
            <span className="text-blue-700">{formatDateTime(estimatedEndTime)}</span>
          </div>
        )}
      </div>

      <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-pulse" style={{ width: '100%' }} />
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        処理が完了するまでページをリロードしないでください
      </p>
    </div>
  );
}
