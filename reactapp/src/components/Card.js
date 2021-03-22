import React from 'react';
import { Location, Send } from 'react-ionicons'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'

import BtnSoucis from './BtnSoucis';

function Card(props) {

    var descDefault = "Cette personne n'a pas renseigné de description, n'hésite pas à lui écrire pour en apprendre plus sur elle!"

    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--; 
        }
        return age;
    }

    var genderSrc = [
        {img: 'https://i.imgur.com/S1xUry1.png'},
        {img: 'https://i.imgur.com/FNaPA8d.png'},      
        {img: 'https://i.imgur.com/EvKcqi9.png'},
    ]

    var genderTxt
    var genderImg
    if(props.user.gender === 'female'){
      genderTxt = "femme"
      genderImg = genderSrc[0].img
    } else if (props.user.gender === 'male'){
      genderTxt = "homme"
      genderImg = genderSrc[1].img
    } else if(props.user.gender === 'other'){
      genderTxt = "other"
      genderImg = genderSrc[2].img
    }
    let when = new Date(props.user.subscriptionDate)
    let date = when.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    var age = getAge(props.user.birthDate)


  async function createConv(contactId, token) {
    console.log('myId', token)
    console.log('contactId', contactId)
    var rawResponse = await fetch(`/create-conv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `myContactId=${contactId}&myToken=${token}`
    });
    var response = await rawResponse.json();
    console.log("create conv", response.convId)

  }

  
  

    return (
        <div className="centerColumn" style={{minHeight: "500px"}}>
        <div className="cardWithShadow" style={{minHeight: "500px"}}>
          <img src={props.user.avatar} alt="avatar" style={{width: 100, height: 100, marginTop: "-20%", border: "5px solid #EC9A1F", borderRadius: "50%"}}/>
          <div className="centerCol">
            <p className="txtPseudo">{props.user.pseudo}</p>
            <p className="txtMember" style={{marginTop: "7px", marginBottom: "7px"}}>Membre depuis le {date}</p>
            <div className="centerRowJustifyCenter">
              <Location color={'#3D4F84'} width="25px" />
              <p className="txtLocation" style={{marginLeft: "5px"}}>Region de {props.user.localisation.label}</p>
            </div>
          </div>
          <div className='centerRowFlexEnd' style={{width: "100%", marginTop: "10px"}}>
            <div className="centerCol">
              <img src={genderImg} alt="gender" style={{width: "30px"}}/>
              <p className="txtSubtitle">{genderTxt}</p>
            </div>
            <div className="centerCol" style={{marginLeft: "30px", marginRight: "30px"}}>
              <img src={genderImg} alt="gender" style={{width: "30px"}}/>
              <p className="txtSubtitle">{genderTxt}</p>
            </div>
            <div className="centerCol">
              <p className="txtAge">{age}</p>                  
              <p className="txtSubtitle">ans</p>
            </div>
          </div>
          <div style={{width: "100%"}}>
            <p className="orangeTitle" style={{textAlign: "left"}}>En quelques mots</p>
            { props.user.problem_description === "" ? <p className="txtIntro" style={{maxHeight: "150px", overflowY: "scroll", fontStyle: "italic", fontWeight: "normal", opacity: 0.5}}>{descDefault}</p> : <p className="txtIntro" style={{maxHeight: "150px", overflowY: "scroll"}}>{props.user.problem_description}</p>}
          </div>
          <div style={{width: "100%"}}>
            <p className="orangeTitle" style={{textAlign: "left"}}>Ses soucis</p>
            <BtnSoucis problemType={props.user.problems_types}/>
          </div>
          <div className='centerRowJustifyCenter' style={{marginTop: "15px"}}>
            <Link to='/messages'>
                <button className="btn" onClick={()=> createConv(props.user._id, props.token)}>
                      <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "10px", marginRight: "10px"}}><Send color={'#FFFFFF'} width="19px" style={{marginRight: "8px", transform: 'rotate(-45deg)'}} />Envoyer un message</p>
                </button>
            </Link>
          </div>
        </div>
      </div>
   );
  }


// export default Card;

function mapStateToProps(state) {
  return { 
    token: state.token,
   }
}

export default connect(
  mapStateToProps,
  null
 )(Card);
