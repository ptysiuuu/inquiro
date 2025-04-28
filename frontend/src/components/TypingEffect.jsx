"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function TypingEffect({ text = 'Typing Effect', fontSize = 'text-5xl', textColor = 'text-stone-300', effectSpeed = 0.1, font }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <h2
            ref={ref}
            className={`${fontSize} ${textColor} ${font ? font : ''} text-center font-bold tracking-tighter`}
        >
            {text.split('').map((letter, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.2, delay: index * effectSpeed }}
                >
                    {letter}
                </motion.span>
            ))}
        </h2>
    );
}
