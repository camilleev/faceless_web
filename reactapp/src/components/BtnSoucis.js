import React from 'react';

function BtnSoucis(props) {
    if(props.problemType){
        var allProblems = props.problemType.map((item, i) => {
          return (
            <button key={i} className="btnProblemTypeSelected noHover" style={{marginRight: "9px", marginBottom: "10px"}}><p className="txtBtnProblemType">{item}</p></button>
           )
        })
    }

    return (
        <div>
            {allProblems}
        </div>
    )
}

export default BtnSoucis;