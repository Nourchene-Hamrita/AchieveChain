# 🎓 Academic-achievement Application

This is a web app for managing academic achievements, combining Moodle course and badge data with blockchain-backed achievement records and wallet-based authentication.
The main user flow initializes Web3 and routing, signs users in, then lets them view courses and manage badges, competencies, and grades.

## 🧱 Architecture Overview

The graph includes the documented Moodle and blockchain integrations.

<img width="11740" height="8145" alt="diagram (7)" src="https://github.com/user-attachments/assets/a341d888-7bd7-49d6-bb3b-dfb1247b2736" />

## 📁 Structure
```
Directory structure:
└── nourchene-hamrita-achievechain/
    ├── client/
    │   ├── README.md
    │   ├── package.json
    │   ├── public/
    │   │   ├── index.html
    │   │   ├── manifest.json
    │   │   └── robots.txt
    │   └── src/
    │       ├── App.css
    │       ├── App.js
    │       ├── App.test.js
    │       ├── AuthContract.js
    │       ├── config.js
    │       ├── index.css
    │       ├── index.js
    │       ├── reportWebVitals.js
    │       ├── setupTests.js
    │       ├── theme.js
    │       ├── web3Connection.js
    │       ├── components/
    │       │   ├── badges/
    │       │   │   ├── BadgeList.js
    │       │   │   ├── Badges.css
    │       │   │   └── Badges.js
    │       │   ├── competencies/
    │       │   │   ├── Competencies.css
    │       │   │   ├── Competencies.js
    │       │   │   └── CompetencyList.js
    │       │   ├── courses/
    │       │   │   ├── course.css
    │       │   │   └── Course.js
    │       │   ├── grades/
    │       │   │   ├── GradeList.js
    │       │   │   ├── Grades.css
    │       │   │   └── Grades.js
    │       │   ├── home/
    │       │   │   ├── Home.css
    │       │   │   └── Home.js
    │       │   ├── navBar/
    │       │   │   ├── NavBar.css
    │       │   │   └── NavBar.js
    │       │   ├── sideBar/
    │       │   │   ├── SideBar.css
    │       │   │   └── SideBar.js
    │       │   ├── signIn/
    │       │   │   ├── SignIn.css
    │       │   │   └── SignIn.js
    │       │   └── signUp/
    │       │       ├── SignUp.css
    │       │       └── SignUp.js
    │       ├── pages/
    │       │   ├── BadgesPage/
    │       │   │   ├── BadgesPage.css
    │       │   │   └── BagdesPage.js
    │       │   ├── CompetenciesPage/
    │       │   │   ├── CompetenciesPage.css
    │       │   │   └── CompetenciesPage.js
    │       │   ├── CoursesPage/
    │       │   │   ├── CoursePage.css
    │       │   │   └── CoursesPage.js
    │       │   └── GradesPage/
    │       │       ├── GradesPage.css
    │       │       └── GradesPage.js
    │       ├── routes/
    │       │   ├── BadgesRoutes.js
    │       │   ├── CompetenciesRoutes.js
    │       │   └── GradesRoutes.js
    │       └── utils/
    │           ├── Authentication.json
    │           ├── AuthenticationHash.js
    │           ├── AuthValidation.js
    │           ├── Formate.js
    │           ├── Formatter.js
    │           └── SignData.js
    └── server/
        ├── README.md
        ├── hardhat.config.js
        ├── package.json
        ├── contracts/
        │   ├── Authentication.sol
        │   ├── Lock.sol
        │   └── Moodle.sol
        ├── scripts/
        │   ├── deploy.js
        │   └── script.js
        └── test/
            ├── Lock.js
            └── Moodle.js

