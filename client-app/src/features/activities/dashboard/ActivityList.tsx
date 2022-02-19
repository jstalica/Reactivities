import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";


export default observer(function ActivityList() {
    const [target,setTarget] = useState('');
    const {activityStore} = useStore();
    const {loading,activitiesByDate,deleteActivity} = activityStore;

    function handleActivityDelete(event: SyntheticEvent<HTMLButtonElement>, id:string){
        setTarget(event.currentTarget.name);
        deleteActivity(id);
    }
    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Content as='a'>{activity.title}</Item.Content>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => activityStore.selectActivity(activity.id)} floated="right" content='View' color='blue'/>
                                <Button 
                                    name={activity.id}
                                    onClick={(e) => handleActivityDelete(e,activity.id)} 
                                    floated="right" 
                                    loading={loading && target === activity.id} 
                                    content='Delete' 
                                    color='red'/>
                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})