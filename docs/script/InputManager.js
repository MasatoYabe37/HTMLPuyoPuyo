//-------------------------------------------
// キャンバスの入力をスマホ風に受け取れるようにする
//-------------------------------------------
class InputManager
{
    constructor(canvas)
    {
        this.canvas = canvas;

        canvas.addEventListener("touchstart", this.onTouchStartMethod, false);
        canvas.addEventListener("mousedown", this.onClickStartMethod, false);
    }
    onTouchStartMethod(eventInfo)
    {
        console.trace("Touch !");
        var context = this.getContext("2d");
        context.fillRect(eventInfo.clientX - 2, eventInfo.clientY - 2, 4, 4);
        var touchDiv = document.getElementById("touch");
        touchDiv.innerText = "Touch! : (" + eventInfo.clientX + ", " + eventInfo.clientY + ")";
    }
    onClickStartMethod(eventInfo)
    {
        console.trace("Click !");
        var context = this.getContext("2d");
        context.fillRect(eventInfo.clientX - 2, eventInfo.clientY - 2, 4, 4);
        var touchDiv = document.getElementById("click");
        touchDiv.innerText = "Click! : (" + eventInfo.clientX + ", " + eventInfo.clientY + ")";
    }
}