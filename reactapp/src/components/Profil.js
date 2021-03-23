import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import { Location, Power, SettingsOutline} from 'react-ionicons'
import BtnSoucis from './BtnSoucis'
import { Redirect } from 'react-router';


import Nav from './Nav'
import Modal from './Modal'
import { Link } from '@material-ui/core';
import ProfilUpdate from './ProfilUpdate';
import ProfilUser from './ProfilUser';


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

  var updateProfil = () => {
    console.log("CLIC DETECTE")
    setUpdate(!update)
    fetchData()
  }

  useEffect(() => {

    fetchData()
    
  }, [props.token]);
  
  
  if(props.token){

    var genderSrc = [
      {img: 'https://i.imgur.com/S1xUry1.png' , txt: "femme"},
      {img: 'https://i.imgur.com/FNaPA8d.png', txt: "homme"},      
      {img: 'https://i.imgur.com/EvKcqi9.png', txt: "other"},
    ]

    if(update){
      return (
        <ProfilUpdate user={user} desc={desc} age={age} gender={genderSrc[gender].txt} imgGender={genderSrc[gender].img} date={date} updateProfilParent={updateProfil}/>
      )
    } else {
      return (
        <ProfilUser user={user} desc={desc} age={age} gender={genderSrc[gender].txt} imgGender={genderSrc[gender].img} date={date} localisation={localisation} problemType={problemType} updateProfilParent={updateProfil}/>
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