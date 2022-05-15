import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { CHAIN_TYPE } from '../config';

export default function UnverifiedCredentials(props) {
    const [uvc, setUvc] = useState([]);
    const [zeroCheck, setZeroCheck] = useState(false)
    const [veriferMode, setVerifierMode] = useState(0)
    const [currvc, setCurrvc] = useState(null)

    useEffect(() => {
        console.log("add", props.address)
        axios.get(`http://localhost:8000/api/sharedDocs/${props.address}`).then(r => {
            if (r.data.vc.length === 0) {
                setZeroCheck(true)
            }
            else
                setUvc(r.data.vc)
        })
    }, [])

    const beginVerification = (vc) => {
        axios.get(`https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${vc.txid}`).then(r => {
            setCurrvc(r.data)
            setVerifierMode(1)
            props.setDisplay(1)
            console.log(r.data.contract_call.function_args[1].repr)
        })

    }

    if (veriferMode === 0) {
        return (
            <div className='content-container d-flex flex-column align-items-center'>
                {uvc.length !== 0 ? <>{uvc.map(vc => <>
                    <div class="card content-card w-50 mb-5">
                        <div class="card-body">
                            <div className='d-flex justify-content-between'>
                                <h5 class="card-title mb-4" style={{ fontWeight: "700" }}><span style={{ fontWeight: "300", fontSize: "medium" }}>Shared by <br /></span>{vc.senderAddress}</h5>
                            </div>
                            <div className='d-flex flex-row'>
                                <button className='card-btn me-3' onClick={() => { window.open(`https://explorer.stacks.co/txid/${vc.txid}?chain=${CHAIN_TYPE}`, "_blank") }}>DETAILS</button>
                                <button className='card-btn me-3' onClick={() => {

                                    beginVerification(vc);
                                }}>VERIFY</button>
                            </div>
                        </div>
                    </div>

                </>)}</> : <>{zeroCheck === true ? <h5>It looks like there are no verifiable credentials shared with you yet.</h5> : <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    xmlSpace="preserve"
                    height="8rem"
                >
                    <circle
                        fill="none"
                        stroke="#000"
                        strokeWidth={4}
                        cx={50}
                        cy={50}
                        r={44}
                        style={{
                            opacity: 0.5,
                        }}
                    />
                    <circle fill="#fff" stroke="#331d96" strokeWidth={3} cx={8} cy={54} r={6}>
                        <animateTransform
                            attributeName="transform"
                            dur="2s"
                            type="rotate"
                            from="0 50 48"
                            to="360 50 52"
                            repeatCount="indefinite"
                        />
                    </circle>
                </svg>
                }</>}

            </div>
        )
    }
    else {
        return (
            <>
                <div className='row vh-100 d-flex flex-wrap'>
                    <div className='col-md-4 text-start'>
                        <button className="anim-btn anim-btn-sm mb-3 mt-2" onClick={() => {
                            props.setDisplay(0);
                            setVerifierMode(0)
                        }}>BACK</button>
                        <iframe src={`${currvc.contract_call.function_args[3].repr.replace('"', "").replace('"', "")}`}
                            style={{ border: "3px solid black" }} height="500" width="400" ></iframe>
                    </div>
                    <div className='col-md-8 text-start mt-5'>
                        <div>
                            <h5 class="mb-4" style={{ fontWeight: "700", fontSize: "4rem" }}>{currvc.contract_call !== undefined ? currvc.contract_call.function_args[2].repr.replace('"', "").replace('"', "") : <></>}</h5>
                            <div style={{ fontWeight: "700", fontSize: "2rem" }}>Owned By </div>
                            <h6 class="mb-4" style={{ fontSize: "1.5rem" }}>{currvc.contract_call !== undefined ? <>{currvc.contract_call.function_args[0].repr}</> : <></>}</h6>
                            <div style={{ fontWeight: "700", fontSize: "2rem" }}>Issued By</div>
                            <h6 class="mb-4" style={{ fontSize: "1.5rem" }} >{currvc.sender_address !== undefined ? <>{currvc.sender_address}</> : <></>}</h6>
                            <button className='card-btn me-3 py-3' onClick={() => { window.open(`https://explorer.stacks.co/txid/${currvc.tx_id}?chain=${CHAIN_TYPE}`, "_blank") }}>DETAILS</button>
                        </div>

                    </div>
                </div>
            </>
        )
    }
}
