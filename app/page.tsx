import Image from "next/image";
import {
  ArrowRight,
  CarFront,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Handshake,
  MessageCircle,
} from "lucide-react";
import { getFeaturedVehicles } from "@/lib/vehicles";

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <Image
      src="/brand/logo-horizontal.png"
      alt="Ponto Auto Veículos"
      width={small ? 172 : 218}
      height={small ? 58 : 73}
      className={small ? "brand-logo brand-logo-small" : "brand-logo"}
      priority
    />
  );
}

export default async function HomePage() {
  const vehicles = await getFeaturedVehicles();

  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#inicio" aria-label="Ponto Auto Veículos - início"><BrandMark /></a>
          <nav className="main-nav" aria-label="Navegação principal">
            <a className="active" href="#estoque">Estoque</a>
            <a href="#venda">Venda seu veículo</a>
            <a href="#loja">A loja</a>
            <a href="#contato">Contato</a>
          </nav>
          <a className="whatsapp-button" href="https://wa.me/5583999999999" target="_blank" rel="noreferrer">
            <MessageCircle size={20} aria-hidden="true" />
            <span>Fale pelo WhatsApp</span>
          </a>
          <button className="mobile-menu" aria-label="Abrir menu"><span /><span /><span /></button>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <div className="eyebrow"><span /> QUALIDADE, CONFIANÇA E BOM NEGÓCIO</div>
          <h1>Seu próximo<br />veículo <em>começa<br className="desktop-break" /> aqui.</em></h1>
          <p>Conheça nosso estoque e visite a <strong>Ponto Auto.</strong></p>
          <div className="hero-actions">
            <a className="button button-primary" href="#estoque">Ver estoque <ArrowRight size={20} /></a>
            <a className="button button-secondary" href="#loja">Conhecer a loja</a>
          </div>
          <div className="trust-row" aria-label="Diferenciais da loja">
            <div><CarFront size={24} /><span>Veículos<br />selecionados</span></div>
            <div><ShieldCheck size={24} /><span>Atendimento<br />especializado</span></div>
            <div><Handshake size={24} /><span>Negociação<br />segura e transparente</span></div>
          </div>
        </div>
        <div className="hero-facade" role="img" aria-label="Fachada da Ponto Auto Veículos">
          <div className="facade-glow" />
          <div className="facade-sign"><Image src="/brand/icon.png" alt="" width={72} height={72} /><span>PONTO AUTO<br /><small>VEÍCULOS</small></span></div>
          <div className="facade-building"><div className="awning" /><div className="glass-grid" /><div className="showroom-lights"><i /><i /><i /><i /><i /></div><div className="showroom-cars"><b /><b /><b /></div></div>
          <div className="facade-caption">Fachada real da loja<br /><strong>Ponto Auto Veículos</strong></div>
        </div>
      </section>

      <section className="search-wrap" aria-label="Buscar veículos">
        <div className="search-card">
          <label className="search-field"><span>Marca ou modelo</span><div><Search size={22} /><input placeholder="Ex.: Honda HR-V, Toyota Corolla, Fiat Strada..." /></div></label>
          <div className="search-divider" />
          <label className="search-field price-field"><span>Faixa de preço</span><div><span>Todos os preços</span><ChevronDown size={18} /></div></label>
          <button className="button button-primary search-button"><Search size={20} /> Buscar veículos</button>
        </div>
        <div className="popular-brands"><strong>Marcas mais buscadas</strong>{["Volkswagen", "Fiat", "Toyota", "Chevrolet", "Jeep", "Hyundai"].map((brand) => <a href="#estoque" key={brand}>{brand}</a>)}</div>
      </section>

      <section className="section stock-section" id="estoque">
        <div className="section-heading"><div><div className="eyebrow"><span /> CONFIRA NOSSO ESTOQUE</div><h2>Veículos em destaque</h2></div><a className="outline-link" href="#estoque">Ver todo o estoque <ArrowRight size={18} /></a></div>
        <div className="vehicle-grid">
          {vehicles.length === 0 ? <div className="empty-stock"><CarFront size={30} /><strong>Nosso estoque está sendo atualizado</strong><p>Em breve você poderá consultar os veículos disponíveis.</p></div> : vehicles.map((vehicle) => <article className="vehicle-card" key={vehicle.id}>
            <div className={`vehicle-photo ${vehicle.tone} ${vehicle.imageUrl ? "has-image" : ""}`} style={vehicle.imageUrl ? { backgroundImage: `url(${vehicle.imageUrl})` } : undefined}><div className="photo-label">Foto do veículo</div><button className="favorite" aria-label={`Favoritar ${vehicle.name}`}><Heart size={21} /></button></div>
            <div className="vehicle-content"><h3>{vehicle.name}</h3><p>{vehicle.version}</p><div className="vehicle-price">{vehicle.price}</div><div className="vehicle-meta"><span>{vehicle.year}</span><span>{vehicle.km}</span></div><a className="vehicle-link" href="#contato">Ver veículo <ArrowRight size={18} /></a></div>
          </article>)}
        </div>
      </section>

      <section className="visit-section" id="loja">
        <div className="visit-copy"><div className="eyebrow"><span /> NOSSA LOCALIZAÇÃO</div><h2>Visite nossa loja</h2><p>Venha conhecer nosso estoque e fazer um ótimo negócio.</p><div className="address"><MapPin size={25} /><div><strong>Av. João Pessoa, s/n</strong><small>João Pessoa, PB</small></div></div><a className="button button-primary" href="https://maps.google.com/?q=Jo%C3%A3o+Pessoa+PB" target="_blank" rel="noreferrer">Como chegar <ArrowRight size={18} /></a></div><div className="location-visual"><div className="mini-facade"><div className="mini-sign">PONTO AUTO<br /><small>VEÍCULOS</small></div><div className="mini-car" /></div><div className="map-placeholder"><MapPin size={25} /><div><strong>Ponto Auto Veículos</strong><span>João Pessoa, PB</span></div></div></div>
      </section>

      <footer className="site-footer" id="contato"><div className="container footer-inner"><BrandMark small /><div><strong>Fale com a Ponto Auto</strong><a href="https://wa.me/5583999999999">WhatsApp comercial</a></div><span>© 2026 Ponto Auto Veículos</span></div></footer>
      <a className="floating-whatsapp" href="https://wa.me/5583999999999" target="_blank" rel="noreferrer" aria-label="Falar pelo WhatsApp"><MessageCircle size={25} /></a>
    </main>
  );
}
