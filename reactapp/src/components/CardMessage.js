import React from 'react';
import { Location } from 'react-ionicons'
import {connect} from 'react-redux';

import Modal from './Modal'

import BtnSoucis from './BtnSoucis';


function CardMessage(props) {

    var descDefault = "Cette persone n'a pas renseigné de description, n'hésite pas à lui écrire pour en apprendre plus sur elle!"

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

    const blockUser = (userId) => {
      props.blockUserMessage(userId)
    };

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
  
    return (
        <div className="centerColumn">
        <div className="cardWithShadow" style={{width: "80%", minHeight:'500px'}}>
          <img src={props.user.avatar} alt="avatar" style={{width: 100, height: 100, marginTop: "-20%", border: "5px solid #EC9A1F", borderRadius: "50%"}}/>
          <div className="centerCol" style={{width: "100%"}}>
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
          <div style={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between'}}>
                <Modal btn={"aider"}/>
                <Modal btn={"signaler"}/>
                <Modal btn={"bloquer"} userId={props.user._id} blockUserCard={blockUser}/>
                
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
 )(CardMessage);
