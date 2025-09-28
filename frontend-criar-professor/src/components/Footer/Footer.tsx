import { Typography, useTheme } from "@mui/material";
import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Footer.scss";
export default function Footer() {
    const theme = useTheme();
    const [hashtags, setHashtags] = useState<string[]>([]);
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Logo */}
                <img src="/logo-sem-fundo.png" className="image-footer" />

                {/* Contato */}
                <div className="contact">
                    <h3>Contato</h3>
                    <ul>
                        <li>
                            <Mail size={16} className="icon" />
                            <span>educacaofacilfiap@gmail.com</span>
                        </li>
                        <li>
                            <Phone size={16} className="icon" />
                            <span>+55 (11) 99999-9999</span>
                        </li>
                        <li>
                            <MapPin size={16} className="icon" />
                            <span>Rua qualquer, número 000</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                Todos os direitos reservados © Educa Fácil {new Date().getFullYear()}
            </div>
        </footer>
    );
}

