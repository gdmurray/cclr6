import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { ToornamentClient } from '@lib/api/toornament'
import { ITeam, Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'
import React from 'react'
import { AnalystLayout } from '@components/analyst/layout'
import { Match } from '@lib/models/toornament'
import { MapStats, MatchStatsForm, useMatchForm } from '@components/analyst/match'
import { FaPlus, FaSyncAlt } from 'react-icons/fa'
import { Button, Input } from '@chakra-ui/react'
import { FormProvider, useFieldArray } from 'react-hook-form'
import { FormControl, FormLabel } from '@chakra-ui/form-control'

export const getServerSideProps = withAuthSSR({
    whenNotAnalyst: AuthAction.REDIRECT_TO_APP,
})(async ({ params }) => {
    const { match } = params
    if (!match) {
        return {
            notFound: true,
        }
    }

    const client = new ToornamentClient()
    const matchObject = await client.getMatchById(match)
    if (matchObject == null) {
        return {
            notFound: true,
        }
    }
    const teamOneId = matchObject.opponents[0].participant.custom_user_identifier
    const teamTwoId = matchObject.opponents[1].participant.custom_user_identifier
    const teamOneData = await Teams.getTeamById(teamOneId, adminFireStore)
    const teamTwoData = await Teams.getTeamById(teamTwoId, adminFireStore)
    const teamOnePlayers = await Teams.getPlayers(teamOneId, adminFireStore)
    const teamTwoPlayers = await Teams.getPlayers(teamTwoId, adminFireStore)

    const teamOne = {
        ...teamOneData,
        players: teamOnePlayers.docs.map((player) => ({
            id: player.id,
            ...player.data(),
        })),
    }

    const teamTwo = {
        ...teamTwoData,
        players: teamTwoPlayers.docs.map((player) => ({
            id: player.id,
            ...player.data(),
        })),
    }

    const playerMap = {
        [teamOne.id]: teamOne.players.reduce((acc, player) => {
            acc[player.uplay] = player.id
            return acc
        }, {}),
        [teamTwo.id]: teamTwo.players.reduce((acc, player) => {
            acc[player.uplay] = player.id
            return acc
        }, {}),
    }

    const matchStats = await adminFireStore.collection('matchStats').where('match_id', '==', match).get()
    const previousStats = matchStats.empty
        ? null
        : matchStats.docs.reduce((acc, elem) => {
              acc = { id: elem.id, ...elem.data() }
              return acc
          }, {})

    return {
        props: {
            teamOne,
            teamTwo,
            match: matchObject,
            uplayMap: playerMap,
            previousStats: previousStats,
        },
    }
})

type Props = {
    teamOne: ITeam
    teamTwo: ITeam
    match: Match
    uplayMap: any
    previousStats: MatchStatsForm | null
}

const MatchDetailAnalysis = ({ teamOne, teamTwo, match, uplayMap, previousStats }: Props): JSX.Element => {
    // const [playerMap, setPlayerMap] = useState()
    //
    // useEffect(() => {
    //     if (uplayMap && !playerMap) {
    //         setPlayerMap(playerMap)
    //     }
    // }, [uplayMap, playerMap])

    const defaultValues =
        previousStats ??
        ({
            match_id: match.id,
            match_date: match.scheduled_datetime,
            team_one_id: teamOne.id,
            team_two_id: teamOne.id,
            maps: [],
        } as Partial<MatchStatsForm>)

    const { methods, onSubmit, syncWithSheets } = useMatchForm(defaultValues)

    const { control } = methods
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'maps',
    })

    return (
        <div className="page-content">
            <p className={'page-title-sm mb-4'}>
                {teamOne.name} vs {teamTwo.name}
                <Button
                    colorScheme={'green'}
                    size={'sm'}
                    className={'ml-4'}
                    leftIcon={<FaSyncAlt />}
                    disabled={previousStats == null}
                    onClick={() => {
                        syncWithSheets(previousStats.id)
                    }}
                >
                    Sync With Sheets
                </Button>
            </p>
            <div className="inner-content">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className="bordered rounded-xl border p-4 mb-4">
                            <FormControl
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <FormLabel>Match Id</FormLabel>
                                <Input w={200} readOnly={true} variant={'unstyled'} {...methods.register('match_id')} />
                            </FormControl>
                            <Button type="submit">SAVE STATS</Button>
                        </div>
                        <div className={'space-y-4'}>
                            {fields.map((mapField, index) => {
                                return (
                                    <MapStats
                                        key={`map-${index}`}
                                        index={index}
                                        teamOne={teamOne}
                                        teamTwo={teamTwo}
                                        teamPlayerMap={uplayMap}
                                        onRemove={remove}
                                    />
                                )
                            })}
                        </div>
                        <Button
                            className={'mt-4'}
                            type={'button'}
                            onClick={() => {
                                append({})
                            }}
                            rightIcon={<FaPlus />}
                        >
                            Add Map{' '}
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}

MatchDetailAnalysis.layout = (content: React.ReactNode): JSX.Element => {
    return <AnalystLayout>{content}</AnalystLayout>
}

export default MatchDetailAnalysis
