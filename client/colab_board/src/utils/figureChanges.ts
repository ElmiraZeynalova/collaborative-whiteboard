import type { ShapeChanges } from "../types/shapes";

type FigureSettings = {
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    fontSize: number;
    textAlign: string;
};

export function getFigureChanges(shapeType: string, changedSetting: string, settings: FigureSettings): ShapeChanges {
    switch (changedSetting) {
        case "fillColor":
            if (["rect", "ellipse", "romb", "sticker"].includes(shapeType)) {
                return { fillStyle: settings.fillColor };
            }
            return {};

        case "strokeColor":
            return { strokeStyle: settings.strokeColor };

        case "strokeWidth":
            return { strokeWidth: settings.strokeWidth };

        case "fontSize":
            if (shapeType === "text" || shapeType === "sticker") {
                return { fontSize: String(settings.fontSize) };
            }
            return {};

        case "textAlign":
            if (shapeType === "text") {
                return { textAlign: settings.textAlign };
            }
            return {};

        default:
            return {};
    }
}