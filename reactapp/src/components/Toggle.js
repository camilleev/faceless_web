import React, {useState} from 'react';

function Toggle (){

    const [isClicked, setIsClicked] = useState(true)
    console.log("isClicked", isClicked)
  
    var handleCheckbox = () => {
      setIsClicked(!isClicked)
    }

    return (
        <div className='centerCol'>
                        <input type="checkbox" id="checkbox-input" style={{display: 'none'}}/>
                        <label htmlFor="checkbox-input" className="round-slider-container" onClick={()=> handleCheckbox()}>
                            <div><p className="txtDemand" >Confidents</p></div>
                            <div><p className="txtDemand" >Demandes</p></div>
                            <div className="round-slider" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            {isClicked ? <p className="txtDemandToggle">Confidents</p> : <p className="txtDemandToggle">Demandes</p>}
                            </div>
                        </label>
        </div>
    )
}

export default Toggle;

