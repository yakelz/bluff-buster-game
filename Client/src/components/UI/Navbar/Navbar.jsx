import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

import { ReactComponent as HomeIco } from '../../../assets/icons/home.svg';
import { ReactComponent as SearchIco } from '../../../assets/icons/search.svg';
import { ReactComponent as CreateIco } from '../../../assets/icons/create.svg';
import { ReactComponent as RatingsIco } from '../../../assets/icons/ratings.svg';
import { ReactComponent as SettingsIco } from '../../../assets/icons/settings.svg';
import BlurContainer from '../BlurContainer/BlurContainer';

function Navbar() {
	return (
		<BlurContainer style='navbar'>
			<nav>
				<NavLink to='/' className='navbar__btn'>
					<HomeIco />
				</NavLink>
				<NavLink to='/search' className='navbar__btn'>
					<SearchIco />
				</NavLink>
				<NavLink to='/create' className='navbar__btn'>
					<CreateIco />
				</NavLink>
				<NavLink to='/ratings' className='navbar__btn'>
					<RatingsIco />
				</NavLink>
				<NavLink to='/settings' className='navbar__btn'>
					<SettingsIco />
				</NavLink>
			</nav>
		</BlurContainer>
	);
}

export default Navbar;
