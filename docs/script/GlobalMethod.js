//--------------------------------------
// ぷよマップのIndexを取得
function GetMapIndex(x, y)
{
    return y * gGame.PUYO_X_MAX + x;
}

function GetPosX(mapIndex)
{
    return parseInt(mapIndex % gGame.PUYO_X_MAX);
}
function GetPosY(mapIndex)
{
    return parseInt(mapIndex / gGame.PUYO_X_MAX);
}