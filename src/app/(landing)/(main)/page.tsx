import Landing from './landing';
import About from './about';
import HowWeWork from './how-we-work';
import Testimonials from './testimonials';
import Projects from './projects';
import Themes from './theme';
import CTA from './cta';

const LandingPage = () => {
  return (
      <div className="items-center justify-center h-full flex flex-col">
          <Landing />
          <About />
          <HowWeWork />
          <CTA />
          <Themes />
          <Projects />
          <Testimonials />
      </div>
  );
};

export default LandingPage;