# [In-progress] CardeDex - Centralized Pokemon TCG collecting platform

PokeCardeDex is a one-stop **web application** built for Pokemon TCG collector's. The platform integrates organizing portfolios, warehouse for pokemon card data, price monitoring, data analytics, and AI-driven insights** to increase user agency and decision-making.
<img width="1508" alt="cardex homepage" src="https://github.com/user-attachments/assets/4c8bf4e6-0378-4be9-aff0-e45375b59538" />





### 🔗 [Expected launch - July 31th 2025]

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
- **Backend:** FastAPI with MongoDB storage
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


## Visual Captures

### Collections page
<img width="1233" alt="Cardex collections" src="https://github.com/user-attachments/assets/746b2a2f-5af5-4c7d-8947-24b42e5f4ce1" />

### Card detail pop up
<img width="517" alt="Cardex pop up page" src="https://github.com/user-attachments/assets/806e6eae-ef46-4c81-848e-88084898b04a" />

### ROI set page
<img width="1177" alt="Cardex ROI sets" src="https://github.com/user-attachments/assets/d7838472-a3d0-4f4b-8a7c-c9f0a90d4a45" />

### ROI calculator page
<img width="1115" alt="ROI calcuation" src="https://github.com/user-attachments/assets/dfd057fb-0d37-4dcb-b36a-634ea9b649b7" />

### ROI pack breakdown tab
<img width="516" alt="Packbreakdown" src="https://github.com/user-attachments/assets/e6e6d56a-0c41-4fe8-89c2-894864339d18" />



 
