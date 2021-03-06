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
            Fall            : 2,    // ぷよ　消えた後の上のぷよが落ちる
            Check           : 3,    // ぷよ　消えチェック
            DestroyAnim     : 4,    // ぷよ　消えるアニメーション
            NextInterval    : 5,    // 次のぷよ待ち
            NextPuyo        : 6,    // 次のぷよを生成     
        }
        this.mMoveState = this.eMoveState.None;
        this.mPlayerID = plid;
        this.mBGCtrl = new Background();
        this.mParam = new GameParam();
        this.mInput = new PlayerInput();
    }

    //--------------------------------------
    // 初期化
    Init(rndSeed)
    {
        this.mBGCtrl.Init(10, 10);
        this.mParam.Init(rndSeed);
        for (var i=0; i<gGame.NEXT_NUM; ++i)
        {
            this._GenerateNextPuyo();
        }
        this._NextPuyo();
        this.mMoveState = this.eMoveState.Dropping;
        this.mInput.Init(this);
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
        // 入力を更新
        this.mInput.Update();
        // @TODO MoveState毎の処理に変更する
        switch (this.mMoveState)
        {
            case this.eMoveState.None: break;

            // ぷよが落ちてくるステート
            case this.eMoveState.Dropping: this._UpatePuyo(dt); break;
            // ぷよが消えた後の、上にあるぷよを落とす処理
            case this.eMoveState.Fall: this._UpdateFallPuyo(dt); break;
            // ぷよが落ち切った後の消えるチェック
            case this.eMoveState.Check: this._CheckDestroyPuyo(); break;
            // ぷよが消えた場合の消えた演出＆スコア加算
            case this.eMoveState.DestroyAnim: this._UpdateDestroyPuyo(dt); break;
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

        this._DrawPuyo();

        this.mBGCtrl.DrawFrame();
        this.mBGCtrl.DrawScore(this.mParam.mScore);
        
        gGame.mMainCanvas.strokeRect(this.mInput.mPosX, this.mInput.mPosY, 4, 4);
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
        // Input処理
        var isRot = this.mInput.mIsTouchEnd && this.mInput.mIsRotate;
        var touchPosX = this.PuyoPos2Grid_X(this.mInput.mPosX);
        var isLeft = this.mInput.mIsTouch && this.mParam.mPuyoX > touchPosX;
        var isRight = this.mInput.mIsTouch && this.mParam.mPuyoX < touchPosX;

        if (isRot)
        {
            if (this.mParam.mPuyoRotateState == this.mParam.ePuyoRotateState.None)
            {
                if (this._ValidateRotation(1,1))
                {
                    this._RotatePuyo(1, 1);
                }
                else if (this._ValidateRotation(1,2))
                {
                    this._RotatePuyo(1, 2);
                }
            }
        }
        if (isLeft)
        {
            this._PuyoMoveLeft();
        }
        if (isRight)
        {
            this._PuyoMoveRight();
        }
        
        // 回転更新
        switch (this.mParam.mPuyoRotateState)
        {
            case this.mParam.ePuyoRotateState.Left: this._UpdatePuyoState_RotateLeft(dt); break;
            case this.mParam.ePuyoRotateState.Right: this._UpdatePuyoState_RotateRight(dt); break;
        }
        // 移動更新
        switch (this.mParam.mPuyoMoveState)
        {
            case this.mParam.ePuyoMoveState.Left: this._UpdatePuyoState_MoveLeft(dt); break;
            case this.mParam.ePuyoMoveState.Right: this._UpdatePuyoState_MoveRight(dt); break;
            case this.mParam.ePuyoMoveState.Up: this._UpdatePuyoState_MoveUp(dt); break;
        }

        // 落下更新
        this._UpdatePuyoState_Fall(dt);
    }

    //--------------------------------------
    // ぷよ　上に移動
    _PuyoMoveUp()
    {
        if (this.mParam.mPuyoMoveState != this.mParam.ePuyoMoveState.None) return;
        console.trace("Move up");
        var isJustPosition = (this.mParam.mActualPuyoY - (this.mParam.mPuyoY * gGame.mPuyoImgSize)) < 0.01;
        if (isJustPosition)
        {
            this.mParam.mPuyoY--;
        }
        this.mParam.mActualPuyoY = this.mParam.mPuyoY * gGame.mPuyoImgSize;
        this.mParam.mPuyoMoveState = this.mParam.ePuyoMoveState.Up;
        this.mParam.mPuyoMoveAnimSec = this.mParam.MOVE_ANIM_SEC;
    }

    //--------------------------------------
    // ぷよ　左に移動
    _PuyoMoveLeft()
    {
        if (this.mParam.mPuyoMoveState != this.mParam.ePuyoMoveState.None) return;
        // 移動先
        var newX1 = this.mParam.mPuyoX-1;
        var newY1 = this.mParam.mPuyoY;
        if (newX1 < 0 || newX1 >= gGame.PUYO_X_MAX) return;
        if (newY1 < 0 || newY1 >= gGame.PUYO_Y_MAX) return;
        var newX2 = this._GetAnotherPuyoX(this.mParam.mPuyoDir, newX1);
        var newY2 = this._GetAnotherPuyoY(this.mParam.mPuyoDir, newY1);
        if (newX2 < 0 || newX2 >= gGame.PUYO_X_MAX) return;
        if (newY2 < 0 || newY2 >= gGame.PUYO_Y_MAX) return;
        var newMap1 = GetMapIndex(newX1, newY1);
        var newMap2 = GetMapIndex(newX2, newY2);
        if (this.mParam.mMap[newMap1] == 0 && this.mParam.mMap[newMap2] == 0)
        {
            this.mParam.mPuyoX--;
            this.mParam.mPuyoMoveState = this.mParam.ePuyoMoveState.Left;
            this.mParam.mPuyoMoveAnimSec = this.mParam.MOVE_ANIM_SEC;
        }
    }

    //--------------------------------------
    // ぷよ　右に移動
    _PuyoMoveRight()
    {
        if (this.mParam.mPuyoMoveState != this.mParam.ePuyoMoveState.None) return;
        // 移動先
        var newX1 = this.mParam.mPuyoX+1;
        var newY1 = this.mParam.mPuyoY;
        if (newX1 < 0 || newX1 >= gGame.PUYO_X_MAX) return;
        if (newY1 < 0 || newY1 >= gGame.PUYO_Y_MAX) return;
        var newX2 = this._GetAnotherPuyoX(this.mParam.mPuyoDir, newX1);
        var newY2 = this._GetAnotherPuyoY(this.mParam.mPuyoDir, newY1);
        if (newX2 < 0 || newX2 >= gGame.PUYO_X_MAX) return;
        if (newY2 < 0 || newY2 >= gGame.PUYO_Y_MAX) return;
        var newMap1 = GetMapIndex(newX1, newY1);
        var newMap2 = GetMapIndex(newX2, newY2);
        if (this.mParam.mMap[newMap1] == 0 && this.mParam.mMap[newMap2] == 0)
        {
            this.mParam.mPuyoX++;
            this.mParam.mPuyoMoveState = this.mParam.ePuyoMoveState.Right;
            this.mParam.mPuyoMoveAnimSec = this.mParam.MOVE_ANIM_SEC;
        }
    }

    _GetAnotherPuyoX(state,pos)
    {
        switch (state)
        {
            case this.mParam.ePuyoDir.Up: return pos;
            case this.mParam.ePuyoDir.Down: return pos;
            case this.mParam.ePuyoDir.Right: return pos + 1;
            case this.mParam.ePuyoDir.Left: return pos - 1;
        }
    }
    _GetAnotherPuyoY(state,pos)
    {
        switch (state)
        {
            case this.mParam.ePuyoDir.Up: return pos - 1;
            case this.mParam.ePuyoDir.Down: return pos + 1;
            case this.mParam.ePuyoDir.Right: return pos;
            case this.mParam.ePuyoDir.Left: return pos;
        }
    }

    //--------------------------------------
    // ぷよ　回転できるかチェック
    // rotDir -1=左、1=右
    _ValidateRotation(rotDir, rotNum)
    {
        // 回転後の回転ステート
        var rotState = (this.mParam.mPuyoDir + (rotDir * rotNum) + (this.mParam.ePuyoDir.MAX * rotNum)) % this.mParam.ePuyoDir.MAX;
        switch (rotState)
        {
            case this.mParam.ePuyoDir.Up:
            case this.mParam.ePuyoDir.Down:
                return true;
            case this.mParam.ePuyoDir.Right:
                {
                    var x = this.mParam.mPuyoX + 1;
                    var map2 = GetMapIndex(x, this.mParam.mPuyoY);
                    if (x < gGame.PUYO_X_MAX || this.mParam.mMap[map2] != 0)
                    {
                        x = x - 1;
                    }
                    var map1 = GetMapIndex(x - 1, this.mParam.mPuyoY);
                    return this.mParam.mMap[map1] == 0;
                }
            case this.mParam.ePuyoDir.Left:
                {
                    var x = this.mParam.mPuyoX - 1;
                    var map2 = GetMapIndex(x, this.mParam.mPuyoY);
                    if (x > 0 || this.mParam.mMap[map2] != 0)
                    {
                        x = x + 1;
                    }
                    var map1 = GetMapIndex(x + 1, this.mParam.mPuyoY);
                    return this.mParam.mMap[map1] == 0;
                }
        }
        return true;
    }

    //--------------------------------------
    // ぷよ回転
    _RotatePuyo(rotDir, rotNum)
    {
        switch (rotDir)
        {
            case -1: // LEFT
                this._RotateLeftPuyo(rotNum);
                break;
            case 1: // RIGHT
                this._RotateRightPuyo(rotNum);
                break;
        }
        this.mParam.mPuyoRotAnimSec = this.mParam.ROTATE_ANIM_SEC;
        this._CollectRotation();
    }

    //--------------------------------------
    // ぷよ　左回転
    _RotateLeftPuyo(rotNum)
    {
        for (var i=0; i<rotNum; ++i)
        {
            this.mParam.mPuyoDir = (this.mParam.mPuyoDir - 1) + this.mParam.ePuyoDir.MAX;
            this.mParam.mPuyoDir = this.mParam.mPuyoDir % this.mParam.ePuyoDir.MAX;
            this.mParam.mPuyoRotateState = this.mParam.ePuyoRotateState.Left;
        }
    }

    //--------------------------------------
    // ぷよ　右回転
    _RotateRightPuyo(rotNum)
    {
        for (var i=0; i<rotNum; ++i)
        {
            this.mParam.mPuyoDir++;
            this.mParam.mPuyoDir = this.mParam.mPuyoDir % this.mParam.ePuyoDir.MAX;
            this.mParam.mPuyoRotateState = this.mParam.ePuyoRotateState.Right;
        }
    }

    //--------------------------------------
    // ぷよ　回転後にはみ出てたらずらす
    _CollectRotation()
    {
        switch (this.mParam.mPuyoDir)
        {
            case this.mParam.ePuyoDir.Up:
                return;
        
            case this.mParam.ePuyoDir.Down:
                {
                    var map = GetMapIndex(this.mParam.mPuyoX, this.mParam.mPuyoY + 1);
                    if ((this.mParam.mPuyoY + 1) >= (gGame.PUYO_Y_MAX - 1) || this.mParam.mMap[map] != 0)
                    {
                        this._PuyoMoveUp();
                    }
                    return;
                }

            case this.mParam.ePuyoDir.Left:
                {
                    var map = GetMapIndex(this.mParam.mPuyoX - 1, this.mParam.mPuyoY);
                    if ((this.mParam.mPuyoX - 1) < 0 || this.mParam.mMap[map] != 0)
                    {
                        this._PuyoMoveRight();
                    }
                    return;
                }

            case this.mParam.ePuyoDir.Right:
                {
                    var map = GetMapIndex(this.mParam.mPuyoX + 1, this.mParam.mPuyoY);
                    if ((this.mParam.mPuyoX + 1) >= gGame.PUYO_X_MAX || this.mParam.mMap[map] != 0)
                    {
                        this._PuyoMoveLeft();
                    }
                    return;
                }
        }
    }

    //--------------------------------------
    // ぷよステート更新 Fall
    _UpdatePuyoState_Fall(dt)
    {
        var speed = this.mParam.mSpeed * dt;
        
        // 下に何かがあるかどうか
        if (this._CanFallDown(speed))
        {
            // 下がる処理
            this._PuyoDown(speed)
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
                // ぷよを固定する
                var puyo1 = parseInt(this.mParam.mCurrentPuyo / 10);
                var x1 = this.mParam.mPuyoX;
                var y1 = this.mParam.mPuyoY;
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
                this.mMoveState = this.eMoveState.Fall;
                // 落ちるぷよを取得する
                this._CorrectFallPuyo();
            }
        }
    }

    //--------------------------------------
    // ぷよ 落下
    _PuyoDown(downValue)
    {
        this.mParam.mActualPuyoY += downValue;
        if (this.mParam.mActualPuyoY > (gGame.PUYO_Y_MAX - 1) * gGame.mPuyoImgSize)
        {
            this.mParam.mActualPuyoY = (gGame.PUYO_Y_MAX - 1) * gGame.mPuyoImgSize;
        }
        this.mParam.mPuyoY = parseInt(this.mParam.mActualPuyoY / gGame.mPuyoImgSize);
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
    // ぷよステート更新 MoveUp
    _UpdatePuyoState_MoveUp(dt)
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
            this.mParam.mPuyoRotateState = this.mParam.ePuyoRotateState.None;
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
            this.mParam.mPuyoRotateState = this.mParam.ePuyoRotateState.None;
        }
    }

    //--------------------------------------
    // 現在のぷよが下がれるかどうか
    _CanFallDown(speed)
    {
        var next_pos = this.mParam.mActualPuyoY;
        // 下向きの場合
        if (this.mParam.mPuyoDir == this.mParam.ePuyoDir.Down)
        {
            next_pos = this.mParam.mActualPuyoY + gGame.mPuyoImgSize;
        }
        // 次進んだらアウト
        var isJustY = next_pos >= (gGame.PUYO_Y_MAX - 1) * gGame.mPuyoImgSize;
        if (isJustY) return false; // ピッタリじゃないときは下に下がれる 

        var grid_x1 = this.mParam.mPuyoX;
        var grid_y1 = this.mParam.mPuyoY;
        var grid_x2 = this._GetAnotherPuyoX(this.mParam.mPuyoDir, grid_x1);
        var grid_y2 = this._GetAnotherPuyoY(this.mParam.mPuyoDir, grid_y1);
        var map1 = GetMapIndex(grid_x1, grid_y1+1);
        var map2 = GetMapIndex(grid_x2, grid_y2+1);
        
        // 下にすでにぷよが存在する
        var isExistBottom = this.mParam.mMap[map1] != 0 || this.mParam.mMap[map2] != 0;
        if (isExistBottom)
        {
            return false;
        }
        return true;
    }
    //--------------------------------------
    // 空中にあるぷよを落とす処理
    _UpdateFallPuyo(dt)
    {
        var isFinished = true;
        if (this.mParam.mFallComplete.length > 0)
        {
            // Fall Puyo 変数たち
            // this.mParam.mFallComplete
            // this.mParam.mFallPuyoId
            // this.mParam.mFallPuyopPosX
            // this.mParam.mFallPuyopActualPosY
            // 下に何もないぷよを収集
            for (var i = 0; i < this.mParam.mFallComplete.length; i++)
            {
                if (this.mParam.mFallComplete[i])
                {
                    continue;
                }
                isFinished = false;
                if (this._CanFallDownUnitPuyo(this.mParam.mFallPuyopPosX[i], this.mParam.mFallPuyopActualPosY[i]))
                {
                    // ぷよを落下させる
                    var speed = this.mParam.mFallingSpeed * dt;
                    this.mParam.mFallPuyopActualPosY[i] += speed;
                    if (this.mParam.mFallPuyopActualPosY[i] > (gGame.PUYO_Y_MAX - 1) * gGame.mPuyoImgSize)
                    {
                        this.mParam.mFallPuyopActualPosY[i] = (gGame.PUYO_Y_MAX - 1) * gGame.mPuyoImgSize;
                    }
                
                }
                else
                {
                    this.mParam.mFallComplete[i] = true;
                }
            }
        }
        // 次のステートへ進む
        if (isFinished)
        {
            // 落ちたところのマップにidを刻みなおす
            for (var i = 0; i < this.mParam.mFallComplete.length; i++)
            {
                var x = this.mParam.mFallPuyopPosX[i];
                var y = this.PuyoGrid2Pos_Y(this.mParam.mFallPuyopActualPosY[i]);
                var mapId = GetMapIndex(x,y);
                var id = this.mParam.mFallPuyoId[i];
                this.mParam.mMap[mapId] = id;
            }
            //次のステートに進む
            this.mMoveState = this.eMoveState.Check;
        }
    }
    //--------------------------------------
    // 現在のぷよが下がれるかどうか単体
    _CanFallDownUnitPuyo(x, actualY)
    {
        var next_pos = actualY;
        // 次進んだらアウト
        var isJustY = next_pos >= (gGame.PUYO_Y_MAX - 1) * gGame.mPuyoImgSize;
        if (isJustY == false) return true; // ピッタリじゃないときは下に下がれる 

        var grid_x = x;
        var grid_y = this.PuyoPos2Grid_Y(actualY);
        var map = GetMapIndex(grid_x, grid_y+1);
        
        // 下にすでにぷよが存在する
        var isExistBottom = this.mParam.mMap[map] != 0;
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
    // 落ちるぷよを取得
    _CorrectFallPuyo()
    {
        // 一回クリアする
        this.mParam.mFallComplete = [];
        this.mParam.mFallPuyoId = [];
        this.mParam.mFallPuyopPosX = [];
        this.mParam.mFallPuyopActualPosY = [];
        // 下に何もないぷよを収集
        for (var i = gGame.PUYO_Y_MAX * gGame.PUYO_X_MAX; i >= 0; --i)
        {
            // 下のぷよのID
            var bottomIndex = i + gGame.PUYO_X_MAX;
            if (this.mParam.mMap[i] != 0 && this.mParam.mMap[bottomIndex] == 0)
            {
                var x = GetPosX(i);
                var y = GetPosY(i);
                if (y >= gGame.PUYO_Y_MAX) continue;
                this.mParam.mFallComplete.push(false);
                this.mParam.mFallPuyoId.push(this.mParam.mMap[i]);
                this.mParam.mFallPuyopPosX.push(x);
                this.mParam.mFallPuyopActualPosY.push(y * gGame.mPuyoImgSize);
                this.mParam.mMap[i] = 0;
            }
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

        switch (this.mMoveState)
        {
            case this.eMoveState.None:
                break;

            case this.eMoveState.Dropping:
                this._DrawPuyoDropping();
                break;
            case this.eMoveState.Fall:
                this._DrawPuyoFall();
                break;
            case this.eMoveState.Check:
                this._DrawPuyoCheck();
                break;
            case this.eMoveState.DestroyAnim:
                this._DrawPuyoDestroyAnim();
                break;
            case this.eMoveState.NextInterval:
                this._DrawPuyoNextInterval();
                break;
            case this.eMoveState.NextPuyo:
                this._DrawPuyoNextPuyo();
                break;  
        }
    }
    
    //--------------------------------------
    // ぷよ 落下中の描画
    _DrawPuyoDropping()
    {
        var puyo1 = parseInt(this.mParam.mCurrentPuyo / 10);
        var puyo2 = parseInt(this.mParam.mCurrentPuyo % 10);

        // 予測を表示
        var proj1X = this.mParam.mPuyoX;
        var proj1Y = this.mParam.mPuyoY;
        proj1Y = this._GetDoroppedPosition(proj1X, proj1Y);
        if (this.mParam.mPuyoDir == this.mParam.ePuyoDir.Down)
        {
            proj1Y = proj1Y - 1;
        }
        var proj1ActualX = this.PuyoGrid2Pos_X(proj1X);
        var proj1ActualY = this.PuyoGrid2Pos_Y(proj1Y);
        this.mBGCtrl.DrawPuyoProjection(puyo1, proj1ActualX, proj1ActualY);

        var proj2X = this._GetAnotherPuyoX(this.mParam.mPuyoDir, this.mParam.mPuyoX);
        var proj2Y = this._GetAnotherPuyoY(this.mParam.mPuyoDir, this.mParam.mPuyoY);
        proj2Y = this._GetDoroppedPosition(proj2X, proj2Y);
        if (this.mParam.mPuyoDir == this.mParam.ePuyoDir.Up)
        {
            proj2Y = proj2Y - 1;
        }
        var proj2ActualX = this.PuyoGrid2Pos_X(proj2X);
        var proj2ActualY = this.PuyoGrid2Pos_Y(proj2Y);
        this.mBGCtrl.DrawPuyoProjection(puyo2, proj2ActualX, proj2ActualY);


        // 現在落ちているぷよを表示(支点)
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

        this.mBGCtrl.DrawPuyoUnit(puyo1, actualX, this.mParam.mActualPuyoY);
        this.mBGCtrl.DrawPuyoUnit(puyo2, actualX+vec_x, this.mParam.mActualPuyoY + vec_y);
    }

    //--------------------------------------
    // ぷよ 操作できない落下中の描画
    _DrawPuyoFall()
    {
    }

    //--------------------------------------
    // ぷよ 操作できない落下中の描画
    _DrawPuyoCheck()
    {
    }

    //--------------------------------------
    // ぷよ 操作できない落下中の描画
    _DrawPuyoDestroyAnim()
    {

    }

    //--------------------------------------
    // ぷよ 操作できない落下中の描画
    _DrawPuyoNextInterval()
    {

    }

    //--------------------------------------
    // ぷよ 操作できない落下中の描画
    _DrawPuyoNextPuyo()
    {

    }

    //--------------------------------------
    // 落下した場合の最下端の位置を取得
    _GetDoroppedPosition(cur_x, cur_y)
    {
        for (var y = cur_y; y<gGame.PUYO_Y_MAX; y++)
        {
            var index = GetMapIndex(cur_x, y+1);
            if (this.mParam.mMap[index] != 0)
            {
                return y;
            }
        }
        return gGame.PUYO_Y_MAX;
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
        var touchPosX = this.PuyoPos2Grid_X(this.mInput.mPosX);
        var isLeft = this.mInput.mIsTouch && this.mParam.mPuyoX > touchPosX;
        var isRight = this.mInput.mIsTouch && this.mParam.mPuyoX < touchPosX;

        var str = "Puyo Position : (" + this.mParam.mPuyoX + ", " + this.mParam.mPuyoY + ")\r\n";
        str += "Puyo ActualY : (" + this.mParam.mActualPuyoY + ")\r\n";
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
        str += "Current Puyo Rotate State : " + this.mParam.mPuyoRotateState + "\r\n";
        str += "Current Puyo Move   State : " + this.mParam.mPuyoMoveState + "\r\n";
        str += "Current Puyo Move   Anim Sec : " + this.mParam.mPuyoMoveAnimSec + "\r\n";
        str += "Is Puyo Move Left Request : " + isLeft + "\r\n";
        str += "Is Puyo Move Right Request : " + isRight + "\r\n";
        str += "Current : " + this.mParam.mCurrentPuyo + "\r\n";
        for (var i=0; i<gGame.NEXT_NUM; i++)
        {
            str += "Next"+i+" : " + this.mParam.mNextPuyo[i] + "\r\n";
        }
        gGame.mDebugBlock.innerText = str;
    }
}