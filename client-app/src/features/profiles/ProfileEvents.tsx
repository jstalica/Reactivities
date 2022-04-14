import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Card, Grid, Header, Icon, Loader, Segment, Tab } from 'semantic-ui-react'
import { PagingParams } from '../../app/models/pagination'
import { useStore } from '../../app/stores/store'
import ProfileEventCard from './ProfileEventCard'
import ProfileEventCardPlaceholder from './ProfileEventCardPlaceholder'

const panes = [
    {
        menuItem: 'Future Events',
        render: () => <></>,
    },
    {
        menuItem: 'Past Events',
        render: () => <></>,
    },
    {
        menuItem: 'Hosting',
        render: () => <></>,
    },
]

export default observer(function ProfileEvents() {
    const { profileStore } = useStore();
    const { setPredicate, loadEvents, loadingEvents, events, pagination, setPagingParams } = profileStore
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1, 4))
        loadEvents().then(() => setLoadingNext(false));
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar' content='Activities' />
                </Grid.Column>
            </Grid>
            <Grid>
                <Grid.Column width={16}>
                    <Tab
                        menu={{ secondary: true, pointing: true }}
                        panes={panes}
                        onTabChange={(e, data) => setPredicate(data.activeIndex as number)}
                    />
                    {loadingEvents && !loadingNext ? (
                        <>
                            <ProfileEventCardPlaceholder />
                        </>
                    ) : (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                            initialLoad={false}
                        >
                            <Segment
                                loading={loadingEvents && !loadingNext}
                                basic
                            >
                                <Grid>
                                    <Grid.Column width={16}>
                                        <Card.Group itemsPerRow={4} stackable>
                                            {events.map(event => (
                                                <ProfileEventCard key={event.id} profileEvent={event} />
                                            ))}
                                        </Card.Group>
                                    </Grid.Column>
                                    <Grid.Column width='16'>
                                        <Loader active={loadingNext} />
                                    </Grid.Column>

                                    {(!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages) &&
                                        <Grid.Column width={16}>
                                            <Header as='h3'>
                                                <Icon.Group size='large'>
                                                    <Icon name='long arrow alternate down' />
                                                    {/* <Icon corner name='add' /> */}
                                                </Icon.Group>
                                                Scroll for more
                                            </Header>
                                        </Grid.Column>}
                                </Grid>

                            </Segment>
                        </InfiniteScroll>
                    )}

                </Grid.Column>
            </Grid>
        </Tab.Pane>

    )
})
