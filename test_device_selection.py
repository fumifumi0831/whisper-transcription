#!/usr/bin/env python3
"""
デバイス選択ロジックのテストスクリプト
CPU環境での動作確認用
"""

import torch

def test_device_selection():
    """デバイス選択ロジックをテストする"""
    print("=" * 50)
    print("デバイス選択ロジックのテスト")
    print("=" * 50)
    
    # CUDAの確認
    cuda_available = torch.cuda.is_available()
    print(f"CUDA available: {cuda_available}")
    
    # XPUの確認
    xpu_available = False
    if hasattr(torch, 'xpu'):
        try:
            xpu_available = torch.xpu.is_available()
            print(f"XPU available: {xpu_available}")
        except AttributeError:
            print("XPU module exists but is_available() is not available")
    else:
        print("XPU module not found (this is normal if Intel Arc GPU is not installed)")
    
    # デバイス選択ロジックのテスト（app.pyと同じロジック）
    if torch.cuda.is_available():
        device = "cuda"
    elif hasattr(torch, 'xpu') and torch.xpu.is_available():
        device = "xpu"
    else:
        device = "cpu"
    
    print(f"\n選択されたデバイス: {device}")
    
    # 期待される動作の確認
    print("\n" + "=" * 50)
    print("期待される動作:")
    if cuda_available:
        print("✅ CUDAが利用可能 → 'cuda'が選択される")
    elif xpu_available:
        print("✅ XPUが利用可能 → 'xpu'が選択される")
    else:
        print("✅ CUDAもXPUも利用不可 → 'cpu'が選択される（正常）")
    print("=" * 50)
    
    return device

if __name__ == "__main__":
    test_device_selection()

