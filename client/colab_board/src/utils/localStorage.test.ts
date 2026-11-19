import { beforeEach, describe, expect, it } from "vitest";
import {
    saveBoardToLocalStorage,
    deleteBoardFromLocalStorage,
    updateBoardNameInLocalStorage,
} from "./localStorageOperations";

describe("localStorage board utilities", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("saveBoardToLocalStorage", () => {
        it("should save a new board", () => {
            saveBoardToLocalStorage("1", "Board 1");

            expect(JSON.parse(localStorage.getItem("boards")!)).toEqual([
                { id: "1", name: "Board 1" },
            ]);
        });

        it("should not add a board if it already exists", () => {
            saveBoardToLocalStorage("1", "Board 1");
            saveBoardToLocalStorage("1", "Another name");

            expect(JSON.parse(localStorage.getItem("boards")!)).toEqual([
                { id: "1", name: "Board 1" },
            ]);
        });

        it("should preserve existing boards", () => {
            saveBoardToLocalStorage("1", "Board 1");
            saveBoardToLocalStorage("2", "Board 2");

            expect(JSON.parse(localStorage.getItem("boards")!)).toHaveLength(2);
        });
    });

    describe("deleteBoardFromLocalStorage", () => {
        it("should delete a board by id", () => {
            saveBoardToLocalStorage("1", "Board 1");
            saveBoardToLocalStorage("2", "Board 2");

            deleteBoardFromLocalStorage("1");

            expect(JSON.parse(localStorage.getItem("boards")!)).toEqual([
                { id: "2", name: "Board 2" },
            ]);
        });

        it("should preserve boards if id does not exist", () => {
            saveBoardToLocalStorage("1", "Board 1");

            deleteBoardFromLocalStorage("999");

            expect(JSON.parse(localStorage.getItem("boards")!)).toEqual([
                { id: "1", name: "Board 1" },
            ]);
        });

        it("should handle an empty list", () => {
            deleteBoardFromLocalStorage("1");

            expect(JSON.parse(localStorage.getItem("boards")!)).toEqual([]);
        });
    });

    describe("updateBoardNameInLocalStorage", () => {
        it("should update board name", async () => {
            saveBoardToLocalStorage("1", "Old name");
            saveBoardToLocalStorage("2", "Board 2");

            updateBoardNameInLocalStorage("1", "New name");

            expect(JSON.parse(localStorage.getItem("boards")!)).toEqual([
                { id: "1", name: "New name" },
                { id: "2", name: "Board 2" },
            ]);
        });

        it("should handle an empty list", async () => {
            updateBoardNameInLocalStorage("1", "New name");

            expect(localStorage.getItem("boards")).toBeNull();
        });
    });
});
