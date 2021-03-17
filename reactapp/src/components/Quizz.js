// import { PromiseProvider } from 'mongoose';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';


function Quizz(props) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pseudo, setPseudo] = useState("")
  const [birthday, setBirthday] = useState()
  const [problem, setProblem] = useState([false, false, false, false, false])
  const [userIdFromBack, setUserIdFromBack] = useState('')
  const [emailError, setEmailError] = useState('')
  const [pseudoError, setPseudoError] = useState('')

  const problemType = ["Amoureux", "Familial", "Physique", "Professionnel", "Scolaire"]

  var allProblems = problemType.map((item, i) => {
    return (
      <button className={problem[i] ? "btnProblemTypeSelected" : "btnProblemType"} key={i} onClick={()=> handleSelectProblem(i)} ><p className="txtBtnProblemType">{item}</p></button>
     )
  })

  const handleSelectProblem = (index) => {
    const problemSelected = [...problem]
    problemSelected[index] = !problemSelected[index]
    setProblem(problemSelected)
  }

  
  const createNewUser = async () => {
    
    if(email === '' || password === '' || pseudo === '' || birthday === null){

      window.alert("Veuillez remplir tous les champs");
    
    } else {
        var allProblemList = []
    
        // var problemList = problem.map((item, i) => {
        problem.map((item, i) => {
            if (item === true) {
            allProblemList.push(problemType[i])
          };
          return allProblemList
        })
        
        var rawResponse = await fetch('/new-user', {
          method: 'POST',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body: `email=${email}&password=${password}&pseudo=${pseudo}&birthday=${birthday}&problemsTypes=${JSON.stringify(allProblemList)}`
        });
        
        var response = await rawResponse.json();

        if(response.result === false) {
          setPseudoError(response.pseudoError)
          setEmailError(response.emailError)
        } else {
          setUserIdFromBack(response.userId)
          props.addToken(response.token)
        }
    }    


  }

  if(userIdFromBack){
    return <Redirect to={`/quizzOptionnal/${userIdFromBack}`}/>
  }

  return (
  
  <div className="centerColumn">
    <div className="container">
      <h1 style={{marginBottom: "10px", marginTop: "0px"}}>Salut,</h1>
      <p className= "txtIntro">On a juste besoin que de ces quelques informations pour te permettre d’utiliser Faceless dans les meilleures conditions. Promis on garde tout ça pour nous !</p>
      <div className="containerQuestion">
        <h2 className="question">C’est quoi ton email ? *</h2>
        <input type="text" className="inputRep" placeholder={"exemple@email.fr"} onChange={(e) => setEmail(e.target.value)} value={email} required="required"/>
        <p className="txtError">{emailError}</p>
      </div>
      <div className="containerQuestion">
        <h2 className="question">Crée ton mot de passe *</h2>
        <input type="password" className="inputRep" placeholder={"****"} onChange={(e) => setPassword(e.target.value)} value={password} required="required"/>
      </div>     
      <div className="containerQuestion">
        <h2 className="question">Comment veux-tu qu’on t’appelle ? *</h2>
        <input type="text" className="inputRep" placeholder={"monPseudo"} onChange={(e) => setPseudo(e.target.value)} value={pseudo} required="required"/>
        <p className="txtError">{pseudoError}</p>

      </div>     
      <div className="containerQuestion">
        <h2 className="question">C’est quoi ta date de naissance ? *</h2>
        <input type="date" className="inputRep" onChange={(e) => setBirthday(e.target.value)} value={birthday} required="required"/>
      </div>
      <div className="containerQuestion">
        <h2 className="question">On discute de quoi ? *</h2>
        {allProblems}
      </div>
      <div style={{display: "flex", justifyContent: "flex-end", marginTop: "40px"}}>
          <button className="btn" onClick={()=> createNewUser()}>
            <p className="txtBtn">valider</p>
          </button>
      </div>
    </div>
  </div>
 );
}

// export default Quizz;

function mapDispatchToProps(dispatch) {
  return {
    addToken: function(token) {
        dispatch( {type: 'addToken', token: token} )
    }
  }
 }
 
 export default connect(
    null,
    mapDispatchToProps
 )(Quizz);