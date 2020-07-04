///==================================================
/// <summary>
/// 背景コントロール
/// </summary>
///==================================================
class Background
{
    constructor()
    {
        // 変数定義
        this._mBGLeft = 0;
        this._mBGRight = 0;
        this._mBGTop = 0;
        this._mBGBottom = 0;
        this._mLineWidth = 5;
        this._mBGImgOffset_X = 0;
        this._mBGImgOffset_Y = 0;
        this._mScoreOffset_X = 0;
        this._mScoreOffset_Y = 0;
        this._mFooterHeight = 35;
        this._mScoreImgSizeX = 53 / 2;
        this._mScoreImgSizeY = 67 / 2;
        this._mScoreLength = 9;
    }

    Init(offset_x, offset_y)
    {
        // gGameが読み込めてないので、こっちで計算する
        this._mBGLeft = offset_x;
        this._mBGRight = this._mBGLeft + gGame.PUYO_X_MAX * gGame.mPuyoImgSize;
        this._mBGTop = offset_y;
        this._mBGBottom = this._mBGTop + (gGame.PUYO_Y_MAX - 1) * gGame.mPuyoImgSize;
        this._mBGImgOffset_X = 0;
        this._mBGImgOffset_Y = 100;
        this._mScoreOffset_X = 0;
        this._mScoreOffset_Y = (gGame.PUYO_Y_MAX - 1) * gGame.mPuyoImgSize;
    }

    // 背景全消去
    Clear()
    {
        if (gGame.mMainCanvas == null) return;

        // 描画モードを戻す
        gGame.mMainCanvas.globalCompositeOperation = "source-over";

        // 画面クリア
        gGame.mMainCanvas.clearRect(this._mBGLeft, this._mBGTop, this._mBGRight - this._mBGLeft, this._mBGBottom - this._mBGTop + this._mFooterHeight);
    }

    // 背景を構築
    DrawBG()
    {
        if (gGame.mMainCanvas == null) return;

        var width = this._mBGRight - this._mBGLeft;
        var height = this._mBGBottom - this._mBGTop;
        var x = this._mBGLeft;
        var y = this._mBGTop;
        // 背景画像を描く
        gGame.mMainCanvas.drawImage(gImgResHolder.mBGImg,
             0, 0, width, height,
             x + this._mBGImgOffset_X, y + this._mBGImgOffset_Y, width, height);
        // デバッグ用の線を描く
        this._DrawGrid();
    }

    // 背景の枠線を書く
    DrawFrame()
    {
        var width = this._mBGRight - this._mBGLeft;
        var height = this._mBGBottom - this._mBGTop;
        var x = this._mBGLeft;
        var y = this._mBGTop;

        // ゲーム内の枠線を書く
        var ofs = this._mLineWidth / 2.0;
        gGame.mMainCanvas.strokeStyle = "gray"
        gGame.mMainCanvas.lineWidth = this._mLineWidth;
        gGame.mMainCanvas.strokeRect(x - ofs, y - ofs, width + this._mLineWidth, height + this._mLineWidth);
        // スコアの枠線を書く
        gGame.mMainCanvas.fillStyle = "gray"
        gGame.mMainCanvas.fillRect(x + this._mScoreOffset_X - this._mLineWidth, y + this._mScoreOffset_Y, width + this._mLineWidth + this._mLineWidth, this._mFooterHeight + this._mLineWidth + this._mLineWidth);
    }

    // マスクを駆ける
    MascDraw()
    {
        var width = this._mBGRight - this._mBGLeft + this._mLineWidth + this._mLineWidth;
        var height = this._mBGBottom - this._mBGTop + this._mLineWidth + this._mLineWidth + this._mFooterHeight + this._mLineWidth;
        var x = this._mBGLeft - this._mLineWidth;
        var y = this._mBGTop - this._mLineWidth;

        gGame.mMainCanvas.globalCompositeOperation = "destination-in";
        gGame.mMainCanvas.fillRect(x, y, width, height);
    }

    // スコアをセット
    DrawScore(score)
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
    // スコアの画像を貼り付け
    _SetScoreImg(index, number)
    {
        var ofs = 10;
        var x = this._mBGRight - ((index+1) * this._mScoreImgSizeX) - ofs;
        var img = null;
        switch (number)
        {
            case 0: img = gImgResHolder.mScoreImg_0; break;
            case 1: img = gImgResHolder.mScoreImg_1; break;
            case 2: img = gImgResHolder.mScoreImg_2; break;
            case 3: img = gImgResHolder.mScoreImg_3; break;
            case 4: img = gImgResHolder.mScoreImg_4; break;
            case 5: img = gImgResHolder.mScoreImg_5; break;
            case 6: img = gImgResHolder.mScoreImg_6; break;
            case 7: img = gImgResHolder.mScoreImg_7; break;
            case 8: img = gImgResHolder.mScoreImg_8; break;
            case 9: img = gImgResHolder.mScoreImg_9; break;
        }
        if (img != null)
        {
            gGame.mMainCanvas.drawImage(img, 0, 0, 53, 67, x + this._mLineWidth, this._mBGBottom + this._mLineWidth, this._mScoreImgSizeX, this._mScoreImgSizeY);
        }
    }

    //--------------------------------------
    // ぷよ単体描画
    DrawPuyoUnit(kind, x, y)
    {
        x = x + this._mBGLeft;
        y = y + this._mBGTop - gGame.mPuyoImgSize; // ぷよの描画だけは、右下が0,0にする
        var w = gGame.mPuyoImgSize;
        var h = gGame.mPuyoImgSize;
        var sx = 0;
        var sy = 0;
        var sw = 620;
        var sh = 620;
        var img = null;
        if (kind > 0 && kind <= gGame.PUYO_KIND_NUM)
        {
            img = gImgResHolder.mPuyoImgList[kind - 1];
        }
        if (img != null)
        {
            gGame.mMainCanvas.drawImage(img, sx, sy, sw, sh, x, y, w, h);
        }
    }
    //--------------------------------------
    // ぷよ予測位置描画
    DrawPuyoProjection(kind, x, y)
    {
        x = x + this._mBGLeft;
        y = y + this._mBGTop - gGame.mPuyoImgSize; // ぷよの描画だけは、右下が0,0にする
        var w = gGame.mPuyoImgSize;
        var h = gGame.mPuyoImgSize;
        var sx = 0;
        var sy = 0;
        var sw = 620;
        var sh = 620;
        var img = null;
        if (kind > 0 && kind <= gGame.PUYO_KIND_NUM)
        {
            img = gImgResHolder.mImgProjList[kind - 1];
        }
        if (img != null)
        {
            gGame.mMainCanvas.drawImage(img, sx, sy, sw, sh, x, y, w, h);
        }
    }

    // デバッグ用グリッド表示
    _DrawGrid()
    {
        if (gGame.mMainCanvas == null) return;

        var unit = gGame.mPuyoImgSize;
        gGame.mMainCanvas.beginPath();
        gGame.mMainCanvas.strokeStyle = "lightgray"
        gGame.mMainCanvas.lineWidth = 1;
        for (var x=1; x<gGame.PUYO_X_MAX; ++x)
        {
            gGame.mMainCanvas.moveTo(this._mBGLeft + x * unit, this._mBGTop);
            gGame.mMainCanvas.lineTo(this._mBGLeft + x * unit, this._mBGBottom);
        }
        for (var y=1; y<(gGame.PUYO_Y_MAX - 1); ++y)
        {
            gGame.mMainCanvas.moveTo(this._mBGLeft, this._mBGTop + y * unit);
            gGame.mMainCanvas.lineTo(this._mBGRight, this._mBGTop + y * unit);
        }
        gGame.mMainCanvas.stroke();
    }
}