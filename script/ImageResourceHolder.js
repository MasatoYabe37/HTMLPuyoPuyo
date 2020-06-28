class ImageResourceHolder
{
    // ロード完了フラグ
    // _mIsLoadList;
    // 画像
    // mBGImg;
    // mScoreImg_0;
    // mScoreImg_1;
    // mScoreImg_2;
    // mScoreImg_3;
    // mScoreImg_4;
    // mScoreImg_5;
    // mScoreImg_6;
    // mScoreImg_7;
    // mScoreImg_8;
    // mScoreImg_9;
    // mPuyoImgList;

    constructor()
    {
        // 読み込み完了フラグ
        this._mIsLoadList = new Array();
        // 画像読み込み
        this.mBGImg = this._LoadImage("./resource/img/puyo_1bg.png");
        this.mScoreImg_0 = this._LoadImage("./resource/img/0.png");
        this.mScoreImg_1 = this._LoadImage("./resource/img/1.png");
        this.mScoreImg_2 = this._LoadImage("./resource/img/2.png");
        this.mScoreImg_3 = this._LoadImage("./resource/img/3.png");
        this.mScoreImg_4 = this._LoadImage("./resource/img/4.png");
        this.mScoreImg_5 = this._LoadImage("./resource/img/5.png");
        this.mScoreImg_6 = this._LoadImage("./resource/img/6.png");
        this.mScoreImg_7 = this._LoadImage("./resource/img/7.png");
        this.mScoreImg_8 = this._LoadImage("./resource/img/8.png");
        this.mScoreImg_9 = this._LoadImage("./resource/img/9.png");
        this.mPuyoImgList = new Array();
        this.mPuyoImgList[0] = this._LoadImage("./resource/img/puyo_1.png");
        this.mPuyoImgList[1] = this._LoadImage("./resource/img/puyo_2.png");
        this.mPuyoImgList[2] = this._LoadImage("./resource/img/puyo_3.png");
        this.mPuyoImgList[3] = this._LoadImage("./resource/img/puyo_4.png");
        this.mPuyoImgList[4] = this._LoadImage("./resource/img/puyo_5.png");
    }


    // 画像読み込み
    _LoadImage(path)
    {
        var id = this._mIsLoadList.length;
        this._mIsLoadList[id] = false

        const imgRef = new Image();
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

const gImgResHolder = new ImageResourceHolder();