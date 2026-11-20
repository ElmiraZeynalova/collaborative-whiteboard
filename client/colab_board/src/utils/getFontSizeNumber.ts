export function getFontSizeNumber(fontSize: string) {
    let fontSizeNumber
    if (fontSize === "S") {
        fontSizeNumber = 14
    } else if (fontSize === "M") {
        fontSizeNumber = 20
    } else if (fontSize === "L") {
        fontSizeNumber = 30
    } else if (fontSize === "XL") {
        fontSizeNumber = 40
    }
    return fontSizeNumber
}