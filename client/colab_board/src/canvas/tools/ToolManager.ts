import type { ToolType } from "./Tool";
import Rect from "./Rect";
import Ellipse from "./Ellipse";
import Text from "./Text";
import Arrow from "./Arrow";
import Romb from "./Romb";
import Line from "./Line";
import Eraser from "./Eraser";
import Pencil from "./Pencil";
import Sticker from "./Sticker";
import Selection from "./Selection";
import Tool from "./Tool";

const TOOL_MAP: Record<string, () => Tool> = {
    rect: () => new Rect(),
    ellipse: () => new Ellipse(),
    romb: () => new Romb(),
    line: () => new Line(),
    pencil: () => new Pencil(),
    selection: () => new Selection(),
    arrow: () => new Arrow(),
    sticker: () => new Sticker(),
    text: () => new Text(),
    eraser: () => new Eraser()
}

export function getToolInstance(tool: ToolType) {
    const factory = TOOL_MAP[tool]
    return factory ? factory() : null
}