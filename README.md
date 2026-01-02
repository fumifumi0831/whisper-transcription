# Whisper文字起こしツール

このリポジトリは、OpenAIのWhisperモデルを使用して音声ファイルからテキストへの文字起こしを行うPythonツールです。

## 機能

- 様々な音声フォーマット（mp3, wav, m4a, など）に対応
- 複数の言語に対応（日本語を含む）
- コマンドラインからの操作
- シンプルなウェブインターフェース（Streamlit使用）

## 必要条件

- Python 3.8以上
- FFmpeg（音声処理に必要）
- 必要なPythonパッケージ（requirements.txtに記載）

## インストール方法

1. このリポジトリをクローンします：

```bash
git clone https://github.com/fumifumi0831/whisper-transcription.git
cd whisper-transcription
```

2. 仮想環境を作成し、有効化します：

```bash
python -m venv venv
# Windowsの場合
venv\Scripts\activate
# macOS/Linuxの場合
source venv/bin/activate
```

3. 必要なパッケージをインストールします：

```bash
pip install -r requirements.txt
```

4. FFmpegをインストールします：
   - Windowsの場合: [FFmpegダウンロードサイト](https://ffmpeg.org/download.html)からダウンロードし、PATHに追加
   - macOSの場合: `brew install ffmpeg`
   - Ubuntuの場合: `sudo apt update && sudo apt install ffmpeg`

## 使用方法

### コマンドラインから使用

```bash
python transcribe.py --file path/to/audio/file.mp3 --model base --output ./ --language ja
```

オプション:

- `--file`: 文字起こしを行う音声ファイルへのパス（必須）
- `--model`: 使用するWhisperモデルのサイズ（tiny, base, small, medium, large）。デフォルトは `base`
- `--language`: 音声の言語（en, ja など）。指定しない場合、自動検出を試みます
- `--output`: 出力テキストファイルのパス。指定しない場合、標準出力に表示します

### Webインターフェースから使用

```bash
streamlit run app.py
```

ブラウザで http://localhost:8501 を開き、インターフェースを操作します。

## ライセンス

MITライセンス

## 謝辞

- [OpenAI Whisper](https://github.com/openai/whisper) - 優れた音声認識モデルの提供に感謝します
