import React, {useState} from 'react';
import {Link} from 'react-router-dom';


import AOS from 'aos';
import 'aos/dist/aos.css'; 
AOS.init();

function LandingPage() {

    const [srcProfil, setSrcProfil] = useState('https://i.imgur.com/NaAwKDQ.png')

    
    return (
    <div className='main'>
        <Link to={`/login`}>
            <img src={srcProfil} alt="LogoProfil" style={{width: "60px", position: "absolute", top: "0px", right: "20px"}} onMouseOver={() => setSrcProfil('https://i.imgur.com/cVEACpM.png')} onMouseOut={() => setSrcProfil('https://i.imgur.com/NaAwKDQ.png')}/>
        </Link>
        <div className="containerLanding">
            {/* logo */}
            <div className='bloc full' style={{height: "95vh"}}>
                    <div style={{height: '90vh', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <img className="move" src="https://i.imgur.com/0642a0c.png" alt="logo" style={{width: "350px", maxWidth: "80%", height: "auto", margin: "5px"}}/>
                        <h3 style={{marginTop: "50px"}}>Besoin de papoter ?</h3>
                        <Link to={`/login`}>
                            <button className="btn" style={{marginTop: "35px"}}>
                                <p className="txtBtn">inscris-toi</p>
                            </button>
                        </Link>
                    </div>
            </div>

            {/* rencontres */}
            <div className='bloc half'>
                <div data-aos="fade-right">
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: '40px'}}>
                        <div style={{margin: "5%"}}>
                            <img src="https://i.imgur.com/bh3BTFS.png" alt="blabla" style={{width: "200px", maxWidth: "80%", height: "auto", marginLeft: "5%"}}/>
                        </div>
                        <div style={{ width: "80%"}}>
                            <h3>viens rencontrer des gens qui te comprennent</h3>
                            <p className="txtLanding">Sur Faceless on te propose de découvrir des profils d’utilisateur qui correspondent à tes besoins. Il y a forcement quelqu’un qui a déjà traversé ce que tu vis, n’hésite pas à lui parler! </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* image rencontres */}
            <div className='bloc half'>
                <div className="slider">
                    <div className="slide-tracks">
                        <div className="slide">
                            <img src="https://i.imgur.com/pTF2G4J.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)"}}/>
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/aBJAg0x.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/fPW3siy.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/q3TuxWT.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/2TBQkz3.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/Ly16Ez4.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/pTF2G4J.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/aBJAg0x.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/fPW3siy.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/q3TuxWT.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/2TBQkz3.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                        <div className="slide">
                            <img src="https://i.imgur.com/Ly16Ez4.png" alt="card" width="100%" style={{borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)", height: "80%"}} />
                        </div>
                    </div>
                </div>
            </div>

            {/* oreille attentive */}
            <div className='bloc full' style={{display: "flex", flexDirection: "column"}}>
                <div data-aos="fade-up">
                    <div style={{position: "relative"}}>
                        <h3 className="title">Tu n'as pas encore trouvé la bonne oreille ?</h3>
                        <img className="splashBottom move" src="https://i.imgur.com/PdONml3.png" alt="goutte"/>
                    </div>
                </div>
            </div>

            {/* image filtres */}
            <div className='bloc half'>
                <div data-aos="fade-right">
                    <video autoPlay loop style={{width: "300px", maxWidth: "80%", height: "auto", borderRadius: "20px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)" }}>
                        <source src='https://i.imgur.com/jZRzT87.mp4' type="video/mp4"/>
                    </video>
                </div>
            </div>

            {/* filtre texte */}
            <div className='bloc half'>
                <div data-aos="fade-left">
                    <div style={{display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", textAlign: "end", marginRight: "5%"}}>
                        <img src="https://i.imgur.com/XZZdA6P.png" alt="present" style={{width: "60px", maxWidth: "80%", height: "auto", marginRight: "5%"}}/>
                        <div style={{display: 'flex', flexDirection: "row", width: "80%", alignItems: "center"}}>
                            <img src="https://i.imgur.com/oZlI6so.png" alt="star" style={{height: "60px", maxHeight: "80%", width: "auto"}}/>
                            <div>
                                <h3>Personnalise tes rencontres</h3>
                                <p className="txtLanding">On te propose des personnes qui correspondent à ces filtres. De base on de te présente des gens avec les mêmes afffinités que toi mais tu peux le changer si tu veux !</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* new confidents */}
            <div className='bloc full' style={{display: "flex", flexDirection: "column"}}>
                <div data-aos="fade-up">
                    <div style={{position: "relative"}}>
                        <img className="splashTop move" src="https://i.imgur.com/dc1wIJw.png" alt="goutte"/>
                        <h3 className="title">Echange avec tes nouveaux confidents !</h3>
                        <img className="bouche" src="https://i.imgur.com/Bt6zMjj.png" alt="bouche"/>
                    </div>
                </div>
            </div>


            {/* div conversation */}
            <div className='bloc half'>
                <div data-aos="fade-right">
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <img src="https://i.imgur.com/8VWl4UF.png" alt="conversation" style={{width: "300px", maxWidth: "80%", height: "auto", borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)"}}/>
                    </div>
                </div>
            </div>


            <div className='bloc half' style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center'}}>
                <div data-aos="fade-left">
                    <div style={{margin: "5%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center'}}>
                        <div style={{width: "80%", position: "relative"}}>
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                <img src="https://i.imgur.com/oZlI6so.png" alt="star" style={{width: "60px", maxWidth: "80%", height: "auto", position: "absolute", top: "-70px", left: "-30px"}}/>
                                <img src="https://i.imgur.com/mzhXwBN.png" alt="heart" style={{width: "40px", maxWidth: "80%", height: "auto", position: "absolute", top: "-60px", right: "130px"}}/>
                                <img src="https://i.imgur.com/9f33BCM.png" alt="hat" style={{width: "40px", maxWidth: "80%", height: "auto", position: "absolute", top: "-80px", right: "-60px"}}/>
                            </div>
                            <h3 className="title right" style={{margin: "auto"}}>Il y a tes confidents et les autres, c’est toi qui choisis avec qui tu parles</h3>
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                                <img src="https://i.imgur.com/AXUpWzr.png" alt="smiley" style={{width: "35px", maxWidth: "80%", height: "auto", marginLeft: "-30px", position: "absolute", bottom: "-50px", left: "40px"}}/>
                                <img src="https://i.imgur.com/jkoQd2T.png" alt="exclamationMark" style={{width: "40px", maxWidth: "80%", height: "auto", position: "absolute", right: "-40px"}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* messagerie */}
            <div className='bloc half'>
                <div data-aos="fade-right">
                    <div style={{position: "relative", margin: "20%"}} >
                        <h3>Personnalise tes rencontres</h3>
                        <p className="txtLanding"> Pas de photos, pas de numéro de téléphone, pas de localisation, la liberté totale d’être toi ! Le Toi des bons jours et le Toi des mauvais jours, on t’aime comme tu es !</p>
                        <Link to={`/login`}>
                            <button className="btn" style={{marginTop: "35px"}}>
                            <p className="txtBtn">inscris-toi</p>
                            </button>
                        </Link>
                        <img src="https://i.imgur.com/q2whFIw.png" alt="splash" style={{height: "59px", position: "absolute", top: "-90px", left: "-85px"}}/>
                        <img src="https://i.imgur.com/gWlZEqm.png" alt="splash" style={{height: "70px", position: "absolute", top: "-94px", right: "-52px"}}/>
                        <img src="https://i.imgur.com/xSKdgCF.png" alt="splash" style={{height: "55px", position: "absolute", bottom: "-75px", right: "-80px"}}/>
                        <img src="https://i.imgur.com/VMFVWgH.png" alt="splash" style={{height: "60px",  position: "absolute", bottom: "-100px", left: "-80px"}}/>
                    </div>
                </div>
            </div>

            {/* messagerie image */}
            <div className='bloc half'>
            <div data-aos="fade-left">
                <img src="https://i.imgur.com/0tySiAZ.png" alt="conversation" style={{width: "250px", maxWidth: "80%", height: "auto", borderRadius: "15px", boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.1)"}}/>
                </div>
            </div>


            {/* rejoins nous */}
            <div className='bloc full' style={{height: "100vh"}}>
                <div data-aos="fade-up">
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", height: "40vh"}}>
                        <h3 className="title" style={{marginTop: "50px"}}>Enfile ta cape d’invisibilité et rejoins nous !</h3>
                        <img className="eclair move" src="https://i.imgur.com/UDEh0cK.png" alt="eclair"/>
                        <Link to={`/login`}>
                            <button className="btn" style={{marginTop: "35px", width: "170px"}}>
                                <p className="txtBtn">inscris-toi</p>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    </div>
    );
  }
  
  export default LandingPage;