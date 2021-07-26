import React from 'react'
import AdminLayout from '@components/admin/layout'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import Canvas from '@components/admin/images/Canvas'
import { getSeasonTeams } from '@lib/season/api'
import MatchSummary from '@components/admin/images/MatchSummary'

export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP,
})(async () => {
    const seasonTeams = await getSeasonTeams('one')
    return {
        props: {
            teams: seasonTeams,
        },
    }
})

const GenerateImages = ({ teams }): JSX.Element => {
    return (
        <div>
            <style jsx>{`
                @font-face {
                    font-family: 'Bahnschrift-BoldCondensed';
                    src: url('/images/generate/Bahnschrift.TTF') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
            `}</style>
            <Tabs variant="soft-rounded" colorScheme="green">
                <TabList>
                    <Tab>Match Summary</Tab>
                    <Tab>Game Day</Tab>
                    <Tab>Daily Summary</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <MatchSummary teams={teams} />
                    </TabPanel>
                    <TabPanel>
                        <p>Game Day</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Daily Summary</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}

GenerateImages.layout = (content: React.ReactNode[]): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}

export default GenerateImages
