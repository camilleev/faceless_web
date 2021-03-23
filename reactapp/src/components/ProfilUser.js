import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import { Location, Power, SettingsOutline} from 'react-ionicons'
import BtnSoucis from './BtnSoucis'
import { Redirect } from 'react-router';


import Nav from './Nav'
import Modal from './Modal'
import { Link } from '@material-ui/core';


function Profil(props) {

    var descDefault = "Tu n'as pas renseigné de description, n'hésite pas à en écrire une pour trouver de nouveaux confidents!"

    var updateProfil = () => {
        props.updateProfilParent()
    }
  
    if(props.token){

      return (
        <div>
            <Nav selected="profil"/>
            <div className="centerCol">
              <div className="card" style={{alignItems: "center", height: "600px"}}>
                <img src={props.user.avatar} alt="avatar" style={{width: 100, height: 100, border: "5px solid #EC9A1F", borderRadius: "50%"}}/>
                <div className="centerCol">
                  <p className="txtPseudo">{props.user.pseudo}</p>
                  <p className="txtMember" style={{marginTop: "7px", marginBottom: "7px"}}>Membre depuis le {props.date}</p>
                  <div className="centerRowJustifyCenter">
                    <Location color={'#3D4F84'} width="25px" />
                    <p className="txtLocation" style={{marginLeft: "5px"}}>Region de {props.localisation}</p>
                  </div>
                </div>
                <div className='centerRowFlexEnd' style={{width: "100%", marginTop: "10px"}}>
                  <div className="centerCol">
                    <img src={props.imgGender} alt="gender" style={{width: "30px"}}/>
                    <p className="txtSubtitle">{props.gender}</p>
                  </div>
                  <div className="centerCol" style={{marginLeft: "30px", marginRight: "30px"}}>
                    <img src={'https://i.imgur.com/FNaPA8d.png'} alt="gender" style={{width: "30px"}}/>
                    <p className="txtSubtitle">femme</p>
                  </div>
                  <div className="centerCol">
                    <p className="txtAge">{props.age}</p>                  
                    <p className="txtSubtitle">ans</p>
                  </div>
                </div>
                <div style={{width: "100%"}}>
                  <p className="orangeTitle" style={{textAlign: "left"}}>En quelques mots</p>
                  { props.desc === descDefault ? <p className="txtIntro" style={{maxHeight: "150px", overflowY: "scroll", fontStyle: "italic", fontWeight: "normal", opacity: 0.5}}>{props.desc}</p> : <p className="txtIntro" style={{maxHeight: "150px", overflowY: "scroll"}}>{props.desc}</p>}
                </div>
                <div style={{width: "100%"}}>
                  <p className="orangeTitle" style={{textAlign: "left"}}>Ses soucis</p>
                  <BtnSoucis problemType={props.problemType}/>
                </div>
                <div className='centerRowFlexEnd' style={{width: "100%", justifyContent: "space-between"}}>
                  <Modal btn={"deconnexion"}/>
                  <button className="btn" onClick={()=> updateProfil()}>
                        <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "10px", marginRight: "10px"}}><SettingsOutline color={'#FFFFFF'} width="22px" style={{marginRight: "8px"}} />Modifier mon profil</p>
                  </button>
                </div>
              </div>
            </div>
        </div>
    );
    } else {
        return <Redirect to='/' />
    }
}


function mapStateToProps(state) {
  return { token: state.token }
}


export default connect(
  mapStateToProps,
  null
 )(Profil);