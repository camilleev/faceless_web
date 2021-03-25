import React, {useState} from 'react';
import Modal from '@material-ui/core/Modal';
import {connect} from 'react-redux';
import { Power } from 'react-ionicons'


function SimpleModal(props) {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const blockUser = () => {

        props.blockUserCard(props.userId)
        setTimeout(function(){ setOpen(false);}, 800);

    };

    //modal signalement cette personne a besoin d'aide
    if(props.btn === "aider"){
        return (
            <div>
                <button className="btn" onClick={handleOpen}>
                    <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px", marginRight: "12px"}}>
                        <img src="https://i.imgur.com/ycK8FiG.png" alt="picto_block" style={{marginRight: "5px", width: "22px"}}/>
                        aider
                    </p>
                </button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    style={{ backdropFilter: "blur(3px)", display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}
                >
                <div style={{outline: "0", backgroundColor: 'var(--beige)', width: "420px", height: "225px", boxShadow: '0px 4px 20px rgba(77, 38, 0, 0.4)', borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                    <h2>Veux-tu signaler que cette personne à besoin d’aide ?</h2>
                    <div className='centerRowJustifyCenter' style={{marginTop: "15px", width: '100%'}}>
                        <button className="btn" style={{marginRight: '15px'}} onClick={()=> handleClose()}>
                            <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px", marginRight: "12px"}}>
                                <img src="https://i.imgur.com/X7Oalsz.png" alt="picto_block" style={{marginRight: "8px", width: "22px"}}/>
                                revenir
                            </p>
                        </button>
                        <button className="btn" style={{marginLeft: '15px'}} onClick={()=> handleClose()}>
                        <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px", marginRight: "12px"}}>
                                <img src="https://i.imgur.com/ycK8FiG.png" alt="picto_block" style={{marginRight: "5px", width: "22px"}}/>
                                aider
                            </p>
                        </button>
                    </div>
                </div>
                </Modal>
            </div>
          );
    }

    //modal signalement d'un utilisateur
    if(props.btn === "signaler"){
        return (
            <div>
                <button className="btnYellow" onClick={handleOpen}>
                    <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px", marginRight: "12px"}}>
                        <img src="https://i.imgur.com/QxuT6vs.png" alt="picto_block" style={{marginRight: "5px", width: "22px"}}/>
                        signaler
                    </p>
                </button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    style={{ backdropFilter: "blur(3px)", display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}
                >
                <div style={{outline: "0", backgroundColor: 'var(--beige)', width: "420px", height: "225px", boxShadow: '0px 4px 20px rgba(77, 38, 0, 0.4)', borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                    <h2>Es-tu sûr de vouloir signaler ce compte ?</h2>
                    <div className='centerRowJustifyCenter' style={{marginTop: "15px", width: '100%'}}>
                        <button className="btn" style={{marginRight: '15px'}} onClick={()=> handleClose()}>
                            <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px", marginRight: "12px"}}>
                                <img src="https://i.imgur.com/X7Oalsz.png" alt="picto_block" style={{marginRight: "8px", width: "22px"}}/>
                                revenir
                            </p>
                        </button>
                        <button className="btnYellow" onClick={()=> handleClose()}>
                            <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px", marginRight: "12px"}}>
                                <img src="https://i.imgur.com/QxuT6vs.png" alt="picto_block" style={{marginRight: "5px", width: "22px"}}/>
                                signaler
                            </p>
                        </button>
                    </div>
                </div>
                </Modal>
            </div>
          );
    }

    //modal bloquer cette personne
    if(props.btn === "bloquer"){
        return (
            <div>
                <button className="btnRed" onClick={handleOpen}>
                    <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px", marginRight: "12px"}}>
                        <img src="https://i.imgur.com/Ec9jXlZ.png" alt="picto_block"  style={{marginRight: "5px", width: "22px"}}/>
                        bloquer
                    </p>
                </button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    style={{ backdropFilter: "blur(3px)", display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}
                >
                <div style={{outline: "0", backgroundColor: 'var(--beige)', width: "420px", height: "225px", boxShadow: '0px 4px 20px rgba(77, 38, 0, 0.4)', borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                    <h2>Es-tu sûr de vouloir bloquer ce compte ?</h2>
                    <div className='centerRowJustifyCenter' style={{marginTop: "15px", width: '100%'}}>
                        <button className="btn" style={{marginRight: '15px'}} onClick={()=> handleClose()}>
                            <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px", marginRight: "12px"}}>
                                <img src="https://i.imgur.com/X7Oalsz.png" alt="picto_block" style={{marginRight: "8px", width: "22px"}}/>
                                revenir
                            </p>
                        </button>
                        <button className="btnRed" onClick={()=> blockUser()}>
                            <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px", marginRight: "12px"}}>
                                <img src="https://i.imgur.com/Ec9jXlZ.png" alt="picto_block"  style={{marginRight: "5px", width: "22px"}}/>
                                bloquer
                            </p>
                        </button>
                    </div>
                </div>
                </Modal>
            </div>
          );
    }

    //modal deconnexion
    if(props.btn === "deconnexion"){
        return (
            <div>
                <button className="btnRed" style={{display: "flex", justifyContent: "center", alignItems: "center"}} onClick={handleOpen}>
                    <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "10px", marginRight: "10px"}} ><Power color={'#FFFFFF'} width="22px" style={{marginRight: "8px"}} />déconnecter</p>
                  </button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    style={{ backdropFilter: "blur(3px)", display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}
                >
                <div style={{outline: "0", backgroundColor: 'var(--beige)', width: "420px", height: "225px", boxShadow: '0px 4px 20px rgba(77, 38, 0, 0.4)', borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                    <h2>Es-tu sûr de vouloir deconnecter ton compte ?</h2>
                    <div className='centerRowJustifyCenter' style={{marginTop: "15px", width: '100%'}}>
                        <button className="btn" style={{marginRight: '15px'}} onClick={()=> handleClose()}>
                            <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px", marginRight: "12px"}}>
                                <img src="https://i.imgur.com/X7Oalsz.png" alt="picto_block" style={{marginRight: "8px", width: "22px"}}/>
                                revenir
                            </p>
                        </button>
                        <button className="btnRed" style={{display: "flex", justifyContent: "center", alignItems: "center"}} onClick={()=> props.clearToken()}>
                            <p className="txtBtn" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "10px", marginRight: "10px"}} ><Power color={'#FFFFFF'} width="22px" style={{marginRight: "8px"}} />déconnecter</p>
                        </button>
                    </div>
                </div>
                </Modal>
            </div>
          );
    }

 
}

function mapStateToProps(state) {
    return { 
      token: state.token,
     }
}

function mapDispatchToProps(dispatch) {
    return {
      clearToken: function(token) {
          dispatch( {type: 'clearToken'} )
      }, 
      clearFilter: function(token) {
        dispatch( {type: 'clearFilter'} )
    }
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleModal);