//-------------------------------------------
// キャンバスの入力をスマホ風に受け取れるようにする
//-------------------------------------------
class InputManager
{
    constructor(canvas)
    {
        this.canvas = canvas;

        canvas.addEventListener("mousedown", this.onClickStartMethod, false);
    }
    onClickStartMethod(eventInfo)
    {
        console.trace("Click !");
        var touchDiv = document.getElementById("click");
        touchDiv.innerText = "Click! : (" + eventInfo.clientX + ", " + eventInfo.clientY + ")";
    }
}