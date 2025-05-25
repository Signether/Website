import { Code, Palette, Zap, Shield } from "lucide-react";

const TechStack = () => {
    const technologies = [
        {
            category: "Frontend",
            icon: <Code className="h-5 w-5" />,
            items: ["React 18", "TypeScript", "Vite"],
            description: "Modern development stack"
        },
        {
            category: "Styling",
            icon: <Palette className="h-5 w-5" />,
            items: ["Tailwind CSS", "shadcn/ui", "Responsive Design"],
            description: "Beautiful, accessible UI"
        },
        {
            category: "Web3",
            icon: <Zap className="h-5 w-5" />,
            items: ["ethers.js", "wagmi", "MetaMask"],
            description: "Seamless blockchain integration"
        },
        {
            category: "Blockchain",
            icon: <Shield className="h-5 w-5" />,
            items: ["Optimism", "DEHR Contract", "Layer 2"],
            description: "Secure & scalable"
        }
    ];

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <div className="container">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-6">
                            Built with Modern Tech
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                            Powered by cutting-edge technologies for performance, security, and developer experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {technologies.map((tech, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        {tech.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{tech.category}</h3>
                                        <p className="text-xs text-muted-foreground">{tech.description}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    {tech.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechStack;