import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../axiosInstance';

const HomeContainer = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #f5f5f5;
`;

const NewsSection = styled.div`
    margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
    text-align: center;
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 2rem;
    font-weight: 300;
    &:after {
        content: '';
        display: block;
        width: 50px;
        height: 3px;
        background: #007bff;
        margin: 1rem auto;
    }
`;

const NewsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 3rem;
    margin: 2rem auto;
    max-width: 1400px;
    padding: 0 2rem;
`;

const NewsCard = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
    margin: 20px;
    &:hover {
        transform: translateY(-5px);
    }
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
    margin-bottom: 1rem;
    background: #000;
`;

const MainImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.8s ease-in-out;
    filter: brightness(0.9);
    ${NewsCard}:hover & {
        transform: scale(1.05);
        filter: brightness(1);
    }
    opacity: ${props => props.$active ? '1' : '0'};
    position: absolute;
    top: 0;
    left: 0;
`;

const ImageOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background: radial-gradient(
        circle at center,
        transparent 60%,
        rgba(0, 0, 0, 0.2) 70%,
        rgba(0, 0, 0, 0.4) 80%,
        rgba(0, 0, 0, 0.6) 90%,
        rgba(0, 0, 0, 0.8) 100%
    );
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
    mask-image: radial-gradient(
        circle at center,
        transparent 60%,
        black 80%
    );
    transition: opacity 0.4s ease;
    ${NewsCard}:hover & {
        opacity: 0.5;
    }
`;

const ThumbnailsContainer = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 0.5rem;
    background: rgba(0,0,0,0.5);
    padding: 5px;
    border-radius: 8px;
`;

const Thumbnail = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    object-fit: cover;
    border: 2px solid ${props => props.$active ? '#fff' : 'transparent'};
`;

const NewsContent = styled.div`
    padding: 1.5rem 2rem;
    max-width: 800px;
    margin: 0 auto;
`;

const NewsTitle = styled.h3`
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
`;

const NewsDate = styled.p`
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    &:before {
        content: '📅';
        margin-right: 0.5rem;
    }
`;

const NewsText = styled.p`
    color: #444;
    line-height: 1.8;
    font-size: 1rem;
    text-align: justify;
    max-width: 600px;
    margin: 0 auto;
    padding: 0 1rem;
`;

const Home = () => {
    const [news, setNews] = useState([]);
    const [activeImages, setActiveImages] = useState({});

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveImages(prev => {
                const newActiveImages = { ...prev };
                Object.keys(prev).forEach(noticiaId => {
                    const noticia = news.find(n => n.id === parseInt(noticiaId));
                    if (noticia && noticia.imagenes) {
                        newActiveImages[noticiaId] = 
                            (prev[noticiaId] + 1) % noticia.imagenes.length;
                    }
                });
                return newActiveImages;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [news]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axiosInstance.get('noticias/');
            setNews(response.data);
            // Inicializar las imágenes activas
            const initialActiveImages = {};
            response.data.forEach(item => {
                if (item.imagenes && item.imagenes.length > 0) {
                    initialActiveImages[item.id] = 0;
                }
            });
            setActiveImages(initialActiveImages);
        } catch (error) {
            console.error('Error al cargar noticias:', error);
        }
    };

    const handleImageClick = (noticiaId, imageIndex) => {
        setActiveImages(prev => ({
            ...prev,
            [noticiaId]: imageIndex
        }));
    };

    return (
        <HomeContainer>
            <NewsSection>
                <SectionTitle>Últimas Noticias</SectionTitle>
                <NewsGrid>
                    {news.map((item) => (
                        <NewsCard key={item.id}>
                            {item.imagenes && item.imagenes.length > 0 && (
                                <ImageContainer>
                                    {item.imagenes.map((imagen, index) => (
                                        <React.Fragment key={imagen.id}>
                                            <MainImage 
                                                src={imagen.imagen} 
                                                alt={item.titulo}
                                                $active={activeImages[item.id] === index}
                                                style={{
                                                    zIndex: activeImages[item.id] === index ? 1 : 0
                                                }}
                                            />
                                            <ImageOverlay 
                                                style={{
                                                    zIndex: activeImages[item.id] === index ? 2 : 0,
                                                    opacity: activeImages[item.id] === index ? 1 : 0
                                                }}
                                            />
                                        </React.Fragment>
                                    ))}
                                    {item.imagenes.length > 1 && (
                                        <ThumbnailsContainer style={{ zIndex: 3 }}>
                                            {item.imagenes.map((imagen, index) => (
                                                <Thumbnail
                                                    key={imagen.id}
                                                    src={imagen.imagen}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    onClick={() => handleImageClick(item.id, index)}
                                                    $active={activeImages[item.id] === index}
                                                />
                                            ))}
                                        </ThumbnailsContainer>
                                    )}
                                </ImageContainer>
                            )}
                            <NewsContent>
                                <NewsTitle>{item.titulo}</NewsTitle>
                                <NewsDate>
                                    {new Date(item.fecha_creacion).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </NewsDate>
                                <NewsText>{item.contenido}</NewsText>
                            </NewsContent>
                        </NewsCard>
                    ))}
                </NewsGrid>
            </NewsSection>
        </HomeContainer>
    );
};

export default Home; 