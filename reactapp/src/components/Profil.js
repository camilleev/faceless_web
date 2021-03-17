import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import { Location, Power, SettingsOutline} from 'react-ionicons'


import Nav from './Nav'
import { Redirect } from 'react-router';

function Profil(props) {

  var descDefault = "Tu n'as pas renseigné de description, n'hésite pas à en écrire une pour trouver de nouveaux confidents!"

  const [user, setUser] = useState('')
  const [date, setDate] = useState('')
  const [problemType, setProblemType] = useState([])
  const [age, setAge] = useState('')
  const [gender, setGender] = useState(2)
  const [desc, setDesc] = useState(descDefault)

  useEffect(() => {

    async function fetchData(){
      var rawResponse = await fetch('/find-user', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `token=${props.token}`
      });
      var response = await rawResponse.json();
      if(response.result){
        setUser(response.user)
        let when = new Date(response.user.subscriptionDate)
        let whenFormat = when.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        setDate(whenFormat)
        setProblemType(response.user.problems_types)
        let birthday = new Date(response.user.birthDate)
        let today = new Date()
        setAge(today.getFullYear() - birthday.getFullYear())
        if(response.user.gender === "female") {
          console.log("1111")
          setGender(0)
        } else if(response.user.gender === "male") {
          console.log("2222")
          setGender(1)
        } else {
          console.log("3333")
          setGender(2)
        }
        if(response.user.problem_description !== ''){
          setDesc(response.user.problem_description)
        }
      }
    }

    fetchData()

    
  }, [props.token]);
  
  
  if(props.token){
    
    console.log("user", user)
    var allProblems = problemType.map((item, i) => {
      return (
        <button key={i} className="btnProblemTypeSelected noHover" style={{marginRight: "10px", marginBottom: "10px"}}><p className="txtBtnProblemType">{item}</p></button>
       )
    })

    var genderSrc = [
      {img: 'https://i.imgur.com/S1xUry1.png' , txt: "femme"},
      {img: 'https://i.imgur.com/FNaPA8d.png', txt: "homme"},      
      {img: 'https://i.imgur.com/EvKcqi9.png', txt: "other"},
    ]

    console.log(genderSrc[gender].txt)

    return (
        <div>
            <Nav selected="profil"/>
            <div className="centerColumn">
              <div className="card">
                <img src={user.avatar} alt="avatar" style={{width: 100, height: 100, marginTop: "-20%", border: "5px solid #EC9A1F", borderRadius: "50%"}}/>
                <div className="centerCol" style={{width: "100%"}}>
                  <p className="txtPseudo">{user.pseudo}</p>
                  <p className="txtMember" style={{marginTop: "7px", marginBottom: "7px"}}>Membre depuis le {date}</p>
                  <div className="centerRowJustifyCenter">
                    <Location color={'#3D4F84'} width="25px" />
                    <p className="txtLocation" style={{marginLeft: "5px"}}>Region de {user.localisation}</p>
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
                  { desc == descDefault ? <p className="txtIntro" style={{maxHeight: "150px", overflowY: "scroll", fontStyle: "italic", fontWeight: "normal", opacity: 0.5}}>{desc}</p> : <p className="txtIntro" style={{maxHeight: "150px", overflowY: "scroll"}}>{desc}</p>}
                </div>
                <div style={{width: "100%"}}>
                  <p className="orangeTitle" style={{textAlign: "left"}}>Ses soucis</p>
                  {allProblems}
                </div>
                <div className='centerRowFlexEnd' style={{width: "100%", justifyContent: "space-between"}}>
                  <button className="btnRed" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "10px", marginRight: "10px"}} onClick={()=> props.clearToken()}><Power color={'#FFFFFF'} width="22px" style={{marginRight: "8px"}} />déconnecter</p>
                  </button>
                  <button className="btn">
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

// export default Profil;

function mapStateToProps(state) {
  return { token: state.token }
}

function mapDispatchToProps(dispatch) {
  return {
    clearToken: function(token) {
        dispatch( {type: 'clearToken'} )
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
 )(Profil);