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
        this.mMoveState = this.eMoveState.Dropping;
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
        // @TODO MoveState毎の処理に変更する
        switch (this.mMoveState)
        {
            case this.eMoveState.None: break;
            // ぷよが落ちてくるステート
            case this.eMoveState.Dropping: this._UpatePuyo(dt); break;
            // ぷよが落ち切った後の消えるチェック
            case this.eMoveState.Check: this._CheckDestroyPuyo(); break;
            // ぷよが消えた場合の消えた演出＆スコア加算
            case this.eMoveState.DestroyAnim: this._UpdateDestroyPuyo(dt); break;
            // ぷよが消えた後の、上にあるぷよを落とす処理
            case this.eMoveState.Fall: this._UpdateFallPuyo(dt); break;
            // ぷよが落ち着いた後の、次のぷよが落ち始めるまでの休憩時間
            case this.eMoveState.NextInterval: this._UpdateNextInterval(dt); break;
            // 次のぷよを生成(1F)いらないかも…？
            case this.eMoveState.NextPuyo: this._NextPuyo(); break;
        }
        // デバッグ表示
        this._DebugDrawInfo();
    }

    //--------------------------------------
    // 描画
    Draw(dt)
    {
        this.mBGCtrl.DrawBG();

        this._DrawPuyoProjection();
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
        // @TODO Input処理
        
        // 回転更新
        switch (this.mParam.mPuyoRotateState)
        {
            case this.mParam.ePuyoRotateState.Left: _UpdatePuyoState_RotateLeft(dt); break;
            case this.mParam.ePuyoRotateState.Right: _UpdatePuyoState_RotateRight(dt); break;
        }
        // 移動更新
        switch (this.mParam.mPuyoMoveState)
        {
            case this.mParam.ePuyoMoveState.Left: this._UpdatePuyoState_MoveLeft(dt); break;
            case this.mParam.ePuyoMoveState.Right: this._UpdatePuyoState_MoveRight(dt); break;
        }

        // 落下更新
        this._UpdatePuyoState_Fall(dt);
    }

    //--------------------------------------
    // ぷよステート更新 Fall
    _UpdatePuyoState_Fall(dt)
    {
        var speed = this.mParam.mSpeed * dt;
        
        // 下に何かがあるかどうか
        if (this._CanFallDown())
        {
            // 下がる処理
            this.mParam.mPuyoY += speed;
        }
        else
        {
            // 下にブロックがある
            if (this.mParam.mPuyoRotateState == this.mParam.ePuyoRotateState.None)
            {
                // 回転してないときは、通常通りカウントを進める
                this.mParam.mPuyoFallCount += speed;
            }
            else
            {
                // 回転中は、カウントの進め方を遅くする
                this.mParam.mPuyoFallCount += speed * this.mParam.mRotFallRate;
            }

            // これ以上下がれない
            if (this.mParam.mPuyoFallCount > this.mParam.PUYO_FALL_COUNT)
            {
                // @TODO ぷよを固定する
                var puyo1 = parseInt(this.mParam.mCurrentPuyo / 10);
                var x1 = this.mParam.mPuyoX;
                var y1 = parseInt(this.mParam.mPuyoY / gGame.mPuyoImgSize);
                var index1 = GetMapIndex(x1,y1);
                var puyo2 = this.mParam.mCurrentPuyo % 10;
                var x2 = x1;
                var y2 = y1;
                switch (this.mParam.mPuyoDir)
                {
                    case this.mParam.ePuyoDir.Up: y2 = y1 - 1; break;
                    case this.mParam.ePuyoDir.Right: x2 = x1 + 1; break;
                    case this.mParam.ePuyoDir.Down: y2 = y1 + 1; break;
                    case this.mParam.ePuyoDir.Left: x2 = x1 - 1; break;
                }
                var index2 = GetMapIndex(x2, y2);
                
                this.mParam.mMap[index1] = puyo1;
                this.mParam.mMap[index2] = puyo2;
                //次のステートに進む
                this.mMoveState = this.eMoveState.Check;
            }
        }
    }

    //--------------------------------------
    // ぷよステート更新 MoveLeft
    _UpdatePuyoState_MoveLeft(dt)
    {
        this.mParam.mPuyoMoveAnimSec -= dt;
        if (this.mParam.mPuyoMoveAnimSec < 0)
        {
            this.mParam.mPuyoMoveAnimSec = 0;
            // 移動を終了する
            this.mParam.mPuyoMoveState = this.mParam.ePuyoMoveState.None;
        }
    }

    //--------------------------------------
    // ぷよステート更新 MoveRight
    _UpdatePuyoState_MoveRight(dt)
    {
        this.mParam.mPuyoMoveAnimSec -= dt;
        if (this.mParam.mPuyoMoveAnimSec < 0)
        {
            this.mParam.mPuyoMoveAnimSec = 0;
            // 移動を終了する
            this.mParam.mPuyoMoveState = this.mParam.ePuyoMoveState.None;
        }
    }

    //--------------------------------------
    // ぷよステート更新 RotateLeft
    _UpdatePuyoState_RotateLeft(dt)
    {
        this.mParam.mPuyoRotAnimSec -= dt;
        if (this.mParam.mPuyoRotAnimSec < 0)
        {
            this.mParam.mPuyoRotAnimSec = 0;
            // 回転を終了する
            this.mParam.mPuyoRotState = this.mParam.ePuyoRotState.None;
        }
    }

    //--------------------------------------
    // ぷよステート更新 RotateRight
    _UpdatePuyoState_RotateRight(dt)
    {
        this.mParam.mPuyoRotAnimSec -= dt;
        if (this.mParam.mPuyoRotAnimSec < 0)
        {
            this.mParam.mPuyoRotAnimSec = 0;
            // 回転を終了する
            this.mParam.mPuyoRotState = this.mParam.ePuyoRotState.None;
        }
    }

    //--------------------------------------
    // 現在のぷよが下がれるかどうか
    _CanFallDown()
    {
        var grid_x = this.mParam.mPuyoX;
        var grid_y = this.PuyoPos2Grid_Y(this.mParam.mPuyoY);
        
        // Yが一ブロックピッタリ
        var isMaxDetailY = this.mParam.mPuyoY > gGame.mPuyoImgSize;
        if (isMaxDetailY == false) return true; // ピッタリじゃないときは下に下がれる 
        // 下が限界値
        var isMaxY = grid_y > gGame.PUYO_Y_MAX; // 下が限界値
        if (isMaxY)
        {
            return false;
        }
        // 下にすでにぷよが存在する
        var isExistBottom = this.mParam.mMap[GetMapIndex(grid_x, grid_y+1)] != 0;
        if (isExistBottom)
        {
            return false;
        }
        return true;
    }
    //--------------------------------------
    // ぷよが落ち切った後の消えるチェック
    _CheckDestroyPuyo()
    {

    }
    //--------------------------------------
    // ぷよが消えた場合の消えた演出＆スコア加算
    _UpdateDestroyPuyo(dt)
    {

    }
    //--------------------------------------
    // ぷよが消えた後の、上にあるぷよを落とす処理
    _UpdateFallPuyo(dt)
    {

    }
    //--------------------------------------
    // ぷよが落ち着いた後の、次のぷよが落ち始めるまでの休憩時間
    _UpdateNextInterval(dt)
    {

    }
    //--------------------------------------
    // 次のぷよを生成(1F)いらないかも…？
    _NextPuyo()
    {

    }

    //--------------------------------------
    // ぷよ予測描画
    _DrawPuyoProjection()
    {

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
        // 位置を計算
        var actualX = this.mParam.mPuyoX * gGame.mPuyoImgSize;
        var animX = gGame.mPuyoImgSize * (this.mParam.mPuyoMoveAnimSec / this.mParam.MOVE_ANIM_SEC);
        switch (this.mParam.mPuyoMoveState)
        {
            case this.mParam.ePuyoMoveState.Right: actualX -= animX;  break;
            case this.mParam.ePuyoMoveState.Left: actualX += animX; break;
        }

        // 回転量を計算
        var rotDeg = 270;
        switch (this.mParam.mPuyoDir)
        {
            case this.mParam.ePuyoDir.Up: rotDeg = 270; break;
            case this.mParam.ePuyoDir.Right: rotDeg = 0; break;
            case this.mParam.ePuyoDir.Down: rotDeg = 90; break;
            case this.mParam.ePuyoDir.Left: rotDeg = 180; break;
        }
        // 回転中の場合 回転量を減算
        if (this.mParam.mPuyoRotateState == this.mParam.ePuyoRotateState.Left)
        {
            var animRate = this.mParam.mPuyoRotAnimSec / this.mParam.ROTATE_ANIM_SEC;
            rotDeg += 90 * animRate;
        }
        else if (this.mParam.mPuyoRotateState == this.mParam.ePuyoRotateState.Right)
        {
            var animRate = this.mParam.mPuyoRotAnimSec / this.mParam.ROTATE_ANIM_SEC;
            rotDeg -= 90 * animRate;
        }
        var distance = gGame.mPuyoImgSize;
        var rotRad = rotDeg * (Math.PI / 180.0);
        var vec_x = Math.cos(rotRad) * distance;
        var vec_y = Math.sin(rotRad) * distance;

        this.mBGCtrl.DrawPuyoUnit(puyo1, actualX + animX, this.mParam.mPuyoY);
        this.mBGCtrl.DrawPuyoUnit(puyo2, actualX + animX +vec_x, this.mParam.mPuyoY + vec_y);

        // @TODO 予測を表示
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
        this.mParam.mPuyoRotateState = this.mParam.ePuyoRotateState.None;
        this.mParam.mPuyoMoveState = this.mParam.ePuyoMoveState.None;
        this.mParam.mPuyoDir = this.mParam.ePuyoDir.Up;
        this.mParam.mPuyoRotAnimSec = 0;
        this.mParam.mPuyoMoveAnimSec = 0;
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
        str += "\r\n";
        str += "Current Move State : " + this.mMoveState + "\r\n";
        str += "Current : " + this.mParam.mCurrentPuyo + "\r\n";
        for (var i=0; i<gGame.NEXT_NUM; i++)
        {
            str += "Next"+i+" : " + this.mParam.mNextPuyo[i] + "\r\n";
        }
        gGame.mDebugBlock.innerText = str;
    }
}