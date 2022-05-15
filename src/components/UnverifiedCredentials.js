import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { CHAIN_TYPE } from '../config';

export default function UnverifiedCredentials(props) {
    const [uvc, setUvc] = useState([]);
    const [zeroCheck, setZeroCheck] = useState(false)
    const [veriferMode, setVerifierMode] = useState(0)

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

    const beginVerification = (txid) => {
        axios.get(`https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${txid}`).then(r => {
            console.log(r.data)
        })
        setVerifierMode(1)
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
                                    
                                    beginVerification(vc.txid);
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
                    <div className='col-md-4'>
                        {/* <iframe src={`${props.localProps.contract_call.function_args[3].repr.replace('"', "").replace('"', "")}`}
                            style={{ border: "3px solid black" }} height="500" width="400" ></iframe> */}
                    </div>
                    <div className='col-md-8 text-start'>
                        {/* <div>
                            <h5 class="mb-4" style={{ fontWeight: "700", fontSize: "4rem" }}>{props.localProps.contract_call !== undefined ? props.localProps.contract_call.function_args[2].repr.replace('"', "").replace('"', "") : <></>}</h5>
                            <div style={{ fontWeight: "700", fontSize: "2rem" }}>Owned By </div>
                            <h6 class="mb-4" style={{ fontSize: "1.5rem" }}>{props.localProps.contract_call !== undefined ? <>{props.localProps.contract_call.function_args[0].repr}</> : <></>}</h6>
                            <div style={{ fontWeight: "700", fontSize: "2rem" }}>Issued By</div>
                            <h6 class="mb-4" style={{ fontSize: "1.5rem" }} >{props.localProps.sender_address !== undefined ? <>{props.localProps.sender_address}</> : <></>}</h6>
                            <div style={{ fontWeight: "700", fontSize: "2rem" }}>Date Issued</div>
                            <div class="mb-4" style={{ fontSize: "1.5rem" }}>{props.localProps.burn_block_time_iso !== undefined ? <>{getDateTime(props.localProps.burn_block_time_iso)}</> : <></>}</div>
                        </div> */}

                    </div>
                </div>
            </>
        )
    }
}
