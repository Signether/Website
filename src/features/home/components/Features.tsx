import { Shield, FileCheck, Clock, Globe, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
    const features = [
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Blockchain Security",
            description: "Immutable proof of document signatures with Web3 verification on Optimism network."
        },
        {
            icon: <FileCheck className="h-6 w-6" />,
            title: "Digital Signatures",
            description: "Create and verify digital signatures with SHA-256 hash generation and on-chain registration."
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Real-time Tracking",
            description: "Track signature status in real-time with timestamped blockchain proof of registration."
        },
        {
            icon: <Globe className="h-6 w-6" />,
            title: "Decentralized Registry",
            description: "Leverage DEHR smart contract for censorship-resistant and transparent file hash storage."
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "Gas Efficient",
            description: "Built on Optimism L2 for lightning-fast transactions with minimal gas fees."
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Wallet Integration",
            description: "Seamless Web3 wallet integration with MetaMask and other Ethereum-compatible wallets."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const generateFloatingVariants = (index: number) => ({
        hidden: {
            opacity: 0,
            y: 60,
            scale: 0.8,
            rotateX: -15
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: index * 0.1
            }
        },
        floating: {
            y: [-5, 5, -5],
            x: [-2, 2, -2],
            rotateY: [-1, 1, -1],
            transition: {
                duration: 3 + (index * 0.5),
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.4
            }
        }
    });

    const iconVariants = {
        initial: { scale: 1, rotate: 0 },
        animate: {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1 + Math.random() * 3
            }
        },
        hover: {
            scale: 1.2,
            rotate: 360,
            transition: {
                duration: 0.6,
                ease: "easeInOut"
            }
        }
    };

    const backgroundVariants = {
        initial: {
            background: "linear-gradient(45deg, transparent, transparent)",
            scale: 1
        },
        hover: {
            background: [
                "linear-gradient(45deg, transparent, rgba(var(--primary)/0.05), transparent)",
                "linear-gradient(135deg, rgba(var(--primary)/0.1), transparent, rgba(var(--primary)/0.05))",
                "linear-gradient(225deg, transparent, rgba(var(--primary)/0.05), transparent)"
            ],
            scale: 1.02,
            transition: {
                background: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                },
                scale: {
                    duration: 0.3
                }
            }
        }
    };

    const glowVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: {
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.2, 0.8],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: Math.random() * 5
            }
        }
    };

    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        animate={{
                            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                            opacity: [0, 0.5, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 2
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
                            Powerful Features
                        </motion.h2>
                        <motion.p
                            className="text-muted-foreground text-lg max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Experience the future of digital signatures with our comprehensive suite of blockchain-powered features
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-xl transition-all duration-500 cursor-pointer"
                                variants={generateFloatingVariants(index)}
                                animate={["visible", "floating"]}
                                whileHover={{
                                    y: -10,
                                    rotateY: 5,
                                    rotateX: 5,
                                    scale: 1.05,
                                    transition: {
                                        duration: 0.3,
                                        ease: "easeOut"
                                    }
                                }}
                                whileTap={{
                                    scale: 0.95,
                                    rotateY: 0,
                                    rotateX: 0
                                }}
                                style={{
                                    transformStyle: "preserve-3d",
                                    perspective: "1000px"
                                }}
                            >
                                <motion.div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                                    variants={backgroundVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    transition={{ duration: 0.5 }}
                                />
                                <motion.div
                                    className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-0"
                                    variants={glowVariants}
                                    initial="initial"
                                    animate="animate"
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <motion.div
                                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500 relative overflow-hidden"
                                            variants={iconVariants}
                                            initial="initial"
                                            animate="animate"
                                            whileHover="hover"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                                                animate={{
                                                    x: [-100, 100],
                                                    transition: {
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        repeatDelay: 3 + Math.random() * 5,
                                                        ease: "easeInOut"
                                                    }
                                                }}
                                            />
                                            {feature.icon}
                                        </motion.div>
                                        <motion.h3
                                            className="text-xl font-semibold"
                                            initial={{ opacity: 0.8 }}
                                            whileHover={{
                                                opacity: 1,
                                                x: 5,
                                                transition: { duration: 0.2 }
                                            }}
                                        >
                                            {feature.title}
                                        </motion.h3>
                                    </div>
                                    <motion.p
                                        className="text-muted-foreground leading-relaxed"
                                        initial={{ opacity: 0.7 }}
                                        whileHover={{
                                            opacity: 1,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        {feature.description}
                                    </motion.p>
                                </div>
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                                        style={{
                                            left: `${20 + i * 30}%`,
                                            top: `${10 + i * 20}%`
                                        }}
                                        animate={{
                                            y: [-5, 5, -5],
                                            opacity: [0.3, 0.8, 0.3],
                                            scale: [0.8, 1.2, 0.8]
                                        }}
                                        transition={{
                                            duration: 2 + i * 0.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.7
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

export default Features;