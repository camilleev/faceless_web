import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';

function QuizzOptionnal() {

    const [problemDesc, setProblemDesc] = useState("")
    const [gender, setGender] = useState('')

    const [townList, setTownList] = useState([])
    const [search, setSearch] = useState('')
    // const [selectedTown, setSelectedTown] = useState(null)

    const [isSelected, setIsSelected] = useState(-1)

    const genderChoice = (index) => {
        if(index === 1){
            setGender('male')
        } else if (index === 2){
            setGender('female')
        } else {
            setGender('other')
        }
    }

    const sendData = async () => {
        
        await fetch('/update-user', {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `desc=${problemDesc}&localisation=${search}&gender=${gender}&userId=${id}`
        });

    }

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
                setTimeout(() => {
                  setTownList([])
                }, 500);
              }}
            >{item.label}</p>
          </div>
        )
    })

    var images = [
        {unSelected:<img className="bigger" src={'https://i.imgur.com/wK81q24.png'} style={{width: 110, height: 110}}
        onMouseOver={e => (e.currentTarget.src = 'https://i.imgur.com/EvKcqi9.png')}
        onMouseOut={e => (e.currentTarget.src = 'https://i.imgur.com/wK81q24.png')}
        alt='gender'/>, selected:  <img src={'https://i.imgur.com/EvKcqi9.png'} style={{width: 110, height: 110}} alt='gender'/>},
        {unSelected: <img className="bigger" src={'https://i.imgur.com/U0HK9Zb.png'} style={{width: 110, height: 110}}
        onMouseOver={e => (e.currentTarget.src = 'https://i.imgur.com/FNaPA8d.png')}
        onMouseOut={e => (e.currentTarget.src = 'https://i.imgur.com/U0HK9Zb.png')}
        alt='gender' />, selected: <img src={'https://i.imgur.com/FNaPA8d.png'} style={{width: 110, height: 110}} alt='gender'/>},
        {unSelected: <img className="bigger" src={'https://i.imgur.com/XDpv4eo.png'} style={{width: 110, height: 110}}
        onMouseOver={e => (e.currentTarget.src = 'https://i.imgur.com/S1xUry1.png')}
        onMouseOut={e => (e.currentTarget.src = 'https://i.imgur.com/XDpv4eo.png')}
        alt='gender' />, selected: <img src={'https://i.imgur.com/S1xUry1.png'} style={{width: 110, height: 110}} alt='gender'/>},
    ];

    var image = images.map((img, key) => {
        return (
            <div key={key} onClick={() => {
                setIsSelected(key)
                genderChoice(key)}}
            >
                {isSelected === key ? img.selected : img.unSelected}
            </div>
        )
    })

    let { id } = useParams();

    console.log("id", id)
    
    return (
        <div className="centerColumn">
            <div className="container">
                <p className= "txtIntro">Si jamais tu veux nous en dire plus c’est par ici ! <br/>
                Plus tu nous en dis plus on peut te présenter des personnes qui te ressemblent, mais rien n’est obligatoire, c’est toi qui choisis !</p>
                <div className="containerQuestion">
                    <h2 className="question">Tu veux décrire pourquoi tu es ici ?</h2>
                    <textarea multiline={true} style={{minHeight: 20, maxHeight: 300}} className="inputRep" placeholder={"Je voudrais parler de ..."} onChange={(e) => setProblemDesc(e.target.value)} value={problemDesc}/>
                </div>  
                <div className="containerQuestion">
                    <h2 className="question">Tu viens d’où ?</h2>
                    <input type="text" className="inputRep" placeholder={"votre ville ?"} onChange={p => onChangeText(p.target.value)} value={search}/>
                </div>   
                <div style={{display: "flex", flexDirection: "column"}}>{TownListComponent}</div>
                <div className="containerQuestion">
                    <h2 className="question">Tu es ?</h2>
                    <div className="centerRow" style={{marginTop: "30px"}}>
                        {image}
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end", marginTop: "40px"}}>
                    <Link to={`/quizzAvatar/${id}`}>
                        <button className="btn" onClick={()=> sendData()}>
                            <p className="txtBtn">valider</p>
                        </button>
                    </Link>
                </div> 
            </div>
        </div>
 );
}

export default QuizzOptionnal;