import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import { Location, Power, SettingsOutline} from 'react-ionicons'
import BtnSoucis from './BtnSoucis'
import { Redirect } from 'react-router';


import Nav from './Nav'
import Modal from './Modal'
import { Link } from '@material-ui/core';
import ProfilUpdate from './ProfilUpdate';


function Profil(props) {

  var descDefault = "Tu n'as pas renseigné de description, n'hésite pas à en écrire une pour trouver de nouveaux confidents!"

  const [user, setUser] = useState('')
  const [date, setDate] = useState('')
  const [problemType, setProblemType] = useState([])
  const [age, setAge] = useState('')
  const [gender, setGender] = useState(2)
  const [desc, setDesc] = useState(descDefault)
  const [localisation, setLocalisation] = useState("")

  const[update, setUpdate] = useState(false)

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

  var updateProfil = () => {
    setUpdate(true)
  }

  useEffect(() => {

    async function fetchData(){
      var rawResponse = await fetch('/find-user', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `token=${props.token}`
      });
      var response = await rawResponse.json();

      console.log("response", response)

      if(response.result){
        setUser(response.user)
        let when = new Date(response.user.subscriptionDate)
        let whenFormat = when.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        setDate(whenFormat)
        setProblemType(response.user.problems_types)
        var age = getAge(response.user.birthDate)
        setAge(age)
        if(response.user.gender === "female") {
          setGender(0)
        } else if(response.user.gender === "male") {
          setGender(1)
        } else {
          setGender(2)
        }
        if(response.user.problem_description !== ''){
          setDesc(response.user.problem_description)
        }
        setLocalisation(response.user.localisation.label)
      }
    }

    fetchData()

    
  }, [props.token]);
  
  
  if(props.token){

    var genderSrc = [
      {img: 'https://i.imgur.com/S1xUry1.png' , txt: "femme"},
      {img: 'https://i.imgur.com/FNaPA8d.png', txt: "homme"},      
      {img: 'https://i.imgur.com/EvKcqi9.png', txt: "other"},
    ]

    if(update){
      console.log("UPDATE TRUE")
      return (
        <ProfilUpdate user={user} desc={desc} age={age} gender={genderSrc[gender].txt} imgGender={genderSrc[gender].img} date={date}/>
      )
    } else {
      return (
        <div>
            <Nav selected="profil"/>
            <div className="centerCol">
              <div className="card" style={{alignItems: "center"}}>
                <img src={user.avatar} alt="avatar" style={{width: 100, height: 100, border: "5px solid #EC9A1F", borderRadius: "50%"}}/>
                <div className="centerCol" style={{width: "100%"}}>
                  <p className="txtPseudo">{user.pseudo}</p>
                  <p className="txtMember" style={{marginTop: "7px", marginBottom: "7px"}}>Membre depuis le {date}</p>
                  <div className="centerRowJustifyCenter">
                    <Location color={'#3D4F84'} width="25px" />
                    <p className="txtLocation" style={{marginLeft: "5px"}}>Region de {localisation}</p>
                  </div>
                </div>
                <div className='centerRowFlexEnd' style={{width: "100%", marginTop: "10px"}}>
                  <div className="centerCol">
                    <img src={genderSrc[gender].img} alt="gender" style={{width: "30px"}}/>
                    <p className="txtSubtitle">{genderSrc[gender].txt}</p>
                  </div>
                  <div className="centerCol" style={{marginLeft: "30px", marginRight: "30px"}}>
                    <img src={'https://i.imgur.com/FNaPA8d.png'} alt="gender" style={{width: "30px"}}/>
                    <p className="txtSubtitle">femme</p>
                  </div>
                  <div className="centerCol">
                    <p className="txtAge">{age}</p>                  
                    <p className="txtSubtitle">ans</p>
                  </div>
                </div>
                <div style={{width: "100%"}}>
                  <p className="orangeTitle" style={{textAlign: "left"}}>En quelques mots</p>
                  { desc === descDefault ? <p className="txtIntro" style={{maxHeight: "150px", overflowY: "scroll", fontStyle: "italic", fontWeight: "normal", opacity: 0.5}}>{desc}</p> : <p className="txtIntro" style={{maxHeight: "150px", overflowY: "scroll"}}>{desc}</p>}
                </div>
                <div style={{width: "100%"}}>
                  <p className="orangeTitle" style={{textAlign: "left"}}>Ses soucis</p>
                  <BtnSoucis problemType={problemType}/>
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
    }
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