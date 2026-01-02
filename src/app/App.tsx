import { useState, useEffect, useCallback } from 'react';
import { FileUploadArea } from './components/FileUploadArea';
import { ProcessingStatus } from './components/ProcessingStatus';
import { TranscriptionResult } from './components/TranscriptionResult';
import { CircleStop, AudioLines } from 'lucide-react';

interface TranscriptionData {
    text: string;
    fileName: string;
    processingTime: number;
}

export default function App() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [estimatedEndTime, setEstimatedEndTime] = useState<Date | null>(null);
    const [transcription, setTranscription] = useState<TranscriptionData | null>(null);
    const [processingTimeoutId, setProcessingTimeoutId] = useState<number | null>(null);

    // リロード防止
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isProcessing) {
                e.preventDefault();
                e.returnValue = '処理中です。ページを離れると処理が中断されます。';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isProcessing]);

    const handleFileSelect = useCallback((file: File) => {
        setSelectedFile(file);
        setTranscription(null);
    }, []);

    const startTranscription = useCallback(async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        const now = new Date();
        setStartTime(now);

        // 音声ファイルのサイズから処理時間を推定（仮定: 1MBあたり5秒）
        const estimatedSeconds = Math.ceil((selectedFile.size / 1024 / 1024) * 5);
        const endTime = new Date(now.getTime() + estimatedSeconds * 1000);
        setEstimatedEndTime(endTime);

        // モックの文字起こし処理をシミュレート
        const timeoutId = window.setTimeout(() => {
            // ダミーの文字起こし結果を生成
            const mockTranscription = generateMockTranscription(selectedFile.name);

            setTranscription({
                text: mockTranscription,
                fileName: selectedFile.name,
                processingTime: estimatedSeconds,
            });

            setIsProcessing(false);
            setStartTime(null);
            setEstimatedEndTime(null);
            setProcessingTimeoutId(null);
        }, estimatedSeconds * 1000);

        setProcessingTimeoutId(timeoutId);
    }, [selectedFile]);

    const stopTranscription = useCallback(() => {
        if (processingTimeoutId !== null) {
            clearTimeout(processingTimeoutId);
            setProcessingTimeoutId(null);
        }

        setIsProcessing(false);
        setStartTime(null);
        setEstimatedEndTime(null);
    }, [processingTimeoutId]);

    const generateMockTranscription = (fileName: string): string => {
        return `こんにちは。これは ${fileName} の文字起こし結果のサンプルです。

実際の音声認識処理を行うには、OpenAI Whisper APIやGoogle Cloud Speech-to-Text、Azure Speech Servicesなどの外部APIとの連携が必要です。

現在はデモンストレーション用のモックデータを表示しています。音声ファイルのサイズに応じて処理時間をシミュレートし、実際の処理フローを再現しています。

処理中は以下の機能が動作しています：
- 経過時間の表示
- 処理終了予定時刻の計算と表示
- 開始ボタンの無効化
- ページリロードの防止
- 処理の停止機能

このアプリケーションは、実際のAPIと連携することで、本格的な文字起こしサービスとして機能します。`;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <AudioLines className="w-10 h-10 text-blue-600" />
                        <h1 className="text-gray-900">音声文字起こしサービス</h1>
                    </div>
                    <p className="text-gray-600">
                        音声ファイルをアップロードして、自動で文字起こしを行います
                    </p>
                </header>

                <div className="space-y-6">
                    <FileUploadArea
                        onFileSelect={handleFileSelect}
                        selectedFile={selectedFile}
                        disabled={isProcessing}
                    />

                    <div className="flex gap-4">
                        <button
                            onClick={startTranscription}
                            disabled={!selectedFile || isProcessing}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isProcessing ? '処理中...' : '文字起こし開始'}
                        </button>

                        {isProcessing && (
                            <button
                                onClick={stopTranscription}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <CircleStop className="w-5 h-5" />
                                停止
                            </button>
                        )}
                    </div>

                    <ProcessingStatus
                        isProcessing={isProcessing}
                        startTime={startTime}
                        estimatedEndTime={estimatedEndTime}
                    />

                    {transcription && (
                        <TranscriptionResult
                            text={transcription.text}
                            fileName={transcription.fileName}
                            processingTime={transcription.processingTime}
                        />
                    )}

                    {!isProcessing && !transcription && selectedFile && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm">
                                <strong>注意:</strong> これはデモ版です。実際の音声認識を行うには、外部APIとの連携が必要です。
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
