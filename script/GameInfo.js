//==================================================
/// <summary>
/// ゲーム情報
/// </summary>
//==================================================
class GameInfo
{
    // 変数定義
    mLastUpdateTime;            // 最終更新時間(UTC)
    mProcessingTime;            // main()処理時間
    mIsSetuped;                 // セットアップ完了しているかどうか      
    mTargetFPS;                 // FPS
    mDeltTime;                  // 経過時間(msec)
    mPuyoImgSize;               // ぷよの画像サイズ（正方形なので一辺）
    mPuyoXMax;                  // X座標の最大個数
    mPuyoYMax;                  // Y座標の最大個数

    // Canvas or UI Element
    mMainCanvasElement;
    mMainCanvas;
    mFPSBlock;

    Init()
    {
        // 目標FPSを設定
        this.mTargetFPS = 30;
        this.mDeltTime = 1000.0 / this.mTargetFPS;
        this.mLastUpdateTime = 0
        this.mPuyoImgSize = 64;
        this.mPuyoXMax = 6;
        this.mPuyoYMax = 12;
        // UIエレメント取得
        this.mMainCanvasElement = document.getElementById("mainCanvas");
        this.mMainCanvas = null;
        if (this.mMainCanvasElement != null)
        {
            this.mMainCanvas = this.mMainCanvasElement.getContext("2d");
        }
        this.mFPSBlock = document.getElementById("fps");
        // セットアップ完了フラグを建てる
        this.mIsSetuped = true;
    }
}

// グローバル変数定義
const gGame = new GameInfo();