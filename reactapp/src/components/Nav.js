import React from 'react';
import {Link} from 'react-router-dom'

function Nav(props) {

    console.log(props.selected)
  return (
    <nav style={{display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "flex-end"}}>
        <Link to="/profil">
            {props.selected === "profil" ? <img src={'https://i.imgur.com/au58pHS.png'} alt="LogoProfilSelected" style={{width: "40px"}}/> 
            : <img src={'https://i.imgur.com/m2YOsbM.png'} alt="LogoProfil" style={{width: "40px"}}/>}
        </Link>
        <Link to="/home">
            {props.selected === "home" ? <img src={'https://i.imgur.com/zQ3tWN2.png'} alt="LogoHomeSelected" style={{width: "40px", height: "68.53", marginLeft: "100px", marginRight: "100px"}}/>
            : <img src={'https://i.imgur.com/tX9vcOL.png'} alt="LogoHome" style={{width: "40px", marginLeft: "100px", marginRight: "100px"}}/>}
        </Link>
        <Link to="/messages">
            {props.selected === "msg" ? <img src={'https://i.imgur.com/LVZVjM4.png'} alt="LogoMsgSelected" style={{width: "40px"}}/>
            : <img src={'https://i.imgur.com/JvgPSCb.png'} alt="LogoMsg" style={{width: "40px"}}/>}
        </Link>
    </nav>
  );
}

export default Nav;
