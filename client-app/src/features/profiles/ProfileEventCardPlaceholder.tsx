import React, { Fragment } from 'react';
import { Segment, Button, Placeholder, Grid } from 'semantic-ui-react';

export default function ProfileEventCardPlaceholder() {
    return (
        <Segment basic>
            <Grid columns={4} stackable>
                <Grid.Column>
                    <Segment raised>
                        <Placeholder>
                            <Placeholder.Image >
                            </Placeholder.Image>
                            <Placeholder.Paragraph>
                                <Placeholder.Line length='medium' />
                                <Placeholder.Line length='short' />
                                <Placeholder.Line length='short' />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                </Grid.Column>

                <Grid.Column>
                    <Segment raised>
                        <Placeholder>
                            <Placeholder.Image >
                            </Placeholder.Image>
                            <Placeholder.Paragraph>
                                <Placeholder.Line length='medium' />
                                <Placeholder.Line length='short' />
                                <Placeholder.Line length='short' />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                </Grid.Column>

                <Grid.Column>
                    <Segment raised>
                        <Placeholder>
                            <Placeholder.Image >
                            </Placeholder.Image>
                            <Placeholder.Paragraph>
                                <Placeholder.Line length='medium' />
                                <Placeholder.Line length='short' />
                                <Placeholder.Line length='short' />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                </Grid.Column>

                <Grid.Column>
                    <Segment raised>
                        <Placeholder>
                            <Placeholder.Image >
                            </Placeholder.Image>
                            <Placeholder.Paragraph>
                                <Placeholder.Line length='medium' />
                                <Placeholder.Line length='short' />
                                <Placeholder.Line length='short' />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                </Grid.Column>
            </Grid>
        </Segment>
    );
};
