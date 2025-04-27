"use client"; // Informacja, że komponent ma być renderowany po stronie klienta

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function TypingEffect({ text = 'Typing Effect', fontSize = 'text-5xl' }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <h2
            ref={ref}
            className={`${fontSize} text-center font-bold tracking-tighter`}
        >
            {text.split('').map((letter, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                    {letter}
                </motion.span>
            ))}
        </h2>
    );
}
