import {useHocuspocusAwareness, useHocuspocusProvider } from '@hocuspocus/provider-react'
import { Icon } from '@iconify/react'
import type {AwarenessUser} from '../../types/awareness'
import {getAllBoardMembers} from '../../api/boards'
import { useQuery } from '@tanstack/react-query'
import { useAuthState } from '../../context/AuthContext'
import { useClientStore } from '../../store/clientStore'
import type { Member } from '../../types/awareness'
import { useMemo } from 'react'

export default function SideBar({closeBar}: {closeBar: () => void}) {
    const users = useHocuspocusAwareness()
    const provider = useHocuspocusProvider()
    const clientId = provider.awareness?.clientID
    const {loggedIn} = useAuthState()
    const boardId = useClientStore(state => state.boardId)
    const userRole = useClientStore(state => state.userRole)

    const activeUsers = useMemo(() => {
        return users.map(item => {
            const user = item.user as AwarenessUser
            return user.userId
        })
    }, [users])

    const { data: members = [] } = useQuery({
        queryKey: ['getAllBoardMembers'],
        queryFn: async() => {
            const members = await getAllBoardMembers(boardId!)
            return members
        },
        enabled: loggedIn,
    })

    console.log(userRole)


    return (
        
        <div className="absolute top-0 right-0 z-12 h-dvh w-[85vw] sm:w-[50vw] md:w-[35vw] lg:w-70 flex flex-col bg-white">
            <header className="flex items-center justify-between w-full py-2 px-3 drop-shadow-md border-b border-black/15">
                <button onClick={closeBar} className="cursor-pointer shrink-0"><Icon icon="gg:arrow-left" width={20} height={20}/></button>
                <h3 className="text-md font-medium truncate mx-2">Board members</h3>
                <Icon icon="lucide:users" width={20} height={20} className="shrink-0"/>
            </header>
            <main className="flex flex-col p-2 gap-4">
                <section className="flex flex-col gap-2">
                    <p className="text-[#919191] text-sm">Active</p>
                    {users.map(item => {
                        const user = item.user as AwarenessUser
                        return (
                            <div
                                key={item.clientId}
                                className="px-3 py-1 rounded-full text-white flex"
                                style={{ backgroundColor: user.color }}
                            >
                                <p className="grow">{item.clientId === clientId ? "Me" : user.name}</p>
                                <p>{user.role}</p>
                            </div>
                        )
                    })}
                </section>
                <section className="flex flex-col gap-2">
                    <p className="text-[#919191] text-sm">All</p>
                        {members.map((item: Member) => {
                            if(!item.name || activeUsers.includes(item.id)) return
                            return (
                                <div
                                    key={item.id}
                                    className="px-3 py-1 rounded-full bg-[#e5e5e5] text-black flex">
                                    <p className="grow">{item.name}</p>
                                </div>
                            )
                        })}
                </section>
            </main>
        </div>
    )
}