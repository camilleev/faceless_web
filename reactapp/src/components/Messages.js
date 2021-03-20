import React, {useState, useEffect, useIsFocused} from 'react';
import {connect} from 'react-redux';
import { Send } from 'react-ionicons'

import Toggle from './Toggle'
import Nav from './Nav'
import ConversationsList from './ConversationsList'
import MessagesList from './MessagesList';
import CardMessage from './CardMessage';

function Messages(props) {

  const [friendsData, setFriendsData] = useState([])
  const [conversationsData, setConversationsData] = useState([])
  const [msgContent, setMsgContent] = useState('')
  const [convId, setConvId] = useState('')
  const [myContactId, setMyContactId] = useState('')
  const [allMsgWithUser, setAllMsgWithUser] = useState([])
  const [avatar, setAvatar] = useState('')
  const [cardData, setCardData] = useState([])

  async function fetchMsg(){
    var rawResponse = await fetch('/show-convers', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}`
    });
    var response = await rawResponse.json();
    setFriendsData(response.friendsData)
    setConversationsData(response.conversationsData)

    console.log("response.friendsData", response.friendsData)
    console.log("response.conversationsData", response.conversationsData)
  }

  useEffect(()=>{
    fetchMsg()
  }, [])
  
  var sendMsg = async (msg, token, convId, contactId) => {

    var rawResponse = await fetch('/send-msg', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${token}&convId=${convId}&msg=${msg}&myContactId=${contactId}`
    });
    var response = await rawResponse.json();
    setMsgContent('')
  }
  
  var selectConv = async (convId, myContactId, token) => {
    setConvId(convId)
    setMyContactId(myContactId)
    var rawResponse = await fetch('/show-msg', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `convId=${convId}&token=${token}&myContactId=${myContactId}`
    });
    var response = await rawResponse.json();
    setAllMsgWithUser(response.allMsgWithUser)
    setAvatar(response.avatar)
    setCardData(response.friendData)
    console.log("response selectConv", response)
  }
  
  if(conversationsData){
    var conv = conversationsData.map((item, i)=> {
      console.log("item", item)
      return (
        <ConversationsList friends={friendsData[i]} conversations={item} key={i} selectConvParent={selectConv}/>
      )
    })
  }
    
  if(allMsgWithUser.length>0){
    var msg = allMsgWithUser.map((item, i)=>{
      return (
        <MessagesList msgData={item} myContactId={myContactId} avatar={avatar} friendAvatar={cardData.avatar}/>
      )
    })
  }

  return (
      <div>
          <Nav selected="msg"/>
          {/* <div className="centerColumn"> */}
            <div style={{display:"flex", flexDirection: "row", height: "90vh"}}>
              <div style={{display:"flex", flexDirection: "column", justifyContent: "flex-start", width: "31%", height: "90vh"}}>
                <Toggle/>
                <div className="scrollBarMsg" style={{maxHeight: "80vh", overflowY: "scroll"}}>
                  {conv}
                </div>
              </div>

              { convId !== '' ?
              <div style={{width: "38%",display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "90vh"}}>
                <div className="scrollBarMsg" style={{height: "80vh", overflowY: "scroll", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                  {msg}
                </div>
                <div className="divInputMsg">
                  <textarea multiline={true} style={{width: "85%",marginLeft: "15px"}} type="text" className="inputMsg" placeholder={"Votre message ici..."} onChange={p => setMsgContent(p.target.value)} value={msgContent} />
                  <button className="btn" style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: 'center'}} onClick={()=> sendMsg(msgContent, props.token, convId, myContactId)}><Send color={'#FFFFFF'} width="22px" style={{transform: 'rotate(-45deg)'}} /></button>
                </div>
              </div> : null
              }
              <div style={{width: "31%"}}>
                {cardData.localisation ? <CardMessage user={cardData}/> : null} 
              </div>
            </div>
          {/* </div> */}
      </div>
  );
}

// export default Messages;

function mapStateToProps(state) {
  return { 
    token: state.token,
   }
}


export default connect(
  mapStateToProps,
  null
 )(Messages);