export type AwarenessUser = {
    name: string
    color: string
    role: string
    userId: string
}

export type AwarenessCursor = {
    x: number
    y: number
}

export type Member = {
    board_id: string
    name: string
    user_id: string
    color: string
    role: string
    access: boolean
}