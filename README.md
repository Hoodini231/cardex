# [In-progress] CardeDex - Centralized Pokemon TCG collecting platform

PokeCardeDex is a one-stop **web application** built for Pokemon TCG collector's. The platform integrates organizing portfolios, warehouse for pokemon card data, price monitoring, data analytics, and AI-driven insights** to increase user agency and decision-making.

![image](https://github.com/user-attachments/assets/b9250ad9-3026-4ace-b7a9-5b118579b933)



### 🔗 [Expected launch - May 31th 2025]

---

## 📌 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [User Guide](#user-guide)
- [Architecture](#architecture)
- [Graphic Examples](#graphic-examples)

---

## ⚙️ Tech Stack

- **Frontend:** Next.JS written with Javascript and Typescript.
- **Backend:** Node.JS and MongoDB as noSQL storage written in Javascript with Python scripts wrapped with FastAPI
- **Deployment:** Aiming to be hosted on AWS cloud services for scalability and reliability.

---

## 🚀 Projected Features

### 1️⃣ **Pokemon Card Information**
- **Dashboard** displaying Pokemon cards from each set in an easily identifiable manner.
- **Filters** for setting and organizing sets to easily identify your specific chase cards.
- **Integration with price monitoring** to make better insights into whether a specific booster pack or box is worth a certain price depending on the Chase card's prices.

### 2️⃣ **Price monitoring**
- **Web scraping** tools are used to monitor multiple websites for certain cards or products and will update every 15 minutes for API request optimization.
  - Why every 15 minutes? this is because Pokemon cards generally do not have high volatility and would optimise API fetch calls allowing much faster rendering with less overhead.

### 3️⃣ **Price analytics for purchase decisions**
- **Statistical formulas** to gauge expected returns of specific goods depending on current market price and card set.
- **Risk analysis** to provide a gauge of how much risk the user is willing to take and when a price point is too high.

### 4️⃣ **Insights**
- **Model training** Identify keep topics and regions to ingest data in which can provide a relationship into speculating card prices.
---

## Architecture
![image](https://github.com/user-attachments/assets/75195040-b603-48e3-9c47-210808068006)
### Key processes
- Per set release quarterly job
  - Updates the current set list every quarter for new sets.
- Price scraping every 15 minutes
  - Cache's the top 10 most popular set prices.
  - Cache's trivial ROI calculation for the most popular goods.
  - Updates price db.
- ROI calculation
  - Uses probability and statistical equations to calculate ROI.
  - It grabs the risk and emotional value of the user via forms or NLP sentiment analysis.
  - Adjust trivial ROI and create an acceptable loss limit.
  - Uses Prospect and expected utility theory.
  - Check reddis cache if user params are the same to avoid overhead on risk and utility re-calculation.


### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Hoodini231/MediTrack.git
cd MediTrack
