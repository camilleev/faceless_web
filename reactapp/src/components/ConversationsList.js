import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';


function ConversationsList (props){

    const [date, setDate] = useState('')

    var styleConv = {display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "90%",}
    var marginBottom = {width: "90%", borderBottom: "1px solid rgba(186,188,194, 0.4)", paddingBottom: "15px", paddingTop: "15px", margin: "0px"}
    var unread = {width: "10px", height: "10px", borderRadius: "5px"}
    var txtMsg = "txtMsg"


    if(props.selected){
        styleConv = {display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background:"var(--beige)", boxShadow: "0px 4px 20px rgba(77, 38, 0, 0.4)", borderRadius:" 20px",  width: "90%", marginLeft: '8px'}
        marginBottom = {width: "90%", paddingBottom: "15px", paddingTop: "15px", margin: "0px"}
    }

    if(props.unRead){
        console.log("UNREAD")
        unread = {width: "10px", height: "10px", borderRadius: "5px", backgroundColor: "var(--bleu-2"}
        txtMsg = "txtMsgUnread"
    }

    useEffect(()=> {
        let when = new Date(props.conversations.lastMessage.date)
        let whenFormat = when.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        setDate(whenFormat)
    }, [props.conversations.lastMessage.date])

    var selectConv = (convId, myContactId, token) => {
        props.selectConvParent(convId, myContactId, token);
    }

    return (
        <div style={styleConv} onClick={()=> selectConv(props.conversations.lastMessage.conversation_id, props.friends._id, props.token)}>
            <div className="centerRow" style={marginBottom}>
                <div style={{margin: "5px"}}><p style={unread}></p></div>
                <img className="imgMsg" src={props.friends.avatar} alt="avatar" style={{width: "50px", height: "50px", marginLeft: "5px"}} />
                <div className="leftCol" style={{width: "100%", marginRight: "10px"}}>
                <div className="centerRowSpaceBetween">
                    <p className="txtMsgPseudo" style={{marginBottom: "0px", marginTop: "0px" }} >{props.friends.pseudo}</p>
                    <p className="txtMsgDate" style={{marginBottom: "0px", marginTop: "0px" }} >{date}</p>
                </div>
                <p className={txtMsg} style={{marginBottom: "0px", marginTop: "10px" }}>{props.conversations.lastMessage.content}</p>
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