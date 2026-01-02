#!/usr/bin/env python3
"""
Whisperを使用した音声文字起こしスクリプト
"""

import os
import argparse
import whisper
import torch
import time
import sys
from datetime import datetime

def check_ffmpeg():
    """FFmpegがインストールされているか確認"""
    if os.system("ffmpeg -version > /dev/null 2>&1") != 0:
        print("エラー: FFmpegがインストールされていません。")
        print("https://ffmpeg.org/download.html からダウンロードし、インストールしてください。")
        sys.exit(1)

def get_available_models():
    """利用可能なWhisperモデルの一覧を返す"""
    return ["tiny", "base", "small", "medium", "large"]

def transcribe_audio(file_path, model_name="base", language=None):
    """
    音声ファイルを文字起こしする
    
    Parameters:
        file_path (str): 音声ファイルのパス
        model_name (str): Whisperモデルの名前 (tiny, base, small, medium, large)
        language (str): 音声の言語コード (例: "ja" for 日本語)
        
    Returns:
        dict: 文字起こし結果
    """
    # モデルの検証
    available_models = get_available_models()
    if model_name not in available_models:
        raise ValueError(f"不正なモデル名: {model_name}. 利用可能なモデル: {', '.join(available_models)}")
    
    # ファイルの存在確認
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"ファイルが見つかりません: {file_path}")
    
    print(f"モデル '{model_name}' をロード中...")
    start_time = time.time()
    
    # GPUが利用可能かチェック（CUDA優先、なければXPU、どちらもなければCPU）
    if torch.cuda.is_available():
        device = "cuda"
    elif hasattr(torch, 'xpu') and torch.xpu.is_available():
        device = "xpu"
    else:
        device = "cpu"
    print(f"デバイス: {device}")
    
    # モデルをロード
    model = whisper.load_model(model_name, device=device)
    
    load_time = time.time() - start_time
    print(f"モデルのロード完了（{load_time:.2f}秒）")
    
    # 文字起こしのオプション
    options = {}
    if language:
        options["language"] = language
    
    # 文字起こし実行
    print(f"文字起こし中: {file_path}")
    transcribe_start = time.time()
    
    result = model.transcribe(file_path, **options)
    
    transcribe_time = time.time() - transcribe_start
    print(f"文字起こし完了（{transcribe_time:.2f}秒）")
    
    return result

def save_result(result, output_file=None):
    """
    文字起こし結果を保存する
    
    Parameters:
        result (dict): 文字起こし結果
        output_file (str): 出力ファイルのパス。Noneの場合は標準出力に表示
    """
    text = result["text"]
    
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"結果を保存しました: {output_file}")
    else:
        print("\n--- 文字起こし結果 ---")
        print(text)
        print("----------------------")

def main():
    """メイン関数"""
    parser = argparse.ArgumentParser(description="Whisperを使用した音声文字起こしツール")
    parser.add_argument("--file", required=True, help="文字起こしする音声ファイルのパス")
    parser.add_argument("--model", default="base", choices=get_available_models(),
                        help="使用するWhisperモデル (デフォルト: base)")
    parser.add_argument("--language", help="音声の言語コード (例: ja, en)")
    parser.add_argument("--output", help="出力ファイルのパス (指定しない場合は標準出力)")
    
    args = parser.parse_args()
    
    # FFmpegの確認
    check_ffmpeg()
    
    try:
        # 文字起こし実行
        result = transcribe_audio(args.file, args.model, args.language)
        
        # 結果を保存または表示
        save_result(result, args.output)
        
        # タイムスタンプ付きの出力も必要な場合
        if args.output and args.output.endswith('.txt'):
            timestamp_output = args.output.replace('.txt', '_timestamps.txt')
            
            with open(timestamp_output, 'w', encoding='utf-8') as f:
                for segment in result["segments"]:
                    start_time = segment["start"]
                    end_time = segment["end"]
                    text = segment["text"]
                    
                    # 時間をフォーマット (HH:MM:SS.ms)
                    start_formatted = str(datetime.utcfromtimestamp(start_time).strftime('%H:%M:%S.%f'))[:-3]
                    end_formatted = str(datetime.utcfromtimestamp(end_time).strftime('%H:%M:%S.%f'))[:-3]
                    
                    f.write(f"[{start_formatted} --> {end_formatted}] {text}\n")
            
            print(f"タイムスタンプ付き結果を保存しました: {timestamp_output}")
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
