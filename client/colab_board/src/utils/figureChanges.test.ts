import { describe, it, expect } from "vitest";
import { getFigureChanges } from "./figureChanges";

const settings = {
    fillColor: "#ff0000",
    strokeColor: "#000000",
    strokeWidth: 5,
    fontSize: 24,
    textAlign: "center",
};

describe("getFigureChanges", () => {
    it.each(["rect", "ellipse", "romb", "sticker"])(
        "should change fill color of %s",
        (type) => {
            expect(
                getFigureChanges(type, "fillColor", settings)
            ).toEqual({
                fillStyle: "#ff0000",
            });
        }
    );

    it.each(["line", "arrow", "pencil", "eraser", "text"])(
        "should not change fill color of %s",
        (type) => {
            expect(
                getFigureChanges(type, "fillColor", settings)
            ).toEqual({});
        }
    );

    it.each([
        "rect",
        "ellipse",
        "romb",
        "sticker",
        "text",
        "line",
        "arrow",
        "pencil",
        "eraser",
    ])("should change stroke color of %s", (type) => {
        expect(
            getFigureChanges(type, "strokeColor", settings)
        ).toEqual({
            strokeStyle: "#000000",
        });
    });

    it("should change stroke width", () => {
        expect(
            getFigureChanges("rect", "strokeWidth", settings)
        ).toEqual({
            strokeWidth: 5,
        });
    });

    it.each(["text", "sticker"])(
        "should change font size of %s",
        (type) => {
            expect(
                getFigureChanges(type, "fontSize", settings)
            ).toEqual({
                fontSize: "24",
            });
        }
    );

    it("should not change font size of rect", () => {
        expect(
            getFigureChanges("rect", "fontSize", settings)
        ).toEqual({});
    });

    it("should change text alignment of text", () => {
        expect(
            getFigureChanges("text", "textAlign", settings)
        ).toEqual({
            textAlign: "center",
        });
    });

    it("should not change text alignment of sticker", () => {
        expect(
            getFigureChanges("sticker", "textAlign", settings)
        ).toEqual({});
    });

    it("should return empty object for unknown setting", () => {
        expect(
            getFigureChanges("rect", "unknown", settings)
        ).toEqual({});
    });
});