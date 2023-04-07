import { Icon } from "@chakra-ui/react";
import PropTypes from "prop-types"

export default function CircleIcon({color}) {
  return (
    <Icon viewBox='0 0 200 200' color={color} boxSize={6}>
      <path
          fill='currentColor'
          d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
      />
  </Icon>
  )
}

CircleIcon.defaultProps = {
  color:""
}
CircleIcon.propTypes = {
  color: PropTypes.string
}