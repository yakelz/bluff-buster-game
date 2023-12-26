import React, { useEffect } from 'react';
import Header from '../UI/Header/Header';
import bg from '../../assets/img/backgrounds/menu.png';
import { Outlet } from 'react-router-dom';
import Navbar from '../UI/Navbar/Navbar';

function Layout() {
	useEffect(() => {
		const wrapper = document.querySelector('.wrapper');
		wrapper.style.backgroundImage = `url(${bg})`;
		wrapper.className = 'wrapper';
		wrapper.className += ' animate';
	}, []);

	return (
		<>
			<Header />
			<Outlet />
			<Navbar />
		</>
	);
}

export default Layout;
