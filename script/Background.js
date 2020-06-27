///==================================================
/// <summary>
/// 背景コントロール
/// </summary>
///==================================================
class Background
{
    // 変数定義
    _mIsLoadList;
    _mBGLeft;
    _mBGRight;
    _mBGTop;
    _mBGBottom;
    _mBGImgOffset_X;
    _mBGImgOffset_Y;
    _mScoreOffset_X;
    _mScoreOffset_Y;
    _mFooterHeight;              // フッタの高さ
    _mScoreImgSizeX;             // スコア画像のサイズ
    _mScoreImgSizeY;             // スコア画像のサイズ
    _mScoreLength;               // スコアの表示桁数

    // 画像
    _mBGImg;
    _mScoreImg_0;
    _mScoreImg_1;
    _mScoreImg_2;
    _mScoreImg_3;
    _mScoreImg_4;
    _mScoreImg_5;
    _mScoreImg_6;
    _mScoreImg_7;
    _mScoreImg_8;
    _mScoreImg_9;

    Init()
    {
        // ロード完了フラグ
        this._mIsLoadList = new Array();
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
        // 画像読み込み
        this._mBGImg = this._LoadImage(this._mBGImg, "./resource/img/puyo_1bg.png");
        this._mScoreImg_0 = this._LoadImage(this._mScoreImg_0, "./resource/img/0.png");
        this._mScoreImg_1 = this._LoadImage(this._mScoreImg_1, "./resource/img/1.png");
        this._mScoreImg_2 = this._LoadImage(this._mScoreImg_2, "./resource/img/2.png");
        this._mScoreImg_3 = this._LoadImage(this._mScoreImg_3, "./resource/img/3.png");
        this._mScoreImg_4 = this._LoadImage(this._mScoreImg_4, "./resource/img/4.png");
        this._mScoreImg_5 = this._LoadImage(this._mScoreImg_5, "./resource/img/5.png");
        this._mScoreImg_6 = this._LoadImage(this._mScoreImg_6, "./resource/img/6.png");
        this._mScoreImg_7 = this._LoadImage(this._mScoreImg_7, "./resource/img/7.png");
        this._mScoreImg_8 = this._LoadImage(this._mScoreImg_8, "./resource/img/8.png");
        this._mScoreImg_9 = this._LoadImage(this._mScoreImg_9, "./resource/img/9.png");
    }

    // 背景を構築
    UpdateBackground()
    {
        if (gGame.mMainCanvas == null) return;
        // 画面クリア
        gGame.mMainCanvas.clearRect(this._mBGLeft, this._mBGTop, this._mBGRight - this._mBGLeft, this._mBGBottom - this._mBGTop + this._mFooterHeight);

        // 背景画像を描く
        gGame.mMainCanvas.drawImage(this._mBGImg, this._mBGImgOffset_X, this._mBGImgOffset_Y);
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
            case 0: img = this._mScoreImg_0; break;
            case 1: img = this._mScoreImg_1; break;
            case 2: img = this._mScoreImg_2; break;
            case 3: img = this._mScoreImg_3; break;
            case 4: img = this._mScoreImg_4; break;
            case 5: img = this._mScoreImg_5; break;
            case 6: img = this._mScoreImg_6; break;
            case 7: img = this._mScoreImg_7; break;
            case 8: img = this._mScoreImg_8; break;
            case 9: img = this._mScoreImg_9; break;
        }
        if (img != null)
        {
            gGame.mMainCanvas.drawImage(img, 0, 0, 53, 67, x, this._mBGBottom, this._mScoreImgSizeX, this._mScoreImgSizeY);
        }
    }



    // 画像読み込み
    _LoadImage(imgRef, path)
    {
        var id = this._mIsLoadList.length;
        this._mIsLoadList[id] = false

        imgRef = new Image();
        imgRef.src = path
        imgRef.onload = () => 
        {
            this._CompleteLoadImage(id)
        }
        return imgRef;
    }

    // 読み込み完了コールバック
    _CompleteLoadImage(index)
    {
        this._mIsLoadList[index] = true;
    }

    // すべての画像の読み込みが完了しているかどうか
    IsCompleteLoadAllImages()
    {
        var isAllLoaded = true;
        for (var i=0; i<this._mIsLoadList.length; i++)
        {
            if (this._mIsLoadList[i] == false) 
            {
                isAllLoaded = false;
                break;
            }
        }
        return isAllLoaded;
    }
}