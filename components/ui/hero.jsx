// import logo from '../assets/logo.svg';
import { FaGithub } from 'react-icons/fa';
const Hero = () =>
{
	return (
		<header
			data-testid='app_header'
			className='w-full flex justify-center items-center flex-col'
		>
			<nav
				data-testid='app_nav'
				className='w-full flex justify-between items-center p-10 top-0 z-10'
			>
				{/* <img
					src={logo}
					alt='ai_logo'
					data-testid='site_logo'
					id='site_logo'
					className='w-28 object-contain'
				/> */}
				<button
					type='button'
					data-testid='gitHub_button'
					id='gitHub_button'
					className='black_btn'
					onClick={() =>
						window.open( 'https://github.com/kabirfaisal1/myReactProtfolio.git' )
					}
				>
					<FaGithub />
				</button>
			</nav>
			<h1 data-testid='main_site_header' id='site_title' className='head_text'>
				Summarize Articles with <br className='max-md:hidden' />
				<span className='orange_gradient'>Machine Learning</span>
			</h1>
			<h2 data-testid='main_header_subtitle' className='desc'>
				{' '}
				Summarize your articles with AI in seconds!
			</h2>
			<p className='mb-3 text-gray-500 dark:text-gray-400'>
				This is an open-source article summarizer web application
				<br className='max-md:hidden' />
				that uses machine learning to transforms lengthy articles into
				<br className='max-md:hidden' />
				clear and concise summaries.
			</p>
		</header>
	);
};
export default Hero;
