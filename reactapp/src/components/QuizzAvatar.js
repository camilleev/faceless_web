import React, {useState, useRef}from 'react';
import {Link, useParams} from 'react-router-dom';
import { ChevronForward, ChevronBack} from 'react-ionicons'
import {connect} from 'react-redux';


function QuizzAvatar(props) {

    let { id } = useParams();
    const [imgAvatarSelected, setImgAvatarSelected] = useState('https://i.imgur.com/atDrheA.png')

    var  avatarSlider = useRef(null);

    var imgAvatarSrc = [
        'https://i.imgur.com/HgBDc9B.png',
        'https://i.imgur.com/NBYvxKX.png',
        'https://i.imgur.com/urOQgGD.png',
        'https://i.imgur.com/clPw5Nx.png',
        'https://i.imgur.com/Wm5vVmF.png',
        'https://i.imgur.com/YSesoUz.png',
        'https://i.imgur.com/mMzuMuT.png',
        'https://i.imgur.com/EHaBuT9.png',
        'https://i.imgur.com/21c3YgT.png',
        'https://i.imgur.com/17T5sWH.png',
        'https://i.imgur.com/97zBLZM.png',
        'https://i.imgur.com/aK9HbPT.png',
        'https://i.imgur.com/T7wBkkk.png',
        'https://i.imgur.com/fJYbMZO.png'
    ]

    var imgAvatar = imgAvatarSrc.map((url, key) => {
        return <img className='item' src={url} style={{width: 100, height:100, marginHorizontal: 5, margin: 7}} alt="avatar" onClick={() => {changeAvatar(key)}}/>
    })

    const scroll = (scrollOffset) => {
        avatarSlider.current.scrollBy({ 
            left: scrollOffset, 
            behavior: 'smooth' 
          });
    }

    var changeAvatar = (index) => {
        setImgAvatarSelected(imgAvatarSrc[index])
    }

    const sendData = async () => {
        const data = await fetch('/update-avatar', {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `avatar=${imgAvatarSelected}&userId=${id}`
        });

        const body = await data.json()

        if(body.result === true){
            props.addToken(body.token)
            props.addFilter(body.myFilter)
        }
    }

    
    
    return (
    
    <div className="centerColumn">
        <img src={imgAvatarSelected} alt="avatar" style={{width: 200, height: 200, paddingBottom: 75}}/>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: "center", width: "80%", maxWidth: "600px"}}>
            <ChevronBack color={'#5571D7'} height="150px" width="30px" onClick={() => scroll(-300)} />
            <div className='wrapper' ref={avatarSlider} style={{margin: "25px"}} >
                {imgAvatar}
            </div>
            <ChevronForward color={'#5571D7'} height="150px" width="30px" onClick={() => scroll(300)}/>
        </div>
        <div style={{display: "flex", justifyContent: "center", marginTop: "40px"}}>
            <Link to={`/home`}>
                <button className="btn" onClick={()=> sendData()}>
                    <p className="txtBtn">c'est fini !</p>
                </button>
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
   )(QuizzAvatar);