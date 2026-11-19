import { describe, it, expect } from "vitest";
import * as Y from "yjs";
import type { YShapeValue } from "../types/shapes";
import { moveShape } from "./moveShape";

function createShape(data: Record<string, YShapeValue>) {
    const doc = new Y.Doc();
    const shape = new Y.Map<YShapeValue>();

    doc.getMap("shapes").set("shape-1", shape);

    doc.transact(() => {
        for (const [key, value] of Object.entries(data)) {
            shape.set(key, value);
        }
    });

    return shape;
}

describe("moveShape", () => {
    it.each(["rect", "ellipse", "romb", "sticker", "text"] as const)(
        "should move %s",
        (type) => {
            const shape = createShape({
                type,
                x: 100,
                y: 200,
            });

            expect(moveShape(shape, 20, -30)).toEqual({
                x: 120,
                y: 170,
            });
        }
    );

    it.each(["line", "arrow"] as const)(
        "should move %s using start coordinates",
        (type) => {
            const shape = createShape({
                type,
                x: 100,
                y: 200,
                startX: 50,
                startY: 70,
            });

            expect(moveShape(shape, 20, -30)).toEqual({
                x: 120,
                y: 170,
                startX: 70,
                startY: 40,
            });
        }
    );

    it.each(["pencil", "eraser"] as const)(
        "should move %s and all its points",
        (type) => {
            const shape = createShape({
                type,
                x: 100,
                y: 200,
                points: [
                    { x: 10, y: 20 },
                    { x: 30, y: 40 },
                ],
            });

            expect(moveShape(shape, 20, -30)).toEqual({
                x: 120,
                y: 170,
                points: [
                    { x: 30, y: -10 },
                    { x: 50, y: 10 },
                ],
            });
        }
    );

    it("should use zero for missing coordinates", () => {
        const shape = createShape({
            type: "rect",
        });

        expect(moveShape(shape, 10, 15)).toEqual({
            x: 10,
            y: 15,
        });
    });

    it("should return empty object for unsupported type", () => {
        const shape = createShape({
            type: "unknown" as YShapeValue,
        });

        expect(moveShape(shape, 10, 15)).toEqual({});
    });

    it("should handle pencil without valid points", () => {
        const shape = createShape({
            type: "pencil",
            points: "invalid",
        });

        expect(moveShape(shape, 10, 15)).toEqual({
            x: 10,
            y: 15,
            points: [],
        });
    });
});
