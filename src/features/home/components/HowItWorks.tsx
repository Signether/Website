import { Upload, Hash, Signature, Verified } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
    const steps = [
        {
            icon: <Upload className="h-8 w-8" />,
            title: "Upload Document",
            description: "Upload your document to our secure platform for processing and hash generation."
        },
        {
            icon: <Hash className="h-8 w-8" />,
            title: "Generate Hash",
            description: "System automatically generates SHA-256 hash of your document for blockchain registration."
        },
        {
            icon: <Signature className="h-8 w-8" />,
            title: "Sign & Register",
            description: "Digitally sign your document and register the hash on Optimism blockchain via DEHR contract."
        },
        {
            icon: <Verified className="h-8 w-8" />,
            title: "Verify & Export",
            description: "Get immutable proof of signature with timestamped blockchain verification and export capabilities."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const stepVariants = {
        hidden: {
            opacity: 0,
            y: 80,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const iconContainerVariants = {
        initial: {
            scale: 1,
            rotateY: 0,
            rotateX: 0
        },
        animate: {
            scale: [1, 1.05, 1],
            rotateY: [-2, 2, -2],
            rotateX: [-1, 1, -1],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1
            }
        },
        hover: {
            scale: 1.15,
            rotateY: 10,
            rotateX: 5,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const iconVariants = {
        initial: { rotate: 0 },
        animate: {
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 2
            }
        },
        hover: {
            rotate: 360,
            scale: 1.1,
            transition: {
                duration: 0.6,
                ease: "easeInOut"
            }
        }
    };

    const numberVariants = {
        initial: {
            scale: 1,
            rotate: 0,
            backgroundColor: "var(--background)"
        },
        animate: {
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 3
            }
        },
        hover: {
            scale: 1.2,
            rotate: 180,
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const connectionVariants = {
        hidden: {
            scaleX: 0,
            opacity: 0
        },
        visible: {
            scaleX: 1,
            opacity: 1,
            transition: {
                duration: 1,
                ease: "easeInOut",
                delay: 0.5
            }
        },
        animate: {
            background: [
                "linear-gradient(to right, rgba(var(--primary)/0.5), transparent)",
                "linear-gradient(to right, transparent, rgba(var(--primary)/0.8), transparent)",
                "linear-gradient(to right, transparent, rgba(var(--primary)/0.5))"
            ],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-5, 5, -5],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 0.6, 0],
                            y: [-20, 20, -20]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5
                        }}
                    />
                ))}
            </div>

            <div className="container relative z-10">
                <div className="mx-auto max-w-5xl">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.h2
                            className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                        >
                            How It Works
                        </motion.h2>
                        <motion.p
                            className="text-muted-foreground text-lg max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Simple, secure, and transparent process to digitally sign and verify your documents
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative group"
                                variants={stepVariants}
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.3, ease: "easeOut" }
                                }}
                            >
                                <motion.div
                                    className="flex flex-col items-center text-center space-y-4"
                                    variants={floatingVariants}
                                    animate="animate"
                                    style={{ animationDelay: `${index * 0.5}s` }}
                                >
                                    <div className="relative">
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-primary/20"
                                            variants={pulseVariants}
                                            animate="animate"
                                            style={{ animationDelay: `${index * 0.3}s` }}
                                        />
                                        <motion.div
                                            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground relative z-10"
                                            variants={iconContainerVariants}
                                            initial="initial"
                                            animate="animate"
                                            whileHover="hover"
                                            style={{
                                                transformStyle: "preserve-3d",
                                                animationDelay: `${index * 0.2}s`
                                            }}
                                        >
                                            <motion.div
                                                variants={iconVariants}
                                                initial="initial"
                                                animate="animate"
                                                whileHover="hover"
                                            >
                                                {step.icon}
                                            </motion.div>
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                                                animate={{
                                                    x: [-100, 100],
                                                    transition: {
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        repeatDelay: 4 + Math.random() * 3,
                                                        ease: "easeInOut"
                                                    }
                                                }}
                                            />
                                        </motion.div>
                                        <motion.div
                                            className="absolute -top-2 -right-2 h-6 w-6 bg-background border-2 border-primary rounded-full flex items-center justify-center text-xs font-bold text-primary"
                                            variants={numberVariants}
                                            initial="initial"
                                            animate="animate"
                                            whileHover="hover"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            {index + 1}
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0.8 }}
                                        whileHover={{
                                            opacity: 1,
                                            scale: 1.05,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <motion.h3
                                            className="text-xl font-semibold"
                                            whileHover={{
                                                color: "var(--primary)",
                                                transition: { duration: 0.2 }
                                            }}
                                        >
                                            {step.title}
                                        </motion.h3>
                                        <motion.p
                                            className="text-muted-foreground text-sm leading-relaxed"
                                            initial={{ opacity: 0.7 }}
                                            whileHover={{
                                                opacity: 1,
                                                transition: { duration: 0.2 }
                                            }}
                                        >
                                            {step.description}
                                        </motion.p>
                                    </motion.div>
                                </motion.div>
                                {index < steps.length - 1 && (
                                    <motion.div
                                        className="hidden lg:block absolute top-8 left-full w-full h-0.5 transform translate-x-4 -translate-y-1/2 origin-left"
                                        variants={connectionVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        animate="animate"
                                        viewport={{ once: true }}
                                        style={{
                                            background: "linear-gradient(to right, rgba(var(--primary)/0.5), transparent)"
                                        }}
                                    />
                                )}
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-primary/40 rounded-full pointer-events-none"
                                        style={{
                                            left: `${20 + i * 25}%`,
                                            top: `${15 + i * 15}%`
                                        }}
                                        animate={{
                                            y: [-10, 10, -10],
                                            x: [-5, 5, -5],
                                            opacity: [0.2, 0.8, 0.2],
                                            scale: [0.5, 1, 0.5]
                                        }}
                                        transition={{
                                            duration: 3 + i * 0.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.3 + i * 0.5
                                        }}
                                    />
                                ))}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;