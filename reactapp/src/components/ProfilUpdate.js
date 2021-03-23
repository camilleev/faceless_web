import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import { Location, Power, SettingsOutline} from 'react-ionicons'
import BtnSoucis from './BtnSoucis'
import { Redirect } from 'react-router';


import Nav from './Nav'
import Modal from './Modal'


function ProfilUpdate(props) {
  
  const [desc, setDesc] = useState(props.desc)
  const [townList, setTownList] = useState([])
  const [coordinates, setCoordinates] = useState([])
  const [search, setSearch] = useState(props.user.localisation.label)
  const [isProblemSelected, setIsProblemSelected] = useState([false, false, false, false, false])
  const [noProblemSelected, setNoProblemSelected] = useState(false)
  const [pseudo, setPseudo] = useState(props.user.pseudo)

  const problemType = ["Amoureux", "Familial", "Physique", "Professionnel", "Scolaire"]
  var allProblemList = []
  var descDefault = "Tu n'as pas renseigné de description, n'hésite pas à en écrire une pour trouver de nouveaux confidents!"

  const handleSelectProblem = (index) => {
    const problemSelected = [...isProblemSelected]
    problemSelected[index] = !problemSelected[index]
    setIsProblemSelected(problemSelected)
  }

  var allProblems = problemType.map((item, i) => {
    return (
      <button className={isProblemSelected[i] ? "btnProblemTypeSelected" : "btnProblemType"} key={i} onClick={()=> handleSelectProblem(i)} ><p className="txtBtnProblemType">{item}</p></button>
     )
  })


  const onChangeText = async (search) => {
    setSearch(search)

    // fetcher les villes dès qu'il y a plus de 2 caractères saisis dans le champs
    if (search.length > 2) {

      const uri = `https://api-adresse.data.gouv.fr/search/?q=${search}&type=municipality&autocomplete=1`
    //   console.log("uri", uri)
      const data = await fetch(uri)
      const body = await data.json()
      const townsAPI = body.features
      const townsApiName = []
    //   console.log("townsAPI", townsAPI)
      townsAPI && townsAPI.map((town) => {
        return (townsApiName.push({
          label: town.properties.label,
        //   postcode: town.properties.postcode,
          coordinates: town.geometry.coordinates,
        }))
      })
      setTownList(townsApiName)
    }
  }

  const TownListComponent = townList.map((item, i, arr) => {
    return (
    <div key={i} style={{borderBottom: "1px solid #5571D7"}}>
        <p className="inputProp"
          onClick={() => {
            // setSelectedTown(item.postcode)
            setSearch(item.label)
            setCoordinates(item.coordinates)
            setTimeout(() => {
              setTownList([])
            }, 500);
          }}
        >{item.label}</p>
      </div>
    )
  })


  var updateProfil = async () => {

    var count = 0
    isProblemSelected.map((item, i) => {
      if (item === true) {
        allProblemList.push(problemType[i])
        count ++
      };
      return allProblemList
    })

    if(count === 0){
      setNoProblemSelected(true)
    } else {
      setNoProblemSelected(false)
      var descModif = desc
      if(desc === descDefault){
        descModif = ""
      }
  
      var rawResponse = await fetch('/update-profil', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `token=${props.token}&localisation=${search}&coordinates=${JSON.stringify(coordinates)}&desc=${descModif}&allProblemList=${JSON.stringify(allProblemList)}&pseudo=${pseudo}`
      });
      var response = await rawResponse.json();
      if(response.result){
        props.updateProfilParent()
      }
    }
    
  }
    
  if(props.token){

    return (
        <div>
            <Nav selected="profil"/>
            <div className="centerCol">
              <div className="card" style={{width: "500px"}}>
                <img src={props.user.avatar} alt="avatar" style={{width: 100, height: 100, border: "5px solid #EC9A1F", borderRadius: "50%"}}/>
                <div className="centerCol">
                  <input type="text" className="txtPseudo" placeholder={props.user.pseudo} onChange={p => setPseudo(p.target.value)} value={pseudo} style={{textAlign: 'center'}} />
                  <p className="txtMember" style={{marginTop: "7px", marginBottom: "7px"}}>Membre depuis le {props.date}</p>
                  <div style={{width: "60%", marginBottom: '15px'}}>
                    <div className="containerQuestion" style={{width: "100%"}}>
                      <input type="text" className="inputRep" placeholder={"votre ville ?"} onChange={p => onChangeText(p.target.value)} value={search} />
                      <div style={{display: "flex", flexDirection: "column"}}>{TownListComponent}</div>
                    </div>
                  </div>
                </div>
                <div className='centerRowFlexEnd' style={{width: "100%"}}>
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
                  <textarea multiline={true} type="text" className="inputDesc" placeholder={"Je voudrais parler de ..."} onChange={p => setDesc(p.target.value)} value={desc} />
                </div>
                <div style={{width: "100%"}}>
                  <p className="orangeTitle" style={{textAlign: "left", margin: "0px"}}>Ses soucis</p>
                  {noProblemSelected ? <p className="txtError" style={{margin: "5px"}}>Selectionne au moins un soucis</p> : null}
                  {allProblems}
                </div>
                <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                  <button className="btn" onClick={()=> updateProfil()} >
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
 )(ProfilUpdate);