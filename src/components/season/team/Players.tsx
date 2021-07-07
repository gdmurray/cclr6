import { Image, useColorMode } from '@chakra-ui/react'
import { getHostName } from '@lib/utils'
import React from 'react'
import { IPlayer } from '@lib/models/player'
import { FaTwitch, FaTwitter } from 'react-icons/fa'

function PlayerCard({ player }: { player: IPlayer }): JSX.Element {
    const { colorMode } = useColorMode()
    return (
        <div className="flex flex-col justify-center pt-5" style={{ width: '90px', height: '175px' }}>
            <Image
                className="mx-auto"
                src={`${getHostName()}/images/${
                    colorMode === 'light' ? 'liquipedia_default_light.png' : 'liquipedia_default_dark.png'
                }`}
                width={115}
            />
            <div className="flex flex-col mt-1 text-sm font-medium text-center" style={{ height: '35px' }}>
                <span className="flex flex-row text-center whitespace-nowrap justify-center">
                    <img
                        style={{ width: '15px', marginRight: '0.25em' }}
                        src={`${getHostName()}/images/${player.country.toLowerCase()}.svg`}
                    />
                    {player.uplay}
                </span>

                <div className="text-center flex flex-row justify-center py-1 text-lg space-x-2">
                    {player.twitter && (
                        <a
                            className="hover:text-twitter"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://twitter.com/${player.twitter}`}
                        >
                            <FaTwitter />
                        </a>
                    )}
                    {player.twitch && (
                        <a
                            className="hover:text-twitch"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://twitch.com/${player.twitch}`}
                        >
                            <FaTwitch />
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

const Players = ({ players }: { players: IPlayer[] }): JSX.Element => {
    const { colorMode } = useColorMode()
    return (
        <>
            <div className="py-4">
                <div className="page-title-sm">Players</div>
                <div className="flex flex-row space-x-6 justify-around">
                    {players
                        .filter((_, idx) => idx < 5)
                        .map((player) => {
                            console.log(player.twitter)
                            return <PlayerCard key={player.id} player={player} />
                        })}
                </div>
            </div>
            <div>
                {players.filter((_, idx) => idx > 4).length > 0 ? (
                    <div className="py-4">
                        <div className="page-title-sm">Substitutes</div>
                        <div className="flex flex-row space-x-6 justify-center">
                            {players
                                .filter((_, idx) => idx > 4)
                                .map((player) => {
                                    return <PlayerCard key={player.id} player={player} />
                                })}
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

export default Players
