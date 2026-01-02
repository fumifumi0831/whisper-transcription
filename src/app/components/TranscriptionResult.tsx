import { FileAudio } from 'lucide-react';

interface TranscriptionResultProps {
  text: string;
  fileName: string;
  processingTime: number;
}

export function TranscriptionResult({ text, fileName, processingTime }: TranscriptionResultProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert('クリップボードにコピーしました');
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileAudio className="w-6 h-6 text-green-600" />
        <div className="flex-1">
          <h3 className="text-gray-900">文字起こし結果</h3>
          <p className="text-sm text-gray-600">{fileName}</p>
        </div>
        <div className="text-right text-sm text-gray-600">
          処理時間: {formatTime(processingTime)}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
        <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{text}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          クリップボードにコピー
        </button>
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`}
          download={`${fileName.replace(/\.[^/.]+$/, '')}_transcript.txt`}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          テキストファイルとしてダウンロード
        </a>
      </div>
    </div>
  );
}
