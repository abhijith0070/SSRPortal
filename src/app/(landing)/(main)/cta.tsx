import { ChevronRightIcon } from 'lucide-react';

import Button from '@/components/button';

const CTA = () => (
    <section className="text-gray-600 body-font w-full bg-white">
        <div className="container px-5 py-12 mx-auto flex flex-wrap">
            <div className="flex w-full justify-between items-center">
                <div className="flex flex-col">
                    <div className="text-primary font-bold text-2xl">
                        Explore our projects
                    </div>
                    <div className="opacity-75 text-sm">
                        Since 2009, we have worked on 994+ projects with 5688+ volunteers from 22+ states.
                    </div>
                </div>
                <div>
                    <Button variant="primary" link="/projects" className="gap-4 items-center">
                        Explore Projects
                        <ChevronRightIcon size="20" />
                    </Button>
                </div>
            </div>
        </div>
    </section>
);

export default CTA;