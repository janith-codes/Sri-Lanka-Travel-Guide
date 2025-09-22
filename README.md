# Sri Lanka Travel Planner 🇱🇰

A mobile-first web application designed to help users discover stunning locations across Sri Lanka and plan their perfect itinerary. Built with Next.js and powered by the Google Maps API, this app provides a seamless experience for searching, filtering, and organizing travel destinations.

**Live Demo:** **[View the deployed project on Vercel](https://[your-vercel-link-here].vercel.app/)**

---

## ## Project Screenshot

*Action: Take a nice screenshot of your app, add it to your repo, and update the link below.*

![Sri Lanka Travel Planner Screenshot](https://[your-image-url-here])

---

## ## Core Features

* **📍 Interactive Map:** Visualizes all travel destinations using the Google Maps API for an intuitive user experience.
* **🔍 Real-time Search:** Instantly find locations as you type.
* **🏷️ Category Filtering:** Easily discover places by category, such as "Historic," "Beach," or "Nature."
* **🗺️ Itinerary Planning:** Add locations to a personal trip, which is saved in the browser across sessions.
* **🚗 Route Optimization:** Calculates the most efficient travel route between all chosen destinations to save time and effort.
* **📱 Mobile-First Design:** A beautiful and responsive interface built with Tailwind CSS ensures a great experience on any device.

---

## ## Tech Stack

This project was built using a modern frontend stack:

* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS
* **Mapping & Geocoding:** Google Maps Platform (Maps JavaScript API, Directions API)
* **State Management:** React Context API
* **Deployment:** Vercel

---

## ## Setup and Local Installation

To get this project running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[your-github-username]/[your-repo-name].git
    cd [your-repo-name]
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add your Google Maps API key:
    ```
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=Your_Actual_API_Key_Goes_Here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## ## Future Improvements

* Integrate a proper backend and database to manage a larger, more dynamic list of locations.
* Add user authentication to allow saving trips to a user account.
* Include more detailed location information, such as opening hours, reviews, and photo galleries.
