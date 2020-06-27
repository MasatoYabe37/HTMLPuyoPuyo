///==================================================
/// <summary>
/// 背景コントロール
/// </summary>
///==================================================
class Background
{
    // 変数定義
    // _mBGLeft;
    // _mBGRight;
    // _mBGTop;
    // _mBGBottom;
    // _mBGImgOffset_X;
    // _mBGImgOffset_Y;
    // _mScoreOffset_X;
    // _mScoreOffset_Y;
    // _mFooterHeight;              // フッタの高さ
    // _mScoreImgSizeX;             // スコア画像のサイズ
    // _mScoreImgSizeY;             // スコア画像のサイズ
    // _mScoreLength;               // スコアの表示桁数


    constructor()
    {
        // 変数定義
        this._mBGLeft = 0;
        this._mBGRight = gGame.mPuyoXMax * gGame.mPuyoImgSize;
        this._mBGTop = 0;
        this._mBGBottom = gGame.mPuyoYMax * gGame.mPuyoImgSize;
        this._mBGImgOffset_X = 0;
        this._mBGImgOffset_Y = 100;
        this._mScoreOffset_X = 0;
        this._mScoreOffset_Y = gGame.mPuyoYMax * gGame.mPuyoImgSize;
        this._mFooterHeight = 35;
        this._mScoreImgSizeX = 53 / 2;
        this._mScoreImgSizeY = 67 / 2;
        this._mScoreLength = 9;
    
    }

    Init()
    {
    }

    // 背景を構築
    UpdateBackground()
    {
        if (gGame.mMainCanvas == null) return;
        // 画面クリア
        gGame.mMainCanvas.clearRect(this._mBGLeft, this._mBGTop, this._mBGRight - this._mBGLeft, this._mBGBottom - this._mBGTop + this._mFooterHeight);

        // 背景画像を描く
        gGame.mMainCanvas.drawImage(ImgResHolder.mBGImg, this._mBGImgOffset_X, this._mBGImgOffset_Y);
        // ゲーム内の枠線を書く
        gGame.mMainCanvas.strokeStyle = "gray"
        var width = this._mBGRight - this._mBGLeft;
        var height = this._mBGBottom - this._mBGTop
        gGame.mMainCanvas.strokeRect(this._mBGLeft, this._mBGTop, width, height);
        // スコアの枠線を書く
        gGame.mMainCanvas.fillStyle = "gray"
        gGame.mMainCanvas.fillRect(this._mScoreOffset_X, this._mScoreOffset_Y, width, this._mFooterHeight);
    }

    // スコアをセット
    SetScore(score)
    {
        var scoreStr = score.toFixed();
        if (this._mScoreLength < scoreStr.length)
        {
            for (var i=0; i<this._mScoreLength; i++)
            {
                this._SetScoreImg(i,9);
            }
            return;
        }
        for (var i=0; i<this._mScoreLength; i++)
        {
            var id = scoreStr.length - i;
            var numChar = 0;
            if (id >= 0)
            {
                var numChar = Number(scoreStr.charAt(id));
            }
            this._SetScoreImg(i, numChar);
        }
    }
    _SetScoreImg(index, number)
    {
        var x = this._mBGRight - (index * this._mScoreImgSizeX);
        var img = null;
        switch (number)
        {
            case 0: img = ImgResHolder.mScoreImg_0; break;
            case 1: img = ImgResHolder.mScoreImg_1; break;
            case 2: img = ImgResHolder.mScoreImg_2; break;
            case 3: img = ImgResHolder.mScoreImg_3; break;
            case 4: img = ImgResHolder.mScoreImg_4; break;
            case 5: img = ImgResHolder.mScoreImg_5; break;
            case 6: img = ImgResHolder.mScoreImg_6; break;
            case 7: img = ImgResHolder.mScoreImg_7; break;
            case 8: img = ImgResHolder.mScoreImg_8; break;
            case 9: img = ImgResHolder.mScoreImg_9; break;
        }
        if (img != null)
        {
            gGame.mMainCanvas.drawImage(img, 0, 0, 53, 67, x, this._mBGBottom, this._mScoreImgSizeX, this._mScoreImgSizeY);
        }
    }
}