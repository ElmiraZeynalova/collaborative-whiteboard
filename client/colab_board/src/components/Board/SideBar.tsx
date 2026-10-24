import {useHocuspocusAwareness, useHocuspocusProvider } from '@hocuspocus/provider-react'
import { Icon } from '@iconify/react'
import type {AwarenessUser, LocalAwarenessUser, Member, Role} from '../../types/awareness'
import {changeUserAccessToBoard, getAllBoardMembers, changeUserRole} from '../../api/boards'
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
    const mode = useClientStore(state => state.boardMode)

    const changeUserRoleMutation = useMutation({
        mutationFn: async ({userId, role}: {userId: string, role: Role}) => {
            if(!boardId || !userId) return
            const member = await changeUserRole(boardId, userId, role)
            return member
        },
        onSuccess: async() => {
            await queryClient.invalidateQueries({
                queryKey: ['getAllBoardMembers', boardId],
            })
        },
        onError: (err) => console.log(err)
    })

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

            provider.sendStateless(JSON.stringify({type: 'access', content: {userId: member.user_id}}))
        },
        onError: (err) => console.log(err)
    })

    const { data: members = [], isPending } = useQuery({
        queryKey: ['getAllBoardMembers', boardId],
        queryFn: async() => {
            const members = await getAllBoardMembers(boardId!)
            return members
        },
        enabled: loggedIn === true,
    })

    const activeMembers = awareness.map(item => {
        const user = item.user as AwarenessUser
        if(user) return user.userId
    }).filter(id => typeof id === 'string') 

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

    function handleAccessChange(userId: string, access: boolean){
        changeUserAccessToBoardMutation.mutate({userId, access})
    }

    function handleRoleChange(userId: string, role: Role){
        changeUserRoleMutation.mutate({userId, role})
    }

    return (
        <>
            <div className="absolute top-0 right-0 z-12 h-dvh w-[85vw] sm:w-[50vw] md:w-[35vw] lg:w-70 flex flex-col bg-white">
                <header className="flex items-center justify-between w-full py-2 px-3 drop-shadow-md border-b border-black/15">
                    <button onClick={closeBar} className="cursor-pointer shrink-0"><Icon icon="gg:arrow-left" width={20} height={20}/></button>
                    <h3 className="text-md font-medium truncate mx-2">Board members</h3>
                    <Icon icon="lucide:users" width={20} height={20} className="shrink-0"/>
                </header>
                {mode === "server" 
                    ? <ServerMemberSection members={members} activeMembers={activeMembers} isPending={isPending} handleAccessChange={(userId: string, access: boolean) => handleAccessChange(userId, access)} handleRoleChange={(userId: string, role: Role) => handleRoleChange(userId, role)}/>
                    : <LocalMemberSection/>
                }

            </div>

         
        </>
    )
}

type MembersProps = {
    members: Member[] 
    activeMembers: string[] 
    isPending: boolean
    handleAccessChange: (userId: string, access: boolean) => void
    handleRoleChange: (userId: string, role: Role) => void
}

function ServerMemberSection(props: MembersProps){
    return(
        <main className="flex flex-col p-2 gap-4">
            <section className="flex flex-col gap-2">
                <p className="text-[#919191] text-sm">Active</p>
                {props.members.map((member: Member) => {
                    if(!props.activeMembers.includes(member.user_id)) return null
                    return <UserBadge key={member.user_id} userId={member.user_id} userName={member.name} userColor={member.color} userRole={member.role} status="active" changeAccess={(access: boolean) => props.handleAccessChange(member.user_id, access)} changeRole={(role: Role) => props.handleRoleChange(member.user_id, role)} />
                })}
            </section>
            <section className="flex flex-col gap-2">
                <p className="text-[#919191] text-sm">All</p>
                {props.isPending && <p>Loading members...</p>}
                {props.members.map((member: Member) => {
                    if(props.activeMembers.includes(member.user_id)) return null
                    return <UserBadge key={member.user_id} userId={member.user_id} userName={member.name} userColor={member.color} userRole={member.role} status={member.access ? "inactive" : "banned"} changeAccess={(access: boolean) => props.handleAccessChange(member.user_id, access)} changeRole={(role: Role) => props.handleRoleChange(member.user_id, role)} />
                })}
            </section>
        </main>
    )
}

function LocalMemberSection(){
    const awareness = useHocuspocusAwareness()
    const provider = useHocuspocusProvider()
    const myClientId = provider.document.clientID

    return(
        <main className="flex flex-col p-2 gap-4">
            <section className="flex flex-col gap-2">
                {awareness.map((item) => {
                    const member = item.user as LocalAwarenessUser
                    if(!member || !member.name || !member.color) return null
                    return (
                        <div
                            key={item.clientId}
                            className="px-3 py-1 rounded-full text-white flex items-center"
                            style={{ backgroundColor: `${member.color}`}}>
                            <p className="grow">{item.clientId === myClientId ? "Me" : member.name}</p>
                        </div>
                    )
                })}
            </section>
        </main>
    )
}

type BadgeProps = {userId: string, userName: string, userColor: string, userRole: Role, status: 'active' | 'inactive' | 'banned', changeAccess: (access: boolean) => void, changeRole: (role: Role) => void}

function UserBadge(memberData: BadgeProps){
    const userId = useClientStore(state => state.userId)
    const userRole = useClientStore(state => state.userRole)

    const backgroundColor = {
        active: memberData.userColor,
        inactive: `color-mix(in srgb, ${memberData.userColor} 55%, white)`,
        banned: '#6b7280',
    }[memberData.status]

    const color = {
        active: 'white',
        inactive: 'black',
        banned: 'red',
    }[memberData.status]

    return(              
        <div
            className="relative cursor-pointer group px-3 py-1 rounded-full text-white flex items-center"
            style={{ backgroundColor, color }}
        >
            <p className="grow">{memberData.userId === userId ? "Me" : memberData.userName}</p>
            <p>{memberData.userRole}</p>

            <Menu myRole={userRole!} memberData={memberData}/>
        </div>
    )
}

function Menu({myRole, memberData}: {myRole: Role, memberData: BadgeProps}){
    
    if(myRole === "owner" && memberData.userRole !== "owner"){
        return(
            <div className="flex gap-1 absolute right-0 top-8 z-13 invisible group-hover:visible shrink-0 bg-transparent">
                {memberData.status !== "banned" && <button
                    onClick={() => memberData.changeRole(memberData.userRole === "contributor" ? "admin" : "contributor")}
                    className="bg-white cursor-pointer hover:bg-mauve-600 text-sm text-black hover:text-white hover:border-transparent border-black border font-normal rounded-lg px-2 py-1"
                    >{memberData.userRole === "contributor" ? "Make admin" : "Make contributor"}
                </button>}
                <button
                    onClick={() => memberData.changeAccess(memberData.status === "banned" ? true : false)}
                    className="bg-white cursor-pointer hover:bg-[#FF0000] text-sm text-[#FF0000] hover:text-white hover:border-transparent border-black border font-normal rounded-lg px-2 py-1"
                    >{memberData.status === "banned" ? "Unban member" : "Ban user"}
                </button>
            </div>
        )
    }

    if(myRole === "admin" && memberData.userRole === "contributor"){
        return(
            <div className="absolute right-0 top-8 z-13 invisible group-hover:visible shrink-0 bg-white">
                <button
                    onClick={() => memberData.changeAccess(memberData.status === "banned" ? true : false)}
                    className="cursor-pointer hover:bg-mauve-600 text-sm text-[#FF0000] hover:text-white hover:border-transparent border-black border font-normal rounded-lg px-2 py-1"
                    >{memberData.status === "banned" ? "Unban member" : "Ban member"}
                </button>
            </div>
        )
    }

    return null
}