# 📚 Learn GitHub Streak Card

Welcome to the **GitHub Streak Card** learning guide! This project visually represents your GitHub contribution streak using dynamic cards.

Whether you're a beginner or an experienced developer, this guide will help you understand the structure, how the streak logic works, and how you can contribute or customize your own version.

---

## 🔍 What is GitHub Streak Card?

The **GitHub Streak Card** shows how many days in a row you've contributed to GitHub — a fun and motivational tool to track your daily coding progress!

---

## 📁 Project Structure

```plaintext
GitHub-Streak-Card/
│
├── .github/              # GitHub-specific workflows and settings
├── public/               # Public assets (e.g., images, HTML files)
├── src/                  # Source files (JavaScript, logic, rendering)
├── README.md             # Project overview
├── CONTRIBUTING.md       # How to contribute
├── LICENSE               # Legal license file
├── LEARN.md              # You're here!
└── ...
```

---

## 🚀 How It Works

1. **Fetch GitHub Data**  
   The app fetches contribution data using the GitHub API or static sources.

2. **Calculate Streak**  
   It calculates consecutive contribution days.

3. **Render Card**  
   The card is rendered with colors, themes, and customization options.

4. **Embed Anywhere**  
   You can use it in your GitHub README or portfolio by embedding the image link.

---

## 🛠️ Tech Stack

- **JavaScript / Node.js**
- **SVG rendering**
- **GitHub REST API**
- (Optional) **Express.js** or static hosting

---

## 💡 How to Learn from This

- Explore the logic that calculates the streak in `src/`.
- Customize themes and SVG templates to make it your own.
- Use GitHub Actions to regenerate the card daily.
- Learn how open-source projects handle contributions, issues, and version control.

---

## 📦 Resources

- [GitHub REST API Docs](https://docs.github.com/en/rest)
- [Node.js Official Site](https://nodejs.org)
- [SVG Basics](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)

---

Happy learning! Feel free to fork this repo and start building your own awesome GitHub widgets 🚀
```

---

## 🧾 How to Add a License to Your GitHub Repository

Adding a license is **important** to protect your code and clarify permissions.

### ✅ Steps to Add a License:

1. **Create a `LICENSE` file** in your repo root.

2. Choose a license:
   - [MIT](https://choosealicense.com/licenses/mit/) — most popular, simple and permissive.
   - [Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)
   - [GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

3. Add the license text (see below for MIT).

4. Commit and push:
   ```bash
   git add LICENSE
   git commit -m "Add MIT License"
   git push
   ```

5. GitHub will automatically detect it.

---

### 📄 Example: MIT License for Your Repo

```text
MIT License

Copyright (c) 2024 Zain Ul Abideen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell      
copies of the Software, and to permit persons to whom the Software is         
furnished to do so, subject to the following conditions:                       

The above copyright notice and this permission notice shall be included in    
all copies or substantial portions of the Software.                            

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR    
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,       
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE   
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER        
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN     
THE SOFTWARE.
```

