import { format } from 'date-fns';
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Card , Image} from 'semantic-ui-react'
import { ProfileEvent } from '../../app/models/profile'

interface Props {
    profileEvent: ProfileEvent
}

export default observer(function ProfileEventCard({profileEvent}: Props) {
    return (
        <Card raised as={Link} to={`/activities/${profileEvent.id}`}>
            <Image 
                src={`/assets/categoryImages/${profileEvent.category}.jpg`}
                style={{minHeight:100, objectFit: 'cover'}}
            />
            <Card.Content>
                <Card.Header textAlign='center'>
                    {profileEvent.title}
                </Card.Header>
                <Card.Meta textAlign='center'>
                    <div>{format(new Date(profileEvent.date),'do LLL')}</div>
                    <div>{format(new Date(profileEvent.date),'h:mm a')}</div>
                </Card.Meta>
            </Card.Content>
        </Card>
    )
})
