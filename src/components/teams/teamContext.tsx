import React, { createContext, useContext } from 'react'
import { ITeam } from '@lib/models/team'
import { User } from '@lib/auth'

interface ITeamContext {
    team: ITeam;
    user: User;
}

export const TeamContext = createContext<ITeamContext>({
    team: null,
    user: null
})

interface TeamProviderProps {
    children: React.ReactNode;
    team: ITeam;
    user: User;
}

export const TeamProvider = (props: TeamProviderProps) => {
    const { team, user } = props
    return <TeamContext.Provider value={{ team, user }}>
        {props.children}
    </TeamContext.Provider>
}

