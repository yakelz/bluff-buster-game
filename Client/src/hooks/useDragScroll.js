import { useRef, useEffect } from 'react';

const useDragScroll = (data) => {
	const ref = useRef(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) {
			return;
		}

		let isDown = false;
		let startX;
		let scrollLeft;

		const onMouseDown = (e) => {
			isDown = true;
			element.classList.add('active');
			startX = e.pageX - element.offsetLeft;
			scrollLeft = element.scrollLeft;
		};

		const onMouseLeave = () => {
			isDown = false;
			element.classList.remove('active');
		};

		const onMouseUp = () => {
			isDown = false;
			element.classList.remove('active');
		};

		const onMouseMove = (e) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - element.offsetLeft;
			const walk = (x - startX) * 3; // скорость прокрутки
			element.scrollLeft = scrollLeft - walk;
		};

		element.addEventListener('mousedown', onMouseDown);
		element.addEventListener('mouseleave', onMouseLeave);
		element.addEventListener('mouseup', onMouseUp);
		element.addEventListener('mousemove', onMouseMove);

		return () => {
			element.removeEventListener('mousedown', onMouseDown);
			element.removeEventListener('mouseleave', onMouseLeave);
			element.removeEventListener('mouseup', onMouseUp);
			element.removeEventListener('mousemove', onMouseMove);
		};
	}, [data]);

	return ref;
};

export default useDragScroll;
