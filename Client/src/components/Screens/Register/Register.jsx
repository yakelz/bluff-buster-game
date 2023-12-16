import React from 'react';
import RegistrationForm from './RegistrationForm/RegistrationForm';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';
import BackButton from '../../UI/Buttons/BackButton';

const Register = () => {
	document.querySelector('.wrapper').className = 'wrapper';
	document.querySelector('.wrapper').className += ' bg-right';

	return (
		<main>
			<BackButton></BackButton>
			<BlurContainer>
				<RegistrationForm></RegistrationForm>
			</BlurContainer>
		</main>
	);
};

export default Register;
