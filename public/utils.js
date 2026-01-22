export const removeAllChildren = x => {
    while(x.firstChild) x.removeChild(x.firstChild)
}