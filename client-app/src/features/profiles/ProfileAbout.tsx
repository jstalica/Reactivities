import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Button, Container, Grid, Header, Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import ProfileForm from './ProfileForm';

interface Props {
    profile: Profile
}

export default observer(function ProfileAbout({ profile }: Props) {
    const { profileStore: { isCurrentUser } } = useStore();
    const [editProfileMode, setEditProfileMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid columns={1}>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Header floated='left' icon='user' content={'About ' || profile.displayName} />
                        {isCurrentUser && (
                            <Button floated='right' basic
                                content={editProfileMode ? 'Cancel' : 'Edit'}
                                onClick={() => setEditProfileMode(!editProfileMode)}
                            />
                        )}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                    {/* <Divider /> */}
                    {!editProfileMode && (
                        <Container >
                            {profile.bio?.split('\n').map((i,key) => {
                                return <p key={key}>{i}</p>
                            })}
                        </Container>
                    )}



                    {editProfileMode && (
                        // <div>Profile Edit time</div>
                        <ProfileForm setEditProfileMode={setEditProfileMode}/>
                    )}
                
                    </Grid.Column>
                    </Grid.Row>
            </Grid>
        </Tab.Pane>
    )
})
