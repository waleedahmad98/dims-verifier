import React from 'react'
import { useState } from 'react'
import MD5 from 'crypto-js/md5';
import axios from 'axios';

export default function ManualVerification() {
    const [owner, setOwner] = useState("")
    const [txid, setTxid] = useState("")
    const [file, setFile] = useState("")

    const verifyCredential = (e) => {
        e.preventDefault();
        if (owner === "" || txid === "" || file === "") {
            alert("Fields cannot be empty!")
        }
        else {
            let hash = MD5(file).toString()
            axios.get(`https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${txid}`).then(res => {
                let data = res.data
                if(data.contract_call.function_args[0].repr.replace('"', "").replace('"', "") === owner && data.contract_call.function_args[1].repr.replace('"', "").replace('"', "") === hash){
                    alert("Verified")
                }
                else{
                    alert("Not Verified")
                }
            })
            
        }
    }


    return (
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
    )
}
