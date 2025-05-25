import CTA from "@Features/home/components/CTA"
import Features from "@Features/home/components/Features"
import Hero from "@Features/home/components/Hero"
import HowItWorks from "@Features/home/components/HowItWorks"
import TechStack from "@Features/home/components/TechStack"
import Container from "@Features/shared/components/Container"

const Home = () => {
    return (
        <Container>
            <Hero />
            <Features />
            <HowItWorks />
            <TechStack />
            <CTA />
        </Container>
    )
}

export default Home