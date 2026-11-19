import { describe, it, expect } from "vitest";
import { calculateZoom } from "./canvasZoom";

describe("calculateZoom", () => {
    it("should zoom in when scrolling up", () => {
        const result = calculateZoom({
            pointer: { x: 100, y: 100 },
            stagePosition: { x: 0, y: 0 },
            oldScale: 1,
            deltaY: -100,
        });

        expect(result.scale).toBeCloseTo(1.05);
    });

    it("should zoom out when scrolling down", () => {
        const result = calculateZoom({
            pointer: { x: 100, y: 100 },
            stagePosition: { x: 0, y: 0 },
            oldScale: 1,
            deltaY: 100,
        });

        expect(result.scale).toBeCloseTo(1 / 1.05);
    });

    it("should not exceed maximum scale", () => {
        const result = calculateZoom({
            pointer: { x: 100, y: 100 },
            stagePosition: { x: 0, y: 0 },
            oldScale: 10,
            deltaY: -100,
        });

        expect(result.scale).toBe(10);
    });

    it("should not go below minimum scale", () => {
        const result = calculateZoom({
            pointer: { x: 100, y: 100 },
            stagePosition: { x: 0, y: 0 },
            oldScale: 0.1,
            deltaY: 100,
        });

        expect(result.scale).toBe(0.1);
    });

    it("should keep the point under cursor in the same position", () => {
        const pointer = { x: 300, y: 200 };
        const stagePosition = { x: -100, y: -50 };
        const oldScale = 2;

        const result = calculateZoom({
            pointer,
            stagePosition,
            oldScale,
            deltaY: -100,
        });

        const oldPoint = {
            x: (pointer.x - stagePosition.x) / oldScale,
            y: (pointer.y - stagePosition.y) / oldScale,
        };

        expect(
            result.position.x + oldPoint.x * result.scale
        ).toBeCloseTo(pointer.x);

        expect(
            result.position.y + oldPoint.y * result.scale
        ).toBeCloseTo(pointer.y);
    });
});