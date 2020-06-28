// プレイヤー毎のパラメータ
class GameParam
{
    constructor()
    {
        this.ePuyoState = 
        {
            None            : 0,
            Fall            : 1,
            Move            : 2,
        }
        this.ePuyoDir = 
        {
            Up : 0, // 支点が下
            Right : 1, // 支点が左
            Down : 2, // 支点が上
            Left : 3, // 支点が右
            MAX : 4,
        }
        this.PUYO_FALL_COUNT = 30;
        this.mRand = new Random();
        this.mMap = new Array();
        this.mScore = 0;
        this.mSpeed = 5;
        this.mNextPuyo = new Array();
        this.mCurrentPuyo = 0;
        this.mPuyoY = 0;
        this.mPuyoX = 0;
        this.PUYO_INIT_POS_X = 0;
        this.PUYO_INIT_POS_Y = 0;
        this.mPuyoFallCount = 0;
        this.mPuyoState = this.ePuyoState.None;
        this.mPuyoDir = this.ePuyoDir.Up;
        this.ROTATE_ANIM_SEC = 0.3;
        this.MOVE_ANIM_SEC = 0.1;
    }

    Init(rndSeed)
    {
        this.PUYO_INIT_POS_X = gGame.mPuyoImgSize * 2;
        this.PUYO_INIT_POS_Y = 0;
        for (var y=0; y<gGame.PUYO_Y_MAX; ++y)
        {
            for (var x=0; x<gGame.PUYO_X_MAX; ++x)
            {
                var index = GetMapIndex(x, y);
                this.mMap[index] = index % 5 + 1;
            }
        }
        this.mRand.Init(rndSeed);
    }
}