import { useState, useEffect, useRef} from 'react'
import './App.css'
import Logo from './assets/Logo.png'
import Pic1 from './assets/pic1.png'
import Pic2 from './assets/pic2.png'
import Pic3 from './assets/pic3.png'
import RightArrow from './assets/rightWhite.png'
import RightArrowBlack from './assets/rightBlack.png'
import Search from './assets/search.png'
import { supabase } from './supabaseClient'
import Chopsticks from './assets/chopstick.png'
import Ramen from './assets/ramen.png'
import useDragScroll from './useDragScroll'
import WaveDivider from './WaveDivider'
import Dishes from './assets/dishes.png'
import Boat from './assets/boat.png'
import PhanThiet from './assets/phanthiet.png'
import Image1 from './assets/image1.png'
import Image2 from './assets/image2.png'
import Arrorw from './assets/curved-arrow.png'
import Crab from './assets/crab_icon.png'
import WhiteLogo from './assets/white_logo.png'

import Email from './assets/email.png'
import Linkedin from './assets/linkedin.png'
import Github from './assets/github.png'

function useFadeIn() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

function FeatureList(){
  const { ref, isVisible } = useFadeIn();
  const features = [
    {label: "Fresh", desc: "Straight from the sea, every day."},
    {label: "Handmade", desc: "Made by hand, the traditional way."},
    {label: "Generation", desc: "Recipes passed down through generations."}
  ]

  return (
    <div ref={ref} className="feature-list">
      {features.map((feature, index) => (
        <div 
          key={feature.label} 
          className={`feature-item ${isVisible ? 'is-visible' : ''}`} 
          style={{ transitionDelay: `${index * 0.15}s` }}
        >
          <div className="feature-item-row">
            <span className="feature-item-label">{feature.label}</span>
            <div className="feature-item-line"></div>
          </div>
          <p className="feature-item-desc">{feature.desc}</p>
        </div>
      ))}
    </div>
  )

}

function statItem({end, label}) {
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    let start = 0;
    const duration = 4000; 
    const increment = end / duration
    
    const stepTime = duration / (end * 10); // Thời gian giữa mỗi bước tăng
    const timer = setInterval(() => {
      start += 1;
      setCounter(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [end]);

  

  return (
    <div className="home_content_stats">
      <span style={{color: '#3A2418', fontWeight: 'bold', fontSize: '36px', fontFamily: 'Playfair Display', display: 'flex', justifyContent: 'flex-end' }}>
        {counter}+
      </span>
      <span className="home_content_stats_label">
        {label}
      </span>
    </div>
  )
}

const renderFood = (foodList) => {
  //Hiển thị ngẫu nhiên 4 món ăn từ danh sách
  const shuffledFood = [...foodList].sort(() => 0.5 - Math.random());
  const displayedFood = shuffledFood.slice(0, 5); // Hiển thị 4 món ăn đầu tiên
  if(displayedFood.length === 0) {
    return <p>No food items available.</p>
  }
  return displayedFood.map((item) => (
    <div key={item.id} className="food-item">
      <img src={item.image_url} alt={item.name} className="food-item-image" />
      <div className="food-item-details">
        <h3 className="food-item-name">{item.name}</h3>
        <p className="food-item-description">{item.description}</p>
        <p className="food-item-price">{item.min_price.toLocaleString()} - {item.max_price.toLocaleString()} VND</p>
      </div>
    </div>
  ))
}

//Render Specialty
const renderSpecialty = (foodlist) => {
  const displayedFood = foodlist.slice(0, 5);
  if (displayedFood.length === 0) {
    return <p>No specialty food available.</p>
  }

  return displayedFood.map((item) => (
    <div key={item.id} className="specialty-item">
      <img 
        src={item.image_url} 
        alt={item.name} 
        draggable={false}
        className="specialty-item-image" />
      <div className="specialty-item-details-container">
        <div className="specialty-item-details">
          <h3 className="specialty-item-name">{item.name}</h3>
          <p className="specialty-item-description">{item.description}</p>
          <div className="specialty-item-footer">
            <p className="specialty-item-price">{item.min_price.toLocaleString()} VND</p>
            <div className="specialty-item-rating">⭐{item.rating}</div>
          </div>
        </div>
      </div>
    </div>
  ))
}

const renderBlobs = () => {
  return (
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-7"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
        <div className="blob blob-6"></div>
        <div className="blob blob-8"></div>
        
      </div>
  )
}

function App() {
  const [filterTab, setFilterTab] = useState('breakfast'); // Tab mặc định là "Breakfast"
  const [foodData, setFoodData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref: scrollRef, isDragging, handlers } = useDragScroll();



  useEffect(() => {
    async function fetchFoodData() {
      try {
        const { data, error} = await supabase.from('dishes').select('*');
        console.log('data:', data, 'error:', error);
        if (error) {
          console.error('Error fetching food data: ', error);
        } else {
          const withImageData = data.map(dish => ({
            ...dish,
            image_url: new URL(`./assets/dishes/${dish.slug}.jpg`, import.meta.url).href,
          }));
          setFoodData(withImageData);
        }
      } catch(error) {
        console.error('Error fetching food data: ', error);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchFoodData();
   
  }, []);

  const handleTabClick = (tab) => {
    setFilterTab(tab);
  };

  const filteredFood = foodData.filter((item) => item.category === filterTab);

  useEffect(() => {
    // Khi filterTab thay đổi, bạn có thể thực hiện các hành động khác nếu cần
  }, [filterTab]);
 

  return (
    <>
      <main className="body">
        <section className="home" id="home">
          {/* Phần Home*/}
          <header className="home_header">
            <img src={Logo} alt="logo" className="logo" />
            <div className="home_navigator">
              <div className="home_navigator_item">
                <a href="#home">Home</a>
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
            <div className="home_search">
              <input type="text" placeholder="Search..." className="home_search_input" />
              <img src={Search} alt="search" className="home_search_icon" />
            </div>
          </header>
          <div className="home_content">
            <div className="home_content_intro">
              <div className="home_content_intro_content">
                <div className="home_content_intro_title">
                  <span style={{fontWeight: 'bold', fontSize: '20px', color: '#C20C65', display: 'flex', justifyContent: 'flex-start' }}>
                    Phan Thiet Cuisine
                  </span>
                  <span style={{color: '#3A2418'}}>Enjoy the most popular </span>
                  <span style={{color: '#3A2418'}}>Streetfood in Phan Thiet </span>
                  <p className="home_content_intro_desc">
                    Sun, salt and sea breeze in every bite.<br /> Discover the dishes that define Phan Thiet.
                  </p>
                  {statItem({end: 20, label: 'Dishes and Drinks'})}
                  {statItem({end: 10, label: 'Must-try Dishes'})}
                  {statItem({end: 5, label: 'Specialty Dishes'})}

                  {/*Nút discover và menu */}
                  <div className="home_content_intro_btns">

                    <button className="discover_btn">
                      <div className="discover_btn_content">
                        <span style={{fontSize: '30', fontFamily: 'Inria Serif, sans-serif'}}>Discover</span>
                        <img src={RightArrow} alt="right-arrow" className="discover_arrow" />
                      </div> 
                    </button>

                    <button className="menu_btn">
                      <div className="menu_btn_content">
                        <span style={{fontSize: '30', fontFamily: 'Inria Serif, sans-serif'}}>Menu</span>
                        <img src={RightArrowBlack} alt="right-arrow" className="discover_arrow" />
                      </div> 
                    </button>

                  </div>
                </div>
                

                <div className="home_content_pics"> 
                  <img src={Pic2} alt="pic2" className="home_content_pics_item2" />
                  <img src={Pic1} alt="pic1" className="home_content_pics_item1" />
                  <img src={Pic3} alt="pic3" className="home_content_pics_item3" />
                </div>
              </div>
            </div>

          </div>


        </section>

        {/* Phần Menu */}
        <section className="menu" id="menu">
          {renderBlobs()}
        
          <div className="menu_header">
            <div className="menu_header_title">
              <img src={Chopsticks} alt="chopsticks" className="menu_header_title_icon" />
              <h1 style={{fontSize: '50px', fontWeight: 'bold', color: '#F0629B', fontFamily: 'Playfair Display, sans-serif'}}>Popular Dishes</h1>
              <img src={Ramen} alt="ramen" className="menu_header_title_icon" />
            </div>
            <h2 style={{fontSize: '30px', fontWeight: 'bold', color: '#3A2418', fontFamily: 'Inria Serif, sans-serif'}}>Discover the most popular dishes in Phan Thiet</h2>
          </div>
          <div className="popular_dishes_tabs">
            <div className={`popular_dishes_tab ${'breakfast' === filterTab ? 'active' : ''}`} onClick={() => handleTabClick('breakfast')}>Breakfast</div>
            <div className={`popular_dishes_tab ${'lunch' === filterTab ? 'active' : ''}`} onClick={() => handleTabClick('lunch')}>Lunch</div>
            <div className={`popular_dishes_tab ${'dinner' === filterTab ? 'active' : ''}`} onClick={() => handleTabClick('dinner')}>Dinner</div>
            <div className={`popular_dishes_tab ${'desserts' === filterTab ? 'active' : ''}`} onClick={() => handleTabClick('desserts')}>Dessert</div>
          </div>
          <div className="popular_dishes">
            {isLoading ? <p className="loading">Loading food items...</p> : renderFood(filteredFood)}
          </div>
        </section>

        <section className="specialty" id="specialty">
          <div className="specialty-header">
            <div className="specialty-header-content">
              <h1 className="specialty-title">Specialty Dishes</h1>
              <img src={Dishes} alt="dishes" className="specialty-header-icon" />
            </div>
            <div className="specialty-subtitle-container">
              <h2 className="specialty-subtitle">Beyond the usual: dishes locals swear by</h2>
              <div className="specialty-header-line"></div>
            </div>
          </div>
         
          <div 
            className={`specialty-dishes ${isDragging ? 'is-dragging' : ''}`} 
            ref={scrollRef} {...handlers}>
            {isLoading ? <p className="loading">Loading specialty food items...</p> : renderSpecialty(filteredFood)}
          </div>
           <div className="specialty-quote">
            <div className="specialty-quote-line">
              <span className="specialty-quote-icon">“</span>
              <p className="specialty-quote-text1">The best way to experience Phan Thiet is through its food.</p>
            </div>
            <div className="specialty-quote-line">
              <p className="specialty-quote-text2">From the bustling markets to the quiet streets, every corner has a story to tell.</p>
              <span className="specialty-quote-icon">”</span>
            </div>
          </div>
          {/*Foating boat image animation */}
          <img src={Boat} alt="boat" className="floating-boat" />
          <WaveDivider />
        </section>

        {/* About Section*/}
        <section className="about" id="about">
          <div className="about-content">
            <div className="about-header">
              <h1 className="about-title">About Phan Thiet Cuisine</h1>
            </div>
            <div className="about-insight">
              <div className="about-copy">
                <div className="about-subtitle-container">
                  <h2 className="about-subtitle">GEOGRAPHICAL LOCATION</h2>
                  <p className="about-description">
                    Phan Thiet sits along the south-central coast of Vietnam, in Binh Thuan province — about 200km from Ho Chi Minh City. 
                    Known for its long white beaches, red sand dunes, and centuries-old fish sauce tradition, it's where the sea meets everyday life.
                    
                    Our mission is to bring the authentic flavors of this coastal city to food enthusiasts around the world. 
                    From traditional dishes to modern interpretations, we celebrate the rich heritage and diverse tastes that define Phan Thiet's food culture.
                  </p>
                </div>
                <div className="about-image-container">
                  <img src={Image2} alt="Image 2" className="about-image-item1" />
                  <img src={Image1} alt="Image 1" className="about-image-item2" />
                </div>
              </div>
              <div className="about-map">
                <div className="about-note">
                  <div className="about-note-content">
                    <div className="about-note-text">Phan Thiet</div>
                    <img src={Arrorw} alt="Arrow" className="about-arrow" />
                  </div>
                </div>
                <img src={PhanThiet} alt="Phan Thiet map outline" className="about-image" />
              </div>
            </div>
          </div>
          
        </section>

        {/* Cuisine Section */}
        <section className="cuisine" id="cuisine">
          <div className="hero-image-blend"></div>
          <div className="cuisine-header">
            <div className="cuisine-title-row">
              <img src={Crab} alt="crab" className="cuisine-header-icon" />
              <h1 className="cuisine-title">PHAN THIET CUISINE</h1>
            </div>
            <h2 className="cuisine-subtitle">A Culinary Journey Through the Coastal City</h2>
          </div>
          <div className="cuisine-content">
            <div className="cuisine-content-text">
              <p className="cuisine-content-description">
                Phan Thiet cuisine is a vibrant tapestry of flavors, shaped by the city's coastal geography and rich cultural heritage.
                From the freshest seafood to the aromatic herbs and spices, every dish tells a story of the sea and the land.
                The cuisine is characterized by its bold flavors, with a perfect balance of sweet, sour, salty, and umami notes.
                Signature dishes like Banh Canh Cua (crab noodle soup) and Nem Nuong (grilled pork sausage) showcase the culinary artistry of Phan Thiet's chefs.
                Whether you're savoring a bowl of hot noodle soup on a bustling street corner or enjoying a seafood feast by the beach, Phan Thiet cuisine offers an unforgettable gastronomic experience.
              </p>
              <FeatureList />
            </div>
            
          </div>
        </section>

        {/* Footer Section */}
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
      </main>

    </>
  )
}
export default App
