import React from 'react';
import LoginForm from './LoginForm/LoginForm';
import BackButton from '../../UI/Buttons/BackButton';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';

const Login = () => {
	document.querySelector('.wrapper').className = 'wrapper';
	document.querySelector('.wrapper').className += ' bg-left';

	return (
		<main>
			<BackButton></BackButton>
			<BlurContainer>
				<LoginForm></LoginForm>
			</BlurContainer>
		</main>
	);
};

export default Login;
