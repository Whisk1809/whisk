import React, {Component} from 'react'
import Slider from 'react-slick'
import RecipeCard from './recipeCard'

class RecipeSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 250,
      slidesToShow: 6,
      slidesToScroll: 3
    }
    const {recipes} = this.props
    return (
      <Slider {...settings}>
        {recipes.map(recipe => {
          return (
            <div key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </div>
          )
        })}
      </Slider>
    )
  }
}

export default RecipeSlider
