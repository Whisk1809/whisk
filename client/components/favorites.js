import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Segment, Container, Button} from 'semantic-ui-react'

class Favorites extends Component {
  render() {
    return (
      <Container>
        <Segment.Group>
          <Segment>
            Recipe 1
            <Button color="blue">remove</Button>
          </Segment>
          <Segment>
            Recipe 2
            <Button color="blue">remove</Button>
          </Segment>
          <Segment>
            Recipe 3
            <Button color="blue">remove</Button>
          </Segment>
        </Segment.Group>
      </Container>
    )
  }
}

export default Favorites
