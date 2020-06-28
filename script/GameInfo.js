///==================================================
/// <summary>
/// ゲーム情報
/// </summary>
///==================================================
class GameInfo
{
    // 変数定義
    // mPlayerNum;                  // プレイヤーの人数
    // mLastUpdateTime;            // 最終更新時間(UTC)
    // mProcessingTime;            // main()処理時間
    // mIsSetuped;                 // セットアップ完了しているかどうか      
    // mTargetFPS;                 // FPS
    // mDeltTime;                  // 経過時間(msec)
    // mPuyoImgSize;               // ぷよの画像サイズ（正方形なので一辺）
    // PUYO_X_MAX;                  // X座標の最大個数
    // PUYO_Y_MAX;                  // Y座標の最大個数
    // mPlayer;                    // プレイヤー

    // Canvas or UI Element
    // mMainCanvasElement;
    // mMainCanvas;
    // mDebugBlock;
    // mFPSBlock;

    constructor()
    {
        this.mPlayerNum = 1;
        this.mTargetFPS = 30;
        this.mDeltTime = 1000.0 / this.mTargetFPS;
        this.mLastUpdateTime = 0
        this.mPuyoImgSize = 64;
        this.PUYO_X_MAX = 6;
        this.PUYO_Y_MAX = 13;
        this.PUYO_KIND_NUM = 5;
        this.NEXT_NUM = 3;
        this.mPlayer = new Array();
        for(var i=0; i<this.mPlayerNum; i++)
        {
            this.mPlayer[i] = new PlayerInfo(i);
        }
        // UIエレメント取得
        this.mMainCanvasElement = document.getElementById("mainCanvas");
        this.mMainCanvas = null;
        if (this.mMainCanvasElement != null)
        {
            this.mMainCanvas = this.mMainCanvasElement.getContext("2d");
        }
        this.mDebugBlock = document.getElementById("debug");
        this.mFPSBlock = document.getElementById("profiler");
        // セットアップ完了フラグを建てる
        this.mIsSetuped = true;
    }

    Init(rndSeed)
    {
        for(var i=0; i<this.mPlayerNum; i++)
        {
            this.mPlayer[i].Init(rndSeed);
        }
    }
}

// グローバル変数定義
const gGame = new GameInfo();