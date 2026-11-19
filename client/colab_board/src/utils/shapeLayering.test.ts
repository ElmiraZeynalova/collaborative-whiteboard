import { describe, it, expect } from "vitest";
import * as Y from "yjs";

import {
    moveForward,
    moveBackward,
    moveToFront,
    moveToBack,
} from "./shapeLayering";

function createOrder(ids: string[]) {
    const doc = new Y.Doc();
    const order = doc.getArray<string>("order");

    order.insert(0, ids);

    return order;
}


describe("moveForward", () => {
    it("should move a shape one position forward", () => {
        const order = createOrder(["a", "b", "c"]);

        moveForward(order, ["a"]);

        expect(order.toArray()).toEqual(["b", "a", "c"]);
    });

    it("should move two selected shapes one position forward", () => {
        const order = createOrder(["a", "b", "c", "d"]);

        moveForward(order, ["b", "c"]);

        expect(order.toArray()).toEqual(["a", "d", "b", "c"]);
    });

    it("should not move the last shape", () => {
        const order = createOrder(["a", "b", "c"]);

        moveForward(order, ["c"]);

        expect(order.toArray()).toEqual(["a", "b", "c"]);
    });

    it("should ignore non-existing IDs", () => {
        const order = createOrder(["a", "b", "c"]);

        moveForward(order, ["x"]);

        expect(order.toArray()).toEqual(["a", "b", "c"]);
    });

    it("should handle an empty selection", () => {
        const order = createOrder(["a", "b", "c"]);

        moveForward(order, []);

        expect(order.toArray()).toEqual(["a", "b", "c"]);
    });
});

describe("moveBackward", () => {
    it("should move a shape one position backward", () => {
        const order = createOrder(["a", "b", "c"]);

        moveBackward(order, ["c"]);

        expect(order.toArray()).toEqual(["a", "c", "b"]);
    });


    it("should move two selected shapes one position backward", () => {
        const order = createOrder(["a", "b", "c", "d"]);

        moveBackward(order, ["c", "d"]);

        expect(order.toArray()).toEqual(["a", "c", "d", "b"]);
    });


    it("should not move the first shape", () => {
        const order = createOrder(["a", "b", "c"]);

        moveBackward(order, ["a"]);

        expect(order.toArray()).toEqual(["a", "b", "c"]);
    });

    it("should ignore non-existing IDs", () => {
        const order = createOrder(["a", "b", "c"]);

        moveBackward(order, ["x"]);

        expect(order.toArray()).toEqual(["a", "b", "c"]);
    });
});

describe("moveToFront", () => {
    it("should move a shape to the end", () => {
        const order = createOrder(["a", "b", "c", "d"]);

        moveToFront(order, ["a"]);

        expect(order.toArray()).toEqual(["b", "c", "d", "a"]);
    });

    it("should move two selected shapes to the end", () => {
        const order = createOrder(["a", "b", "c", "d"]);

        moveToFront(order, ["a", "b"]);

        expect(order.toArray()).toEqual(["c", "d", "a", "b"]);
    });


    it("should not change order if ID does not exist", () => {
        const order = createOrder(["a", "b", "c"]);

        moveToFront(order, ["x"]);

        expect(order.toArray()).toEqual(["a", "b", "c"]);
    });
});

describe("moveToBack", () => {
    it("should move a shape to the beginning", () => {
        const order = createOrder(["a", "b", "c", "d"]);

        moveToBack(order, ["d"]);

        expect(order.toArray()).toEqual(["d", "a", "b", "c"]);
    });

    it("should move two selected shapes to the beginning", () => {
        const order = createOrder(["a", "b", "c", "d"]);

        moveToBack(order, ["d", "c"]);

        expect(order.toArray()).toEqual(["c", "d", "a", "b"]);
    });

    it("should not change order if ID does not exist", () => {
        const order = createOrder(["a", "b", "c"]);

        moveToBack(order, ["x"]);

        expect(order.toArray()).toEqual(["a", "b", "c"]);
    });
});
