
import { describe, it, expect, vi } from "vitest";
import * as Y from "yjs";
import type Konva from "konva";
import type { YShapeValue } from "../types/shapes";

import {
    handleShapeDragEnd,
    handleTransformEnd,
} from "./shapeHandlers";

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

function createNode({
    x = 0,
    y = 0,
    scaleX = 1,
    scaleY = 1,
    rotation = 0,
} = {}) {
    let currentX = x;
    let currentY = y;
    let currentScaleX = scaleX;
    let currentScaleY = scaleY;

    return {
        x: vi.fn(() => currentX),
        y: vi.fn(() => currentY),

        scaleX: vi.fn((value?: number) => {
            if (value !== undefined) currentScaleX = value;
            return currentScaleX;
        }),

        scaleY: vi.fn((value?: number) => {
            if (value !== undefined) currentScaleY = value;
            return currentScaleY;
        }),

        rotation: vi.fn(() => rotation),

        position: vi.fn(({ x, y }: { x: number; y: number }) => {
            currentX = x;
            currentY = y;
        }),
    } as unknown as Konva.Node;
}


describe("handleShapeDragEnd", () => {
    it("should update coordinates of a rect", () => {
        const shape = createShape({
            type: "rect",
            x: 100,
            y: 200,
        });

        const node = createNode({ x: 130, y: 240 });

        handleShapeDragEnd(shape, node);

        expect(shape.get("x")).toBe(130);
        expect(shape.get("y")).toBe(240);
        expect(node.position).not.toHaveBeenCalled();
    });

    it("should update arrow coordinates", () => {
        const shape = createShape({
            type: "arrow",
            x: 100,
            y: 200,
            startX: 50,
            startY: 70,
        });

        const node = createNode({ x: 120, y: 150 });

        handleShapeDragEnd(shape, node);

        expect(shape.get("x")).toBe(120);
        expect(shape.get("y")).toBe(150);
        expect(shape.get("startX")).toBe(70);
        expect(shape.get("startY")).toBe(130);
        expect(node.position).not.toHaveBeenCalled();
    });

    it("should update line coordinates and reset node position", () => {
        const shape = createShape({
            type: "line",
            x: 100,
            y: 200,
            startX: 50,
            startY: 70,
        });

        const node = createNode({ x: 20, y: 30 });

        handleShapeDragEnd(shape, node);

        expect(shape.get("x")).toBe(120);
        expect(shape.get("y")).toBe(230);
        expect(shape.get("startX")).toBe(70);
        expect(shape.get("startY")).toBe(100);

        expect(node.position).toHaveBeenCalledWith({
            x: 0,
            y: 0,
        });
    });

    it("should move all pencil points and reset node position", () => {
        const shape = createShape({
            type: "pencil",
            x: 100,
            y: 200,
            points: [
                { x: 10, y: 20 },
                { x: 30, y: 40 },
            ],
        });

        const node = createNode({ x: 5, y: 10 });

        handleShapeDragEnd(shape, node);

        expect(shape.get("x")).toBe(105);
        expect(shape.get("y")).toBe(210);
        expect(shape.get("points")).toEqual([
            { x: 15, y: 30 },
            { x: 35, y: 50 },
        ]);

        expect(node.position).toHaveBeenCalledWith({
            x: 0,
            y: 0,
        });
    });
});


describe("handleTransformEnd", () => {
    it("should resize rect", () => {
        const shape = createShape({
            type: "rect",
            x: 100,
            y: 100,
            width: 50,
            height: 40,
        });

        const node = createNode({
            x: 120,
            y: 130,
            scaleX: 2,
            scaleY: 1.5,
            rotation: 45,
        });

        handleTransformEnd(shape, node);

        expect(shape.get("x")).toBe(120);
        expect(shape.get("y")).toBe(130);
        expect(shape.get("width")).toBe(100);
        expect(shape.get("height")).toBe(60);
        expect(shape.get("rotation")).toBe(45);

        expect(node.scaleX).toHaveBeenCalledWith(1);
        expect(node.scaleY).toHaveBeenCalledWith(1);
    });

    it("should not allow rect dimensions below 5", () => {
        const shape = createShape({
            type: "rect",
            x: 0,
            y: 0,
            width: 10,
            height: 10,
        });

        const node = createNode({
            scaleX: 0.1,
            scaleY: 0.1,
        });

        handleTransformEnd(shape, node);

        expect(shape.get("width")).toBe(5);
        expect(shape.get("height")).toBe(5);
    });

    it("should resize ellipse radius", () => {
        const shape = createShape({
            type: "ellipse",
            x: 0,
            y: 0,
            radius: { x: 20, y: 30 },
        });

        const node = createNode({
            scaleX: 2,
            scaleY: 3,
        });

        handleTransformEnd(shape, node);

        expect(shape.get("radius")).toEqual({
            x: 40,
            y: 90,
        });
    });
});