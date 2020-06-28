// プレイヤー毎のパラメータ
class GameParam
{
    constructor()
    {
        this.ePuyoDir = 
        {
            Up : 0, // 支点が下
            Right : 1, // 支点が左
            Down : 2, // 支点が上
            Left : 3, // 支点が右
            MAX : 4,
        }
        this.ePuyoRotateState =
        {
            None : 0,
            Left : 1,
            Right : 2,
        }
        this.ePuyoMoveState = 
        {
            None : 0,
            Left : 1,
            Right : 2,
        }
        this.PUYO_FALL_COUNT = 30;
        this.mRand = new Random();
        this.mMap = new Array();
        this.mScore = 0;
        this.mSpeed = 20;
        this.mNextPuyo = new Array();
        this.mCurrentPuyo = 0;
        this.mPuyoY = 0; // y は 位置
        this.mPuyoX = 0; // x は グリッド
        this.PUYO_INIT_POS_X = 0;
        this.PUYO_INIT_POS_Y = 0;
        this.mPuyoFallCount = 0;
        this.mPuyoRotateState = this.ePuyoRotateState.None;
        this.mPuyoMoveState = this.ePuyoMoveState.None;
        this.mPuyoDir = this.ePuyoDir.Up;
        this.ROTATE_ANIM_SEC = 0.3;
        this.MOVE_ANIM_SEC = 0.1;
        this.mRotFallRate = 0.5;
        this.mPuyoRotAnimSec = 0;
        this.mPuyoMoveAnimSec = 0;
    }

    Init(rndSeed)
    {
        this.PUYO_INIT_POS_X = 2;
        this.PUYO_INIT_POS_Y = 0;
        for (var y=0; y<gGame.PUYO_Y_MAX; ++y)
        {
            for (var x=0; x<gGame.PUYO_X_MAX; ++x)
            {
                var index = GetMapIndex(x, y);
                this.mMap[index] = 0;// index % 5 + 1;
            }
        }
        this.mRand.Init(rndSeed);
    }
}