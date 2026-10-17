import {useHocuspocusAwareness, useHocuspocusProvider } from '@hocuspocus/provider-react'
import { Icon } from '@iconify/react'
import type {AwarenessUser, Member} from '../../types/awareness'
import {changeUserAccessToBoard, getAllBoardMembers} from '../../api/boards'
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { useClientStore } from '../../store/clientStore'
import { useAuthState } from '../../context/AuthContext'
import {useEffect} from 'react'

export default function SideBar({closeBar}: {closeBar: () => void}) {
    const awareness = useHocuspocusAwareness()
    const provider = useHocuspocusProvider()
    const boardId = useClientStore(state => state.boardId)
    const {loggedIn} = useAuthState()
    const queryClient = useQueryClient()

    const changeUserAccessToBoardMutation = useMutation({
        mutationFn: async ({userId, access}: {userId: string, access: boolean}) => {
            if(!boardId || !userId) return
            const member = await changeUserAccessToBoard(boardId, userId, access)
            return member
        },
        onSuccess: async(member) => {
            await queryClient.invalidateQueries({
                queryKey: ['getAllBoardMembers', boardId],
            })

            provider.sendStateless(JSON.stringify({type: 'access', content: {message: 'access prohibited', userId: member.user_id}}))
        },
        onError: (err) => console.log(err)
    })

    const { data: members = [], isPending } = useQuery({
        queryKey: ['getAllBoardMembers', boardId],
        queryFn: async() => {
            const members = await getAllBoardMembers(boardId!)
            return members
        },
        enabled: loggedIn,
    })

    const activeMembers = awareness.map(item => {
        const user = item.user as AwarenessUser
        if(user) return user.userId
    }) ?? []

    const activeMembersKey = activeMembers
        .filter((id): id is string => Boolean(id))
        .sort()
        .join(',')

    useEffect(() => {
        if (!loggedIn || !boardId) return
        queryClient.invalidateQueries({
            queryKey: ['getAllBoardMembers', boardId],
        })
    }, [activeMembersKey, boardId, loggedIn, queryClient])

    // console.log(activeMembers)
    // console.log(members)

    async function handleAccessChange(userId: string, access: boolean){
        changeUserAccessToBoardMutation.mutateAsync({userId, access})
    }

    return (
        <>
            <div className="absolute top-0 right-0 z-12 h-dvh w-[85vw] sm:w-[50vw] md:w-[35vw] lg:w-70 flex flex-col bg-white">
                <header className="flex items-center justify-between w-full py-2 px-3 drop-shadow-md border-b border-black/15">
                    <button onClick={closeBar} className="cursor-pointer shrink-0"><Icon icon="gg:arrow-left" width={20} height={20}/></button>
                    <h3 className="text-md font-medium truncate mx-2">Board members</h3>
                    <Icon icon="lucide:users" width={20} height={20} className="shrink-0"/>
                </header>
                <main className="flex flex-col p-2 gap-4">
                    <section className="flex flex-col gap-2">
                        <p className="text-[#919191] text-sm">Active</p>
                        {awareness.map(item => {
                            const user = item.user as AwarenessUser
                            if(!user) return null
                            return <UserBadge key={user.userId} userId={user.userId} userName={user.name} userColor={user.color} userRole={user.role} status="active" changeAccess={() => handleAccessChange(user.userId, false)}/>
                        })}
                    </section>
                    <section className="flex flex-col gap-2">
                        <p className="text-[#919191] text-sm">All</p>
                        {isPending && <p>Loading members...</p>}
                        {members.map((member: Member) => {
                            if(activeMembers.includes(member.user_id)) return null
                            return <UserBadge key={member.user_id} userId={member.user_id} userName={member.name} userColor={member.color} userRole={member.role} status={member.access ? "inactive" : "banned"} changeAccess={() => handleAccessChange(member.user_id, member.access ? false : true)}/>
                        })}
                    </section>
                </main>
            </div>

         
        </>
    )
}

type Props = {userId: string, userName: string, userColor: string, userRole: string, status: 'active' | 'inactive' | 'banned', changeAccess: () => void}

function UserBadge(props: Props){
    const userId = useClientStore(state => state.userId)
    const userRole = useClientStore(state => state.userRole)

    const backgroundColor = {
        active: props.userColor,
        inactive: `color-mix(in srgb, ${props.userColor} 55%, white)`,
        banned: '#6b7280',
    }[props.status]

    return(              
        <div
            className="relative cursor-pointer group px-3 py-1 rounded-full text-white flex items-center"
            style={{ backgroundColor }}
        >
            <p className="grow">{props.userId === userId ? "Me" : props.userName}</p>
            <p>{props.userRole}</p>

            {userRole === "owner" && props.userRole === "contributor" && <button
                onClick={props.changeAccess}
                className="absolute right-0 top-8 z-13 invisible group-hover:visible cursor-pointer shrink-0  bg-white hover:bg-mauve-600 text-sm text-[#FF0000] hover:text-white hover:border-transparent border-black border font-normal rounded-lg px-2 py-1"
                >{props.status === "banned" ? "Unban member" : "Ban user"}</button>}
        </div>
    )
}
