// グローバル定義　変数
const BgCtrl = new Background();

//------------------------------------------
// 関数
// 初期化
function OnStartApplication()
{
    gGame.Init();
    BgCtrl.Init();
    setInterval(main, gGame.mDeltTime)
}

// FPSを記録（最終更新時間も）
function UpdateProfile(dt)
{
    var now_time = performance.now();
    // var elapsed_time = now_time - m_lastUpdateTime;
    var elapsed_time = now_time - gGame.mLastUpdateTime;

    var str = "last update time : "+ gGame.mLastUpdateTime + "\r\n";
    str += "elapsed time : " + dt.toFixed(2) + " msec (target elapsed time : " + gGame.mDeltTime.toFixed(2) + ")\r\n";
    str += "FPS : " + (1000.0 / dt).toFixed(2) + "(target FPS : " + gGame.mTargetFPS + ") \r\n";
    str += "Processing time : " + Number(gGame.mProcessingTime).toFixed(2) + "msec\r\n";
    if (ImgResHolder.IsCompleteLoadAllImages())
    {
        BgCtrl.UpdateBackground();
        BgCtrl.SetScore(parseInt(gGame.mLastUpdateTime / 1000));
        str += "Background images all loaded. \r\n";
    }
    else
    {
        str += "Background images not load yet. \r\n";
    }

    gGame.mFPSBlock.innerText = str;
}


//==================================================
// メイン更新
function Update(dt)
{
    UpdateProfile(dt);
    // 更新
    for (var i=0; i<gGame.mPlayerNum; ++i)
    {
        gGame.mPlayer[i].Update(dt)
    }

    // 描画
    for (var i=0; i<gGame.mPlayerNum; ++i)
    {
        gGame.mPlayer[i].Draw(dt)
    }
}

//==================================================
// メインループ
function main()
{
    var s_time = performance.now();
    var elapsed_time = s_time - gGame.mLastUpdateTime; // 前回更新からの経過時間

    Update(elapsed_time);

    gGame.mLastUpdateTime = performance.now();
    gGame.mProcessingTime = gGame.mLastUpdateTime - s_time;
}

// 初期化
OnStartApplication();