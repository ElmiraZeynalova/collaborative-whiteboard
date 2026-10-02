import {useHocuspocusAwareness, useHocuspocusProvider } from '@hocuspocus/provider-react'
import { Icon } from '@iconify/react'
import type {AwarenessUser} from '../types/awareness'

export default function SideBar({closeBar}: {closeBar: () => void}) {
    const users = useHocuspocusAwareness()
    const provider = useHocuspocusProvider()
    const clientId = provider.awareness?.clientID
    
    return (
        
        <div className="absolute top-0 right-0 z-12 h-dvh w-[85vw] sm:w-[50vw] md:w-[35vw] lg:w-70 flex flex-col gap-2 bg-white">
            <div className="flex items-center justify-between w-full py-2 px-3 drop-shadow-md border-b border-black/15">
                <button onClick={closeBar} className="cursor-pointer shrink-0"><Icon icon="gg:arrow-left" width={20} height={20}/></button>
                <h3 className="text-md font-medium truncate mx-2">Board contributors</h3>
                <Icon icon="lucide:users" width={20} height={20} className="shrink-0"/>
            </div>
            <div className="flex flex-col gap-2 px-2">
                {users.map(item => {
                    const user = item.user as AwarenessUser
                    return (
                        <div
                            key={item.clientId}
                            className="px-3 py-1 rounded-full text-white"
                            style={{ backgroundColor: user.color }}
                        >
                            {item.clientId === clientId ? "Me" : user.name}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}