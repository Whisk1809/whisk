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
    return (
      <div>
        <Slider {...settings}>
          {this.props.recipes.map(recipe => {
            return (
              <div>
                <RecipeCard recipe={recipe} />
              </div>
            )
          })}
        </Slider>
      </div>
    )
  }
}

export default RecipeSlider
