import { Mail, MapPin, Phone } from "lucide-react";
import "./Footer.scss";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Logo */}
                <img className='image-footer'
                    src="./dist/logo-sem-fundo.png"
                />


                {/* Contato */}
                <div className="contact">
                    <h3>Contato</h3>
                    <ul>
                        <li><Mail size={16} /> email@email.com</li>
                        <li><Phone size={16} /> +55 (11) 99999-9999</li>
                        <li><MapPin size={16} /> Rua qualquer, número 000</li>
                        <li><a href="#">Perguntas frequentes (FAQ)</a></li>
                        <li><a href="#">Termos e Condições</a></li>
                    </ul>
                </div>

                {/* Categorias */}
                <div className="categories">
                    <h3>Categorias</h3>
                    <div className="list">
                        <a href="#">Matemática</a>
                        <a href="#">Educação Física</a>
                        <a href="#">Português</a>
                        <a href="#">Inglês</a>
                        <a href="#">Química</a>
                        <a href="#">Artes</a>
                        <a href="#">Biologia</a>
                        <a href="#">Física</a>
                        <a href="#">História</a>
                        <a href="#">Geografia</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                Todos os direitos reservados © Educa Fácil {new Date().getFullYear()}
            </div>
        </footer>
    );
}
