import React from 'react'
import { useState } from 'react'
import MD5 from 'crypto-js/md5';
import axios from 'axios';

export default function ManualVerification() {
    const [owner, setOwner] = useState("")
    const [txid, setTxid] = useState("")
    const [file, setFile] = useState("")
    const [svg, setSvg] = useState("")
    const [text, setText] = useState("")

    const verifyCredential = (e) => {
        e.preventDefault();

        if (owner === "" || txid === "" || file === "") {
            alert("Fields cannot be empty!")
        }
        else {
            file.text().then((text) => {
                let hash = MD5(text).toString();
                axios.get(`https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${txid}`).then(res => {
                    let data = res.data
                    console.log(hash, data.contract_call.function_args[1].repr.replace('"', "").replace('"', ""))
                    if (data.contract_call.function_args[0].repr.replace('"', "").replace('"', "") === owner && data.contract_call.function_args[1].repr.replace('"', "").replace('"', "") === hash) {
                        setText("Valid Credential")
                        setSvg(<svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={50}
                            height={50}
                            style={{
                                fill: "#26e07f",
                            }}
                        >
                            <path d="M25 2C12.318 2 2 12.318 2 25c0 12.683 10.318 23 23 23 12.683 0 23-10.317 23-23C48 12.318 37.683 2 25 2zm10.827 14.562L24.316 33.525l-8.997-8.349a1 1 0 1 1 1.36-1.466l7.29 6.764 10.203-15.036a1.001 1.001 0 0 1 1.655 1.124z" />
                        </svg>)
                    }
                    else {
                        setText("Invalid Credential")
                        setSvg(<svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={50}
                            height={50}
                            viewBox="0 0 50 50"
                            style={{
                                fill: "#fa314a",
                            }}
                        >
                            <path d="M25 2C12.319 2 2 12.319 2 25s10.319 23 23 23 23-10.319 23-23S37.681 2 25 2zm8.71 30.29c.39.39.39 1.03 0 1.42-.2.19-.45.29-.71.29s-.51-.1-.71-.29L25 26.42l-7.29 7.29c-.2.19-.45.29-.71.29s-.51-.1-.71-.29c-.39-.39-.39-1.03 0-1.42L23.58 25l-7.29-7.29c-.39-.39-.39-1.03 0-1.42.39-.39 1.03-.39 1.42 0L25 23.58l7.29-7.29c.39-.39 1.03-.39 1.42 0 .39.39.39 1.03 0 1.42L26.42 25l7.29 7.29z" />
                        </svg>)
                    }
                })
            });


        }
    }


    return (
        <div>
            <div className='d-flex justify-content-center mt-5'>
                <form className="w-50" onSubmit={verifyCredential}>
                    <div className="mb-3">
                        <label htmlFor="txid" className="form-label">Transaction ID</label>
                        <input type="text" className="form-control" id="txid" value={txid} onChange={(e) => { setTxid(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="owner" className="form-label">Owner's Address</label>
                        <input type="text" className="form-control" id="owner" value={owner} onChange={(e) => { setOwner(e.target.value) }} />
                    </div>

                    <input type="file" id="file" onChange={(e) => { setFile(e.target.files[0]) }} /><br />
                    <button type="submit" className='btn1 btn-md mt-5'>Verify</button>
                </form>
            </div>
            <div className='mt-5'>{svg}{text}</div>
        </div>
    )
}
