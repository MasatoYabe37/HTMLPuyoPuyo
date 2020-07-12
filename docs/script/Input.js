class PlayerInput
{
    constructor()
    {
        this.DETECT_ROT_LENGTH = 50;
        this.mIsTouch = false;
        this.mPosX = 0;
        this.mPosY = 0;
        this.mTouchStartPosX = 0;
        this.mTouchStartPosY = 0;
        this.mIsTouchStart = false;
        this.mIsTouchEnd = false;
        this.mIsRotate = false;
    }

    Init(player)
    {
        this.mPlayer = player;
    }

    Update()
    {
        this.mIsTouchStart = false;
        this.mIsTouchEnd = false;

        if (this.mIsTouch)
        {
            // タッチが離れたかチェック
            if (Input.mIsTouched == false || this._InnerPlayerArae() == false)
            {
                this._TouchEnd();
                return 
            }
            this._Touching();
        }
        else
        {
            // タッチされたかチェック
            if (Input.mIsTouched && this._InnerPlayerArae() == true)
            {
                this._TouchStart();
            }
        }
        this.DebugDraw();
    }

    _ConvTouchPosX(pos)
    {
        return (pos - gGame.mMainCanvasElement.getBoundingClientRect().left) / gGame.mCanvasScale;
    }
    _ConvTouchPosY(pos)
    {
        return (pos - gGame.mMainCanvasElement.getBoundingClientRect().top) / gGame.mCanvasScale;
    }

    _InnerPlayerArae()
    {
        var x = this._ConvTouchPosX(Input.mTouchPosX);
        var y = this._ConvTouchPosY(Input.mTouchPosY);
        var X_OVER = x >= this.mPlayer.mBGCtrl._mBGLeft;
        var X_UNDER = x <= this.mPlayer.mBGCtrl._mBGRight;
        var Y_OVER = y >= this.mPlayer.mBGCtrl._mBGTop;
        var Y_UNDER = y <= this.mPlayer.mBGCtrl._mBGBottom;
        return X_OVER && X_UNDER && Y_OVER && Y_UNDER;
    }

    _TouchStart()
    {
        this.mIsTouchStart = true;
        this.mIsTouch = true;
        this.mTouchStartPosX = (this._ConvTouchPosX(Input.mTouchPosX) - this.mPlayer.mBGCtrl._mBGLeft);
        this.mTouchStartPosY = (this._ConvTouchPosY(Input.mTouchPosY) - this.mPlayer.mBGCtrl._mBGTop);
        this.mPosX = this.mTouchStartPosX;
        this.mPosY = this.mTouchStartPosY;
        this.mIsRotate = false;
    }
    _Touching()
    {
        this.mPosX = this._ConvTouchPosX(Input.mTouchPosX) - this.mPlayer.mBGCtrl._mBGLeft;
        this.mPosY = this._ConvTouchPosY(Input.mTouchPosY) - this.mPlayer.mBGCtrl._mBGTop;
        this.mIsRotate = false;
    }
    _TouchEnd()
    {
        this.mIsTouch = false;
        this.mIsTouchEnd = true;
        
        var lenX = this.mTouchStartPosX - this.mPosX;
        var lenY = this.mTouchStartPosY - this.mPosY;
        var len = Math.sqrt(lenX * lenX + lenY * lenY);
        this.mIsRotate = len < this.DETECT_ROT_LENGTH;
    }

    DebugDraw()
    {
        var str = "";

        if (this.mIsTouch == false)
        {
            str += "Not click yet.\n";
            str += "TouchEnd : " + this.mIsTouchEnd + "\n";
        }
        else
        {
            var lenX = this.mTouchStartPosX - this.mPosX;
            var lenY = this.mTouchStartPosY - this.mPosY;
            var len = Math.sqrt(lenX * lenX + lenY * lenY);
            var isRotate = len < this.DETECT_ROT_LENGTH;

            str += "Clicking! : (" + this.mPosX + ", " + this.mPosY + ")\n";
            str += "InitPos : (" + this.mTouchStartPosX + ", " + this.mTouchStartPosY + ")\n";
            str += "LenX : " + lenX + "\n";
            str += "LenY : " + lenY + "\n";
            str += "Len : " + len.toFixed(2) + "\n";
            str += "Rotate : " + isRotate + "\n";
            str += "BG Left   : " + this.mPlayer.mBGCtrl._mBGLeft + "\n";
            str += "BG Right  : " + this.mPlayer.mBGCtrl._mBGRight + "\n";
            str += "BG Top    : " + this.mPlayer.mBGCtrl._mBGTop + "\n";
            str += "BG Bottom : " + this.mPlayer.mBGCtrl._mBGBottom + "\n";

            str += "TouchStart : " + this.mIsTouchStart + "\n";
        }

        var touchDiv = document.getElementById("click");
        touchDiv.innerText = str;
    }
}