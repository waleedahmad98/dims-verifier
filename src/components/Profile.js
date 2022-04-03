import React, { useEffect, useState } from 'react';
import { Storage } from "@stacks/storage";
import {
  Person,
} from 'blockstack';
import axios from 'axios';

export const Profile = ({ userData, userSession, handleSignOut }) => {
  const person = new Person(userData.profile);
  const storage = new Storage({ userSession });
  const [nfts, setNFTs] = useState([]);
  const [txids, setTxids] = useState([]);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    axios.get(`https://stacks-node-api.testnet.stacks.co/extended/v1/address/${person._profile.stxAddress.testnet}/assets`).then((resp) => {
      const data = resp.data.results
      let temp = []
      for (let i = 0; i < data.length; i = i + 1) {
        temp.push(data[i].tx_id)
      }
      setTxids(temp)
      setCheck(true)
    })
  }, [])

  useEffect(() => {
    if (check === true) {
      let temp = []
      let promises = []

      for (let i = 0; i < txids.length; i = i + 1) {
        promises.push(axios.get(`https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${txids[i]}`).then((resp) => {
          temp.push(resp.data)
        }))
      }
      Promise.all(promises).then(() => {
        console.log(temp)
        setNFTs(temp)
      })


    }
  }, [check])

  return (
    <div className="container text-start">
      <div className='d-flex flex-row justify-content-between mt-5'>
        <h3 className='osb'>Welcome, {person._profile.stxAddress.testnet}</h3>
        <button type="button" className='btn btn-primary ms-2' onClick={handleSignOut}> Sign Out</button>
      </div>

      <div className='content-container'>
        <table className='table'>
          <thead>
            <tr>
              <th scope="col">Holder Degree</th>
              <th scope="col">Link</th>
              <th scope="col">Issuer</th>
              <th scope="col">Transaction</th>
              <th scope="col">Verification Status</th>
            </tr>
          </thead>
          <tbody>
            {nfts.length !== 0 ? <>{nfts.map(nft => <tr><td>{nft.contract_call.function_args[2].repr.replace('"',"").replace('"', "")}</td><td><button className='btn btn-primary' onClick={()=>{window.open(
              nft.contract_call.function_args[3].repr.replace('"',"").replace('"', ""), "_blank"
            )}}>View Degree</button></td><td>{nft.sender_address}</td><td><button className='btn btn-primary' onClick={()=>{window.open(`https://explorer.stacks.co/txid/${nft.tx_id}?chain=testnet`, "_blank" )}}>View on Explorer</button></td></tr>)}</> : <></>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Profile
