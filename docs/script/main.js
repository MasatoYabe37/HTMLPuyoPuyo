//------------------------------------------
// 関数
// 初期化
function OnStartApplication()
{
    var now = new Date();
    var time = now.getTime();
    var yearSeed = (parseInt(now.getUTCFullYear()) << 4);
    var monthSeed = (parseInt(now.getUTCMonth()) << 8);
    var daySeed = (parseInt(now.getUTCDay()) << 12);
    var hoursSeed = (parseInt(now.getUTCHours()) << 16);
    var minutesSeed = (parseInt(now.getUTCMinutes()) << 20);
    var secondsSeed = (parseInt(now.getUTCSeconds()) << 24);
    var millisecondsSeed = (parseInt(now.getUTCMilliseconds()) << 28);
    var rndSeed = time;
    rndSeed += yearSeed;
    rndSeed += monthSeed;
    rndSeed += daySeed;
    rndSeed += hoursSeed;
    rndSeed += minutesSeed;
    rndSeed += secondsSeed;
    rndSeed += millisecondsSeed;
    gGame.Init(rndSeed);
    setInterval(main, gGame.mDeltTime)
}

// FPSを記録（最終更新時間も）
function UpdateProfile(dt)
{
    var now_time = performance.now();
    // var elapsed_time = now_time - m_lastUpdateTime;
    var elapsed_time = now_time - gGame.mLastUpdateTime;

    var str = "last update time : "+ gGame.mLastUpdateTime + "\r\n";
    str += "elapsed time : " + (dt * 1000.0).toFixed(2) + " msec (target elapsed time : " + gGame.mDeltTime.toFixed(2) + ")\r\n";
    str += "FPS : " + (1.0 / dt).toFixed(2) + "(target FPS : " + gGame.mTargetFPS + ") \r\n";
    str += "Processing time : " + Number(gGame.mProcessingTime).toFixed(2) + "msec\r\n";

    gGame.mFPSBlock.innerText = str;
}


//==================================================
// メイン更新
function Update(dt)
{
    // 準備が整ってない場合は、更新せず
    if (gImgResHolder.IsCompleteLoadAllImages() == false) return;
    
    // プロファイリング
    UpdateProfile(dt);

    // 前更新
    for (var i=0; i<gGame.mPlayerNum; ++i)
    {
        gGame.mPlayer[i].PreUpdate(dt)
    }
    
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
    // 経過時間計測
    var s_time = performance.now();
    var elapsed_time = (s_time - gGame.mLastUpdateTime) / 1000.0; //(秒)

    // メイン更新
    Update(elapsed_time);

    // 時間記録＆処理時間計測
    gGame.mLastUpdateTime = performance.now();
    gGame.mProcessingTime = gGame.mLastUpdateTime - s_time;
}

// 初期化
OnStartApplication();