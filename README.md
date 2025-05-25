# 🖋️ Signather - Digital Signature Platform

## 🔍 What is Signather?

Signather is a **decentralized digital signature platform** built on **React + TypeScript + Vite** that integrates with the **DEHR (Decentralized Hash Registry)** smart contract on Optimism. It provides a modern, user-friendly interface for **digitally signing documents** and **registering file hashes** on-chain.

Think of it as a digital notary 📋 - providing immutable proof of document signatures and ownership with blockchain verification.

---

## ✨ Features

- ✅ Modern React interface with TypeScript support  
- ✅ Seamless Web3 wallet integration  
- ✅ Document upload and SHA-256 hash generation  
- ✅ Digital signature creation and verification  
- ✅ On-chain hash registration via DEHR contract  
- ✅ Responsive design with Tailwind CSS  
- ✅ Real-time signature status tracking  
- ✅ Export signed documents with proofs  

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite  
- **Styling**: Tailwind CSS  
- **Web3**: ethers.js / wagmi  
- **Blockchain**: Optimism Network  
- **Smart Contract**: DEHR (Decentralized Hash Registry)  
- **Build Tool**: Vite with SWC  

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun  
- MetaMask or another Web3 wallet  
- Optimism network configured in wallet  

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Development

```bash
# Run with hot module replacement
bun run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Application pages
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── contracts/      # Contract ABIs and addresses
├── types/          # TypeScript type definitions
└── assets/         # Static assets
```

---

## 🔧 Configuration

The project uses path aliases configured in `vite.config.ts`:

```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}
```

This allows clean imports like `import { Button } from "@/components/ui/button"`

---

## 🌐 Web3 Integration

Signather connects to the DEHR smart contract on Optimism to:

1. **Register document hashes** on-chain for immutable proof  
2. **Verify existing registrations** and ownership  
3. **Track signature timestamps** with blockchain precision  
4. **Provide decentralized attestation** of document authenticity  

---

## 🧪 Testing

```bash
# Run unit tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run E2E tests
bun run test:e2e
```

---

## 📦 Building & Deployment

```bash
# Build for production
bun run build

# Deploy to your preferred hosting platform
# (Vercel, Netlify, AWS S3, etc.)
```

---

## 🔗 Related Projects

- **[DEHR Smart Contract](/root/Projects/Signather/DEHR)** - The underlying blockchain registry  
- **Optimism Network** - Layer 2 scaling solution for Ethereum  

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project  
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Built with [Vite](https://vitejs.dev/) for lightning-fast development  
- Styled with [Tailwind CSS](https://tailwindcss.com/) for modern UI  
- Powered by [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)  
- Secured by [Optimism](https://optimism.io/) blockchain technology  

---

> "Digital signatures, powered by blockchain transparency." ✍️🔗