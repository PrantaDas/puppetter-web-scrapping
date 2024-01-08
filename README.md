# Puppeteer Web Scraping Script

This is a Puppeteer script written in TypeScript for web scraping purposes. The script automates browser actions to interact with a website, solve reCAPTCHA challenges, and download a PDF file. It uses additional Puppeteer plugins for stealth and reCAPTCHA solving.

## Prerequisites

Before running the script, ensure you have the following installed and configured:

- **Node.js and npm:** [Download and install Node.js](https://nodejs.org/)
- **Git:** [Download and install Git](https://git-scm.com/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/puppeteer-web-scraping.git
    ```

2. Navigate to the project directory:

    ```bash
    cd puppeteer-web-scraping
    ```

3. Install dependencies:

    ```bash
    pnpm install
    ```

## Configuration

1. Create a `.env` file in the root of the project.

2. Add the following environment variables to the `.env` file:

    ```env
    URL= https://www.gob.mx/curp  # Replace with the target URL
    IDENTIFIER= replace with the sample CURP or identifier
    CAPTCHA_TOKEN=your_captcha_token  # Replace with your 2Captcha token
    ```

## Usage

Run the script using the following command:

```bash
pnpm dev
```