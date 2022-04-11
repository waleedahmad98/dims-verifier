import React, { useEffect, useState } from 'react';
import { Storage } from "@stacks/storage";
import {
  Person,
} from 'blockstack';
import axios from 'axios';

export const Profile = ({ userData, userSession, handleSignOut }) => {
  const person = new Person(userData.profile);
  const storage = new Storage({ userSession });

  return (
    <div className="container text-start">
     
    </div>
  );
}

export default Profile
