function scroll_off()
{
    document.addEventListener('touchmove', scrollEvent, { passive:false });
}

function scroll_on()
{
    document.removeEventListener('touchmove', scrollEvent, { passive: false });
}

function scrollEvent(event)
{
    event.preventDefault();
}