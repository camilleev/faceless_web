import React, {useState, useEffect} from 'react';
import {withStyles  } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

export default function SliderHome(props) {
  const [value, setValue] = useState(props.defaultValue);

  useEffect (() => {
    setValue(props.defaultValue)
  }, [props.defaultValue])


  // console.log("props.defaultValue", props.defaultValue)
  // console.log("value composant", value)

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.valueSliderParent(newValue)
};


  return (
    <div>
        <AirbnbSlider 
            value={value}
            onChange={handleChange}
            max={props.max}
            min={props.min}
        />
    </div>
  );
}

const AirbnbSlider = withStyles({
    root: {
      color: "linear-gradient(180deg, #7E94E2 0%, #2958E5 100%)",
      height: 3,
      padding: '13px 0',
      width: "90%",
    },
    thumb: {
      height: 22,
      width: 22,
      backgroundImage: "linear-gradient(180deg, #F0B865 0%, #EC9A1F 100%)",
      marginTop: -10,
      marginLeft: -13,
      boxShadow: '#ebebeb 0 2px 2px',
      '&:focus, &:hover, &$active': {
        boxShadow: '#ccc 0 2px 3px 1px',
      },
      '& .bar': {
        // display: inline-block !important;
        height: 9,
        width: 1,
        backgroundColor: 'currentColor',
        marginLeft: 1,
        marginRight: 1,
      },
    },
    active: {},
    track: {
      height: 3,
    },
    rail: {
      color: '#A09B93',
      opacity: 0.5,
      height: 3,
      borderRadius: "9px"
  
    },
  })(Slider);
  