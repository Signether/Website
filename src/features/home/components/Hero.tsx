import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Optimism from "@Assets/hero/optimism.svg"
import Hardhat from "@Assets/hero/hardhat.svg"
import { Link } from "react-router";
import { motion } from "framer-motion";

const Hero = () => {
    const scrollToNext = () => {
        const nextSection = document.querySelector('section:nth-of-type(2)');
        nextSection?.scrollIntoView({ behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const logoVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.95
        }
    };

    const arrowVariants = {
        initial: { y: 0 },
        animate: {
            y: [0, 8, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden">
            <motion.div
                className="absolute h-full w-full bg-[url('https://library.shadcnblocks.com/images/block/patterns/grid1.svg')] bg-contain bg-repeat opacity-100 [mask-image:linear-gradient(to_right,white,transparent,transparent,white)] lg:block"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />

            <div className="container flex-1 flex items-center justify-center py-28 md:py-32">
                <motion.div
                    className="mx-auto flex max-w-5xl flex-col items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
                        <motion.span
                            variants={itemVariants}
                            className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;>svg]:size-3 gap-1 [&amp;>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden text-foreground [a&amp;]:hover:bg-accent [a&amp;]:hover:text-accent-foreground transition-colors hover:bg-secondary/20"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            New Release
                        </motion.span>
                        <motion.div variants={itemVariants}>
                            <motion.h1
                                className="mb-6 text-4xl font-bold tracking-tight text-pretty md:text-5xl lg:text-7xl"
                                variants={logoVariants}
                                whileHover="hover"
                            >
                                🖋️ Signather
                            </motion.h1>
                            <motion.p
                                className="mx-auto max-w-2xl text-muted-foreground md:text-lg lg:text-xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                            >
                                A decentralized digital signature platform that integrates with blockchain technology. Providing immutable proof of document signatures, ownership and integrity with Web3 verification.
                            </motion.p>
                        </motion.div>
                        <motion.div
                            className="mt-6 flex items-center gap-4"
                            variants={itemVariants}
                        >
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button className="cursor-pointer">Open App</Button>
                            </motion.div>
                            <Link to={"https://gov.signather.org/"}>
                                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                    <Button variant={"outline"} className="cursor-pointer">
                                        Governance
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>
                        <motion.div
                            className="mt-12 flex flex-col items-center gap-4 lg:mt-16"
                            variants={itemVariants}
                        >
                            <motion.p
                                className="text-center text-sm text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.6 }}
                            >
                                Powered by the next generation
                            </motion.p>
                            <motion.div
                                className="flex flex-wrap items-center justify-center gap-8 opacity-80"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 0.8, y: 0 }}
                                transition={{ delay: 1.4, duration: 0.6 }}
                            >
                                <motion.img
                                    src={Optimism}
                                    alt="Optimism"
                                    className="h-5 transition-opacity hover:opacity-100"
                                    whileHover={{ scale: 1.1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.img
                                    src={Hardhat}
                                    alt="Hardhat"
                                    className="h-7 transition-opacity hover:opacity-100"
                                    whileHover={{ scale: 1.1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.img
                                    src="https://library.shadcnblocks.com/images/block/logos/tailwind-wordmark.svg"
                                    alt="Tailwind CSS"
                                    className="h-5 transition-opacity hover:opacity-100"
                                    whileHover={{ scale: 1.1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.6 }}
            >
                <motion.button
                    onClick={scrollToNext}
                    className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Scroll to next section"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.span
                        className="text-sm font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.2, duration: 0.4 }}
                    >
                        Scroll down
                    </motion.span>
                    <motion.div
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/20 group-hover:border-foreground/40 group-hover:bg-accent transition-all duration-300"
                        variants={arrowVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                    </motion.div>
                </motion.button>
            </motion.div>
        </section>
    );
};

export default Hero;