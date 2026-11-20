import type { AwarenessCursor, AwarenessUser } from "../../types/awareness"
import Konva from "konva"
import { useHocuspocusAwareness, useHocuspocusProvider } from "@hocuspocus/provider-react"
import { Icon } from '@iconify/react'

type Props = {
    stage: Konva.Stage
}
export default function RemoteCursors({ stage }: Props) {
    const users = useHocuspocusAwareness()
    const provider = useHocuspocusProvider()
    const clientId = provider.awareness?.clientID

    return (
        <>
            {users.map(item => {
                if (item.clientId === clientId) return null
                if (!item.cursor || !item.user) return null

                const cursor = item.cursor as AwarenessCursor
                const user = item.user as AwarenessUser

                const screenX =
                    cursor.x * stage.scaleX() + stage.x()

                const screenY =
                    cursor.y * stage.scaleY() + stage.y()

                return (
                    <div
                        key={item.clientId}
                        className="absolute z-10 pointer-events-none"
                        style={{
                            top: screenY,
                            left: screenX,
                        }}
                    >
                        <Icon
                            icon="fluent:cursor-16-filled"
                            width={20}
                            height={20}
                            color={user.color}
                        />
                    </div>
                )
            })}
        </>
    )
}