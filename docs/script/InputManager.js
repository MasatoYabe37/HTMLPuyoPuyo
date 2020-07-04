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

        canvas.addEventListener("mousedown", this._OnClickStartMethod, false);
        canvas.addEventListener("mousemove", this._OnClickMoveMethod, false);
        canvas.addEventListener("mouseup", this._OnClickEndMethod, false);
    }
    _OnClickStartMethod(eventInfo)
    {
        if (Input.mIsTouched) return;
        Input.mIsTouched = true;
        Input.mTouchPosX = eventInfo.clientX;
        Input.mTouchPosY = eventInfo.clientY;
        // Input.mTouchStartPosX = eventInfo.clientX;
        // Input.mTouchStartPosY = eventInfo.clientY;
        
        // var touchDiv = document.getElementById("click");
        // touchDiv.innerText = "Click down! : (" + eventInfo.clientX + ", " + eventInfo.clientY + ")";
    }
    _OnClickMoveMethod(eventInfo)
    {
        if (Input.mIsTouched == false) return;
        Input.mTouchPosX = eventInfo.clientX;
        Input.mTouchPosY = eventInfo.clientY;
        
        // var touchDiv = document.getElementById("click");
        // touchDiv.innerText = "Click moved! : (" + eventInfo.clientX + ", " + eventInfo.clientY + ")";
    }
    _OnClickEndMethod(eventInfo)
    {
        if (Input.mIsTouched == false) return;
        Input.mIsTouched = false;
        Input.mTouchPosX = eventInfo.clientX;
        Input.mTouchPosY = eventInfo.clientY;
        // var posX = eventInfo.clientX;
        // var posY = eventInfo.clientY;
        // var lenX = Input.mTouchStartPosX - posX;
        // var lenY = Input.mTouchStartPosY - posY;
        // var len = Math.sqrt(lenX * lenX + lenY * lenY);
        // var isRotate = len < Input.DETECT_ROT_LENGTH;

        // var touchDiv = document.getElementById("click");
        // var str = "Click up! : (" + posX + ", " + posY + ")\n";
        // str += "LenX : " + lenX + "\n";
        // str += "LenY : " + lenY + "\n";
        // str += "Len : " + len.toFixed(2) + "\n";
        // str += "Rotate : " + isRotate + "\n";
        // touchDiv.innerText = str;
    }
}
