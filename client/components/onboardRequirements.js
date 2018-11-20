import React, {Component} from 'react'
import {
  Grid,
  Image,
  Progress,
  Header,
  Card,
  Container,
  Button
} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {postRequirement} from '../store/requirements'
import {fetchCategories} from '../store/categories'

class OnboardRequirements extends Component {
  componentDidMount() {
    this.props.fetchCategories()
    console.log(this.props)
  }
  handleRequire = categoryId => {
    console.log('event', categoryId)
    this.props.addRequirement('categoryId', categoryId)
  }
  render() {
    return (
      <div>
        <Header>Select Your Dietary Requirements</Header>
        <Progress value="1" total="5" progress="ratio" />
        {this.props.categories ? (
          <Container textAlign="center">
            <Grid columns={3} centered padded>
              {this.props.categories.map(category => {
                return (
                  <Button
                    onClick={() => this.handleRequire(category.id)}
                    category={category.id}
                    key={category.id}
                  >
                    <Grid.Column
                      color="red"
                      className="grid-column"
                      textAlign="center"
                    >
                      {category.name}
                    </Grid.Column>
                  </Button>
                )
              })}
            </Grid>
          </Container>
        ) : null}
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
    addRequirement: (type, idOfRequirement) =>
      dispatch(postRequirement(type, idOfRequirement, true)),
    excludeRequirement: (type, idOfRequirement) => {
      dispatch(postRequirement(type, idOfRequirement, false))
    },
    fetchCategories: () => dispatch(fetchCategories())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OnboardRequirements)
