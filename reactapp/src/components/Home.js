import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

import Nav from './Nav'
import Slider from './Slider'
import Card from './Card'
import { Redirect } from 'react-router';


function Home(props) {

  const [userToDisplay, setUserToDisplay] = useState([])
  const [me, setMe] = useState([])
  const [isGenderSelected, setisGenderSelected] = useState([false, false, false])
  const [localisation, setLocalisation] = useState('')
  const [age, setAge] = useState([])
  const [isProblemSelected, setIsProblemSelected] = useState([false, false, false, false, false])

  const problemType = ["Amoureux", "Familial", "Physique", "Professionnel", "Scolaire"]
  const genderType = ["other", "male", "female"]
  var tabGender = []
  var allProblemList = []
  var allGenderList = []
  async function fetchData(){
    var rawResponse = await fetch('/show-card', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}`
    });
    var response = await rawResponse.json();
    setUserToDisplay(response.userToDisplay)
    setMe(response.me)
    setAge(response.myFilter.age)
  }

  useEffect(() => {

    
    fetchData()
    
  }, [props.token]);
  
  useEffect(()=> {
    if(props.filter.problems_types){
      // var problemCheck = problemType.map((item, i)=> {
        problemType.map((item, i)=> {
          var problemCopy = isProblemSelected
        if(props.filter.problems_types.includes(item)){
          if(!problemCopy[i]){
            problemCopy[i] = !problemCopy[i]
          }
        }
        return setIsProblemSelected(problemCopy)
      })
      // var genderCheck = props.filter.gender.map((item, i) => {
        props.filter.gender.map((item) => {
          var copyGender = isGenderSelected
        if(item === "other"){
          copyGender[0] = true
        }
        if(item === "male"){
          copyGender[1] = true
        }
        if(item === "female"){
          copyGender[2] = true
        }
        setisGenderSelected(copyGender)
      })
      setLocalisation(props.filter.localisation)

    }
    
  }, [props.filter])

  
  const handleSelectProblem = (index) => {
    const problemSelected = [...isProblemSelected]
    problemSelected[index] = !problemSelected[index]
    setIsProblemSelected(problemSelected)
  }

  const updateFilter = async () => {

    isProblemSelected.map((item, i) => {
      if (item === true) {
        allProblemList.push(problemType[i])
      };
      return allProblemList
    })
    isGenderSelected.map((item, i) => {
      if (item === true) {
        allGenderList.push(genderType[i])
      };
      return allGenderList
    })

    var rawResponse = await fetch('/update-filter', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `allProblemList=${JSON.stringify(allProblemList)}&allGenderList=${JSON.stringify(allGenderList)}&age=${JSON.stringify(age)}&localisation=${localisation}&token=${props.token}`
    });
    
    var response = await rawResponse.json();

    if(response.result === true){
      props.addFilter(response.filter)
      fetchData()
    }

    allProblemList = []
    allGenderList = []


  }
  
  var allProblems = problemType.map((item, i) => {
    return (
      <button className={isProblemSelected[i] ? "btnProblemTypeSelected" : "btnProblemType"} key={i} onClick={()=> handleSelectProblem(i)} ><p className="txtBtnProblemType">{item}</p></button>
     )
  })
  
  if(userToDisplay){
    var cardToShow = userToDisplay.map((user, i)=> {
        return <Card user={user}/>
    })
  }


  var selectGender = (index) => {
    tabGender = [...isGenderSelected]
    tabGender[index] = !isGenderSelected[index]
    setisGenderSelected(tabGender)
  }

  var valueSlider = (value) => {

    if(value.length){
      setAge(value)
    } else {
      setLocalisation(value)
    }

  }

  var images = [
    {unSelected:<img className="bigger" src={'https://i.imgur.com/wK81q24.png'} style={{width: 50, height: 50}}
    onMouseOver={e => (e.currentTarget.src = 'https://i.imgur.com/EvKcqi9.png')}
    onMouseOut={e => (e.currentTarget.src = 'https://i.imgur.com/wK81q24.png')}
    alt='other'/>, selected:  <img src={'https://i.imgur.com/EvKcqi9.png'} style={{width: 50, height: 50}} alt='other'/>},
    {unSelected: <img className="bigger" src={'https://i.imgur.com/U0HK9Zb.png'} style={{width: 50, height: 50}}
    onMouseOver={e => (e.currentTarget.src = 'https://i.imgur.com/FNaPA8d.png')}
    onMouseOut={e => (e.currentTarget.src = 'https://i.imgur.com/U0HK9Zb.png')}
    alt='male' />, selected: <img src={'https://i.imgur.com/FNaPA8d.png'} style={{width: 50, height: 50}} alt='male'/>},
    {unSelected: <img className="bigger" src={'https://i.imgur.com/XDpv4eo.png'} style={{width: 50, height: 50}}
    onMouseOver={e => (e.currentTarget.src = 'https://i.imgur.com/S1xUry1.png')}
    onMouseOut={e => (e.currentTarget.src = 'https://i.imgur.com/XDpv4eo.png')}
    alt='female' />, selected: <img src={'https://i.imgur.com/S1xUry1.png'} style={{width: 50, height: 50}} alt='female'/>},
  ];

  var image = images.map((img, key) => {
      return (
          <div key={key} onClick={()=> {selectGender(key)}} >
              {isGenderSelected[key] ? img.selected :  img.unSelected}
          </div>
      )
  })

  
  if(props.token){

    return (
  
      <div>
        <div className="filter" style={{width: '27%', position: 'absolute', left: '0px', bottom: 'Opx', zIndex: 1, minHeight: "100%"}}>
          <div className="centerColumn" >
            <div className="leftCol" >
              <div>
                <h1 style={{textAlign: "left"}}>Salut<br></br>{me.pseudo}!</h1>
              </div>
              <div>
                <h2>Que veux tu trouver ?</h2>
                <p className="txtSubtitle">Genre</p>
                <div className="centerRow" style={{marginTop: "30px"}}>
                        {image}
                </div>
              </div>
              <div>
                <p className="txtSubtitle">Age</p>
                <p className="txtSlider">{age[0]} - {age[1]} ans</p>
                {/* {age !== [] ? <Slider defaultValue={age} valueSliderParent={valueSlider} max={100}/> : null} */}
                { me.is_adult ? <Slider defaultValue={age} valueSliderParent={valueSlider} max={100} min={18}/> : <Slider defaultValue={age} valueSliderParent={valueSlider} max={18} min={15}/>}
              </div>
              <div>
                <p className="txtSubtitle">Distance</p>
                <p className="txtSlider">{localisation<800 ? localisation + "km" : "France"}</p>
                <Slider defaultValue={localisation} valueSliderParent={valueSlider} max={800}/>
              </div>
              <div>
                <p className="txtSubtitle">Soucis</p>
                {allProblems}
              </div>
              <div className="centerRowFlexEnd" style={{marginTop: "20px"}}>
                <button className="btn" onClick={()=> updateFilter()}>
                  <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "10px", marginRight: "10px"}}>enregistrer</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Nav selected="home"/>
        <div style={{display:"flex", flexDirection: "row", marginTop: "20px", minHeight: "85vh"}}>
          <div className="wrapperCard">
          <div className="centerColumn" style={{marginLeft: "10px"}}>
          <div style={{height: "490px", width: "400px"}}>
          </div>
          </div>
            {cardToShow}
          </div>
        </div>
      </div>
   );
  } else {
    return <Redirect to='/' />
  }

}

// export default Home;
function mapStateToProps(state) {
  return { 
    token: state.token,
    filter: state.filter
   }
}

function mapDispatchToProps(dispatch) {
 return {
   addFilter: function(filter) {
     dispatch( {type: 'addFilter', filter: filter} )
 },
 }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
 )(Home);
