import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Icon, Image } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import FollowButton from './FollowButton'

interface Props {
    profile: Profile
}

function truncateString(s: string | undefined, n: number) {
    if (!s) return '';
    if (s.length < n) return s;

    return s.slice(0, n) + '...';
}

export default observer(function ProfileCard({ profile }: Props) {
    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>
                    {profile.displayName}
                </Card.Header>
                <Card.Description>
                    {profile.bio && truncateString(profile.bio, 40)}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                {profile.followersCount} {profile.followersCount === 1 ? ' follower' : ' followers'}
            </Card.Content>
            <FollowButton profile={profile} />
        </Card>
    )
})
