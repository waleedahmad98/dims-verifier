import React from 'react'
import { useState } from 'react'
import UnverifiedCredentials from './UnverifiedCredentials'

export default function AutomaticVerification(props) {
    const [toggler, setToggler] = useState("Verification Records")
    const [mode, setMode] = useState(0)
    const [modeText, setModeText] = useState("Pending Verifications")

    return (
        <div><div className='d-flex justify-content-between mt-5'>
            <div>
                <h4 style={{ fontWeight: "700" }}>{modeText}</h4>
            </div>
            <div>
                <button className='anim-btn anim-btn-sm py-2' onClick={() => {
                    if (mode === 0) {
                        setToggler("Pending Verifications");
                        setModeText("Verified Credentials")
                        setMode(1)
                    }
                    else {
                        setToggler("Verification Records");
                        setModeText("Pending Verifications")
                        setMode(0)
                    }

                }}>{toggler}</button>
            </div>

        </div>{mode === 0 ? <UnverifiedCredentials address={props.address} /> : <></>}</div>
    )
}
