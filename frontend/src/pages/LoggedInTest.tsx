import React from 'react';

function LoggedInTest() {
  // Retrieve user data from localStorage
  const _ud = localStorage.getItem('user_data');

  // Handle the case where user data is not found
  if (!_ud) {
    return (
      <div id="loggedInDiv">
        <span id="userName">Not logged in</span>
      </div>
    );
  }

  // Parse user data
  const ud = JSON.parse(_ud);
  //const userId = ud.id;
  const firstName = ud.firstName;
  const lastName = ud.lastName;
  const country = ud.country;
  const city = ud.city;

  // Logout function
  const doLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    localStorage.removeItem('user_data');
    window.location.href = '/';
  };

  return (
    <div id="loggedInDiv">
      <span id="userName">Logged In As {firstName} {lastName} Where you live {country}, {city}</span>
      <br />
      <button
        type="button"
        id="logoutButton"
        className="buttons"
        onClick={doLogout}
      >
        Log Out
      </button>
    </div>
  );
}

export default LoggedInTest;