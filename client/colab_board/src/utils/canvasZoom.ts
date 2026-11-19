const SCALE_BY = 1.05;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

type Point = {
    x: number;
    y: number;
};

type ZoomParams = {
    pointer: Point;
    stagePosition: Point;
    oldScale: number;
    deltaY: number;
};

export function calculateZoom({
    pointer,
    stagePosition,
    oldScale,
    deltaY,
}: ZoomParams) {
    const direction = deltaY > 0 ? -1 : 1;

    const scaleChange = direction > 0
        ? SCALE_BY
        : 1 / SCALE_BY;

    const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, oldScale * scaleChange)
    );

    const mousePointTo = {
        x: (pointer.x - stagePosition.x) / oldScale,
        y: (pointer.y - stagePosition.y) / oldScale,
    };

    const newPosition = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };

    return {
        scale: newScale,
        position: newPosition,
    };
}