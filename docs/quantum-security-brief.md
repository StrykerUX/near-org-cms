# Quantum Security — copy brief

Transcription of `QuantumSecurity.docx`, the copy deck `/prototype/quantum-security`
is built from. **This is the source of truth for the page's words**, not the
design canvas and not the components — the canvas transcribed from this, and the
port transcribed from the canvas.

Checked in so page copy can be diffed against it without re-parsing a binary.

> Written in English, like `components/sections/quantum/`. The rest of `docs/` is
> in Spanish — see the language note in that folder's README.

## Provenance

| | |
|---|---|
| Source file | `QuantumSecurity.docx` |
| SHA-256 | `92f49ea8f61196cf91732443d4d5094c4eba05fed3029a43b29e6af0c02b7c4c` |
| Also at | `uploads/QuantumSecurity.docx` in the Claude Design project `Website rebuild request` (byte-identical) |
| Transcribed | 2026-08-11 |

Angle brackets `⟨…⟩` after a link show the **actual href** on that hyperlink,
which is not always what the visible text says — see §0 and the notes at the end.

---

## 0. Page meta

- **Route (title text):** `near.org/quantum-security`
- **Route (actual hyperlink):** ⟨`near.org/blockchain/quantum-security`⟩ ← these disagree
- **Meta title:** Quantum-Safe Blockchain: Post-Quantum Security on NEAR Protocol
- **Meta description:** NEAR is a quantum-safe blockchain with post-quantum signing (FIPS-204 / ML-DSA) live on mainnet. See how NEAR defends against the quantum threat.

## 1. Hero

- **H2:** Quantum-safe blockchain, live on mainnet
- **Body:** Quantum computing threatens the cryptography that secures every blockchain. NEAR accounts are decoupled from cryptography by design, so upgrading to post-quantum security takes a single key rotation. Post-quantum signing is live on NEAR mainnet today.
- **CTA:** See NEAR's quantum roadmap → *[anchor link - jump below]*

## 2. Proof strip

| Fact | Gloss |
|---|---|
| Post-quantum signing | Live on mainnet |
| FIPS-204 (ML-DSA) | NIST-approved scheme |
| One transaction | To rotate to quantum-safe keys |
| Account-level | Default path, not an opt-in tool |
| 5+ years | 100% mainnet uptime |
| Since 2019 | Account model designed for quantum safety |

## 3. The threat

- **H2:** The quantum threat to blockchains
- **Body:** Most blockchains derive account ownership from elliptic-curve cryptography, which a quantum computer running Shor's algorithm could reverse to steal assets from any address with an exposed public key. Bloomberg puts as much as $470 billion of Bitcoin at risk to the quantum threat.
- **Link:** How NEAR is preparing for the quantum era → ⟨`near.org/blog/making-near-protocol-post-quantum-safe`⟩

## 4. Why NEAR moves first

- **H2:** A key rotation, not a migration
- **Body:** On most chains, an address is derived from a keypair, so defending against quantum attack means migrating the address itself. NEAR accounts are decoupled from cryptography, so an account holder rotates to quantum-safe keys in a single transaction and keeps the same account.
- **Link:** How the NEAR account model works → ⟨`https://docs.near.org/protocol/accounts-contracts/account-model`⟩

## 5. What's live today

- **H2:** Post-quantum signing, live on mainnet
- **Body:** NEAR supports FIPS-204 (ML-DSA), a NIST-approved lattice-based post-quantum signature scheme, at the protocol level. Any account holder rotates to quantum-safe keys through the NEAR CLI.
- ✦ **Signature agility.** The protocol already supported EdDSA and ECDSA. A post-quantum scheme extends a model built for multiple signature types.
- ✦ **Account-level by default.** Quantum-safe keys secure the account itself, not a separate vault users opt into.
- ✦ **Live in production.** Post-quantum signing runs on mainnet, not on testnet or in a research demo.
- **Link:** Rotate your keys with the NEAR CLI → ⟨`docs.near.org/tools/cli#ml-dsa-65-post-quantum-2`⟩

## 6. Beyond accounts

- **H2:** Beyond accounts: wallets, cross-chain, and research
- **Body:** Account-level protection is the first step. NEAR is also extending quantum safety across the surfaces that hold and move assets.
- ✦ **Wallets.** NEAR is working with software and hardware wallet builders, such as Ledger, on post-quantum support.
- ✦ **Cross-chain.** The NEAR Intents team is developing quantum-safe Chain Signatures, so users from any chain can hold assets in a quantum-safe environment even if their origin chain is slow to upgrade.
- ✦ **Ownership research.** A zero-knowledge approach lets a user prove they know the seed phrase behind an asset, a contingency for verifying rightful ownership if classical keys break.

## 7. Competitive contrast

- **H2:** How is NEAR different from other quantum-safe chains?
- **Body:** Most post-quantum protection in production today is narrower than it sounds. On NEAR, quantum safety is a default account-level property, live in production, not an opt-in tool or a roadmap item.

| Alternatives | On NEAR |
|---|---|
| A quantum-safe vault or account users opt into, separate from the default wallet | Quantum-safe keys secure the account itself, by default |
| Protection for historical chain state or cross-chain proofs, not account balances | Post-quantum signing protects the balance in the account |
| Native quantum-safe accounts mapped years out, full migration targeting end of decade | Post-quantum signing live on mainnet today |
| A chain-wide migration to move to a new signature scheme | A single key rotation, because accounts are decoupled from cryptography |

## 8. Roadmap

- **H2:** NEAR's post-quantum roadmap
- **Subhead:** One future-proof migration, sequenced in public.
- **Body:** Securing accounts is step one. Every layer of a live blockchain eventually needs post-quantum protection, and NEAR is sequencing that work so the ecosystem migrates once rather than repeatedly.
- ✦ **Live now.** Post-quantum signing (FIPS-204 / ML-DSA) at the account and protocol level. Rotate through the NEAR CLI.
- ✦ **In progress.** Post-quantum support across software and hardware wallets. Quantum-safe Chain Signatures for cross-chain users on NEAR Intents.
- ✦ **In research.** Zero-knowledge seed-phrase ownership proofs as a quantum contingency.
- ✦ **On the horizon.** Post-quantum consensus, validators, and epoch sync, the deeper protocol layers that complete the migration.
- **Body:** Near One publishes ongoing technical detail on this work as it ships.
- **Link:** Follow the research → ⟨`blog.nearone.org`⟩ — 💬 **unresolved comment, see below**

## 9. Press coverage

- **H2:** Blockchain quantum security in the news
- **Subhead:** How the industry is covering the quantum threat, and NEAR's readiness
- ✦ **Bloomberg** — as much as $470 billion of Bitcoin could be at risk as quantum computing advances. → ⟨`https://www.bloomberg.com/news/articles/2026-07-07/will-quantum-computers-hack-bitcoin-and-other-cryptocurrencies?srnd=homepage-americas`⟩
- ✦ **Project Eleven** — research estimating over 7 million BTC in quantum-exposed addresses. → ⟨`https://bitcoin-risq-list.projecteleven.com/`⟩
- ✦ **NEAR Protocol Brings Quantum-Safe Signing to Mainnet.** With the 2.13 upgrade, NEAR becomes one of the first blockchains to add a NIST-approved post-quantum signature scheme in production. → ⟨`https://www.prnewswire.com/news-releases/near-protocol-brings-quantum-safe-signing-to-mainnet-302829646.html`⟩

## 10. FAQ

- **H2:** Quantum security FAQ

**Q: Is NEAR quantum-safe?**
A: Yes. NEAR supports post-quantum signing with FIPS-204 (ML-DSA), a NIST-approved signature scheme, live on mainnet. Any NEAR account holder can rotate to quantum-safe keys in a single transaction.

**Q: What is post-quantum cryptography?**
A: Post-quantum cryptography, also called quantum-safe or quantum-resistant cryptography, refers to signature and encryption schemes designed to stay secure against both classical and quantum computers. NEAR uses FIPS-204 (ML-DSA), a lattice-based scheme approved by NIST.

**Q: How does NEAR protect against the quantum threat?**
A: NEAR accounts are decoupled from cryptography and controlled through rotatable access keys. Adding a post-quantum signature scheme is a key rotation rather than a chain-wide migration, so account holders upgrade to quantum-safe keys with one transaction while keeping the same account.

**Q: What is the quantum threat to cryptocurrency?**
A: A powerful enough quantum computer running Shor's algorithm could derive a private key from an exposed public key and take the assets it controls. Addresses whose public keys are already visible onchain are the most exposed. Galaxy Digital estimates as much as $470 billion of Bitcoin sits in such addresses.

**Q: When will quantum computers threaten blockchains?**
A: Estimates vary, but industry and research timelines increasingly cluster around the end of the decade, and Google's 2026 research lowered the resources thought necessary. Because exposed keys can be harvested now and attacked later, security teams recommend migrating before a working attack exists.

## 11. Closing CTA

- **H2:** Upgrade to a quantum-safe account
- **Body:** Post-quantum signing is live on NEAR mainnet. Rotate your keys today, and read how NEAR is securing the ecosystem for the quantum era.
- **CTA:** Rotate your keys → ⟨`docs.near.org/tools/cli#ml-dsa-65-post-quantum-2`⟩
- **Link:** Read the deep-dive → ⟨`near.org/blog/making-near-protocol-post-quantum-safe`⟩

---

## Comment left in the document

Anchored to §8's "Follow the research" link:

> **Avery Erwin**, 2026-07-29 — *"Update coming soon from Mally"*

So that target is provisional. `blog.nearone.org` is what shipped in the build.

## Where the built page departs from this deck

Not defects to fix on sight — each has a reason. Recorded so a copy diff does not
re-litigate them.

| # | Departure | Where it came from |
|---|---|---|
| §3 | The closing sentence — "Bloomberg puts as much as $470 billion of Bitcoin at risk" — is promoted out of the paragraph and set as a standalone figure. Same words, different typographic weight. | This repo |
| §4 | The section headline is not the deck's "A key rotation, not a migration" but a rewriting sentence built from §4's own body: "Defending against quantum attack means *migrating the address itself* → *rotating one key*." The deck's headline idea is carried by the swap rather than stated. | This repo |
| §0 | Meta title and description are **not implemented**. `page.meta.ts` carries prototype placeholder copy. | Not in the canvas — it has nowhere to put meta tags |
| §9 | Bloomberg URL ships without its `?srnd=homepage-americas` tracking param. | The design canvas |
| — | Three lines on the page are in no section of this deck: "Every blockchain will have to replace its cryptography…", "Every chain faces the same mathematics…", "One rotation ahead." | The design canvas |
| §6 | Deck's single H2 is split into an eyebrow ("Beyond accounts") plus H2 ("Wallets, cross-chain, and research"). Same words. | The design canvas |
| §10 | The eyebrow above the FAQ heading was removed — the canvas had one reading "FAQ" directly above a heading ending in "FAQ". | This repo |

## Contradiction inside the deck itself

**$470 billion is credited to two different sources.** §3 and §9 say **Bloomberg**;
§10's fourth answer says **Galaxy Digital**. Both appear on the built page, in
their respective sections, because the port was faithful. Needs an editorial
decision before this goes to production.
