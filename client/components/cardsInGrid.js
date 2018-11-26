import React from 'react'
import { Grid, Segment, Header, Image, Card, Icon, Button, Divider, Radio, Form, Container } from 'semantic-ui-react';

const GridExampleStretchedEqual = () => (
  <Grid columns='equal'>
    <Grid.Row stretched>
      <Grid.Column>
        <Segment>1</Segment>
        <Segment>2</Segment>
      </Grid.Column>
      <Grid.Column width={6}>
        <Segment>
          <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment>1</Segment>
        <Segment>2</Segment>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Segment>1</Segment>
        <Segment>2</Segment>
      </Grid.Column>
      <Grid.Column width={6}>
        <Segment>
          <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment>1</Segment>
        <Segment>2</Segment>
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default GridExampleStretchedEqual
