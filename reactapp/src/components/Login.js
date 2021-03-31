import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';


function Login(props) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [userExists, setUserExists] = useState(false)
    const [errorMail, setErrorMail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')


    var handleSubmitSignin = async () => {
        const data = await fetch('/sign-in', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `emailFromFront=${email}&passwordFromFront=${password}`
        })
      
        const body = await data.json()


        if(body.result === true){
            props.addToken(body.token)
            props.addFilter(body.myFilter)
            setUserExists(true)
        } else {
            setErrorMail(body.errorMail)
            setErrorPassword(body.errorPassword)
        }
    }  
    
    if(userExists){
      return <Redirect to='/home' />
    }

    return (
    <div>
        <div className="centerColumn" style={{minHeight: "90vh"}}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "300px"}}>
                <p className="orangeTitle" style={{marginBottom: "20px"}}>j’ai déjà un compte : </p>
                <input type="text" className="inputWhite" placeholder={"exemple@email.fr"} onChange={p => setEmail(p.target.value)} value={email} />
                <p style={{marginTop: "-20px"}} className="txtError">{errorMail}</p>
                <input type="password" className="inputWhite" placeholder={"****"} onChange={p => setPassword(p.target.value)} value={password} />
                <p style={{marginTop: "-20px"}} className="txtError">{errorPassword}</p>
                <button className="btn" onClick={() => handleSubmitSignin()}>
                    <p className="txtBtn">valider</p>
                </button>
            </div>
        </div>
        <div className="centerRow" style={{marginTop: "-100px"}}>
            <Link to={`/quizz`}>
                <p className="blueSubtitle">je n’ai pas encore de compte</p>
            </Link>
        </div>
    </div>
 );
}

function mapDispatchToProps(dispatch) {
    return {
      addToken: function(token) {
          dispatch( {type: 'addToken', token: token} )
      },
      addFilter: function(filter) {
        dispatch( {type: 'addFilter', filter: filter} )
    },
    }
   }
   
   export default connect(
      null,
      mapDispatchToProps
   )(Login);