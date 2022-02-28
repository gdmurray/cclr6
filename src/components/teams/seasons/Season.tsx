import React, { useContext } from 'react'
import { FaRegCreditCard, FaTimes } from 'react-icons/fa'
import { Button, Tooltip } from '@chakra-ui/react'
import { Season } from '@lib/models/season'
import { TeamContext } from '@components/teams/teamContext'
import useEligibility from '@components/teams/seasons/Eligibility'
import { Tournament } from '@lib/models/tournament'
import Loader from '@components/Loader'
import PaymentForm from '@components/teams/Payment'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { Qualifier } from './Qualifier'
import { PaymentContext, PurchaseTarget } from '@components/teams/PaymentContext'

dayjs.extend(LocalizedFormat)

export default function SeasonComponent({ season }: { season: Season }): JSX.Element {
    const teamContext = useContext(TeamContext)
    const { team, user } = teamContext

    const { isPurchasing, teamPurchases, handlePaymentClick } = useContext(PaymentContext)

    const getButtonContent = () => {
        if (!season.active) {
            return <>Event Passed</>
        }
        if (isPurchasing) {
            return (
                <>
                    Cancel Purchase&nbsp;
                    <FaTimes />
                </>
            )
        }
        return (
            <>
                Purchase Pass&nbsp;
                <FaRegCreditCard />
            </>
        )
    }

    const { eligibility, eligibilityChecklist, loading } = useEligibility({ team, user })
    return (
        <div className="bordered border rounded-xl">
            <div className="flex flex-col w-full p-4 h-full z-10 relative">
                <div className="flex-1 flex flex-row justify-between">
                    <div>
                        <div className="text-main font-heavy text-2xl md:text-3xl font-bold">
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline transition-all duration-150"
                                // href={`https://www.toornament.com/en_US/tournaments/${season.toornamentId}/information`}
                            >
                                {season.name}
                            </a>
                        </div>
                        <div className="mt-1">
                            <div className="font-semibold text-alt text-sm">
                                Date:&nbsp;{dayjs(season.start_date).format('LL')}
                                &nbsp;-&nbsp;{dayjs(season.end_date).format('LL')}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {teamPurchases.length === 0 && (
                            <Tooltip
                                isDisabled={isPurchasing}
                                label="Pass grants you access to all Qualifiers"
                                hasArrow
                            >
                                <Button
                                    colorScheme={isPurchasing || !season.active ? 'red' : 'green'}
                                    onClick={() =>
                                        handlePaymentClick({
                                            target: PurchaseTarget.SEASON_PASS,
                                            id: season.id,
                                            name: season.name,
                                        })
                                    }
                                >
                                    {getButtonContent()}
                                </Button>
                            </Tooltip>
                        )}
                        {eligibilityChecklist()}
                    </div>
                </div>
                {isPurchasing && <PaymentForm season={season} team={team} />}
                <div className="mt-4">
                    <div className="font-semibold text-main pb-1">Qualifiers</div>
                    <div
                        className={`p-2 bordered border-2 rounded-xl space-y-2 ${
                            eligibility?.eligible ? '' : 'disabled'
                        }`}
                    >
                        {loading && <Loader text="Loading Qualifiers" />}
                        {!loading &&
                            season.qualifiers.map((qualifier) => {
                                return (
                                    <Qualifier
                                        key={qualifier.id}
                                        qualifier={qualifier as Tournament}
                                        eligibility={eligibility}
                                        season={season}
                                    />
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
}
