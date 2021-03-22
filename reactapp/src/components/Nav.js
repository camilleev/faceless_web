import React from 'react';
import {Link} from 'react-router-dom'

function Nav(props) {

    return (
    <nav style={{display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "flex-start"}}>
        <Link to="/profil">
            {props.selected === "profil" ? <img src={'https://i.imgur.com/cVEACpM.png'} alt="LogoProfilSelected" style={{width: "60px"}}/> 
            : <img src={'https://i.imgur.com/NaAwKDQ.png'} alt="LogoProfil" style={{width: "60px"}}/>}
        </Link>
        <div style={{marginLeft: "130px", marginRight: "130px"}}>
        <Link to="/home">
            {props.selected === "home" ? <img src={'https://i.imgur.com/6ytgaw5.png'} alt="LogoHomeSelected" style={{width: "60px"}}/>
            : <img src={'https://i.imgur.com/EGqPW0y.png'} alt="LogoHome" style={{width: "60px"}}/>}
        </Link>
        </div>
        <Link to="/messages">
            {props.selected === "msg" ? <img src={'https://i.imgur.com/FsxFpt7.png'} alt="LogoMsgSelected" style={{width: "60px"}}/>
            : <img src={'https://i.imgur.com/w5kfhIs.png'} alt="LogoMsg" style={{width: "60px"}}/>}
        </Link>
    </nav>
  );
}

export default Nav;
