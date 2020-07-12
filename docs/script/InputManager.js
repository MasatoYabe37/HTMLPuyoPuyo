//-------------------------------------------
// キャンバスの入力をスマホ風に受け取れるようにする
//-------------------------------------------
class InputManager
{
    // 回転の定義
    // 一定以上動いていない
    constructor(canvas)
    {
        this.canvas = canvas;
        this.mIsTouched = false;
        this.mTouchPosX = 0;
        this.mTouchPosY = 0;
        // this.mTouchStartPosX = 0;
        // this.mTouchStartPosY = 0;

        canvas.addEventListener("touchstart", this._OnTouchStartMethod, false);
        canvas.addEventListener("touchmove", this._OnTouchMoveMethod, false);
        canvas.addEventListener("touchend", this._OnTouchEndMethod, false);
        // マウスでのイベント
        canvas.addEventListener("mousedown", this._OnClickStartMethod, false);
        canvas.addEventListener("mousemove", this._OnClickMoveMethod, false);
        canvas.addEventListener("mouseup", this._OnClickEndMethod, false);
    }
    
    _OnTouchStartMethod(eventInfo)
    {
        if (Input.mIsTouched) return;
        Input.mIsTouched = true;
        Input.mTouchPosX = eventInfo.touches[0].pageX;
        Input.mTouchPosY = eventInfo.touches[0].pageY;
                
        //var touchDiv = document.getElementById("click_event");
        // touchDiv.innerText = "Touch down! : (" + eventInfo.clientX + ", " + eventInfo.clientY + ")";
        
        eventInfo.stopPropagation();
    }
    _OnTouchMoveMethod(eventInfo)
    {
        if (Input.mIsTouched == false) return;
        Input.mTouchPosX = eventInfo.touches[0].pageX;
        Input.mTouchPosY = eventInfo.touches[0].pageY;
        
        // var touchDiv = document.getElementById("click_event");
        // touchDiv.innerText = "Touch moved! : (" + Input.mTouchPosX + ", " + Input.mTouchPosY + ")";
        
        eventInfo.preventDefault();
        eventInfo.stopPropagation();
    }
    _OnTouchEndMethod(eventInfo)
    {
        if (Input.mIsTouched == false) return;
        Input.mIsTouched = false;
        // Input.mTouchPosX = eventInfo.touches[0].pageX;
        // Input.mTouchPosY = eventInfo.touches[0].pageY;
        
        // var touchDiv = document.getElementById("click_event");
        // touchDiv.innerText = "Touch up!";
        
        eventInfo.stopPropagation();
    }
    
    _OnClickStartMethod(eventInfo)
    {
        if (Input.mIsTouched) return;
        Input.mIsTouched = true;
        Input.mTouchPosX = eventInfo.clientX;
        Input.mTouchPosY = eventInfo.clientY;
                
        // var touchDiv = document.getElementById("click_event");
        // touchDiv.innerText = "Click down! : (" + eventInfo.clientX + ", " + eventInfo.clientY + ")";
        
    }
    _OnClickMoveMethod(eventInfo)
    {
        if (Input.mIsTouched == false) return;
        Input.mTouchPosX = eventInfo.clientX;
        Input.mTouchPosY = eventInfo.clientY;
        
        // var touchDiv = document.getElementById("click_event");
        // touchDiv.innerText = "Click moved! : (" + eventInfo.clientX + ", " + eventInfo.clientY + ")";
        
    }
    _OnClickEndMethod(eventInfo)
    {
        if (Input.mIsTouched == false) return;
        Input.mIsTouched = false;
        Input.mTouchPosX = eventInfo.clientX;
        Input.mTouchPosY = eventInfo.clientY;
        
        // var touchDiv = document.getElementById("click_event");
        // touchDiv.innerText = "Click up!";
        
    }
}
