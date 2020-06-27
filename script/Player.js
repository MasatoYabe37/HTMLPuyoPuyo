class PlayerInfo
{
    // 変数定義
    BGCtrl;                 // 背景コントロール

    init()
    {
        this.BGCtrl = new Background();
        this.BGCtrl.init();
    }

    isReady()
    {
        if (this.BGCtrl.IsCompleteLoadAllImages() == false) return false;
        
        return true;
    }
}