import React from 'react';

function MessagesList (props){

    if(props.msgData.from_id === props.myContactId){
        return (
            <div style={{width: "95%", marginBottom: "8px"}}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: 'flex-start'}}>
                    <img className="imgMsg" src={props.friendAvatar} alt="avatar" style={{width: "28px", height: "28px", marginRight: "5px"}}/>
                    <div className='msgFromFriend'>
                        <p className='txtMsgFromFriend'>{props.msgData.content}</p>
                    </div>
                </div>
            </div>

        )
    } else {
        return(
            <div style={{width: "95%", marginBottom: "8px"}}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: 'flex-end'}}>
                    <div className='msgFromMe'>
                        <p className='txtMsgFromMe'>{props.msgData.content}</p>
                    </div>
                    <img className="imgMsg" src={props.avatar} alt="avatar" style={{width: "28px", height: "28px", marginLeft: "5px"}}/>
                </div>
            </div>

        )
    }

}

export default MessagesList