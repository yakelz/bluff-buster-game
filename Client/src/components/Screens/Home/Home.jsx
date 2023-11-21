import React from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
	return (
		<div>
			<h1>Home</h1>
			<Link to='/ratings'>Ratings</Link>
			<Link to='/settings'>Settings</Link>
			<Link to='/lobby/1'>Lobby</Link>
			<Link to='/login'>Login</Link>
			<Link to='/register'>Register</Link>
		</div>
	);
};

export default Home;
