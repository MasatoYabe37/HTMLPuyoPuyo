class PlayerInfo
{
    // 変数定義
    // mPlayerID;
    // mBGCtrl;                 // 背景コントロール
    // mInput;
    // mGameParam

    constructor(plid)
    {
        this.mPlayerID = plid;
        this.mBGCtrl = new Background();
        this.mBGCtrl.Init();
        this.mInput = new InputInfo();
        this.mInput.Init();
        this.mParam = new GameParam();
        this.mParam.Init();
    }

    Init()
    {
    }

    Update(dt)
    {

    }

    Draw(dt)
    {
        
    }

    IsReady()
    {
        if (this.BGCtrl.IsCompleteLoadAllImages() == false) return false;
        
        return true;
    }
}