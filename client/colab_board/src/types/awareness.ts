export type AwarenessUser = {
    name: string
    color: string
    role: Role
    userId: string
}

export type AwarenessCursor = {
    x: number
    y: number
}

export type Role = "owner" | "admin" | "contributor"

export type Member = {
    board_id: string
    name: string
    user_id: string
    color: string
    role: Role
    access: boolean
}