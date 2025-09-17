import { Typography, useTheme } from "@mui/material";
import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHashtags } from "../../service/post";
import "./Footer.scss";
export default function Footer() {
    const theme = useTheme();
    const [hashtags, setHashtags] = useState<string[]>([]);
    useEffect(() => {
        getHashtags().then(setHashtags).catch(console.error)
    }, []);
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

                {/* Categorias */}
                <div className="hashtags">
                    <h3>Algumas hashtags</h3>
                    <div className="list">
                        {hashtags.length > 0 ? (
                            hashtags.map((tag) => (
                                <Link key={tag} to="#">
                                    <Typography sx={{ color: theme.palette.secondary.contrastText }}>{tag}</Typography>
                                </Link>
                            ))
                        ) : (
                            <p>Carregando hashtags...</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                Todos os direitos reservados © Educa Fácil {new Date().getFullYear()}
            </div>
        </footer>
    );
}

