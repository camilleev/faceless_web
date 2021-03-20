import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';


function ConversationsList (props){

    const [date, setDate] = useState('')

    useEffect(()=> {
        let when = new Date(props.conversations.lastMessage.date)
        let whenFormat = when.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        setDate(whenFormat)
    }, [])

    var selectConv = (convId, myContactId, token) => {
        props.selectConvParent(convId, myContactId, token);
    }

    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} onClick={()=> selectConv(props.conversations.lastMessage.conversation_id, props.friends._id, props.token)}>
            <div className="centerRow" style={{width: "90%", borderBottom: "1px solid var(--bleu-1)", paddingBottom: "15px", paddingTop: "15px", margin: "0px"}}>
                <div style={{margin: "5px"}}><p style={{width: "10px", height: "10px", borderRadius: "5px", backgroundColor: "pink"}}></p></div>
                <img className="imgMsg" src={props.friends.avatar} alt="avatar" style={{width: "50px", height: "50px", marginLeft: "5px"}}/>
                <div className="leftCol" style={{width: "100%", marginRight: "10px"}}>
                <div className="centerRowSpaceBetween">
                    <p className="txtMsgPseudo" style={{marginBottom: "0px", marginTop: "0px" }} >{props.friends.pseudo}</p>
                    <p className="txtMsgDate" style={{marginBottom: "0px", marginTop: "0px" }} >{date}</p>
                </div>
                <p className="txtMsg" style={{marginBottom: "0px", marginTop: "10px" }}>{props.conversations.lastMessage.content}</p>
                </div>
            </div>
        </div>
    )
}

// export default ConversationsList


function mapStateToProps(state) {
    return { 
      token: state.token,
     }
  }
  
  
  export default connect(
    mapStateToProps,
    null
   )(ConversationsList);