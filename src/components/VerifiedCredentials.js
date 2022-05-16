import React from 'react'
import { useState, useEffect } from 'react'
import { CHAIN_TYPE } from '../config'
import axios from 'axios'
export default function VerifiedCredentials(props) {
    const [vc, setVc] = useState([])
    const [zeroCheck, setZeroCheck] = useState(false)
    useEffect(() => {
        axios.get(`http://localhost:8000/api/history/${props.address}`).then(r => {
            console.log(r)
            if (r.data.length === 0) {
                setZeroCheck(true)
            }
            else
                setVc(r.data)
        })
    }, [])

    return (
        <div className='content-container d-flex flex-column align-items-center'>
            {console.log(vc)}
            {vc.length !== 0 ? <>{vc.map(vc => <>
                <div class="card content-card w-50 mb-5">
                    <div class="card-body">
                        <div className='d-flex justify-content-between'>
                            <h5 class="card-title mb-4" style={{ fontWeight: "700" }}><span style={{ fontWeight: "300", fontSize: "medium" }}>Shared by <br /></span>{vc.senderAddress}</h5>
                            <h5 class="card-title mb-4" style={{ fontWeight: "700" }}><span style={{ fontWeight: "300", fontSize: "medium" }}>Validity <br /></span>{vc.result}</h5>
                        </div>
                        <div className='d-flex flex-row'>
                            <button className='card-btn me-3' onClick={() => { window.open(`https://explorer.stacks.co/txid/${vc.txid}?chain=${CHAIN_TYPE}`, "_blank") }}>DETAILS</button>
                        </div>
                    </div>
                </div>

            </>)}</> : <>{zeroCheck === true ? <h5>It looks like there are no verifiable credentials available.</h5> : <svg
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
