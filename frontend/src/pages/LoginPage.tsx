import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';

export default function LoginPage(){
  return (
    <div>
      <PageTitle />
      <Login />
      <p>
        login page hehehe
      </p>
    </div>
  );
};

