
import React, { useState, useEffect, useRef } from 'react';
import { testimonials } from '../constants';

const Testimonials: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = window.setTimeout(
            () => setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length),
            5000
        );

        return () => {
            resetTimeout();
        };
    }, [activeIndex]);

    return (
        <section id="testimonials" className="py-20 sm:py-32 bg-gray-50 scroll-mt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tighter">Loved by businesses worldwide</h2>
                <div className="mt-12 h-48 relative overflow-hidden">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center transition-opacity duration-1000 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <blockquote className="text-xl sm:text-2xl font-medium text-gray-800">
                                “{testimonial.quote}”
                            </blockquote>
                            <footer className="mt-4">
                                <p className="text-base font-semibold text-gray-900">{testimonial.author}</p>
                                <p className="text-sm text-gray-500">{testimonial.company}</p>
                            </footer>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-center space-x-3">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
