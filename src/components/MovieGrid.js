import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import "../styles/MovieGrid.css";
import { getMovies } from '../api';

// Export movie arrays
export const bollywoodMovies = [
  {
    id: 1,
    title: "Jawan (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/bollywood/jawan.jpg",
    addedDate: "2024-04-15",
    description:
      "A high-octane action thriller that outlines the emotional journey of a man who is set to rectify the wrongs in society. Driven by a personal vendetta while keeping up a promise made years ago, Jawan involves a web of revenge, redemption, and closure.",
    views: "1,234",
    duration: "169 min",
    quality: "HD",
    release: "2023/09/07",
    imdb: "7.1",
    genres: ["Action", "Thriller", "Drama", "Crime"],
    director: "Atlee Kumar",
    actors: [
      "Shah Rukh Khan",
      "Nayanthara",
      "Vijay Sethupathi",
      "Deepika Padukone",
      "Priyamani",
      "Sanya Malhotra",
    ],
    country: "India",
    externalFileUrl: "https://new17.gdtot.dad/file/3857066142",
  },
  {
    id: 2,
    title: "Animal (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/bollywood/animal.jpg",
    addedDate: "2024-04-14",
    description:
      "A violent, vengeful man goes down a dark path of vengeance and destruction when his beloved father is attacked. As he becomes increasingly ruthless, his actions begin to affect his relationships and spiral out of control.",
    views: "987",
    duration: "201 min",
    quality: "4K",
    release: "2023/12/01",
    imdb: "6.7",
    genres: ["Crime", "Drama", "Action", "Thriller"],
    director: "Sandeep Reddy Vanga",
    actors: [
      "Ranbir Kapoor",
      "Anil Kapoor",
      "Bobby Deol",
      "Rashmika Mandanna",
      "Triptii Dimri",
    ],
    country: "India",
  },
  {
    id: 3,
    title: "Tiger 3 (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/bollywood/tiger3.jpg",
    addedDate: "2024-04-13",
    description:
      "Tiger and Zoya race against time to save both their family and country from a vengeful ex-ISI agent, Aatish. As they navigate through international espionage and personal vendettas, their loyalty to the nation is tested like never before.",
    views: "856",
    duration: "155 min",
    quality: "4K",
    release: "2023/11/12",
    imdb: "6.2",
    genres: ["Action", "Adventure", "Spy", "Thriller"],
    director: "Maneesh Sharma",
    actors: [
      "Salman Khan",
      "Katrina Kaif",
      "Emraan Hashmi",
      "Kumud Mishra",
      "Ridhi Dogra",
    ],
    country: "India",
  },
  {
    id: 4,
    title: "12th Fail (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/bollywood/12thfail.jpg",
    addedDate: "2024-04-12",
    description:
      "Based on a true story, the film follows Manoj Kumar Sharma's extraordinary journey from failing 12th grade to becoming an IPS officer. Through poverty, setbacks, and determination, it showcases the triumph of perseverance.",
    views: "456",
    duration: "147 min",
    quality: "4K",
    release: "2023/10/27",
    imdb: "9.2",
    genres: ["Biography", "Drama", "Inspirational"],
    director: "Vidhu Vinod Chopra",
    actors: [
      "Vikrant Massey",
      "Medha Shankar",
      "Anant V Joshi",
      "Anshumaan Pushkar",
      "Priyanshu Chatterjee",
    ],
    country: "India",
  },
  {
    id: 5,
    title: "Dunki (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/bollywood/dunki.jpg",
    addedDate: "2024-04-11",
    description:
      "Through the illegal 'donkey route', four friends from a small village in Punjab dream of migrating to London for a better life. Their emotional journey, filled with humor and heartbreak, explores the lengths people go to for their dreams.",
    views: "567",
    duration: "161 min",
    quality: "4K",
    release: "2023/12/21",
    imdb: "7.0",
    genres: ["Comedy", "Drama", "Social", "Immigration"],
    director: "Rajkumar Hirani",
    actors: [
      "Shah Rukh Khan",
      "Taapsee Pannu",
      "Vicky Kaushal",
      "Boman Irani",
      "Vikram Kochhar",
    ],
    country: "India",
  },
  {
    id: 6,
    title: "Sam Bahadur (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/bollywood/sambahadur.jpg",
    addedDate: "2024-04-10",
    description:
      "A biographical drama chronicling the life of Sam Manekshaw, India's first Field Marshal. From the Indo-Pak wars to his strategic brilliance in 1971, the film captures his remarkable military career and personal journey.",
    views: "293",
    duration: "150 min",
    quality: "4K",
    release: "2023/12/01",
    imdb: "7.8",
    genres: ["Biography", "War", "Drama", "Historical"],
    director: "Meghna Gulzar",
    actors: [
      "Vicky Kaushal",
      "Sanya Malhotra",
      "Fatima Sana Shaikh",
      "Neeraj Kabi",
      "Edward Sonnenblick",
    ],
    country: "India",
  },
  {
    id: 7,
    title: "Fighter (2024)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/bollywood/fighter.jpg",
    addedDate: "2024-04-16",
    description:
      "A high-octane aerial action film that follows the journey of elite Indian Air Force pilots as they face their most challenging mission yet.",
    views: "789",
    duration: "166 min",
    quality: "4K",
    release: "2024/01/25",
    imdb: "7.5",
    genres: ["Action", "Drama", "War"],
    director: "Siddharth Anand",
    actors: ["Hrithik Roshan", "Deepika Padukone", "Anil Kapoor"],
    country: "India",
  },
  {
    id: 8,
    title: "Article 370 (2024)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/bollywood/article370.jpg",
    addedDate: "2024-04-16",
    description:
      "A political thriller based on the events surrounding the abrogation of Article 370 in Jammu and Kashmir.",
    views: "467",
    duration: "158 min",
    quality: "4K",
    release: "2024/02/23",
    imdb: "7.8",
    genres: ["Political", "Thriller", "Drama"],
    director: "Aditya Suhas Jambhale",
    actors: ["Yami Gautam", "Priyamani", "Arun Govil"],
    country: "India",
  },
];

export const hollywoodMovies = [
  {
    id: 101,
    title: "Oppenheimer (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/hollywood/oppenheimer.jpg",
    addedDate: "2024-04-15",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. This biographical thriller explores the moral complexities and psychological toll of creating the world's most destructive weapon.",
    views: "1,647",
    duration: "180 min",
    quality: "4K",
    release: "2023/07/21",
    imdb: "8.4",
    genres: ["Biography", "Drama", "History"],
    director: "Christopher Nolan",
    actors: ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
    country: "United States",
  },
  {
    id: 102,
    title: "Barbie (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/hollywood/barbie.jpg",
    addedDate: "2024-04-08",
    description:
      "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    views: "1,923",
    duration: "114 min",
    quality: "4K",
    release: "2023/07/21",
    imdb: "7.0",
    genres: ["Comedy", "Adventure", "Fantasy"],
    director: "Greta Gerwig",
    actors: [
      "Margot Robbie",
      "Ryan Gosling",
      "America Ferrera",
      "Kate McKinnon",
      "Will Ferrell",
    ],
    country: "United States",
  },
  {
    id: 103,
    title: "Mikey 17",
    type: "HD",
    language: "Hindi",
    posterUrl: "/hollywood/mikey17.jpg",
    addedDate: "2024-04-07",
    description:
      "An employee on a human expedition to colonize an ice world who refuses to let his clone take his place. Based on Edward Ashton's novel 'Mickey7', this sci-fi epic follows a disposable employee sent on the most dangerous missions of space colonization.",
    views: "145",
    duration: "TBA",
    quality: "4K",
    release: "2024/03/29",
    imdb: "N/A",
    genres: ["Science Fiction", "Thriller", "Adventure", "Drama"],
    director: "Bong Joon-ho",
    actors: [
      "Robert Pattinson",
      "Steven Yeun",
      "Naomi Ackie",
      "Mark Ruffalo",
      "Toni Collette",
    ],
    country: "United States",
  },
  {
    id: 104,
    title: "Fast X (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/hollywood/fastx.jpg",
    addedDate: "2024-04-06",
    description:
      "Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes. As they face their most dangerous adversary yet, they must come together to protect everything they've built.",
    views: "1,345",
    duration: "142 min",
    quality: "4K",
    release: "2023/05/19",
    imdb: "5.9",
    genres: ["Action", "Adventure", "Crime"],
    director: "Louis Leterrier",
    actors: [
      "Vin Diesel",
      "Michelle Rodriguez",
      "Jason Statham",
      "John Cena",
      "Charlize Theron",
    ],
    country: "United States",
  },
  {
    id: 105,
    title: "John Wick 4",
    type: "HD",
    language: "Hindi",
    posterUrl: "/hollywood/johnwick4.jpg",
    addedDate: "2024-04-05",
    description:
      "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    views: "1,678",
    duration: "169 min",
    quality: "4K",
    release: "2023/03/24",
    imdb: "7.7",
    genres: ["Action", "Crime", "Thriller"],
    director: "Chad Stahelski",
    actors: [
      "Keanu Reeves",
      "Donnie Yen",
      "Bill Skarsgård",
      "Laurence Fishburne",
      "Ian McShane",
    ],
    country: "United States",
    tailorPlayer: "https://www.youtube.com/watch?v=qEVUtrk8_B4",
    fastPlayer: "https://ok.ru/videoembed/123456789",
    ultraPlayer: "https://vimeo.com/987654321",
  },
  {
    id: 106,
    title: "The Marvels",
    type: "HD",
    language: "Hindi",
    posterUrl: "/hollywood/marvels.jpg",
    addedDate: "2024-04-04",
    description:
      "Carol Danvers, Kamala Khan, and Monica Rambeau team up to save the universe when their powers become entangled. Together, they must work as a team to stop a new threat and restore order to the cosmos.",
    views: "901",
    duration: "105 min",
    quality: "4K",
    release: "2023/11/10",
    imdb: "5.6",
    genres: ["Action", "Adventure", "Fantasy"],
    director: "Nia DaCosta",
    actors: [
      "Brie Larson",
      "Teyonah Parris",
      "Iman Vellani",
      "Samuel L. Jackson",
      "Zawe Ashton",
    ],
    country: "United States",
  },
  {
    id: 107,
    title: "Dune: Part Two (2024)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/hollywood/dune2.jpg",
    addedDate: "2024-04-16",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    views: "1,345",
    duration: "166 min",
    quality: "4K",
    release: "2024/03/01",
    imdb: "8.8",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    director: "Denis Villeneuve",
    actors: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    country: "United States",
  },
  {
    id: 108,
    title: "Godzilla x Kong: The New Empire (2024)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/hollywood/godzillaxkong.jpg",
    addedDate: "2024-04-16",
    description:
      "Godzilla and Kong must unite to face a colossal undiscovered threat hidden within our world.",
    views: "876",
    duration: "115 min",
    quality: "4K",
    release: "2024/03/29",
    imdb: "6.5",
    genres: ["Action", "Sci-Fi", "Adventure"],
    director: "Adam Wingard",
    actors: ["Rebecca Hall", "Brian Tyree Henry", "Dan Stevens"],
    country: "United States",
  },
];

export const southMovies = [
  {
    id: 201,
    title: "Leo (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/south/leo.jpg",
    addedDate: "2024-04-15",
    description:
      "A café owner becomes entangled in a dangerous criminal conspiracy.",
    views: "1,234",
    duration: "164 min",
    quality: "4K",
    release: "2023/10/19",
    imdb: "7.2",
    genres: ["Action", "Crime", "Thriller"],
    director: "Lokesh Kanagaraj",
    actors: ["Vijay", "Sanjay Dutt", "Trisha Krishnan"],
    country: "India",
  },
  {
    id: 202,
    title: "Salaar (2023)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/south/salaar.jpg",
    addedDate: "2024-04-14",
    description:
      "A gang leader makes a promise to a dying friend by taking on other criminal gangs.",
    views: "1,456",
    duration: "175 min",
    quality: "4K",
    release: "2023/12/22",
    imdb: "7.0",
    genres: ["Action", "Crime", "Drama"],
    director: "Prashanth Neel",
    actors: ["Prabhas", "Prithviraj Sukumaran", "Shruti Haasan"],
    country: "India",
  },
  {
    id: 203,
    title: "KGF: Chapter 2 (2022)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/south/kgf2.jpg",
    addedDate: "2024-04-13",
    description:
      "Rocky takes control of the Kolar Gold Fields and his newfound power makes the government as well as his enemies jittery. However, he still has to confront Ramika Sen.",
    views: "2,345",
    duration: "168 min",
    quality: "4K",
    release: "2022/04/14",
    imdb: "8.2",
    genres: ["Action", "Drama", "Thriller"],
    director: "Prashanth Neel",
    actors: ["Yash", "Sanjay Dutt", "Raveena Tandon"],
    country: "India",
  },
  {
    id: 204,
    title: "RRR (2022)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/south/rrr.jpg",
    addedDate: "2024-04-12",
    description:
      "A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.",
    views: "2,678",
    duration: "187 min",
    quality: "4K",
    release: "2022/03/25",
    imdb: "7.8",
    genres: ["Action", "Drama", "History"],
    director: "S.S. Rajamouli",
    actors: ["N.T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt"],
    country: "India",
  },
  {
    id: 205,
    title: "Pushpa: The Rise (2021)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/south/pushpa.jpg",
    addedDate: "2024-04-11",
    description:
      "A laborer rises through the ranks of a red sandalwood smuggling syndicate, making powerful enemies in the process.",
    views: "1,234",
    duration: "179 min",
    quality: "4K",
    release: "2021/12/17",
    imdb: "7.6",
    genres: ["Action", "Crime", "Drama"],
    director: "Sukumar",
    actors: ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"],
    country: "India",
  },
  {
    id: 206,
    title: "Baahubali 2: The Conclusion (2017)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/south/baahubali2.jpg",
    addedDate: "2024-04-10",
    description:
      "When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.",
    views: "3,456",
    duration: "167 min",
    quality: "4K",
    release: "2017/04/28",
    imdb: "8.2",
    genres: ["Action", "Drama", "Fantasy"],
    director: "S.S. Rajamouli",
    actors: ["Prabhas", "Rana Daggubati", "Anushka Shetty"],
    country: "India",
  },
  {
    id: 207,
    title: "HanuMan (2024)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/south/hanuman.jpg",
    addedDate: "2024-04-16",
    description:
      "A young man gains superpowers and becomes a superhero to protect his village from evil forces.",
    views: "678",
    duration: "158 min",
    quality: "4K",
    release: "2024/01/12",
    imdb: "8.2",
    genres: ["Action", "Fantasy", "Adventure"],
    director: "Prashanth Varma",
    actors: ["Teja Sajja", "Amritha Aiyer", "Varalaxmi Sarathkumar"],
    country: "India",
  },
  {
    id: 208,
    title: "Guntur Kaaram (2024)",
    type: "HD",
    language: "Hindi",
    posterUrl: "/south/gunturkaaram.jpg",
    addedDate: "2024-04-16",
    description:
      "A young man returns to his hometown to confront his past and fight for justice.",
    views: "567",
    duration: "165 min",
    quality: "4K",
    release: "2024/01/12",
    imdb: "6.8",
    genres: ["Action", "Drama", "Thriller"],
    director: "Trivikram Srinivas",
    actors: ["Mahesh Babu", "Sreeleela", "Meenakshi Chaudhary"],
    country: "India",
  },
];

function MovieGrid({ category }) {
  const [movies, setMovies] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchAndFilterMovies() {
      try {
        const allMovies = await getMovies();
        let filtered = allMovies;
        if (category && category !== 'all' && category !== 'undefined') {
          let categoryName;
          switch (category) {
            case 'web-series':
              categoryName = 'Web Series';
              break;
            case 'bollywood':
              categoryName = 'Bollywood Movies';
              break;
            case 'hollywood':
              categoryName = 'Hollywood Movies';
              break;
            case 'south':
              categoryName = 'South Movies';
              break;
            default:
              categoryName = category.charAt(0).toUpperCase() + category.slice(1) + ' Movies';
          }
          filtered = allMovies.filter(m => m.category === categoryName);
        }
        setMovies(filtered);
      } catch (e) {
        setMovies([]);
      }
    }
    fetchAndFilterMovies();
  }, [category]);

  const incrementViews = (movieId) => {
    setMovies((prevMovies) => {
      const updatedMovies = prevMovies.map((movie) => {
        if (movie.id === movieId) {
          const currentViews = parseInt(movie.views.replace(/,/g, ""));
          return {
            ...movie,
            views: (currentViews + 1).toLocaleString(),
          };
        }
        return movie;
      });

      // Save the updated views to localStorage
      if (category) {
        localStorage.setItem(
          `movies_${category}`,
          JSON.stringify(updatedMovies)
        );
      }

      return updatedMovies;
    });
  };

  // Calculate how many movies to show based on grid columns
  const getVisibleMovies = () => {
    if (showAll) {
      return movies;
    }

    // Calculate grid columns based on screen width
    const gridColumns =
      window.innerWidth > 1600
        ? 8
        : window.innerWidth > 1200
        ? 6
        : window.innerWidth > 1024
        ? 5
        : window.innerWidth > 768
        ? 4
        : window.innerWidth > 480
        ? 3
        : 2;

    // Show 2 rows of movies initially
    return movies.slice(0, gridColumns * 2);
  };

  const handleViewMore = () => {
    setShowAll(true);
  };

  const handleViewLess = () => {
    setShowAll(false);
  };

  return (
    <div className="movie-grid-container">
      <h2 className="section-title">
        {category === "all"
          ? "All Movies"
          : category
          ? `${category.charAt(0).toUpperCase() + category.slice(1)} Movies`
          : "Recently Added"}
        {movies.length >
          (window.innerWidth > 1600
            ? 16
            : window.innerWidth > 1200
            ? 12
            : window.innerWidth > 1024
            ? 10
            : window.innerWidth > 768
            ? 8
            : window.innerWidth > 480
            ? 6
            : 4) && (
          <button
            className="view-more-button"
            onClick={showAll ? handleViewLess : handleViewMore}
          >
            {showAll ? "View Less" : "View More"}
          </button>
        )}
      </h2>
      <div className="movie-grid">
        {getVisibleMovies().map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onWatch={() => incrementViews(movie.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieGrid;
