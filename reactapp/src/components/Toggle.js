import React, {useState} from 'react';

function Toggle (props){

    const [isClicked, setIsClicked] = useState(props.demandStatus)

    console.log("props.demandStatus", props.demandStatus)
  
    var handleDemandBox = () => {
        setIsClicked(!isClicked)
        props.handleDemandBoxParent()
    }

    return (
        <div className='centerCol' style={{width: "100%"}}>
            <input type="checkbox" id="checkbox-input" style={{display: 'none'}}/>
            <label htmlFor="checkbox-input" className="round-slider-container" onClick={()=> handleDemandBox()}>
                <div><p className="txtDemand" >Confidents</p></div>
                <div><p className="txtDemand" >Demandes ({props.demandNb})</p></div>
                <div className="round-slider" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                {isClicked ? <p className="txtDemandToggle">Demandes ({props.demandNb})</p> : <p className="txtDemandToggle">Confidents</p>}
                </div>
            </label>
        </div>
    )
}

export default Toggle;

