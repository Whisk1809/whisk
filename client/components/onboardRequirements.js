import React, {Component} from 'react'
import {Grid, Image, Progress, Header} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {postRequirement} from '../store/requirements'

class OnboardRequirements extends Component {
  render() {
    return (
      <div>
        <Header>Select Your Dietary Requirements</Header>
        <Progress value="1" total="5" progress="ratio" />

        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column>
              <Image src="/images/wireframe/media-paragraph.png" />
            </Grid.Column>
            <Grid.Column>
              <Image src="/images/wireframe/media-paragraph.png" />
            </Grid.Column>
            <Grid.Column>
              <Image src="/images/wireframe/media-paragraph.png" />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Image src="/images/wireframe/media-paragraph.png" />
            </Grid.Column>
            <Grid.Column>
              <Image src="/images/wireframe/media-paragraph.png" />
            </Grid.Column>
            <Grid.Column>
              <Image src="/images/wireframe/media-paragraph.png" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    categories: state.categories
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addRequirement: (type, idOfRequirement, requirement) =>
      dispatch(postRequirement(type, idOfRequirement, requirement))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OnboardRequirements)
