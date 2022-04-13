import React, { useEffect, useState } from 'react';
import { Storage } from "@stacks/storage";
import {
  Person,
} from 'blockstack';
import axios from 'axios';
import { CHAIN_TYPE, BASE_API_URL } from '../config';
import ManualVerification from './ManualVerification';

export const Profile = ({ userData, userSession, handleSignOut }) => {
  const person = new Person(userData.profile);
  const storage = new Storage({ userSession });
  const [stx, setStx] = useState("")
  const [reveal, setReveal] = useState(0)
  const [mode, setMode] = useState(0)

  useEffect(() => {
    try {
      let principal = null;
      if (CHAIN_TYPE === 'testnet')
        principal = person._profile.stxAddress.testnet
      else
        principal = person._profile.stxAddress.mainnet

      axios.get(`${BASE_API_URL}/extended/v1/address/${principal}/stx`).then((res) => {
        setStx((parseInt(res.data.balance) / 1000000).toString())
      })
    }
    catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <div className="container">
      <div className='d-flex flex-row justify-content-between mt-5'>
        {reveal === 0 ? <button className='reveal-btn' onClick={() => { setReveal(1) }}>REVEAL ADDRESS</button> : <><button className='reveal-btn' data-bs-dismiss="alert" onClick={() => {
          navigator.clipboard.writeText(CHAIN_TYPE === "testnet" ? person._profile.stxAddress.testnet : person._profile.stxAddress.mainnet)
          setReveal(0);

        }}> {CHAIN_TYPE === "testnet" ? person._profile.stxAddress.testnet : person._profile.stxAddress.mainnet} </button></>}
        <div>
          <button className='reveal-btn' disabled>STX Balance: {stx}</button>
          <button type="button" className='btn1 btn-md ms-2' onClick={handleSignOut}> Sign Out</button>
        </div>
      </div>
      {mode === 0 ? <div className='d-flex flex-column align-items-center'>
        <button className='btn1 btn-lg mt-5 w-50' onClick={()=>{setMode(1)}}>Manual Verification</button>
        <button className='btn1 btn-lg mt-2 w-50' onClick={()=>{alert("This feature is not yet implemented!")}}>Automatic Request Verification</button>
      </div> : <>{mode === 1 ? <ManualVerification/> : <></>}</>}
    </div>
  );
}

export default Profile
