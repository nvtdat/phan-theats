import {fetchFoodData, fetchFoodDetails} from './foodAPI'
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './App.css';
import Logo from './assets/Logo.png';
import Search from './assets/search.png';
import WhiteLogo from './assets/white_logo.png';
import Email from './assets/email.png';
import Linkedin from './assets/linkedin.png';
import Github from './assets/github.png';
import SearchBar from './SearchBar'

function FoodDetails() {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isFoodListLoading, setIsFoodListLoading] = useState(true);
    const [foodDetails, setFoodDetails] = useState(null);
    const [foodList, setFoodList] = useState([]);

    const scrollRef = useRef(null);

    function scroll(direction) {
        const amount = 240;
        scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }

    useEffect(() => {
        async function loadFoodList() {
            if (!foodDetails) return;
            setIsFoodListLoading(true);
            try {
                const data = await fetchFoodData();
                const relatedFood = data.filter((food) => food.category === foodDetails.category && food.slug !== slug);
                console.log('relatedFood:', relatedFood);
                setFoodList(relatedFood);
            } catch(error) {
                console.error('Error fetching food list: ', error);
            } finally {
                setIsFoodListLoading(false);
            }
        }
        loadFoodList();
    }, [foodDetails, slug]);

    const renderFoodList = () => {
        
        if (isFoodListLoading) {
            return <p>Loading related dishes...</p>;
        }

        const randomFoodList = foodList.sort(() => 0.5 - Math.random());
        return (
            <div className="food-list" ref={scrollRef}>
                {randomFoodList.map((food) => (
                    <div key={food.slug} className="food-list-item">
                        <img src={food.image_url} alt={food.name} className="food-list-image" />
                        <div className="food-list-name-panel">
                            <h3 className="food-list-name">{food.name}</h3>
                            <button className="food-list-view-button">
                                <Link to={`/food/${food.slug}`} className="food-list-view-link">View details</Link>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    useEffect(() => {
        fetchFoodDetails(slug).then((data) => {
        setFoodDetails(data);
        }).catch((error) => {
            console.error('Error fetching food details: ', error);
        }).finally(() => {
            setIsLoading(false);
        })
    }, [slug]);

    return (
        <>
        <header className="food_header">
            <Link to="/">
                <img src={Logo} alt="logo" className="logo" />
            </Link>
            <div className="home_navigator">
                <div className="home_navigator_item">
                    <Link to="/">Home</Link>
                </div>
                <div className="home_navigator_item">
                <a href="#menu">Food</a>
                </div>
                <div className="home_navigator_item">
                <a href="#about">About</a>
                </div>
                <div className="home_navigator_item">
                <a href="#specialty">Specialty</a>
                </div>
            </div>
            {/* Search bar */}
            <SearchBar />
        </header>

        <main className="food-details">
            {isLoading ? (
                <p>Loading...</p>
            ) : foodDetails ? (
                <div className="food-details-content">
                    <img src={foodDetails.image_url} alt={foodDetails.name} className="food-details-image" />
                    <div className="food-details-info">
                        <div className="food-details-header">
                            <h1 className="food-details-title">{foodDetails.name}</h1>
                            <div className="food-details-category"> {foodDetails.category}</div>
                        </div>

                        <p className="food-details-introduction"> {foodDetails.introduction}</p>
                        <div className="food-details-description-section">
                            <h2 className="food-details-description-title">About this dish</h2>
                            <p className="food-details-description">{foodDetails.description}</p>
                        </div>
                        <div className="food-details-ingredients-section">
                            <h2 className="food-details-ingredients-title">Ingredients</h2>
                            <p className="food-details-ingredients">{foodDetails.ingredients}</p>  
                        </div>
                        <div className="food-details-footer">
                            <p className="food-details-price">{foodDetails.min_price.toLocaleString()} - {foodDetails.max_price.toLocaleString()} VND</p>
                            <p className="food-details-rating"> ⭐ {foodDetails.rating}</p>
                        </div>
                    </div>
                </div>) : (
                <p>Food details not found.</p>
            )}

            <div className="food-list-section">
                <div className="food-list-header">
                    <h2 className="food-list-title">Related Dishes</h2>
                    <div className="food-list-arrows">
                        <button className="food-list-arrow-btn" onClick={() => scroll('left')}>‹</button>
                        <button className="food-list-arrow-btn" onClick={() => scroll('right')}>›</button>
                    </div>
                </div>
                {renderFoodList()}
            </div>

        </main>

        <section className="footer" id="footer">
            <div className="footer-content">
            <div className="footer-logo">
                <img src={WhiteLogo} alt="logo" className="footer-logo-image" />
            </div>
            
            <div className="footer-contact">
                <h1 className="footer-contact-title">Let's connect</h1>
                <h2 className="footer-contact-subtitle">Have feedback or a food tip?</h2>
                <button className="footer-contact-line">
                <img src={Email} alt="email" className="footer-contact-icon" />
                <p className="footer-contact-text"> nvtdat30052006@gmail.com</p>
                </button>
                <button className="footer-contact-line" onClick={() => window.open('https://www.linkedin.com/in/%C4%91%E1%BA%A1t-nguy%E1%BB%85n-v%C4%83n-ti%E1%BA%BFn-8747b33b7/', '_blank')}>
                <img src={Linkedin} alt="linkedin" className="footer-contact-icon" />
                <p className="footer-contact-text"> https://www.linkedin.com/in/đạt-nguyễn-văn-tiến </p>
                </button>
                <button className="footer-contact-line" onClick={() => window.open('https://github.com/nvtdat', '_blank')}>
                <img src={Github} alt="github" className="footer-contact-icon" />
                <p className="footer-contact-text"> github.com/nvtdat</p>
                </button>
            </div>
            </div>
            <span className="footer-copyright">© Designed by Tien Dat.</span>
        </section>
        </>
    )

}
export default FoodDetails;