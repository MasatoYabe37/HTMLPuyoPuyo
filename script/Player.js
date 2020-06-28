class PlayerInfo
{
    // 変数定義
    // mPlayerID;
    // mBGCtrl;                 // 背景コントロール
    // mInput;
    // mGameParam
    // eMoveState
    // mMoveState

    constructor(plid)
    {
        this.eMoveState =
        {
            None            : 0,    // なにもなし
            Dropping        : 1,    // ぷよ　落ちてる
            Check           : 2,    // ぷよ　消えチェック
            DestroyAnim     : 3,    // ぷよ　消えるアニメーション
            Fall            : 4,    // ぷよ　消えた後の上のぷよが落ちる
            NextInterval    : 5,    // 次のぷよ待ち
            NextPuyo        : 6,    // 次のぷよを生成     
        }
        this.mMoveState = this.eMoveState.None;
        this.mPlayerID = plid;
        this.mBGCtrl = new Background();
        this.mInput = new InputInfo();
        this.mParam = new GameParam();
    }

    //--------------------------------------
    // 初期化
    Init(rndSeed)
    {
        this.mBGCtrl.Init(10, 10);
        this.mInput.Init();
        this.mParam.Init(rndSeed);
        for (var i=0; i<gGame.NEXT_NUM; ++i)
        {
            this._GenerateNextPuyo();
        }
        this._NextPuyo();
    }

    //--------------------------------------
    // 前更新
    PreUpdate(dt)
    {
        this.mBGCtrl.Clear();
    }

    //--------------------------------------
    // 更新
    Update(dt)
    {
        this._UpatePuyo(dt);
        // デバッグ表示
        this._DebugDrawInfo();
    }

    //--------------------------------------
    // 描画
    Draw(dt)
    {
        this.mBGCtrl.DrawBG();

        this._DrawPuyo();

        this.mBGCtrl.DrawFrame();
        this.mBGCtrl.DrawScore(this.mParam.mScore);
        this.mBGCtrl.MascDraw();
    }

    //================================================
    //#region  ぷよ関連処理
    //--------------------------------------
    // ぷよ　位置→格子位置
    PuyoPos2Grid_X(x)
    {
        return parseInt(x / gGame.mPuyoImgSize);
    }
    PuyoPos2Grid_Y(y)
    {
        return parseInt(y / gGame.mPuyoImgSize);
    }
    //--------------------------------------
    // ぷよ　格子位置→位置
    PuyoGrid2Pos_X(x)
    {
        return x * gGame.mPuyoImgSize;
    }
    PuyoGrid2Pos_Y(y)
    {
        return y * gGame.mPuyoImgSize;
    }

    //--------------------------------------
    // ぷよ関連更新
    _UpatePuyo(dt)
    {
        if (this.mParam.mPuyoY < 500)
        {
            this.mParam.mPuyoY += this.mParam.mSpeed * dt;
        }
    }

    //--------------------------------------
    // ぷよ関連描画
    _DrawPuyo()
    {
        // すでに落ち切っているぷよを表示
        for (var i=0; i<(gGame.PUYO_X_MAX * gGame.PUYO_Y_MAX); ++i)
        {
            var grid_x = GetPosX(i);
            var grid_y = GetPosY(i);
            var x = this.PuyoGrid2Pos_X(grid_x);
            var y = this.PuyoGrid2Pos_Y(grid_y);

            this.mBGCtrl.DrawPuyoUnit(this.mParam.mMap[i], x, y);
        }

        // 現在落ちているぷよを表示(支点)
        var puyo1 = parseInt(this.mParam.mCurrentPuyo / 10);
        var puyo2 = parseInt(this.mParam.mCurrentPuyo % 10);
        this.mBGCtrl.DrawPuyoUnit(puyo1, this.mParam.mPuyoX, this.mParam.mPuyoY);
        // @TODO 現在落ちているぷよを表示（もう一個の方）
        
        // this.mBGCtrl.DrawPuyoUnit(0, this.PuyoGrid2Pos_X(0), this.PuyoGrid2Pos_Y(0));
        // this.mBGCtrl.DrawPuyoUnit(1, this.PuyoGrid2Pos_X(1), this.PuyoGrid2Pos_Y(1));
        // this.mBGCtrl.DrawPuyoUnit(2, this.PuyoGrid2Pos_X(2), this.PuyoGrid2Pos_Y(2));
        // this.mBGCtrl.DrawPuyoUnit(3, this.PuyoGrid2Pos_X(3), this.PuyoGrid2Pos_Y(3));
        // this.mBGCtrl.DrawPuyoUnit(4, this.PuyoGrid2Pos_X(4), this.PuyoGrid2Pos_Y(4));
        // this.mBGCtrl.DrawPuyoUnit(5, this.PuyoGrid2Pos_X(5), this.PuyoGrid2Pos_Y(5));
        
    }

    //--------------------------------------
    // 次のぷよを作ってそのほかの設定をする
    _NextPuyo()
    {
        this.mParam.mCurrentPuyo = this.mParam.mNextPuyo[0];
        this._GenerateNextPuyo();
        this.mParam.mPuyoX = this.mParam.PUYO_INIT_POS_X;
        this.mParam.mPuyoY = this.mParam.PUYO_INIT_POS_Y;
        this.mParam.mPuyoFallCount = 0;
        this.mParam.mPuyoState = this.mParam.ePuyoState.Fall;
        this.mParam.mPuyoDir = this.mParam.ePuyoDir.Up;
    }

    //--------------------------------------
    // 次のぷよを決定する
    _GenerateNextPuyo()
    {
        var next1 = (this.mParam.mRand.Next() >>> 0) % gGame.PUYO_KIND_NUM + 1;
        var next2 = (this.mParam.mRand.Next() >>> 0) % gGame.PUYO_KIND_NUM + 1;
        var next = next1 * 10 + next2;
        for (var i=0; i<gGame.NEXT_NUM - 1; ++i)
        {
            this.mParam.mNextPuyo[i] = this.mParam.mNextPuyo[i + 1];
        }
        this.mParam.mNextPuyo[gGame.NEXT_NUM - 1] = next;
    }
    //#endregion
    //================================================


    //--------------------------------------
    // デバッグ表示
    _DebugDrawInfo()
    {
        var str = "";
        for (var y=0; y<gGame.PUYO_Y_MAX; ++y)
        {
            for (var x=0; x<gGame.PUYO_X_MAX; ++x)
            {
                var index = GetMapIndex(x, y);
                str += " " + this.mParam.mMap[index];
            }
            str += "\r\n"
        }
        str += "\r\n"
        str += "Current : " + this.mParam.mCurrentPuyo + "\r\n";
        for (var i=0; i<gGame.NEXT_NUM; i++)
        {
            str += "Next"+i+" : " + this.mParam.mNextPuyo[i] + "\r\n";
        }
        gGame.mDebugBlock.innerText = str;
    }
}