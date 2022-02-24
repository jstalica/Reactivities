import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponents from '../../../app/layouts/LoadingComponents';
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ActivityDetailedHeader from '../details/ActivityDetailedHeader'
import ActivityDetailedInfo from '../details/ActivityDetailedInfo'
import ActivityDetailedChat from '../details/ActivityDetailedChat'
import ActivityDetailedSideBar from '../details/ActivityDetailedSideBar'


export default observer(function ActivityDetails() {
    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) loadActivity(id);
    }, [id, loadActivity]);

    if (loadingInitial || !activity) return <LoadingComponents />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSideBar />
            </Grid.Column>
        </Grid>
    )
})