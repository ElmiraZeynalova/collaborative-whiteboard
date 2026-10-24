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
import * as Y from 'yjs'
import type { YShape } from "../../types/shapes";

type ToolContext = {
    yShapes: Y.Map<YShape>
    yShapesOrder: Y.Array<string>
}

const TOOL_MAP: Record<string, (ctx: ToolContext) => Tool> = {
    rect: (ctx) => new Rect(ctx),
    ellipse: (ctx) => new Ellipse(ctx),
    romb: (ctx) => new Romb(ctx),
    line: (ctx) => new Line(ctx),
    pencil: (ctx) => new Pencil(ctx),
    selection: (ctx) => new Selection(ctx),
    arrow: (ctx) => new Arrow(ctx),
    sticker: (ctx) => new Sticker(ctx),
    text: (ctx) => new Text(ctx),
    eraser: (ctx) => new Eraser(ctx),
}


export function getToolInstance(tool: ToolType, ctx: ToolContext) {
    const factory = TOOL_MAP[tool]

    return factory ? factory(ctx) : null
}