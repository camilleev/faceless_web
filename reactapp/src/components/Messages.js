import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import { Send } from 'react-ionicons'


import Toggle from './Toggle'
import Nav from './Nav'
import ConversationsList from './ConversationsList'
import MessagesList from './MessagesList';
import CardMessage from './CardMessage';

function Messages(props) {

  const [msgContent, setMsgContent] = useState('')
  const [convId, setConvId] = useState('')
  const [myContactId, setMyContactId] = useState('')
  const [allMsgWithUser, setAllMsgWithUser] = useState([])
  const [avatar, setAvatar] = useState('')
  const [cardData, setCardData] = useState([])
  const [conversations, setConversations] = useState([])
  const [demand, setDemand] = useState(false)
  const [nbDemand, setNbDemand] = useState(0)
  const [selectedConv, setSelectedConv] = useState('')
  const [unreadMsg, setUnreadMsg] = useState(0)
  const [idConvUnread, setIdConvUnread] = useState([])

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }


  useEffect(()=>{
    getLastConv()
  }, [])

  useEffect(()=>{
    fetchMsg()
  }, [demand])

  async function fetchMsg(){
    var rawResponse = await fetch('/show-convers', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&demand=${demand}`
    });
    var response = await rawResponse.json();
    setConversations(response.conversations)
    setNbDemand(response.nbNewConversations)
    setUnreadMsg(response.nbUnreadMsg)
    setIdConvUnread(response.convWithUnreadMsg)
  }

  var selectConv = async (convId, myContactId, token, item) => {
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
    fetchMsg()
    setSelectedConv(convId)
    scrollToBottom()
  }

  async function getLastConv(){
    var rawResponse = await fetch('/show-convers', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&demand=${demand}`
    });
    var response = await rawResponse.json();
    var lastConvId = response.lastConvId
    var lastContactId = response.lastContactId
    selectConv(lastConvId, lastContactId, props.token)
    setIdConvUnread(response.convWithUnreadMsg)
    setUnreadMsg(response.nbUnreadMsg)
  }
    
  var sendMsg = async (msg, token, convId, contactId) => {
    
    var rawResponse = await fetch('/send-msg', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${token}&convId=${convId}&msg=${msg}&myContactId=${contactId}`
    });
    await rawResponse.json();
    setMsgContent('')
    selectConv(convId,contactId,token)
  }

  var handleDemandBox = () => {
    setDemand(!demand)
  }

  const blockUser =  async (userId) => {

    var rawResponse = await fetch(`/block-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `token=${props.token}&userToblock=${userId}`
      });
      var response = await rawResponse.json();
      getLastConv()
  };
  
  if(conversations){
    var conv = conversations.map((item, i)=> {
      var selected = false
      var unRead = false
      if(item.conversationsData.lastMessage.conversation_id === selectedConv){
        selected = true
      }
      if(idConvUnread.includes(item.conversationsData.lastMessage.conversation_id)){
        unRead = true
      }
      return (
        <ConversationsList friends={item.friendsData} conversations={item.conversationsData} key={i} selectConvParent={selectConv} selected={selected} unRead={unRead}/>
      )
    })
  }
    
  if(allMsgWithUser.length>0){
    var msg = allMsgWithUser.map((item, i)=>{
      return (
        <MessagesList msgData={item} myContactId={myContactId} avatar={avatar} friendAvatar={cardData.avatar} key={i}/>
      )
    })
  }


  return (
      <div style={{height: "100vh"}}>
          <Nav selected="msg"/>
          {/* <div className="centerColumn"> */}
            <div style={{display:"flex", flexDirection: "row", height: "85vh", margin:"0px"}}>
              <div style={{display:"flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center",  width: "31%"}}>
                <Toggle handleDemandBoxParent={handleDemandBox} demandStatus={demand} demandNb={nbDemand} unreadMsg={unreadMsg}/>
                <div className="scrollBarMsg" style={{maxHeight: "80vh", overflowY: "scroll", marginTop: "10px", height: "100%", width: "100%", marginRight: "0px"}}>
                  <div style={{height: "20px", width: "31%", background: "linear-gradient(to bottom,  rgba(255, 241, 226, 1) 0%, rgba(255, 241, 226, 0) 100%)", position: "absolute"}}></div>
                  {conv}
                </div>
              </div>
              { convId ? <div style={{width: "38%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end"}}>
                <div className="scrollBarMsg" style={{height: "80vh", overflowY: "auto", width: '100%'}}>
                  {msg}
                  <div ref={messagesEndRef} />
                </div>
                <div className="divInputMsg">
                  <textarea multiline={true} style={{width: "85%",marginLeft: "15px", height:'100%', resize: "none"}} type="text" className="inputMsg" placeholder={"Votre message ici..."} onChange={p => setMsgContent(p.target.value)} value={msgContent} />
                  <button className="btn" style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: 'center'}} onClick={()=> sendMsg(msgContent, props.token, convId, myContactId)}><Send color={'#FFFFFF'} width="22px" style={{transform: 'rotate(-45deg)'}} /></button>
                </div>
              </div> : null}
              <div style={{width: "31%"}}>
                {cardData.localisation ? <CardMessage user={cardData} blockUserMessage={blockUser}/> : null} 
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