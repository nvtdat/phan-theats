import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './assets/Logo.png';
import Search from './assets/search.png';
import WhiteLogo from './assets/white_logo.png';
import {fetchFoodData} from './foodAPI'
import SearchBar from './SearchBar'
import Email from './assets/email.png';
import Linkedin from './assets/linkedin.png';
import Github from './assets/github.png';
import Filter from './assets/filter.png';


function renderFoodList(foodList, isFoodLoading, navigate) {
    if(foodList.length === 0 && !isFoodLoading) {
        return <p>No food items found.</p>
    }
    if(isFoodLoading) {
        return <p>Loading food items...</p>;
    }

    return foodList.map((food) => (
        <div key={food.slug} className="menu-food-list-item" onClick={() => navigate(`/food/${food.slug}`)}>
            <img src={food.image_url}  className="menu-food-list-image" />
            <div className="menu-food-list-category">{food.category}</div>
            <div className="menu-food-list-info">
                
                <h3 className="menu-food-list-name">{food.name}</h3>
                <p className="menu-food-list-description">{food.description}</p>

                <div className="menu-food-list-price-rating">
                    <span className="menu-food-list-price">{food.min_price.toLocaleString()} đ</span>
                    <span className="menu-food-list-rating"> ⭐{food.rating}</span>
                </div>
            </div>
        </div>
    ))

}

function MenuPage() {
    const [isActive, setIsActive] = useState('home');
    const [foodList, setFoodList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const navigate = useNavigate();

    const category = [
        {viewValue: 'All', value: 'all'},
        {viewValue: 'Breakfast', value: 'breakfast'},
        {viewValue: 'Lunch', value: 'lunch'},
        {viewValue: 'Dinner', value: 'dinner'},
        {viewValue: 'Dessert', value: 'dessert'},
    ]

    const filteredFoodList = selectedCategory === 'all' ? foodList : foodList.filter((food) => food.category.toLowerCase() === selectedCategory.toLowerCase());

    useEffect(() => {
        async function loadFoodList() {
            setIsLoading(true);
            try {
                const data = await fetchFoodData();
                setFoodList(data);
                console.log('foodList: ', data);
            } catch(error) {
                console.error('Error fetching food list: ', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadFoodList();
    }, []);

    return(
        <>
        <header className="food_header">
            <Link to="/">
                <img src={Logo} alt="logo" className="logo" />
            </Link>
            <div className="home_navigator">
                <div className="home_navigator_item" onClick={() => setIsActive('home')}>
                    <Link to="/">Home</Link>
                </div>
                <div className="home_navigator_item" onClick={() => setIsActive('menu')}>
                    <a href="#menu" >Food</a>
                </div>
                <div className="home_navigator_item" onClick={() => setIsActive('about')}>
                    <a href="#about">About</a>
                </div>
                <div className="home_navigator_item" onClick={() => setIsActive('specialty')}>
                    <a href="#specialty">Specialty</a>
                </div>
            </div>
            {/* Search bar */}
            <SearchBar />
        </header>
        <main className="menu-page-content">
            <div className="menu-page-title">
                <span className="menu-page-title-highlight1">Our</span> 
                <span className="menu-page-title-highlight2">Menu</span>
            </div>
            <p className="menu-page-subtitle">Flavor of Phan Thiet in every dishes</p>
            <div className="menu-toolbar">
                <div className="menu-filter-wrapper">
                    <button className="menu-filter-btn"
                        onClick={() => setIsFilterOpen(isFilterOpen => !isFilterOpen)}>
                        <img src={Filter} alt="filter" className="menu-filter-icon" />
                    </button>
                    {isFilterOpen && (
                        <div className="menu-filter-dropdown">
                            {category.map((cat) => (
                                <button className={`menu-filter-dropdown-item ${selectedCategory === cat.value ? 'active' : ''}`}
                                    key={cat.value}
                                    onClick={() => {
                                        setSelectedCategory(cat.value);
                                        setIsFilterOpen(false);
                                    }}>
                                    {cat.viewValue}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="menu-food-list">
                {renderFoodList(filteredFoodList, isLoading, navigate)}
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

export default MenuPage;