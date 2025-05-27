import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { Link } from "react-router";

const CTA = () => {
    return (
        <section className="py-20 md:py-32">
            <div className="container">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-6">
                        Ready to Secure Your Documents?
                    </h2>
                    <p className="text-lg mb-10 max-w-2xl mx-auto">
                        Join the future of digital signatures with blockchain-powered security and transparency.
                        Start signing documents with immutable proof today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" variant="secondary" className="group">
                            Get Started Now
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <Link to={"https://github.com/Signether"} target="_blank">
                            <Button size="lg" variant="outline" className="hover:bg-primary-foreground hover:text-primary cursor-pointer">
                                <Github className="mr-2 h-4 w-4" />
                                View on GitHub
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t">
                        <div className="text-center">
                            <div className="text-2xl font-bold mb-2">100%</div>
                            <div className="text-sm">Decentralized</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold mb-2">⚡</div>
                            <div className="text-sm">Lightning Fast</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold mb-2">🔒</div>
                            <div className="text-sm">Immutable Security</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;