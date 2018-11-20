import React, {Component} from 'react'
import Slider from 'react-slick'
import RecipeCard from './recipeCard'

class RecipeSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 250,
      slidesToShow: 3,
      slidesToScroll: 3
    }
    const {recipes} = this.props
    const {allIds, byId} = recipes
    return (
      <div>
        <div>
          <h3>Recipes for you</h3>
          <Slider {...settings}>
            {allIds.map(id => {
              return (
                <div key={id}>
                  <RecipeCard recipe={byId[id]} />
                </div>
              )
            })}
          </Slider>
        </div>
        <div>
          <h3>Trending</h3>
          <Slider {...settings}>
            {allIds.map(id => {
              return (
                <div key={id}>
                  <RecipeCard recipe={byId[id]} />
                </div>
              )
            })}
          </Slider>
      </div>
      <div>
        <h3>Popular</h3>
        <Slider {...settings}>
          {allIds.map(id => {
            return (
              <div key={id}>
                <RecipeCard recipe={byId[id]} />
              </div>
            )
          })}
        </Slider>
      </div>
      <div>
        <h3>Try something new</h3>
        <Slider {...settings}>
          {allIds.map(id => {
            return (
              <div key={id}>
                <RecipeCard recipe={byId[id]} />
              </div>
            )
          })}
        </Slider>
      </div>
     </div>
    )
  }
}

export default RecipeSlider
