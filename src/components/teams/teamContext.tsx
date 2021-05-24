import React, { createContext, useContext } from 'react'
import { ITeam } from '@lib/models/team'
import { User } from '@lib/auth'

interface ITeamContext {
    team: ITeam;
    user: User;
    setTeam: (team: ITeam) => void
}

export const TeamContext = createContext<ITeamContext>({
    team: null,
    user: null,
    setTeam: (_: ITeam) => null
})

interface TeamProviderProps {
    children: React.ReactNode;
    team: ITeam;
    user: User;
    setTeam: (team: ITeam) => void;
}

export const TeamProvider = (props: TeamProviderProps) => {
    const { team, user, setTeam } = props
    return <TeamContext.Provider value={{ team, user, setTeam }}>
        {props.children}
    </TeamContext.Provider>
}

